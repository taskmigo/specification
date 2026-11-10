# 3. External Interface Requirements

## 3.1 Ticket API

### TKT-API-001 — Create Ticket

`POST /api/v0/tickets` SHALL accept `ticketTypeId`, required nonblank `title`, required nonblank `status`, and optional `customFields` object. A successful creation SHALL return HTTP 201 with created `id`.

### TKT-API-002 — List Ticket

`GET /api/v0/tickets` SHALL accept optional `ticketTypeId`, `filterBy`, repeated `sortBy`, `page`, and `pageSize`, and return an authorized offset page.

### TKT-API-003 — Read and update Ticket

`GET /api/v0/tickets/{ticketId}` SHALL return authorized Ticket details. `PATCH /api/v0/tickets/{ticketId}` SHALL accept optional `title`, `status`, and `customFields`; both operations SHALL be constrained by an Object Authorization predicate for that Ticket's operation.

### TKT-API-004 — Ticket response projection

Ticket responses SHALL expose `id`, `ticketTypeId`, `templateVersionId`, `title`, `status`, `createdBy`, `createdAt`, `updatedAt`, and `customFields`.

## 3.2 Ticket Type API

### TKT-API-005 — Type CRUD subset

`POST /api/v0/ticket-types` SHALL create a Type from nonblank `key` and `name`. `GET /api/v0/ticket-types` SHALL list Types. `GET /api/v0/ticket-types/{ticketTypeId}` SHALL read one. `PATCH /api/v0/ticket-types/{ticketTypeId}` SHALL permit updates to `name` and `status` only.

### TKT-API-006 — Template lifecycle routes

For one Type, `POST/GET /api/v0/ticket-types/{ticketTypeId}/templates` SHALL create a draft/list versions. `GET/PATCH /api/v0/ticket-types/{ticketTypeId}/templates/{templateVersionId}` SHALL read/replace draft fields. `POST` on the version's `/publish` or `/retire` route SHALL invoke the named lifecycle transition.

### TKT-API-007 — Template fields

A template field request SHALL have optional `fieldId`, required `key`, `label`, `dataType`, `required` boolean, and optional `constraints`. Responses SHALL include resolved `fieldId`, `key`, `label`, `dataType`, `required`, and `constraints`.

### TKT-API-008 — Type and template responses

Ticket Type SHALL expose `id`, `key`, `name`, `status`, `createdAt`, `updatedAt`. Template SHALL expose `id`, numeric `version`, `status`, `fields`, and optional `publishedAt`/`retiredAt`.

## 3.3 Shared API Contract

All v0 operations SHALL use the [API response envelope](../007.%20Audit%20and%20API%20Contracts/README.md). Filter and sort syntax SHALL follow [Query Filtering](../004.%20Query%20Filtering/README.md).

## 3.4 Explicit HTTP Operation Inventory

