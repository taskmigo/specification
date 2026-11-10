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

HTTP operation paths and methods SHALL match the checked-in generated [OpenAPI v0 snapshot](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/resources/static/api/docs/openapi.yaml).

## 3.4 HTTP Contract Details and Error Matrix

### 3.4.1 Audit list request and response

`GET /api/v0/audit/{entityType}/logs` SHALL accept a string `entityType` path parameter. The implemented entity-type allowlist SHALL contain exactly `user`. It SHALL accept optional `page` (one-based, default 1, minimum 1) and `pageSize` (default 20, 1–100). It SHALL NOT imply `filterBy` or `sortBy` support. Successful responses SHALL use HTTP 200, an array of Audit log projections, and [offset pagination metadata](#api-if-004--offset-pagination).

| Field | Type | Presence and meaning |
| --- | --- | --- |
| `id` | UUID | Audit event identity |
| `entityType` | String | `user` for this route |
| `entityId` | UUID | Audited User identity |
| `actor.id` | UUID | Actor identity retained for audit linkage |
| `actor.username` | String | Anonymized when applicable to lifecycle scrub |
| `occurredAt` | ISO-8601 instant | Event occurrence time |
| `changes[].field` | String | Affected logical field |
| `changes[].before`, `changes[].after` | Nullable JSON value | Null for sensitive field changes |
| `changes[].sensitive` | Boolean | Whether the field's prior/new values are redacted |

Request Authorization SHALL apply. The corresponding User list Object Authorization predicate SHALL be unrestricted (`true`) for Audit list access; otherwise the request SHALL be forbidden rather than returning a partial audit log. Returned events SHALL use [AUD-FR-006 ordering](04-functional-and-behavioral-requirements.md#aud-fr-006--audit-read-order). A user-scope absence SHALL not be interpreted as an independent public audit-listing permission.

### 3.4.2 Envelope types

| Field | Successful response | Failed response |
| --- | --- | --- |
| `success` | `true` | `false` |
| `statusCode` | Actual HTTP status integer | Actual HTTP status integer |
| `message.code`, `message.text` | Operation-specific outcome code/text | Failure-class code/text |
| `data` | Endpoint-specific JSON object/array or null for no-body operations | `null` |
| `error` | `null` | `{code, message, formErrors?}` |
| `meta.execution.startedAt` | ISO-8601 instant | ISO-8601 instant when request is handled in v0 response context |
| `meta.execution.duration` | Nonnegative integer milliseconds | Nonnegative integer milliseconds when available |
| `meta.pagination.type` | `offset` for paginated operations only | Not a generic failure guarantee |
| `meta.pagination.offset` | `{currentPage, pageSize, totalItems, totalPages}` for paginated operations | Not a generic failure guarantee |

The `error.formErrors` map is optional and SHALL contain field-name-to-message entries for field validation failures. The server SHALL not leak stack traces through the public error envelope. The existence of an internal `CursorMeta` type SHALL NOT be interpreted as a public cursor pagination API.

### 3.4.3 Common HTTP and application-error mapping

| Condition | HTTP status | `message.code` | `error.code` |
| --- | --- | --- | --- |
| Body validation failure | 422 | `validation.failed` | `VALIDATION_ERROR` |
| Malformed or unreadable JSON | 400 | `request.malformed` | `MALFORMED_REQUEST` |
| Invalid `filterBy` | 400 | `query.filter.invalid` | `INVALID_FILTER` |
| Invalid `sortBy` | 400 | `query.sort.invalid` | `INVALID_SORT` |
| Forbidden request | 403 | `security.forbidden` | `FORBIDDEN` |
| Missing resource from typed/recognized exception | 404 | `resource.not-found` | `NOT_FOUND` |
| Recognized invalid Ticket/EAV request | 400 | `request.invalid` | `INVALID_REQUEST` |
| Recognized Ticket/Template lifecycle conflict | 409 | `resource.state.conflict` | `STATE_CONFLICT` |
| Unexpected unhandled server error | 500 | `internal.error` | `INTERNAL_ERROR` |

Domain typed errors use the separately specified mapping in [API-FR-003](04-functional-and-behavioral-requirements.md#api-fr-003--domain-failures). Missing/invalid authentication has the 401 security boundary and SHALL be checked against its configured versioned security renderer; no single 401 `error.code` is asserted without verifying that renderer. **Status, message code and error code are distinct fields**, and clients SHALL not infer them from human-readable message text.

### 3.4.4 OpenAPI parity boundary

The generated [OpenAPI v0 snapshot](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/resources/static/api/docs/openapi.yaml) is implementation evidence. Its operation inventory, parameter defaults, response schemas, error responses, and `x-filter-by`/`x-sort-by` extensions SHALL be checked against each **owning module's** contract and this shared envelope. The generated file SHALL NOT silently override business behavior in an approved module SRS. No single handwritten aggregate OpenAPI file is required by this contract.
