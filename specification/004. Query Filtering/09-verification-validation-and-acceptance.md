# 9. Verification, Validation, and Acceptance Evidence

## 9.1 Verification Matrix

Verification SHALL cover:

- SCHEMA-001–SCHEMA-004: Typed Query Contract identity, nested API-visible paths, collection type metadata, and explicit allow-lists.
- PRED-001–PRED-002: Opaque typed predicates, compatible composition, and predicate identity.
- FILTER-001–FILTER-003: HTTP input, `EXPRESSION` compilation, Boolean result requirement, diagnostics, and `400` handling.
- SPRING-001: Generic MVC resolution through `ResolvableType` without string target selectors.
- PERSIST-001–PERSIST-003: Resource-owned mappings, JPA/custom adapters, collection quantifiers, and semantic equivalence.
- QRY-001–QRY-005: API-field binding, nested/composed projections, composition, collection predicates, and pre-pagination execution.
- DATA-001–DATA-002: Query Path/schema/predicate identity and request lifecycle.
- QUAL-001: Deterministic filter semantics.
- SEC-001–SEC-002: Persistence namespace isolation and public diagnostic vocabulary.
- PERF-001–PERF-002: Database-side filtering and compiled-artifact identity/reuse.
- TECH-001–TECH-004: Spring integration, persistence abstractions, source isolation, and failure behavior.

## 9.2 Acceptance Scenarios

Verification SHALL demonstrate:

1. `object.name` maps to a differently named persistence field without exposing that persistence name to the client.
2. `object.user.name` maps through a persistence join or custom query projection.
3. `FilteredQuery<CustomerListQuery>` resolves the correct Query Schema without a string target annotation.
4. `all(object.user.emails, email => len(email) > 10)` preserves the Language result when translated by a supported persistence adapter.
5. Persistence-only names are rejected and absent from client diagnostics.
6. Client filtering executes before pagination without unrestricted JVM row filtering.

Language evidence SHALL satisfy the [Language verification matrix](../003.%20Language/09-verification-validation-and-acceptance.md#91-verification-and-conformance-matrix).
