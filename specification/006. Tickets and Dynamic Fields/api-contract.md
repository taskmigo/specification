# API v0 contract — Ticket (Ticket, Type, Template)

**Normative interface specification.** Taskmigo backend implementations and their generated OpenAPI SHALL conform to this contract. Update this document through requirements review **before** changing endpoint behavior, and compare generated OpenAPI with `npm run openapi:check`. This document is not generated from OpenAPI.

The following operation table is authoritative for HTTP method/path, accepted query parameters, request DTO, successful status, response `data` DTO and per-route authorization. Responses use the [shared API envelope](../007.%20Audit%20and%20API%20Contracts/12-api-v0-http-examples.md), and all routes require Bearer Request Authorization unless explicitly noted. Documented errors are applicable operation errors in addition to common 500 failures; not every error is expected on every request.

## 1. Operation contracts

<!-- prettier-ignore -->
| Method | Path | Query parameters | JSON request DTO | Success HTTP | Response `data` | Message code | Authz | Errors |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `GET` | `/api/v0/tickets` | `page,pageSize,ticketTypeId,filterBy,sortBy` | `-` | `200` | `TicketInfo[]` | `resource.ticket.listed` | `request+object` | `400,401,403,422` |
| `POST` | `/api/v0/tickets` | `-` | `CreateTicketRequest` | `201` | `IdResponse` | `resource.ticket.created` | `request` | `400,401,403,415,422` |
| `GET` | `/api/v0/tickets/{ticketId}` | `-` | `-` | `200` | `TicketInfo` | `resource.ticket.read` | `request+object` | `400,401,403,404,422` |
| `PATCH` | `/api/v0/tickets/{ticketId}` | `-` | `UpdateTicketRequest` | `200` | `TicketInfo` | `resource.ticket.updated` | `request+object` | `400,401,403,404,415,422` |
| `GET` | `/api/v0/ticket-types` | `-` | `-` | `200` | `TicketTypeInfo[]` | `resource.ticket-type.listed` | `request` | `400,401,403,422` |
| `POST` | `/api/v0/ticket-types` | `-` | `CreateTicketTypeRequest` | `201` | `IdResponse` | `resource.ticket-type.created` | `request` | `400,401,403,415,422` |
| `GET` | `/api/v0/ticket-types/{ticketTypeId}` | `-` | `-` | `200` | `TicketTypeInfo` | `resource.ticket-type.read` | `request` | `400,401,403,404,422` |
| `PATCH` | `/api/v0/ticket-types/{ticketTypeId}` | `-` | `UpdateTicketTypeRequest` | `200` | `TicketTypeInfo` | `resource.ticket-type.updated` | `request` | `400,401,403,404,415,422` |
| `GET` | `/api/v0/ticket-types/{ticketTypeId}/templates` | `-` | `-` | `200` | `TicketTemplateVersion[]` | `resource.ticket-template.listed` | `request` | `400,401,403,404,422` |
| `POST` | `/api/v0/ticket-types/{ticketTypeId}/templates` | `-` | `-` | `201` | `TicketTemplateVersion` | `resource.ticket-template.created` | `request` | `400,401,403,404,422` |
| `GET` | `/api/v0/ticket-types/{ticketTypeId}/templates/{templateVersionId}` | `-` | `-` | `200` | `TicketTemplateVersion` | `resource.ticket-template.read` | `request` | `400,401,403,404,422` |
| `PATCH` | `/api/v0/ticket-types/{ticketTypeId}/templates/{templateVersionId}` | `-` | `UpdateTicketTemplateRequest` | `200` | `TicketTemplateVersion` | `resource.ticket-template.updated` | `request` | `400,401,403,404,415,422` |
| `POST` | `/api/v0/ticket-types/{ticketTypeId}/templates/{templateVersionId}/publish` | `-` | `-` | `200` | `TicketTemplateVersion` | `resource.ticket-template.published` | `request` | `400,401,403,404,422` |
| `POST` | `/api/v0/ticket-types/{ticketTypeId}/templates/{templateVersionId}/retire` | `-` | `-` | `200` | `TicketTemplateVersion` | `resource.ticket-template.retired` | `request` | `400,401,403,404,422` |

