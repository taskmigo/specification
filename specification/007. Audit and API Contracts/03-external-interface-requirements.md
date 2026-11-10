# 3. External Interface Requirements

## 3.1 Audit HTTP API

### AUD-API-001 — Audit list

`GET /api/v0/audit/{entityType}/logs` SHALL return a paginated list for supported entity types. The current supported entity type SHALL be exactly `user`.

### AUD-API-002 — Audit access

Audit list SHALL require authenticated Request Authorization and unrestricted User Object visibility. A restricted User object predicate SHALL result in forbidden access to the Audit list.

### AUD-API-003 — Audit representation

The public Audit record SHALL include `id`, `entityType`, `entityId`, `actor {id, username}`, `occurredAt`, and `changes [{field, before, after, sensitive}]`.

## 3.2 API Response Envelope

### API-IF-001 — Standard envelope

Version 0 API responses SHALL contain `success` boolean, `statusCode` integer, `message {code,text}`, nullable `error`, `meta`, and nullable `data`.

### API-IF-002 — Error representation

Failure responses SHALL set `success=false`, `data=null`, and `error {code,message,formErrors?}`; success responses SHALL set `error=null`.

### API-IF-003 — Execution timing

Version 0 responses SHALL expose `meta.execution.startedAt` (instant) and `meta.execution.duration` (nonnegative elapsed milliseconds), captured by the request timing filter where available.

### API-IF-004 — Offset pagination

Offset-paginated responses SHALL expose `meta.pagination.type="offset"` and `offset {currentPage,pageSize,totalItems,totalPages}`. Request parameters SHALL default to `page=1`, `pageSize=20`, with `page>=1` and `1<=pageSize<=100`.

## 3.3 OpenAPI

### API-IF-005 — Query capability metadata

Generated OpenAPI SHALL describe each declared operation's `filterBy` allowlisted fields/operators as `x-filter-by` and sortable fields as `x-sort-by` when applicable. Dynamic runtime fields SHALL NOT be assumed to be enumerated by static OpenAPI generation.

### API-IF-006 — Versioned resources

Generated backend OpenAPI paths, methods, parameters, DTOs and statuses SHALL conform to the authored [normative per-module API contracts](12-api-v0-http-examples.md#2-module-api-contract-index). A discrepancy is a verification failure or an explicitly documented backend-generated defect; it SHALL NOT be resolved by blindly copying generated output into the specification.

## 3.4 Audit Collection Query Boundary

### AUD-API-004 — Fixed audit query options

`GET /api/v0/audit/{entityType}/logs` SHALL accept `page` and `pageSize` but not expose `filterBy` or `sortBy`. The server SHALL order results by `occurredAt` descending and `id` descending, as specified in [AUD-FR-006](04-functional-and-behavioral-requirements.md#aud-fr-006--audit-read-order).

## 3.5 HTTP Request and Response Examples

The [common v0 conventions](12-api-v0-http-examples.md) define response envelopes and index the normative contracts owned by Authorization, Identity, Ticket and Audit. Each module's `api-contract.md` independently defines its required interface.

## Normative HTTP API Contract

The [Audit module API contract](api-contract.md) is the authoritative description of the Audit endpoint, its parameters, response fields and allowed errors. See [Audit request/response examples](12-api-v0-examples.md) and the [shared API v0 conventions](12-api-v0-http-examples.md). The implementation-generated OpenAPI SHALL be verified against the authored specification.
