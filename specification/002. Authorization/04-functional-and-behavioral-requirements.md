# 4. Functional and Behavioral Requirements

## 4.1 ECMAScript Policy Compilation

### POLICY-001 — Compilation model

Taskmigo SHALL parse supported ECMAScript module syntax with a maintained parser and compile it into Taskmigo-owned Policy IR.

Authorization execution SHALL evaluate Policy IR; it SHALL NOT invoke a general-purpose JavaScript runtime or evaluate policy source directly.

Verification: Inspect the compiler and execution boundary and run a policy evaluation test that confirms execution uses Policy IR without invoking a general-purpose JavaScript runtime.
Traceability: [ECMAScript Policy Contract](02-overall-description.md#223-ecmascript-policy-contract); TECH-003.

### POLICY-002 — Supported decision-function subset

The policy language SHALL support:

```text
function / arrow-function body
const declarations
return
if / else
string, number, boolean, null literals
undefined
property access
=== !== < <= > >=
&& || !
numeric binary + - * / %
numeric unary + -
parenthesized expressions
```

`null` and `undefined` MAY appear as values in supported expressions and intermediate computation. They do not satisfy the decision-function result contract when they become the concrete authorization result.

`%` MAY be used by Request policies. An Object policy using an operation that cannot be translated by the Object query layer SHALL be rejected for Object Authorization.

Additional function calls, string helpers, collection membership operations, loops, mutation, and dynamic language features are outside the specified subset unless separately specified.

Verification: Compile representative policies for every listed construct and reject unsupported calls, loops, mutation, and dynamic features.
Traceability: [ECMAScript Policy Contract](02-overall-description.md#223-ecmascript-policy-contract); TECH-003.

### POLICY-003 — Static validation

Before a Statement becomes active, compilation SHALL validate what can be determined structurally without requiring whole-function return-type proof:

- the required `export default` entry point;
- supported syntax and operations;
- supported roots and fields where their schema is known;
- scope-specific restrictions;
- compiler complexity limits.

Static validation MAY reject a trivially invalid construct when its invalidity is certain, but authorization correctness SHALL NOT depend on compile-time proof that every execution path returns a boolean.

The concrete decision result type SHALL be checked during authorization as defined by STMT-004.

Verification: Compile structurally valid policies with different runtime result types and confirm that result validation occurs during authorization.
Traceability: STMT-004; TECH-004.

### POLICY-004 — DB-authoritative Statement state and compiled-artifact reuse

Every authorization operation SHALL obtain the current relevant effective Statement state from the database before policy evaluation.

Taskmigo SHALL NOT use an in-memory or distributed cache of Statement records, effective Statement sets, Statement ids, or authorization snapshots to bypass that database lookup.

Policy IR MAY be reused across operations only as a derived compiled artifact after the current Statement has been loaded from the database. Any such reuse SHALL be keyed by an immutable fingerprint of the exact policy/Statement state loaded for the current operation, such as a content hash or equivalent revision-safe identity.

A compiled-artifact cache:

- SHALL NOT determine which Statements are effective;
- SHALL NOT suppress the per-operation database lookup;
- SHALL NOT make authorization correctness depend on cache invalidation, TTL, or cross-node synchronization;
- SHALL be treated as an optimization only.

If a safe compiled artifact cannot be matched to the exact database-loaded Statement state, Taskmigo SHALL compile from that loaded policy source.

Verification: Change policy or Statement metadata between operations and confirm a stale compiled artifact is not used.
Traceability: [ECMAScript Policy Contract](02-overall-description.md#223-ecmascript-policy-contract); PERF-004.

### POLICY-005 — Constant folding

Constant policy results and constant subexpressions SHALL be folded when semantics are unchanged.

At minimum:

```js
export default () => true;
```

and:

```js
export default () => false;
```

SHALL be represented as constant policy results.

Verification: Compile the true and false constant examples and inspect Policy IR for constant representations; evaluate equivalent constant subexpressions.
Traceability: [ECMAScript Policy Contract](02-overall-description.md#223-ecmascript-policy-contract); OBJ-005.

## 4.2 Request Authorization

### REQ-001 — Decision semantics

For `scope: request`:

```text
DENY if any target-matching DENY Statement evaluates true
ELSE ALLOW if any target-matching ALLOW Statement evaluates true
ELSE DENY
```

Policy evaluation SHALL verify that each concrete decision result is boolean before applying the Statement effect.

A non-boolean policy result SHALL raise an authorization exception and fail closed.

Failures in policy evaluation or required `principal`/`request` input resolution SHALL fail closed.

Verification: Evaluate matching allow and deny Statements, including default-deny and deny-overrides cases, and inject parser, evaluator, and required-input failures; confirm the result is denial where required.
Traceability: [Fail-Closed Behavior](07-constraints.md#74-fail-closed-behavior); TECH-004.

### REQ-002 — Constant short-circuit

A target-matching DENY Statement whose compiled policy is constant `TRUE` SHALL immediately produce the final DENY result.

After the final result is known, authorization SHALL NOT evaluate remaining policies or resolve authorization inputs that cannot change that result.

A constant-`TRUE` ALLOW SHALL NOT bypass applicable DENY Statements.

The required database Statement resolution for the operation occurs before these in-operation evaluation short-circuits; short-circuiting SHALL NOT skip the per-operation DB source-of-truth lookup.

Verification: Use a constant-true deny followed by an instrumented policy/input resolution and confirm the deny short-circuits evaluation after database resolution has occurred.
Traceability: [Resolution and Operation Snapshot](02-overall-description.md#221-resolution-and-operation-snapshot); PERF-004.

### REQ-003 — Request input boundary

For `scope: request`, authorization SHALL evaluate the policy using only the `principal` and `request` values already available at the time of authorization.

Request Authorization SHALL NOT load business resources, invoke resource adapters, or make resource data available through `object`.

A Request policy that declares or references `object` SHALL be rejected before the Statement becomes active. Resource declarations and resolution are excluded by [RES-001–RES-003](03-external-interface-requirements.md#32-authorization-inputs-and-operation-snapshot). No compatibility fallback SHALL ignore these constructs.

Statement database resolution and creation of the operation-scoped Authorization Snapshot SHALL remain part of authorization and SHALL not be interpreted as business-resource loading.

Verification: Accept Request policies using the supported `principal` and `request` fields; reject direct, destructured, and property-based `object` references; verify the resource exclusions and no resource lookup specified by RES-001–RES-003; inject missing required request inputs and confirm denial.
Traceability: [Request Authorization Input Boundary](02-overall-description.md#224-request-authorization-input-boundary); INPUT-001 through INPUT-003; RES-001 through RES-003; [Fail-Closed Behavior](07-constraints.md#74-fail-closed-behavior).

## 4.3 Object Authorization and Shared Filter AST

### OBJ-001 — Partial evaluation

For `scope: object`, Taskmigo SHALL evaluate known `principal` and `request` values while retaining `object.*` as symbolic values.

The residual authorization predicate SHALL be represented as Filter AST.

A fully evaluated Object policy result SHALL be boolean. A partially evaluated result SHALL represent a boolean residual predicate. Any other result SHALL raise an authorization exception and fail closed.

Verification: Partially evaluate constant, symbolic, and invalid object policies and confirm boolean results become valid filters while invalid results raise an exception and deny.
Traceability: [Shared Object Filter](02-overall-description.md#222-shared-object-filter); STMT-004.

### OBJ-002 — Initial Filter Schema scope

Filter Schema SHALL map policy-visible object fields to persisted fields/types for a registered Object Authorization mapping and SHALL own type validation/coercion at that persistence boundary.

The authorization system SHALL preserve direct one-segment object fields. Nested paths, joins, and relationship predicates remain outside the current scope.

Verification: Map valid direct fields through a registered Filter Schema and reject nested, joined, or relationship field references.
Traceability: [Scope](01-introduction.md#12-scope); [Assumptions and Dependencies](08-requirements-allocation-and-dependencies.md#81-assumptions-and-dependencies).

### OBJ-003 — Filter AST

The Filter AST SHALL support the operations required to preserve the existing Object Authorization semantics:

```text
ALL NONE
AND OR NOT
EQ NE GT GE LT LE
numeric ADD SUBTRACT MULTIPLY DIVIDE NEGATE
```

Filter AST is independent of ECMAScript syntax and persistence APIs.

Verification: Inspect the Filter AST API and translate equivalent predicates from policy IR and a future client-filter producer without exposing persistence types in the AST.
Traceability: [Scope](01-introduction.md#12-scope); [Appendix B](11-appendices.md#111-future-extensions-non-normative) `filterBy` extension.

### OBJ-004 — Database execution

Filter AST SHALL compile to the resource query predicate used by the existing persistence layer.

Authorization filtering SHALL execute before pagination. The authorization system SHALL NOT load unrestricted business rows and filter them in JVM memory.

An Object policy that cannot be represented by the selected Filter Schema / Filter AST SHALL not be active for that Object Authorization mapping.

Verification: Activate policies using unsupported fields and operators and confirm mapping validation rejects them before activation; verify authorized rows are filtered in the database before pagination.
Traceability: [Shared Object Filter](02-overall-description.md#222-shared-object-filter); TECH-004.

### OBJ-005 — Composition

Object visibility SHALL use:

```text
ANY(ALLOW filters) AND NOT ANY(DENY filters)
```

Constant composition SHALL be simplified before JPA translation.

At minimum:

```text
TRUE object policy  -> ALL
FALSE object policy -> NONE
ALL OR X             -> ALL
NONE OR X            -> X
ALL AND X             -> X
NONE AND X           -> NONE
NOT ALL              -> NONE
NOT NONE              -> ALL
```

A target-matching DENY Statement with constant `TRUE` SHALL reduce the final authorization filter to `NONE` without translating remaining ACL predicates.

When the final authorization filter is `NONE`, the query layer SHOULD avoid a database query when the caller can produce the correct empty result without it.

Verification: Test constant and composed object policies, inspect the simplified Filter AST, and confirm the authorization predicate is applied before pagination without JVM row filtering.
Traceability: [Scope](01-introduction.md#12-scope); [Shared Object Filter](02-overall-description.md#222-shared-object-filter).

The composition test SHALL include the complete allow/deny table and confirm constant simplification preserves the required visibility result.
