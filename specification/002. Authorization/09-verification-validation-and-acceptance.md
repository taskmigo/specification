# 9. Verification, Validation, and Acceptance Evidence

## 9.1 Verification and Conformance Matrix

Verification SHALL cover:

- STMT-001–STMT-007: Statement contract, deferred semantic validation, runtime `PROGRAM` profile enforcement, Boolean semantics, effects, and targets.
- INPUT-001–INPUT-003: Typed principal/request roots and runtime Object Authorization Schema-derived symbolic object paths.
- RES-001–RES-003: Request resource exclusion and absence of privileged resource-loading calls.
- SNAPSHOT-001–SNAPSHOT-004: One immutable operation state, consistency, coherent creation, and no cross-request reuse.
- AUTH-API-001–AUTH-API-006: Typed request input, opaque context, Request/Object APIs, object schema/predicate contracts, Spring adaptation, and persistence binding.
- LOG-API-001–LOG-API-003: Protected Authorization Log retrieval, v0 offset pagination, ordering, and public log representation.
- POLICY-001–POLICY-005: Runtime `PROGRAM` compilation, deferred semantic validation, database-authoritative state, artifact identity, and folding.
- STATE-001–STATE-002: Database-owned effective Statement revisions and revision-based Authorization-layer derived-artifact freshness.
- LOG-DATA-001–LOG-DATA-002: Persisted Authorization Log fields, diagnostic safety, and deterministic ordering identity.
- REQ-001–REQ-003: Default-deny, deny-overrides, non-`Bool` fail-closed behavior, short-circuiting, Request input boundary, and Request outcome logging.
- OBJ-001–OBJ-005: Runtime partial evaluation, nested/composed/collection Object Authorization Schema paths, opaque predicates, queryability, database execution, and composition.
- LOG-001–LOG-005: One log per Request/Object invocation, outcome/severity mapping, error classification, Object predicate outcome semantics, and log-persistence isolation.
- PERF-001–PERF-005: Graph/query performance, per-operation freshness, revision-aware derived-artifact reuse, cache independence, and stress behavior.
- TECH-001–TECH-005: Explicit constant semantics, integration boundaries, policy isolation, fail-closed behavior, and authorization-log isolation.

## 9.2 Acceptance Conditions

Verification SHALL demonstrate:

1. Creating or updating a structurally valid Statement with semantically invalid policy source succeeds without policy compilation, target-to-schema resolution, or Object queryability validation.
2. A semantically invalid persisted Statement fails closed only when a matching Request or Object Authorization operation executes it and produces one `ERROR`/`ERROR` Authorization Log for that invocation.
3. Request Authorization returns one opaque `AuthorizationContext` derived from the same state used for its decision.
4. Object Authorization reuses that context without independently resolving effective Statements.
5. `ObjectAuthorization.authorize(context, ObjectAuthorizationSchema<Q>)` returns `ObjectAuthorizationPredicate<Q>` without exposing JPA entities or Semantic AST.
6. Nested API paths and collection quantifiers are validated at runtime against the Object Authorization Schema supplied to the Object Authorization operation and remain symbolic until resource-owned persistence translation.
7. Non-`Bool` Request/Object results fail closed at runtime and are logged as authorization errors rather than ordinary denied decisions.
8. Object Authorization executes before pagination without unrestricted JVM row filtering.
9. Request Authorization logs successful grants as `ALLOWED`/`INFO`, successful denials including default deny as `DENIED`/`WARNING`, and execution failures as `ERROR`/`ERROR`.
10. Object Authorization logs a successfully produced constant-false final predicate as `DENIED`/`WARNING`, any other successfully produced final predicate as `ALLOWED`/`INFO`, and does not infer denial merely from an empty database result set.
11. Authorization Log persistence failure does not change the authorization outcome already determined by the authorization engine and remains operationally observable.
12. `GET /api/v0/authorization/logs` is protected by normal Request Authorization and returns deterministic newest-first pages using one-based `page`, bounded `pageSize`, total item count, and total page count.
13. Effective Statement resolution exposes a database-owned revision that changes after a committed Statement update, and Authorization does not reuse a derived artifact when that revision or another required runtime compilation identity changes.
14. Executable applications and Statement writers do not need to duplicate transport route metadata solely to create or update Statements.

Language evidence SHALL satisfy the [Language verification matrix](../003.%20Language/09-verification-validation-and-acceptance.md#91-verification-and-conformance-matrix).
