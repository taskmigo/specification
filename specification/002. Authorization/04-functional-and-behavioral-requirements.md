# 4. Functional and Behavioral Requirements

## 4.1 Language Compilation

### POLICY-001 — Runtime compilation model

Authorization SHALL compile a target-matching Statement `policy` through Language `PROGRAM` mode into typed Semantic AST when the policy is required by a Request or Object Authorization operation.

The Authorization-owned Compilation Profile MAY enable canonical collection quantifiers and `len(...)` and SHALL be included in compiled-artifact identity.

Request Authorization SHALL evaluate Semantic AST; Object Authorization SHALL partially evaluate it. Authorization SHALL NOT execute source through a general-purpose script runtime.

Verification: Persist policy source without semantic pre-validation and inspect runtime compilation/execution boundaries and profile identity.
Traceability: [Language](../003.%20Language/README.md); STMT-003.

### POLICY-002 — Runtime Environment contract

Request scope SHALL compile/evaluate against an Environment Schema exposing `principal` and `request`. Object scope SHALL additionally expose symbolic `object` paths/types derived from the `ObjectAuthorizationSchema<Q>` supplied to the current Object Authorization operation.

Policy-result interpretation SHALL follow STMT-004.

Verification: Execute both scopes against their exact runtime Environment Schemas.
Traceability: INPUT-001; AUTH-API-004.

### POLICY-003 — Deferred semantic validation

Creating or updating a Statement SHALL NOT perform authorization semantic validation of its policy or target and SHALL NOT require Object target-to-schema applicability metadata.

When a target-matching Statement participates in authorization, Authorization SHALL validate language/profile syntax, binding/types, complete return flow, supported authorization roots, complexity limits, and scope-dependent semantics during runtime compilation/evaluation. Object Authorization SHALL additionally validate symbolic object paths/operators against the `ObjectAuthorizationSchema<Q>` supplied to that operation before accepting the resulting predicate for persistence use.

Any such runtime validation failure SHALL follow STMT-003, LOG-003, and TECH-004.

Verification: Persist Statements containing invalid syntax, unavailable roots, invalid types, malformed targets, unsupported Object paths, and unsupported Object operators; confirm create/update succeeds structurally and matching runtime authorization fails closed with one error log.
Traceability: STMT-002; STMT-003; OBJ-002; OBJ-004; LOG-003.

### POLICY-004 — DB-authoritative Statement state and artifact reuse

Every authorization operation SHALL obtain current effective Statement state from the database. Compiled Semantic AST MAY be reused only after current Statement loading and only under exact Statement revision, Language/compiler, scope Environment Schema, Compilation Profile, and, for Object Authorization, supplied Object Authorization Schema identity.

A compiled-artifact cache SHALL NOT determine effective Statements, suppress the required database lookup, or make correctness depend on TTL, invalidation, or synchronization.

