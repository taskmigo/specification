# API v0 contract — Entity Audit

**Normative interface specification.** Taskmigo backend implementations and their generated OpenAPI SHALL conform to this contract. Update this document through requirements review **before** changing endpoint behavior, and compare generated OpenAPI with `npm run openapi:check`. This document is not generated from OpenAPI.

The following operation table is authoritative for HTTP method/path, accepted query parameters, request DTO, successful status, response `data` DTO and per-route authorization. Responses use the [shared API envelope](../007.%20Audit%20and%20API%20Contracts/12-api-v0-http-examples.md), and all routes require Bearer Request Authorization unless explicitly noted. Documented errors are applicable operation errors in addition to common 500 failures; not every error is expected on every request.

## 1. Operation contracts

<!-- prettier-ignore -->
| Method | Path | Query parameters | JSON request DTO | Success HTTP | Response `data` | Message code | Authz | Errors |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `GET` | `/api/v0/audit/{entityType}/logs` | `page,pageSize` | `-` | `200` | `AuditLog[]` | `resource.audit.listed` | `request+unrestricted-user-object` | `400,401,403,422` |

### Query and path parameter definitions

| Parameter | Type | Required | Validation and semantics |
| --- | --- | --- | --- |
| `page` | integer | No | Defaults 1; minimum 1 (only on paginated routes). |
| `pageSize` | integer | No | Defaults 20; between 1 and 100 (only on paginated routes). |
| `{...Id}` | UUID | Yes | Every UUID placeholder in the route path is mandatory and must parse as a UUID. |
| `{entityType}` | string | Yes | Currently accepts only `user`. |

**Note:** A parameter absent from an operation's row SHALL NOT be exposed as an accepted option for that operation. For example, Ticket Type list has no paging or filtering parameters. Exact `filterBy` field/operator and `sortBy` lists are in [Query Filtering](../004.%20Query%20Filtering/11-appendices.md#115-static-operation-capability-matrix).

## 2. Request and response DTOs

These are **explicit JSON field contracts**. `Required=yes` means required in a request or guaranteed by the response model, except fields documented as nullable/omitted. Nested and array types refer to another field contract in this section. Generated OpenAPI must represent required request fields, allowed enum values, field types and response DTO properties consistently.

### AuditLog

| Field | JSON type | Required | Validation / meaning |
| --- | --- | --- | --- |
| `id` | `uuid` | yes | Audit record ID |
| `entityType` | `string` | yes | Currently only user supported |
| `entityId` | `uuid` | yes | Entity ID |
| `actor` | `AuditActor` | yes | Actor identity snapshot |
| `occurredAt` | `date-time` | yes | Event instant |
| `changes` | `array<AuditChange>` | yes | Field changes |

### AuditActor

| Field | JSON type | Required | Validation / meaning |
| --- | --- | --- | --- |
| `id` | `uuid` | yes | Persistent actor UUID |
| `username` | `string` | yes | Anonymized as Unknown user after tombstone |

### AuditChange

| Field | JSON type | Required | Validation / meaning |
| --- | --- | --- | --- |
| `field` | `string` | yes | Changed field name |
| `before` | `any` | no | Null on sensitive changes |
| `after` | `any` | no | Null on sensitive changes |
| `sensitive` | `boolean` | yes | Sensitive marker |

### Shared response DTOs

**`IdResponse`** is an object `{ "id": "<uuid>" }`. **`Void`** is JSON `null`. **`Type[]`** means a JSON array of `Type` inside `data`. These are wrapped in the common versioned envelope, not returned as bare JSON bodies. A successful creation SHALL use HTTP 201 with a `Location` header pointing to the created resource. `200` is expected for read, update, delete and other transitions listed above.

## 3. Authorization, validation and behavior

- Only entity type `user` is supported by the audit list operation. An authorized request must also have **unrestricted User Object visibility**; a restricted User Object predicate yields forbidden access.
- Audit lists are offset-paginated and ordered by `occurredAt DESC`, then `id DESC`. No `filterBy` or `sortBy` parameters are exposed.
- Audit change entries marked `sensitive=true` have null `before` and `after`; User tombstoning scrubs historical identifying actor/field values without deleting audit records.

## 4. Concrete HTTP examples and verification

The [module-specific request/response examples](12-api-v0-examples.md) illustrate serialized bodies and success envelopes. The module's [External Interface Requirements](03-external-interface-requirements.md) and [behavioral SRS](04-functional-and-behavioral-requirements.md) specify further lifecycle invariants. To verify backend conformance, run `npm run openapi:check` with the generated backend OpenAPI; the contract checker reads these **authored tables** rather than copying generated schemas into specification.
