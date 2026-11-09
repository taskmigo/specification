# 6. Quality and Performance Requirements

## 6.1 Safety

### SEC-001 — Allowlist enforcement

Unknown fields/operators, persistence-only names, and incompatible schema identity SHALL fail validation; they SHALL NOT become raw SQL/JPA paths.

### SEC-002 — No arbitrary code execution

The filter compiler SHALL use a bounded language compilation profile and symbolic expression mapping rather than executing user-provided scripts or SQL.

## 6.2 Performance

### PERF-001 — Database-side evaluation

Client filtering, Object Authorization, sorting and offset pagination SHALL be executed through the resource's database query. A full-table application-memory filter/sort SHALL NOT replace the defined API contract.

### PERF-002 — Bounded page size

Version 0 offset endpoints SHALL cap `pageSize` at 100; the compiler SHALL reject invalid query syntax before starting unrestricted execution.

## 6.3 Correctness

### QUAL-001 — Same-context compilation

A runtime query-field snapshot SHALL be used consistently for filter validation, authorization predicate binding, and sorting in one operation.

### QUAL-002 — Deterministic ordering

Requested multi-sort order and nulls-last semantics SHALL be preserved when translated to JPA, and no-sort behavior SHALL remain stable by resource identifier as implemented.