Verification: Change Statement state and compilation identities independently, including the Object Authorization Schema supplied to an Object operation.
Traceability: [Language compiled artifact metadata](../003.%20Language/05-data-and-information-requirements.md#data-003--compiled-artifact-metadata); STATE-001; STATE-002; PERF-004.

### POLICY-005 — Constant folding

Constant policy results and subexpressions SHALL be folded when semantics are unchanged.

Verification: Inspect constant true/false and quantified constant cases.
Traceability: [Language constant folding](../003.%20Language/04-functional-and-behavioral-requirements.md#partial-002--constant-folding-and-boolean-simplification); OBJ-005.

## 4.2 Request Authorization

### REQ-001 — Decision semantics

For Request scope:

```text
DENY if any target-matching DENY Statement evaluates true
ELSE ALLOW if any target-matching ALLOW Statement evaluates true
ELSE DENY
```

Each evaluated policy SHALL yield concrete `Bool`; non-`Bool` results and authorization execution failures SHALL fail closed.

The final successful ALLOW/DENY decision SHALL be logged according to LOG-002. An authorization execution failure SHALL instead be logged as ERROR according to LOG-003, even though access fails closed.

Verification: Test default deny, allow, deny override, non-`Bool`, evaluator failure, and corresponding log outcomes.
Traceability: STMT-004; LOG-002; LOG-003; TECH-004.

### REQ-002 — Constant short-circuit

A target-matching constant-true DENY SHALL produce final DENY after required operation Statement resolution. A constant-true ALLOW SHALL NOT bypass applicable DENY Statements.

Verification: Instrument remaining evaluation after constant deny.
Traceability: POLICY-005; PERF-004.

### REQ-003 — Request input boundary

Request Authorization SHALL evaluate using only already-available principal/request inputs. It SHALL NOT load business resources, invoke resource adapters, or expose `object`.

Verification: Instrument resource access and execute policies using unavailable roots/privileged calls to verify fail-closed runtime behavior.
Traceability: INPUT-001 through INPUT-003; RES-001 through RES-003.

## 4.3 Object Authorization

### OBJ-001 — Partial evaluation

Object Authorization SHALL partially evaluate target-matching policy Semantic AST using known `principal`/`request` values while retaining `ObjectAuthorizationSchema<Q>`-derived `object` values as symbolic.

A concrete `Bool` or residual `Bool` expression SHALL become the logical Object Authorization Predicate. Non-`Bool` concrete/residual results and authorization execution failures SHALL fail closed before queryability or persistence translation.

Verification: Partially evaluate constant, nested, quantified, conditional, non-`Bool`, and invalid persisted policies at runtime.
Traceability: STMT-004; [Language partial evaluation](../003.%20Language/04-functional-and-behavioral-requirements.md#45-partial-evaluation); LOG-003.

### OBJ-002 — Object Authorization Schema scope

Object policy-visible paths, structured types, collection element types, nullability, and accepted operators SHALL derive from the `ObjectAuthorizationSchema<Q>` supplied to the current Object Authorization operation.

Nested/composed API paths MAY map to joins, computed persistence expressions, multiple entities, arrays/JSON, or custom query adapters without changing the Object policy path.

Verification: Authorize nested/composed Object Authorization Schemas with differing persistence topology and the same persisted Statement source.
Traceability: AUTH-API-004; AUTH-API-006.

### OBJ-003 — Opaque logical predicate

The persistence-neutral Object Authorization Predicate SHALL remain a typed `ObjectAuthorizationPredicate<Q>` whose internal semantic representation derives from the residual Boolean Semantic AST.

Core Authorization SHALL NOT expose Semantic AST or persistence query structures through the predicate interface.

Verification: Inspect public/domain boundaries and predicate opacity.
Traceability: AUTH-API-004.

### OBJ-004 — Runtime queryability and database execution

Authorization SHALL validate symbolic object paths/operators, including paths inside restricted collection lambdas, against the `ObjectAuthorizationSchema<Q>` supplied to the current Object Authorization operation before the predicate is accepted for persistence use.

Object Authorization SHALL execute in the database before pagination through the resource-owned authorization persistence binder or equivalent repository adapter. Authorization SHALL NOT load unrestricted rows and filter them in JVM memory.

Verification: Persist policies with unsupported nested/collection paths/operators, execute them against differing schemas, and inspect database-before-pagination execution for valid predicates.
Traceability: OBJ-002; AUTH-API-006; POLICY-003.

### OBJ-005 — Composition

Object visibility SHALL preserve:

```text
ANY(ALLOW predicates) AND NOT ANY(DENY predicates)
```

Composition SHALL produce `ObjectAuthorizationPredicate<Q>` and simplify constant Boolean identities before persistence translation when semantics are unchanged.

A constant-true matching DENY SHALL reduce the final Object Authorization Predicate to constant false.

Verification: Test complete allow/deny combinations and constant simplification.
Traceability: OBJ-003; POLICY-005.

## 4.4 Authorization Logging

### LOG-001 — One log record per authorization attempt

Each invocation of Request Authorization SHALL persist one Authorization Log representing the final Request Authorization outcome. Each invocation of Object Authorization SHALL persist one Authorization Log representing the final Object Authorization outcome.

Authorization SHALL NOT create one persisted Authorization Log per evaluated Statement for the same authorization invocation.

Verification: Execute authorization operations matching zero, one, and multiple Statements and count persisted log records.
Traceability: LOG-DATA-001.

### LOG-002 — Allowed and denied severity

A successfully completed authorization invocation SHALL map its final outcome and log level as follows:

| Authorization outcome | Log level |
| --------------------- | --------- |
| `ALLOWED`             | `INFO`    |
| `DENIED`              | `WARNING` |

For Request Authorization, the final granted decision SHALL map to `ALLOWED`; the final non-error denied decision, including default deny, SHALL map to `DENIED`.

Verification: Exercise explicit allow, deny override, and default deny and inspect persisted outcome/level pairs.
Traceability: REQ-001; LOG-DATA-001.

### LOG-003 — Authorization error severity

A runtime authorization failure in target processing, policy compilation, binding, typing, evaluation, partial evaluation, Object queryability validation, predicate composition, or required persistence translation SHALL produce outcome `ERROR` with log level `ERROR` and SHALL fail closed under TECH-004.

An error outcome SHALL NOT be reclassified as `DENIED` merely because fail-closed behavior prevents access.

Verification: Trigger each supported runtime failure boundary and confirm one `ERROR`/`ERROR` Authorization Log plus fail-closed behavior.
Traceability: STMT-003; STMT-006; POLICY-003; TECH-004.

### LOG-004 — Object Authorization outcome semantics

A successful Object Authorization invocation whose final composed `ObjectAuthorizationPredicate<Q>` is constant false SHALL log `DENIED`/`WARNING`. A successful Object Authorization invocation producing any other final predicate SHALL log `ALLOWED`/`INFO`.

An empty resource-query result SHALL NOT retroactively change an Object Authorization Log from `ALLOWED` to `DENIED`; an empty result does not prove that authorization denied a concrete object.

Verification: Produce constant-false, constant-true, residual, and empty-query-result cases and inspect the logged outcomes.
Traceability: OBJ-005; LOG-002.

### LOG-005 — Logging failure isolation

Failure to persist an Authorization Log SHALL NOT convert an `ALLOWED` result to `DENIED`, convert a `DENIED` result to an application error, or otherwise change the authorization outcome already determined by the authorization engine.

The system SHALL surface Authorization Log persistence failure through operational diagnostics independently of the persisted Authorization Log API.

Verification: Make Authorization Log persistence unavailable during allowed, denied, and authorization-error cases and confirm the authorization outcome remains unchanged while the logging failure is observable operationally.
Traceability: TECH-005.