### Query and path parameter definitions

| Parameter | Type | Required | Validation and semantics |
| --- | --- | --- | --- |
| `page` | integer | No | Defaults 1; minimum 1 (only on paginated routes). |
| `pageSize` | integer | No | Defaults 20; between 1 and 100 (only on paginated routes). |
| `filterBy` | string | No | Safe expression validated against the route's Query Schema. Only on declared list operations. |
| `sortBy` | repeated string | No | Ordered field list, `-field` descending; no `+field`. Only on declared list operations. |
| `ticketTypeId` (query) | UUID | No | Optional Ticket list restriction; not a Ticket Type list filter. |
| `{...Id}` | UUID | Yes | Every UUID placeholder in the route path is mandatory and must parse as a UUID. |

**Note:** A parameter absent from an operation's row SHALL NOT be exposed as an accepted option for that operation. For example, Ticket Type list has no paging or filtering parameters. Exact `filterBy` field/operator and `sortBy` lists are in [Query Filtering](../004.%20Query%20Filtering/11-appendices.md#115-static-operation-capability-matrix).

## 2. Request and response DTOs

These are **explicit JSON field contracts**. `Required=yes` means required in a request or guaranteed by the response model, except fields documented as nullable/omitted. Nested and array types refer to another field contract in this section. Generated OpenAPI must represent required request fields, allowed enum values, field types and response DTO properties consistently.

### CreateTicketRequest

| Field | JSON type | Required | Validation / meaning |
| --- | --- | --- | --- |
| `ticketTypeId` | `uuid` | yes | ACTIVE Type with a current published template |
| `title` | `string` | yes | Nonblank |
| `status` | `string` | yes | Nonblank string; not a managed workflow enum |
| `customFields` | `object` | no | Custom key/value map, validated against current template |

### TicketInfo

| Field | JSON type | Required | Validation / meaning |
| --- | --- | --- | --- |
| `id` | `uuid` | yes | Stable Ticket ID |
| `ticketTypeId` | `uuid` | yes | Stable Type ID |
| `templateVersionId` | `uuid` | yes | Pinned historical template UUID |
| `title` | `string` | yes | Common field |
| `status` | `string` | yes | Common field, no enforced workflow |
| `createdBy` | `uuid` | yes | User ID |
| `createdAt` | `date-time` | yes | Creation instant |
| `updatedAt` | `date-time` | yes | Mutation instant |
| `customFields` | `object` | yes | Historical-version-validated typed map |

### UpdateTicketRequest

| Field | JSON type | Required | Validation / meaning |
| --- | --- | --- | --- |
| `title` | `string` | no | Optional nonblank when supplied |
| `status` | `string` | no | Optional nonblank when supplied |
| `customFields` | `object` | no | PATCH merge; null removes optional stored custom value |

### CreateTicketTypeRequest

| Field | JSON type | Required | Validation / meaning |
| --- | --- | --- | --- |
| `key` | `string` | yes | Nonblank, unique, immutable key |
| `name` | `string` | yes | Nonblank |

### TicketTypeInfo

| Field | JSON type | Required | Validation / meaning |
| --- | --- | --- | --- |
| `id` | `uuid` | yes | Stable UUID |
| `key` | `string` | yes | Immutable Type key |
| `name` | `string` | yes | Editable name |
| `status` | `enum:ACTIVE,RETIRED` | yes | Type availability |
| `createdAt` | `date-time` | yes | Creation instant |
| `updatedAt` | `date-time` | yes | Last modification instant |

### UpdateTicketTypeRequest

| Field | JSON type | Required | Validation / meaning |
| --- | --- | --- | --- |
| `name` | `string` | no | Optional name |
| `status` | `enum:ACTIVE,RETIRED` | no | Optional Type status |

