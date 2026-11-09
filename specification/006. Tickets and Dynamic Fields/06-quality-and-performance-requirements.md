# 6. Quality and Performance Requirements

## 6.1 Query Correctness

### TKT-QUAL-001 — Database-side filtering and sorting

Ticket queries SHALL apply authorization, filter, and sorting in the database before offset pagination. The implementation SHALL NOT fetch all Tickets to apply client filters in memory.

### TKT-QUAL-002 — Unambiguous metadata

Runtime field lookup SHALL avoid exposing a custom-field path whose visible key ambiguously refers to multiple schema definitions, field UUIDs, or types in the requested history scope.

### TKT-QUAL-003 — Schema-consistent binding

Object Authorization and client query predicates SHALL be bound only with their matching runtime query-field context and operation schema identity, not a different request's field catalog.

## 6.2 Data Preservation

### TKT-QUAL-004 — Immutable historical templates

Publishing a new template SHALL NOT mutate values stored under older versions. A Ticket SHALL continue reading/updating against the schema version to which it was created.

### TKT-QUAL-005 — Validation before persistence

Data type validation SHALL reject unsupported coercion, unknown keys and invalid required/constraint values before committing Ticket mutations.

## 6.3 Performance Evidence

Typed EAV values and indexed common Ticket fields support database predicates, but this SRS makes no unverified throughput/latency guarantee.
