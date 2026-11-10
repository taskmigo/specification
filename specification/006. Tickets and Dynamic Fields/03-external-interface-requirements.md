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

## 3.4 Ticket Type List and Authorization Surface

### TKT-API-009 — Ticket Type listing is not a Ticket query

`GET /api/v0/ticket-types` SHALL return the complete Type collection ordered by `key`, with a basic API response `meta`. This endpoint SHALL NOT be documented as accepting `page`, `pageSize`, `filterBy`, `sortBy`, or `ticketTypeId`; those options belong to supported Ticket collection operations.

### TKT-API-010 — Current Type and template access boundary

The current Ticket Type and Template controllers SHALL be protected by versioned Request Authorization. They do not resolve Object Authorization predicates for Type listing, Type reads/updates, or template operations. This describes a current API limitation, not a guarantee that all Ticket Types are intended to remain universally visible.

## HTTP/JSON Examples

See the [API v0 HTTP and JSON reference](../007.%20Audit%20and%20API%20Contracts/12-api-v0-http-examples.md) for concrete method/path, input DTO, sample request, successful response, and error envelope for the Ticket and Template APIs.