### TicketTemplateVersion

| Field | JSON type | Required | Validation / meaning |
| --- | --- | --- | --- |
| `id` | `uuid` | yes | Template version UUID |
| `version` | `integer` | yes | Monotonically increasing positive version |
| `status` | `enum:DRAFT,PUBLISHED,RETIRED` | yes | Template version state |
| `fields` | `array<TicketTemplateField>` | yes | Ordered field definitions |
| `publishedAt` | `date-time` | no | Nullable; present once published |
| `retiredAt` | `date-time` | no | Nullable; present once retired |

### TicketTemplateField

| Field | JSON type | Required | Validation / meaning |
| --- | --- | --- | --- |
| `fieldId` | `uuid` | yes | Stable field identity |
| `key` | `string` | yes | Unique logical field key |
| `label` | `string` | yes | Display label |
| `dataType` | `enum:STRING,NUMBER,BOOLEAN,DATE,DATETIME,UUID,ENUM` | yes | Typed field |
| `required` | `boolean` | yes | Required when creating/updating values |
| `constraints` | `object` | yes | Type-dependent allowed constraints |

### UpdateTicketTemplateRequest

| Field | JSON type | Required | Validation / meaning |
| --- | --- | --- | --- |
| `fields` | `array<TicketTemplateFieldRequest>` | yes | Full replacement for DRAFT only |

### TicketTemplateFieldRequest

| Field | JSON type | Required | Validation / meaning |
| --- | --- | --- | --- |
| `fieldId` | `uuid` | no | Reuses existing field identity only when compatible |
| `key` | `string` | yes | Nonblank, must not collide with common fields |
| `label` | `string` | yes | Nonblank |
| `dataType` | `enum:STRING,NUMBER,BOOLEAN,DATE,DATETIME,UUID,ENUM` | yes | Field type immutable for published ID |
| `required` | `boolean` | no | Default false when omitted |
| `constraints` | `object` | no | See typed field constraints in section 5 |

### Shared response DTOs

**`IdResponse`** is an object `{ "id": "<uuid>" }`. **`Void`** is JSON `null`. **`Type[]`** means a JSON array of `Type` inside `data`. These are wrapped in the common versioned envelope, not returned as bare JSON bodies. A successful creation SHALL use HTTP 201 with a `Location` header pointing to the created resource. `200` is expected for read, update, delete and other transitions listed above.

## 3. Authorization, validation and behavior

- Ticket Type and Template operations currently use Request Authorization only. `GET /ticket-types` is an unpaginated, key-ordered list; template version lists are unpaginated. Neither exposes Ticket `filterBy`/`sortBy` or per-object Type authorization.
- Creating a Ticket requires an ACTIVE Type with a PUBLISHED current template. Ticket instances pin their template version. Template version lifecycle is DRAFT -> PUBLISHED -> RETIRED. Editing a DRAFT uses full field replacement. Existing Tickets remain on the pinned version after later publishes.
- Ticket `customFields` are an object in the HTTP body/response, but filter and authorization expressions use `object.<fieldKey>` for queryable compatible custom fields. Dynamic types/constraints are recorded in [Data Requirements](05-data-and-information-requirements.md).
- **Known OpenAPI generation defect:** Eight Ticket Type/Template operations return HTTP 200 with a typed `data` payload from their controllers, but the currently generated backend OpenAPI omits the 200 response. The contract above is normative; this difference must be reported as a deviation, not 'corrected' by removing the spec requirement.

## 4. Concrete HTTP examples and verification

The [module-specific request/response examples](12-api-v0-examples.md) illustrate serialized bodies and success envelopes. The module's [External Interface Requirements](03-external-interface-requirements.md) and [behavioral SRS](04-functional-and-behavioral-requirements.md) specify further lifecycle invariants. To verify backend conformance, run `npm run openapi:check` with the generated backend OpenAPI; the contract checker reads these **authored tables** rather than copying generated schemas into specification.
