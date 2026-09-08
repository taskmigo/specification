# 9. Verification, Validation, and Acceptance Evidence

## 9.1 Verification and Conformance Matrix

Verification SHALL cover:

- STMT-001–STMT-007: Statement contract, `PROGRAM` profile, bounded intrinsics, runtime Bool enforcement, effects, and targets.
- INPUT-001–INPUT-003: Typed principal/request roots and Query Schema-derived symbolic object paths.
- RES-001–RES-003: Request resource exclusion and absence of privileged resource-loading calls.
- SNAPSHOT-001–SNAPSHOT-004: One immutable operation state, consistency, coherent creation, and no cross-request reuse.
- AUTH-API-001–AUTH-API-005: Typed request input, opaque context, Request/Object APIs, and Spring Security-to-MVC context propagation.
- POLICY-001–POLICY-005: `PROGRAM` compilation, schema/profile-aware validation, database-authoritative state, artifact identity, and folding.
- REQ-001–REQ-003: Default-deny, deny-overrides, non-`Bool` fail-closed behavior, short-circuiting, and Request input boundary.
- OBJ-001–OBJ-005: Partial evaluation, nested/composed/collection Query Schema paths, opaque Query Predicates, queryability, and composition.
- PERF-001–PERF-005: Graph/query performance, per-operation freshness, cache independence, and stress behavior.
- TECH-001–TECH-004: Pattern discipline, policy isolation, fail-closed behavior, and distinct client-filter failures.

## 9.2 Acceptance Conditions

Verification SHALL demonstrate:

1. Request Authorization returns one opaque `AuthorizationContext` derived from the same state used for its decision.
2. Object Authorization reuses that context without independently resolving effective Statements.
3. `ObjectAuthorization.authorize(context, QuerySchema<Q>)` returns a typed logical `QueryPredicate<Q>` without exposing JPA entities or Semantic AST.
4. Nested API paths and collection quantifiers are validated against Query Schema and remain symbolic until persistence translation.
5. Non-`Bool` Object results fail closed before Query Predicate acceptance.
6. Object Authorization and Query Filtering compose before pagination.
7. Spring Security and MVC integration reuse the same operation context.

Embedded Language evidence SHALL satisfy the [Embedded Language verification matrix](../003.%20Embedded%20Language/09-verification-validation-and-acceptance.md#91-verification-and-conformance-matrix). Query predicate/persistence evidence SHALL satisfy the [Query Filtering verification matrix](../004.%20Query%20Filtering/09-verification-validation-and-acceptance.md#91-verification-matrix).