All operations below use the [API v0 envelope](../007.%20Audit%20and%20API%20Contracts/03-external-interface-requirements.md#32-api-response-envelope). Their operation boundaries are evidenced by the [Ticket controller](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/api/v0/ticket/TicketController.java) and [Ticket Type controller](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/api/v0/ticket/TicketTypeController.java).

| Requirement | Method and path                                                                  | Request input                                                     | Success data                                      |
| ----------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------- |
| TKT-API-001 | `POST /api/v0/tickets`                                                           | Create Ticket JSON                                                | HTTP 201, `{id: UUID}`, Location header           |
| TKT-API-002 | `GET /api/v0/tickets`                                                            | `page`, `pageSize`, `ticketTypeId`, `filterBy`, repeated `sortBy` | HTTP 200, Ticket array plus offset metadata       |
| TKT-API-003 | `GET /api/v0/tickets/{ticketId}`                                                 | UUID path                                                         | HTTP 200, Ticket projection                       |
| TKT-API-003 | `PATCH /api/v0/tickets/{ticketId}`                                               | UUID path, partial Ticket JSON                                    | HTTP 200, updated Ticket projection               |
| TKT-API-005 | `POST /api/v0/ticket-types`                                                      | Create Type JSON                                                  | HTTP 201, `{id: UUID}`, Location header           |
| TKT-API-005 | `GET /api/v0/ticket-types`                                                       | None                                                              | HTTP 200, nonpaginated Type array                 |
| TKT-API-005 | `GET /api/v0/ticket-types/{ticketTypeId}`                                        | UUID path                                                         | HTTP 200, Type projection                         |
| TKT-API-005 | `PATCH /api/v0/ticket-types/{ticketTypeId}`                                      | UUID path, partial Type JSON                                      | HTTP 200, updated Type projection                 |
| TKT-API-006 | `POST /api/v0/ticket-types/{ticketTypeId}/templates`                             | UUID Type path, no request body                                   | HTTP 201, Template projection and Location header |
| TKT-API-006 | `GET /api/v0/ticket-types/{ticketTypeId}/templates`                              | UUID Type path                                                    | HTTP 200, nonpaginated Template array             |
| TKT-API-006 | `GET /api/v0/ticket-types/{ticketTypeId}/templates/{templateVersionId}`          | Two UUID path identifiers                                         | HTTP 200, Template projection                     |
| TKT-API-006 | `PATCH /api/v0/ticket-types/{ticketTypeId}/templates/{templateVersionId}`        | Two UUID path identifiers and `fields` array                      | HTTP 200, updated Template projection             |
| TKT-API-006 | `POST /api/v0/ticket-types/{ticketTypeId}/templates/{templateVersionId}/publish` | Two UUID path identifiers                                         | HTTP 200, published Template projection           |
| TKT-API-006 | `POST /api/v0/ticket-types/{ticketTypeId}/templates/{templateVersionId}/retire`  | Two UUID path identifiers                                         | HTTP 200, retired Template projection             |

No generic Ticket DELETE, Type DELETE, or template version DELETE SHALL be inferred. Request Authorization applies to all public routes. Ticket list/read/update additionally use their operation-specific Object Authorization and [pinned schema context](04-functional-and-behavioral-requirements.md#43-query-and-authorization).

### 3.4.1 Ticket request and response fields

| Field                    | Create request                        | PATCH request                               | Ticket response              |
| ------------------------ | ------------------------------------- | ------------------------------------------- | ---------------------------- |
| `id`                     | Server-assigned                       | Not mutable                                 | UUID                         |
| `ticketTypeId`           | Required UUID                         | Not mutable                                 | UUID                         |
| `templateVersionId`      | Server-pinned                         | Not mutable                                 | UUID                         |
| `title`                  | Required nonblank string              | Optional string                             | String                       |
| `status`                 | Required nonblank string              | Optional string                             | String                       |
| `customFields`           | Optional object of key to typed value | Optional object, only supplied keys changed | Object of key to typed value |
| `createdBy`              | Derived from authenticated User token | Not mutable                                 | UUID                         |
| `createdAt`, `updatedAt` | Server-assigned                       | Server-managed                              | ISO-8601 instants            |

On create, null custom-field entries SHALL be ignored before validation; unknown field keys and missing required fields SHALL fail under the pinned published template. On PATCH, a null value for an optional custom field SHALL clear it, while omitted keys SHALL retain their values. The exact validation semantics are [TKT-FR-008–010](04-functional-and-behavioral-requirements.md#42-ticket-creationupdate). The `customFields` schema is runtime-dependent: static OpenAPI cannot enumerate the effective template's keys.

### 3.4.2 Ticket Type and Template schemas

| Model                   | Fields and rules                                                                                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Create Type request     | Required nonblank `key` and `name`. Type identity and initial ACTIVE status are server-managed.                                                               |
| PATCH Type request      | Optional `name: string` and `status` with enum values `ACTIVE` or `RETIRED`. Omitted property retains its current value.                                      |
| Type response           | `id: UUID`, `key: string`, `name: string`, `status` with values `ACTIVE` or `RETIRED`, and `createdAt` and `updatedAt` instants.                              |
| PATCH Template request  | Required `fields` array; **replaces** the complete DRAFT field set. Each field entry SHALL be nonnull and valid.                                              |
| Template field request  | Optional `fieldId: UUID`, required nonblank `key` and `label`, required `dataType`, boolean `required`, optional `constraints` object.                        |
| Template field response | `fieldId: UUID`, `key`, `label`, `dataType`, `required`, `constraints`.                                                                                       |
| Template response       | `id: UUID`, `version: integer`, `status` with values `DRAFT`, `PUBLISHED` or `RETIRED`, `fields: array`, and nullable `publishedAt` and `retiredAt` instants. |

Supported custom field `dataType` values SHALL be `STRING`, `NUMBER`, `BOOLEAN`, `DATE`, `DATETIME`, `UUID`, and `ENUM`. Template version transitions and backwards compatibility follow [TKT-FR-003–006](04-functional-and-behavioral-requirements.md#41-ticket-type-lifecycle).

### 3.4.3 Ticket list filter and sort allowlists

The query uses the shared [filter and sort grammar](../004.%20Query%20Filtering/03-external-interface-requirements.md); the `ticketTypeId` optional query parameter is a dedicated scope restriction, not an alias for `filterBy`.

| Static logical field              | Filter operators         | Sortable on Ticket list |
| --------------------------------- | ------------------------ | ----------------------- |
| `id`, `ticketTypeId`, `createdBy` | EQ, NE                   | No                      |
| `title`, `status`                 | EQ, NE, CONTAINS         | Yes                     |
| `createdAt`, `updatedAt`          | EQ, NE, GT, GTE, LT, LTE | Yes                     |

Dynamic `customFields` field availability and operator/sort support SHALL follow [TKT-FR-013–015](04-functional-and-behavioral-requirements.md#43-query-and-authorization) with the resolved query context. Global and Type-scoped queries may have different dynamic fields. Generated OpenAPI `x-filter-by` and `x-sort-by` SHALL describe static capabilities; consumers SHALL NOT assume every dynamic field is statically enumerated.

### 3.4.4 Error and side-effect contract

Missing or invalid body fields SHALL follow the shared HTTP 422 validation contract; malformed JSON SHALL produce HTTP 400. Query syntax/allowlist failures SHALL use `INVALID_FILTER` or `INVALID_SORT`. Domain validation of EAV field values or keys can return HTTP 400 `INVALID_REQUEST`; invalid type/template lifecycle transitions can return HTTP 409 `STATE_CONFLICT`; unknown Type/Template and unknown-or-unauthorized Ticket targets can return HTTP 404 `NOT_FOUND` under the [API error mapping](../007.%20Audit%20and%20API%20Contracts/04-functional-and-behavioral-requirements.md#42-api-v0-error-semantics). Do not collapse distinct errors into an invented universal error. Ticket creation/patch SHALL preserve immutable Type, creator and historical template association.
