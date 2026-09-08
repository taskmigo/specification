# 4. Functional and Behavioral Requirements

## 4.1 Embedded Language Compilation

### POLICY-001 — Compilation model

Authorization SHALL compile Statement `policy` through Embedded Language `PROGRAM` mode into typed Semantic AST using an Authorization-owned Compilation Profile.

The profile MAY enable canonical collection quantifiers and `len(...)` and SHALL be included in compiled-artifact identity.

Request Authorization SHALL evaluate Semantic AST; Object Authorization SHALL partially evaluate it. Authorization SHALL NOT execute source through a general-purpose script runtime.

Verification: Inspect compilation/execution boundaries and profile identity.
Traceability: [Embedded Language](../003.%20Embedded%20Language/README.md); STMT-003.

### POLICY-002 — Environment contract

Request scope SHALL expose `principal` and `request`. Object scope SHALL additionally expose symbolic `object` paths/types derived from the applicable Query Schema.

Policy-result interpretation SHALL follow STMT-004.

Verification: Compile both scopes against their exact Environment Schemas.
Traceability: INPUT-001; [Query Schema](../004.%20Query%20Filtering/03-external-interface-requirements.md#schema-002--query-schema).

### POLICY-003 — Static validation

Before activation, Authorization SHALL validate language/profile syntax, binding/types, complete return flow, supported authorization roots, complexity limits, and Object queryability for every registered applicable Query Schema that the Statement target may govern.

Control-flow and quantified expressions SHALL NOT hide unsupported symbolic object paths/operators from queryability validation.

Verification: Activate policies with unsupported paths/operators inside conditional and quantifier predicates and confirm rejection for applicable Query Schemas.
Traceability: OBJ-002; OBJ-004.

### POLICY-004 — DB-authoritative Statement state and artifact reuse

Every authorization operation SHALL obtain current effective Statement state from the database. Compiled Semantic AST MAY be reused only after current Statement loading and only under exact Statement/language/schema/profile identity.

A compiled-artifact cache SHALL NOT determine effective Statements, suppress the required database lookup, or make correctness depend on TTL/invalidation/synchronization.

Verification: Change Statement state and compilation identities independently.
Traceability: [Embedded Language compiled artifact metadata](../003.%20Embedded%20Language/05-data-and-information-requirements.md#data-003--compiled-artifact-metadata); PERF-004.

### POLICY-005 — Constant folding

Constant policy results and subexpressions SHALL be folded when semantics are unchanged.

Verification: Inspect constant true/false and quantified constant cases.
Traceability: [Embedded Language constant folding](../003.%20Embedded%20Language/04-functional-and-behavioral-requirements.md#partial-002--constant-folding-and-boolean-simplification); OBJ-005.

## 4.2 Request Authorization

### REQ-001 — Decision semantics

For Request scope:

```text
DENY if any target-matching DENY Statement evaluates true
ELSE ALLOW if any target-matching ALLOW Statement evaluates true
ELSE DENY
```

Each evaluated policy SHALL yield concrete `Bool`; non-`Bool` or evaluation failure SHALL fail closed.

Verification: Test default deny, allow, deny override, non-`Bool`, and evaluator failure.
Traceability: STMT-004; TECH-004.

### REQ-002 — Constant short-circuit

A target-matching constant-true DENY SHALL produce final DENY after required operation Statement resolution. A constant-true ALLOW SHALL NOT bypass applicable DENY Statements.

Verification: Instrument remaining evaluation after constant deny.
Traceability: POLICY-005; PERF-004.

### REQ-003 — Request input boundary

Request Authorization SHALL evaluate using only already-available principal/request inputs. It SHALL NOT load business resources, invoke resource adapters, or expose `object`.

Verification: Instrument resource access and reject unavailable roots/privileged calls.
Traceability: INPUT-001 through INPUT-003; RES-001 through RES-003.

## 4.3 Object Authorization

### OBJ-001 — Partial evaluation

Object Authorization SHALL partially evaluate policy Semantic AST using known `principal`/`request` values while retaining Query Schema-derived `object` values as symbolic.

A concrete `Bool` or residual `Bool` expression SHALL become the logical Object Predicate. Non-`Bool` concrete/residual results or evaluation failures SHALL fail closed before queryability/persistence translation.

Verification: Partially evaluate constant, nested, quantified, conditional, and non-`Bool` policies.
Traceability: STMT-004; [Embedded Language partial evaluation](../003.%20Embedded%20Language/04-functional-and-behavioral-requirements.md#45-partial-evaluation).

### OBJ-002 — Query Schema scope

Object policy-visible paths, structured types, collection element types, nullability, and queryable operators SHALL derive from the applicable `QuerySchema<Q>` defined by Query Filtering.

Nested/composed API paths MAY map to joins, computed persistence expressions, multiple entities, arrays/JSON, or custom query adapters without changing the Object policy path.

Verification: Authorize nested/composed Query Contracts with differing persistence topology.
Traceability: [Query Schema requirements](../004.%20Query%20Filtering/03-external-interface-requirements.md#31-query-contract-interfaces).

### OBJ-003 — Shared logical predicate

The persistence-neutral Object Predicate SHALL remain a typed logical `QueryPredicate<Q>` whose internal semantic representation is derived from the residual Boolean Semantic AST. Authorization SHALL NOT require a second public predicate AST.

Verification: Inspect public/domain boundaries and confirm no Filter AST conversion is required.
Traceability: AUTH-API-004; [Query Predicate](../004.%20Query%20Filtering/03-external-interface-requirements.md#pred-001--typed-opaque-query-predicate).

### OBJ-004 — Queryability and database execution

Authorization SHALL validate symbolic object paths/operators, including those inside restricted collection lambdas, against the applicable Query Schema before the predicate is accepted for persistence use.

Object filtering SHALL execute in the database before pagination through Query Filtering/resource persistence mapping. Authorization SHALL NOT load unrestricted rows and filter them in JVM memory.

Verification: Test unsupported nested/collection paths/operators and inspect database-before-pagination execution.
Traceability: OBJ-002; [Query execution](../004.%20Query%20Filtering/04-functional-and-behavioral-requirements.md#qry-005--persistence-execution-before-pagination).

### OBJ-005 — Composition

Object visibility SHALL preserve:

```text
ANY(ALLOW predicates) AND NOT ANY(DENY predicates)
```

Composition SHALL produce `QueryPredicate<Q>` and simplify constant Boolean identities before persistence translation when semantics are unchanged.

A constant-true matching DENY SHALL reduce the final Object predicate to constant false.

Verification: Test complete allow/deny combinations and constant simplification.
Traceability: [Query Predicate composition](../004.%20Query%20Filtering/03-external-interface-requirements.md#pred-002--typed-composition); POLICY-005.
