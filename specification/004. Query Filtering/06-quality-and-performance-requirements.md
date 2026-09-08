# 6. Quality and Performance Requirements

## 6.1 Determinism and Safety

### QUAL-001 — Deterministic logical semantics

For identical Query Schema, Embedded Language version/profile, source, and known inputs, filter compilation and logical predicate composition SHALL produce equivalent semantics.

Verification: Repeat compilation/composition and compare results modulo non-semantic metadata.
Traceability: FILTER-002; PRED-002.

### SEC-001 — Persistence namespace isolation

Database tables, columns, JPA attributes, joins, and persistence expressions SHALL NOT become queryable merely because they exist. Only explicitly registered API-visible Query Paths SHALL be addressable.

Verification: Probe persistence-only names and confirm they remain unknown query fields.
Traceability: SCHEMA-004; PERSIST-002.

### SEC-002 — Public diagnostic vocabulary

Client diagnostics SHALL identify API-visible Query Paths and logical operators. They SHALL NOT disclose persistence columns, entity implementation names, join topology, or raw persistence exceptions.

Verification: Trigger mapping failures and inspect `ProblemDetail` output.
Traceability: FILTER-003; SEC-001.

## 6.2 Performance

### PERF-001 — Database-side filtering

Authorization and client filtering SHALL be applied before pagination and SHALL avoid unrestricted JVM row filtering.

Verification: Inspect query counts, SQL/persistence predicates, and page totals.
Traceability: QRY-005.

### PERF-002 — Compiled filter reuse

A compiled `filterBy` artifact MAY be reused only when source content, Embedded Language version/profile, Environment Schema identity, and Query Schema identity are compatible.

Verification: Change each identity input and confirm stale compiled filters are not reused.
Traceability: DATA-001; [Embedded Language compiled artifact metadata](../003.%20Embedded%20Language/05-data-and-information-requirements.md#data-003--compiled-artifact-metadata).
