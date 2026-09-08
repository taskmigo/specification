# 4. Functional and Behavioral Requirements

## 4.1 Embedded Language Compilation

### POLICY-001 — Compilation model

The authorization system SHALL compile Statement `policy` source through the [Embedded Language](../003.%20Embedded%20Language/README.md) compiler in `PROGRAM` mode into a typed Semantic AST.

The Authorization policy Compilation Profile SHALL enable the current Embedded Language feature families defined by ENV-004 and SHALL be included in compiled-artifact identity under POLICY-004.

Request Authorization SHALL evaluate the Semantic AST. Object Authorization SHALL partially evaluate the Semantic AST. Authorization SHALL NOT invoke a general-purpose JavaScript runtime or evaluate policy source directly.

Verification: Inspect the compiler and execution boundary and run Request and Object policy tests that confirm Authorization uses the `PROGRAM` parser entry/profile and consumes the Embedded Language Semantic AST rather than ANTLR parse-tree types or policy source.
Traceability: [Embedded Language Contract](02-overall-description.md#223-embedded-language-contract); [Embedded Language source modes](../003.%20Embedded%20Language/03-external-interface-requirements.md#syntax-001--canonical-source-modes); [Embedded Language semantic representation](../003.%20Embedded%20Language/04-functional-and-behavioral-requirements.md#lang-001--language-owned-semantic-representation).

### POLICY-002 — Embedded Language contract

Program syntax, Semantic AST semantics, type-system semantics, control flow, operators, evaluation, and partial evaluation SHALL follow the [Embedded Language feature](../003.%20Embedded%20Language/README.md).

For `scope: request`, the Authorization Environment Schema SHALL expose `principal` and `request` and SHALL not expose `object`.

For `scope: object`, the Authorization Environment Schema SHALL expose `principal`, `request`, and symbolic `object`.

Policy-result interpretation SHALL follow STMT-004.

Verification: Compile policies in both scopes as `PROGRAM` sources to Semantic AST against the corresponding Authorization Environment Schema and execute them through the applicable Authorization runtime path.
Traceability: [Authorization inputs](03-external-interface-requirements.md#32-authorization-inputs-and-operation-snapshot); STMT-004; [Embedded Language Environment Schema](../003.%20Embedded%20Language/03-external-interface-requirements.md#env-001--environment-schema); [Embedded Language Compilation Profile](../003.%20Embedded%20Language/03-external-interface-requirements.md#env-004--compilation-profile).

### POLICY-003 — Static validation

Before a Statement becomes active, compilation SHALL validate:

- Embedded Language `PROGRAM` syntax and the Authorization policy Compilation Profile.
- Binding, static types, and complete return control flow.
- Supported authorization roots and fields for the Statement scope.
- Compiler complexity limits.
- Object residual field/operator support for the selected Filter Schema mapping.

A policy failing a required static validation SHALL NOT become active.

Verification: Attempt activation with one failure in each required static-validation category. Also activate valid non-`Bool` Embedded Language programs and verify STMT-004 is enforced only when Authorization evaluates or partially evaluates their Semantic AST.
Traceability: [Embedded Language diagnostics](../003.%20Embedded%20Language/06-quality-and-performance-requirements.md#diag-001--actionable-diagnostics); STMT-003; STMT-004; OBJ-004.

### POLICY-004 — DB-authoritative Statement state and compiled-artifact reuse

Every authorization operation SHALL obtain the current relevant effective Statement state from the database before policy evaluation.

The authorization system SHALL NOT use an in-memory or distributed cache of Statement records, effective Statement sets, Statement ids, or authorization snapshots to bypass that database lookup.

A compiled Semantic AST MAY be reused across operations only as a derived artifact after the current Statement has been loaded from the database. Any such reuse SHALL be keyed by an immutable fingerprint of the exact policy/Statement state loaded for the current operation and SHALL also satisfy the compiled-artifact identity requirements of the Embedded Language feature, including the Authorization Environment Schema and policy Compilation Profile.

A compiled-artifact cache:

- SHALL NOT determine which Statements are effective.
- SHALL NOT suppress the per-operation database lookup.
- SHALL NOT make authorization correctness depend on cache invalidation, TTL, or cross-node synchronization.
- SHALL be treated as an optimization only.

If a safe compiled Semantic AST cannot be matched to the exact database-loaded Statement state and Embedded Language compilation contract, the authorization system SHALL compile from that loaded policy source.

Verification: Change policy, Statement metadata, Authorization Environment Schema, policy Compilation Profile, or another relevant Embedded Language compilation contract between operations and confirm a stale Semantic AST is not used.
Traceability: [Embedded Language Contract](02-overall-description.md#223-embedded-language-contract); [Embedded Language compiled artifact metadata](../003.%20Embedded%20Language/05-data-and-information-requirements.md#data-003--compiled-artifact-metadata); PERF-004.

### POLICY-005 — Constant folding

Constant policy results and constant subexpressions SHALL be folded when Embedded Language semantics are unchanged.

At minimum:

```text
return true;
```

and:

```text
return false;
```

SHALL be represented as constant Semantic AST results.

Verification: Compile the true and false constant examples and inspect the Semantic AST for constant representations; evaluate equivalent constant subexpressions.
Traceability: [Embedded Language constant folding](../003.%20Embedded%20Language/04-functional-and-behavioral-requirements.md#partial-002--constant-folding-and-boolean-simplification); OBJ-005.

## 4.2 Request Authorization

### REQ-001 — Decision semantics

For `scope: request`:

```text
DENY if any target-matching DENY Statement evaluates true
ELSE ALLOW if any target-matching ALLOW Statement evaluates true
ELSE DENY
```

For each evaluated Request policy, Authorization SHALL evaluate its Semantic AST and inspect the concrete result. A result whose runtime type is not `Bool` SHALL raise an authorization runtime exception and fail closed before the Statement effect is applied.

Failures in policy evaluation or required `principal`/`request` input resolution SHALL fail closed.

Verification: Evaluate matching allow and deny Statements, including default-deny and deny-overrides cases. Evaluate an active non-`Bool` policy Semantic AST and confirm a runtime authorization exception and denial. Inject evaluator and required-input failures and confirm the result is denial where required.
Traceability: [Fail-Closed Behavior](07-constraints.md#74-fail-closed-behavior); STMT-004.

### REQ-002 — Constant short-circuit

A target-matching DENY Statement whose compiled policy is constant `TRUE` SHALL immediately produce the final DENY result.

After the final result is known, authorization SHALL NOT evaluate remaining policies or resolve authorization inputs that cannot change that result.

A constant-`TRUE` ALLOW SHALL NOT bypass applicable DENY Statements.

The required database Statement resolution for the operation occurs before these in-operation evaluation short-circuits; short-circuiting SHALL NOT skip the per-operation DB source-of-truth lookup.

Verification: Use a constant-true deny followed by an instrumented policy/input resolution and confirm the deny short-circuits evaluation after database resolution has occurred.
Traceability: [Resolution and Operation Snapshot](02-overall-description.md#221-resolution-and-operation-snapshot); PERF-004.

### REQ-003 — Request input boundary

For `scope: request`, authorization SHALL evaluate the policy Semantic AST using only the `principal` and `request` values already available at the time of authorization.

Request Authorization SHALL NOT load business resources, invoke resource adapters, or make resource data available through `object`.

A Request policy that references `object`, `resources`, or uses call syntax SHALL be rejected before the Statement becomes active. No compatibility fallback SHALL ignore these constructs.

Statement database resolution and creation of the operation-scoped Authorization Snapshot SHALL remain part of authorization and SHALL not be interpreted as business-resource loading.

Verification: Accept Request policies using the supported `principal` and `request` fields; reject `object`, `resources`, and `resource(...)`; verify the resource exclusions and no resource lookup specified by RES-001–RES-003; inject missing required request inputs and confirm denial.
Traceability: [Request Authorization Input Boundary](02-overall-description.md#224-request-authorization-input-boundary); INPUT-001 through INPUT-003; RES-001 through RES-003; [Fail-Closed Behavior](07-constraints.md#74-fail-closed-behavior).

## 4.3 Object Authorization and Shared Semantic Predicate

### OBJ-001 — Partial evaluation

For `scope: object`, the authorization system SHALL partially evaluate the Statement policy Semantic AST with known `principal` and `request` values while retaining `object.*` as symbolic values.

Partial evaluation SHALL follow the [Embedded Language Partial Evaluation requirements](../003.%20Embedded%20Language/04-functional-and-behavioral-requirements.md#45-partial-evaluation).

After partial evaluation:

- A concrete `true` SHALL become the constant-true Object Predicate.
- A concrete `false` SHALL become the constant-false Object Predicate.
- A residual Semantic AST expression whose static type is `Bool` SHALL become the Object Predicate without requiring conversion to a second persistence-neutral AST.
- A concrete non-`Bool` result or residual non-`Bool` Semantic AST expression SHALL raise an authorization runtime exception and fail closed before queryability validation or persistence-query compilation.

An evaluation failure or invalid residual contract SHALL raise an authorization exception and fail closed.

Verification: Partially evaluate active `Bool` and non-`Bool` policy Semantic ASTs across constant, symbolic, conditional, early-return, and failing cases. Confirm valid concrete booleans and residual boolean Semantic AST expressions become Object Predicates, while concrete or residual non-`Bool` results raise a runtime authorization exception and fail closed.
Traceability: [Shared Object Filter](02-overall-description.md#222-shared-object-filter); STMT-004; [Embedded Language partial evaluation](../003.%20Embedded%20Language/04-functional-and-behavioral-requirements.md#partial-001--unknown-preserving-evaluation).

### OBJ-002 — Initial Filter Schema scope

Filter Schema SHALL map policy-visible object fields to persisted fields/types for a registered Object Authorization mapping and SHALL define which Semantic AST fields and operators can be represented by the persistence query predicate.

The mapped object fields and types SHALL be exposed through the `object` root in the Authorization Environment Schema.

The authorization system SHALL preserve direct one-segment object fields. Nested paths, joins, and relationship predicates remain outside the current scope.

Verification: Map valid direct fields through a registered Filter Schema and reject nested, joined, relationship, or unsupported operator references during Object queryability validation.
Traceability: [Scope](01-introduction.md#12-scope); [Assumptions and Dependencies](08-requirements-allocation-and-dependencies.md#81-assumptions-and-dependencies); OBJ-004.

### OBJ-003 — Shared Semantic AST predicate

The normative persistence-neutral Object Predicate SHALL be a typed `Bool` Semantic AST expression produced by Embedded Language compilation or partial evaluation.

The Object Predicate SHALL preserve the operations required by the existing Object Authorization semantics:

```text
boolean literals true false
AND OR NOT
EQ NE GT GE LT LE
numeric ADD SUBTRACT MULTIPLY DIVIDE NEGATE
static object-field references
```

Authorization SHALL NOT require a separate Filter AST contract between the residual Semantic AST and persistence-query compilation. Persistence adapters MAY use implementation-private intermediate structures provided those structures do not become a second authorization semantic contract and preserve the specified predicate semantics.

Verification: Inspect the Object Predicate and persistence-query boundary, confirm the required operations are represented through Semantic AST expressions, and confirm no public/authorization-domain Filter AST conversion is required before query compilation.
Traceability: [Shared Object Filter](02-overall-description.md#222-shared-object-filter); [Embedded Language semantic representation](../003.%20Embedded%20Language/04-functional-and-behavioral-requirements.md#lang-001--language-owned-semantic-representation).

### OBJ-004 — Database execution and queryability

A validated Object Predicate SHALL compile to the resource query predicate used by the existing persistence layer.

Authorization filtering SHALL execute before pagination. The authorization system SHALL NOT load unrestricted business rows and filter them in JVM memory.

Activation-time Object queryability validation SHALL validate only residual fields and operators that depend on symbolic `object` against the selected Filter Schema mapping.

Control-flow constructs in the policy Semantic AST SHALL NOT hide residual fields or operators from activation-time queryability validation.

Persistence-query compilation SHALL consume the validated Semantic AST expression and the selected Filter Schema without requiring source-text interpretation.

Verification: Activate policies using supported and unsupported residual fields/operators across conditional/return paths and confirm mapping validation rejects unsupported cases before activation; compile valid Object Predicates to the resource query predicate and verify authorized rows are filtered in the database before pagination.
Traceability: [Shared Object Filter](02-overall-description.md#222-shared-object-filter); POLICY-003; OBJ-002; OBJ-003.

### OBJ-005 — Composition

Object visibility SHALL use:

```text
ANY(ALLOW predicates) AND NOT ANY(DENY predicates)
```

Predicate composition SHALL produce or preserve a typed `Bool` Semantic AST expression and SHALL be simplified before persistence translation.

At minimum:

```text
TRUE object policy  -> true
FALSE object policy -> false
true OR X            -> true
false OR X           -> X
true AND X           -> X
false AND X          -> false
NOT true             -> false
NOT false            -> true
```

A target-matching DENY Statement with constant `TRUE` SHALL reduce the final authorization predicate to constant `false` without compiling remaining ACL predicates to persistence queries.

When the final authorization predicate is constant `false`, the query layer SHOULD avoid a database query when the caller can produce the correct empty result without it.

Verification: Test constant and composed object policies, inspect the simplified Semantic AST predicate, and confirm the authorization predicate is applied before pagination without JVM row filtering.
Traceability: [Scope](01-introduction.md#12-scope); [Shared Object Filter](02-overall-description.md#222-shared-object-filter); [Embedded Language constant folding](../003.%20Embedded%20Language/04-functional-and-behavioral-requirements.md#partial-002--constant-folding-and-boolean-simplification).

The composition test SHALL include the complete allow/deny table and confirm constant simplification preserves the required visibility result.
