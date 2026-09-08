# 5. Data and Information Requirements

## 5.1 Query Schema Data

### DATA-001 — Query Path and schema identity

A Query Path SHALL be an immutable ordered sequence of non-blank API-visible path segments.

A Query Schema SHALL have a stable identity sufficient to distinguish incompatible changes to paths, types, nullability, allowed operators, and nested/collection element contracts.

Verification: Change each schema property independently and confirm incompatible compiled filters are not treated as exact matches.
Traceability: SCHEMA-002; SCHEMA-003; PERF-002.

### DATA-002 — Opaque predicate identity

A `QueryPredicate<Q>` SHALL be immutable for its logical lifetime and SHALL retain enough internal identity to prevent application under an incompatible Query Contract or Query Schema revision.

Public consumers SHALL NOT require access to its Semantic AST or persistence representation.

Verification: Attempt cross-contract/schema reuse and inspect public visibility.
Traceability: PRED-001; DATA-001.

## 5.2 Lifecycle

Query Schemas MAY be singleton Spring beans. Request-derived `QueryPredicate<Q>` and `FilteredQuery<Q>` values SHALL NOT be reused under incompatible client input or Query Schema identity.

Verification: Execute sequential requests with distinct filters and confirm request-derived filter state is isolated.
