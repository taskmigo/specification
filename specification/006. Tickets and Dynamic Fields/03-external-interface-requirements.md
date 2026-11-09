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
