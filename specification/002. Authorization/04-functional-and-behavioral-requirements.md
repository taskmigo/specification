# 4. Functional and Behavioral Requirements

## 4.1 Embedded Language Compilation

### POLICY-001 — Compilation model

The authorization system SHALL compile Statement `policy` source through the [Embedded Language](../003.%20Embedded%20Language/README.md) compiler into typed Language IR.

Authorization execution SHALL evaluate or partially evaluate Language IR; it SHALL NOT invoke a general-purpose JavaScript runtime or evaluate policy source directly.

Verification: Inspect the compiler and execution boundary and run policy evaluation tests that confirm execution uses typed Language IR without invoking a JavaScript runtime.
Traceability: [Embedded Language Contract](02-overall-description.md#223-embedded-language-contract); [Embedded Language semantic representation](../003.%20Embedded%20Language/04-functional-and-behavioral-requirements.md#lang-001--language-owned-semantic-representation).

### POLICY-002 — Embedded Language contract

The program syntax, type system, control-flow semantics, operator semantics, evaluation semantics, partial evaluation, and generic queryability rules SHALL be defined by the [Embedded Language feature](../003.%20Embedded%20Language/README.md).

Authorization SHALL NOT extend the Embedded Language with authorization-only syntax or utility functions. Authorization-specific behavior SHALL be expressed through the scope-dependent Environment Schema, Statement effect, and Object query-lowering mapping.

For `scope: request`, the Authorization Environment Schema SHALL expose `principal` and `request` and SHALL not expose `object`.

For `scope: object`, the Authorization Environment Schema SHALL expose `principal`, `request`, and symbolic/query-bound `object`.

Verification: Compile the same Embedded Language program syntax in both scopes and confirm only the Authorization Environment Schema/queryability differences change acceptance.
Traceability: [Authorization inputs](03-external-interface-requirements.md#32-authorization-inputs-and-operation-snapshot); [Embedded Language Environment Schema](../003.%20Embedded%20Language/03-external-interface-requirements.md#env-001--environment-schema).

### POLICY-003 — Static validation

Before a Statement becomes active, compilation SHALL validate:

- Embedded Language syntax.
- Binding and static types, including complete `Bool` return paths.
- Supported authorization roots and fields for the Statement scope.
- Compiler complexity limits.
- Applicable Object residual queryability for the selected Filter Schema mapping.

A policy failing any required validation SHALL NOT become active.

Verification: Attempt activation with one failure in each category and confirm rejection with the corresponding Embedded Language diagnostic category.
Traceability: [Embedded Language diagnostics](../003.%20Embedded%20Language/06-quality-and-performance-requirements.md#diag-001--actionable-diagnostics); OBJ-004.

### POLICY-004 — DB-authoritative Statement state and compiled-artifact reuse

Every authorization operation SHALL obtain the current relevant effective Statement state from the database before policy evaluation.

The authorization system SHALL NOT use an in-memory or distributed cache of Statement records, effective Statement sets, Statement ids, or authorization snapshots to bypass that database lookup.

Language IR MAY be reused across operations only as a derived compiled artifact after the current Statement has been loaded from the database. Any such reuse SHALL be keyed by an immutable fingerprint of the exact policy/Statement state loaded for the current operation and SHALL also satisfy the compiled-artifact identity requirements of the Embedded Language feature.

A compiled-artifact cache:

- SHALL NOT determine which Statements are effective.
- SHALL NOT suppress the per-operation database lookup.
- SHALL NOT make authorization correctness depend on cache invalidation, TTL, or cross-node synchronization.
- SHALL be treated as an optimization only.

If a safe compiled artifact cannot be matched to the exact database-loaded Statement state and Embedded Language compilation contract, the authorization system SHALL compile from that loaded policy source.

Verification: Change policy, Statement metadata, or a relevant Embedded Language compilation contract between operations and confirm a stale compiled artifact is not used.
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

SHALL be represented as constant policy results.

Verification: Compile the true and false constant examples and inspect Language IR for constant representations; evaluate equivalent constant subexpressions.
Traceability: [Embedded Language constant folding](../003.%20Embedded%20Language/04-functional-and-behavioral-requirements.md#partial-002--constant-folding-and-boolean-simplification); OBJ-005.

## 4.2 Request Authorization

### REQ-001 — Decision semantics

For `scope: request`:

```text
DENY if any target-matching DENY Statement evaluates true
ELSE ALLOW if any target-matching ALLOW Statement evaluates true
ELSE DENY
```

Each active Request policy SHALL already satisfy the Embedded Language static complete-`Bool` return contract.

Failures in policy evaluation or required `principal`/`request` input resolution SHALL fail closed.

Verification: Evaluate matching allow and deny Statements, including default-deny and deny-overrides cases, and inject evaluator and required-input failures; confirm the result is denial where required.
Traceability: [Fail-Closed Behavior](07-constraints.md#74-fail-closed-behavior); STMT-004.

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

A Request policy that references `object`, `resources`, or uses call syntax SHALL be rejected before the Statement becomes active. No compatibility fallback SHALL ignore these constructs.

Statement database resolution and creation of the operation-scoped Authorization Snapshot SHALL remain part of authorization and SHALL not be interpreted as business-resource loading.

Verification: Accept Request policies using the supported `principal` and `request` fields; reject `object`, `resources`, and `resource(...)`; verify the resource exclusions and no resource lookup specified by RES-001–RES-003; inject missing required request inputs and confirm denial.
Traceability: [Request Authorization Input Boundary](02-overall-description.md#224-request-authorization-input-boundary); INPUT-001 through INPUT-003; RES-001 through RES-003; [Fail-Closed Behavior](07-constraints.md#74-fail-closed-behavior).

## 4.3 Object Authorization and Shared Filter AST

### OBJ-001 — Partial evaluation

For `scope: object`, the authorization system SHALL partially evaluate the Statement `policy` Embedded Language program with known `principal` and `request` values while retaining `object.*` as symbolic values.

Partial evaluation SHALL follow the [Embedded Language Partial Evaluation requirements](../003.%20Embedded%20Language/04-functional-and-behavioral-requirements.md#45-partial-evaluation).

A concrete `true` SHALL lower to `ALL`; a concrete `false` SHALL lower to `NONE`. A residual boolean Language IR predicate SHALL be lowered to Filter AST.

An evaluation failure or invalid residual contract SHALL raise an authorization exception and fail closed.

Verification: Partially evaluate constant, symbolic, conditional, early-return, and failing Object policies and confirm concrete booleans and residual predicates become valid filters while failures deny.
Traceability: [Shared Object Filter](02-overall-description.md#222-shared-object-filter); STMT-004.

### OBJ-002 — Initial Filter Schema scope

Filter Schema SHALL map policy-visible object fields to persisted fields/types for a registered Object Authorization mapping and SHALL provide the `object` Environment Schema/query capabilities required by the Embedded Language consumer contract.

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

Filter AST is independent of Embedded Language source syntax and persistence APIs.

Verification: Inspect the Filter AST API and translate equivalent predicates from residual Language IR and a future client-filter producer without exposing persistence types in the AST.
Traceability: [Scope](01-introduction.md#12-scope); [Appendix B](11-appendices.md#111-future-extensions-non-normative) `filterBy` extension.

### OBJ-004 — Database execution and queryability

Filter AST SHALL compile to the resource query predicate used by the existing persistence layer.

Authorization filtering SHALL execute before pagination. The authorization system SHALL NOT load unrestricted business rows and filter them in JVM memory.

An Object policy that can produce a residual expression not representable by the selected Filter Schema / Filter AST SHALL not be active for that Object Authorization mapping.

Control-flow constructs SHALL NOT hide residual fields or operators from activation-time queryability validation.

The activation validation SHALL satisfy the [Embedded Language residual queryability](../003.%20Embedded%20Language/04-functional-and-behavioral-requirements.md#query-001--residual-queryability) requirement under the Authorization-provided query capability contract.

Verification: Activate policies using supported and unsupported residual fields/operators across conditional/return paths and confirm mapping validation rejects unsupported cases before activation; verify authorized rows are filtered in the database before pagination.
Traceability: [Shared Object Filter](02-overall-description.md#222-shared-object-filter); POLICY-003.

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
ALL AND X            -> X
NONE AND X           -> NONE
NOT ALL              -> NONE
NOT NONE              -> ALL
```

A target-matching DENY Statement with constant `TRUE` SHALL reduce the final authorization filter to `NONE` without translating remaining ACL predicates.

When the final authorization filter is `NONE`, the query layer SHOULD avoid a database query when the caller can produce the correct empty result without it.

Verification: Test constant and composed object policies, inspect the simplified Filter AST, and confirm the authorization predicate is applied before pagination without JVM row filtering.
Traceability: [Scope](01-introduction.md#12-scope); [Shared Object Filter](02-overall-description.md#222-shared-object-filter).

The composition test SHALL include the complete allow/deny table and confirm constant simplification preserves the required visibility result.
