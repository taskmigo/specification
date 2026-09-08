# 9. Verification, Validation, and Acceptance Evidence

## 9.1 Verification Matrix

Verification SHALL cover:

- SCHEMA-001–SCHEMA-004: Typed query-contract identity, API-visible nested paths, collection type metadata, and explicit allow-lists.
- PRED-001–PRED-002: Opaque typed predicates and same-contract composition.
- FILTER-001–FILTER-003: HTTP input, `EXPRESSION` compilation, Bool requirement, diagnostics, and `400` handling.
- SPRING-001: Generic MVC resolution through `ResolvableType` without string target selectors.
- PERSIST-001–PERSIST-003: Resource-owned mappings, JPA/custom adapters, collection quantifiers, and semantic equivalence.
- QRY-001–QRY-005: API-field binding, nested/composed projections, composition, collection predicates, and pre-pagination execution.
- DATA-001–DATA-002: Immutable path/schema/predicate identity and request lifecycle.
- QUAL-001: Deterministic filter semantics.
- SEC-001–SEC-002: Persistence namespace isolation and public diagnostic vocabulary.
- PERF-001–PERF-002: Database-side filtering and compiled-artifact identity/reuse.
- TECH-001–TECH-004: Spring integration, persistence abstractions, source isolation, and distinct failure boundaries.

## 9.2 Acceptance Scenarios

Verification SHALL demonstrate:

1. `object.name` can map to a differently named database/JPA field without exposing that name to the client.
2. `object.user.name` can map through a persistence join or custom projection.
3. `filterBy` and Object Authorization predicates compose before pagination.
4. `AuthorizedQuery<CustomerListQuery>` resolves the correct Query Schema without a string target annotation.
5. `all(object.user.emails, email => len(email) > 10)` preserves the Embedded Language result when translated by a supported persistence adapter.
6. Persistence-only names are rejected and absent from client diagnostics.
