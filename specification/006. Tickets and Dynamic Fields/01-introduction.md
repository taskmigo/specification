# 1. Introduction

## 1.1 Purpose

This specification documents the implemented Taskmigo Ticket bounded context, public Ticket/Ticket Type APIs, versioned custom-field templates, EAV persistence, and operation-scoped filtering, sorting, and Object Authorization at backend commit `9c1cd242fe4c5210fdd8dd88311e328a3784d0e1`.

## 1.2 Scope

The Ticket capability SHALL manage Ticket Types, draft/published/retired template versions, Tickets with stable common fields and historical custom-field schemas, and database-executed authorized queries. The shared EAV implementation belongs to `:modules:internal:eav` and is not itself a public Ticket-management API.

## 1.3 Terms

- **Ticket Type:** Stable typed work-item classification, `ACTIVE` or `RETIRED`.
- **Template version:** Immutable once published, with `DRAFT`, `PUBLISHED`, `RETIRED` lifecycle.
- **EAV schema instance:** Typed custom-field values pinned to one schema version.
- **Query field context:** Server-resolved metadata snapshot of compatible fields for a list/read/update operation.

## 1.4 Source References

- [Ticket controller](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/api/v0/ticket/TicketController.java).
- [Ticket Type controller](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/api/v0/ticket/TicketTypeController.java).
- [Ticket application service](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/ticket/src/main/java/io/taskmigo/ticket/application/TicketServiceImpl.java).
- [EAV schema service](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/internal/eav/src/main/java/io/taskmigo/eav/schema/application/EavSchemaServiceImpl.java).

## 1.5 Organization

Section 3 specifies APIs, Section 4 the functional contracts, Section 5 persistence, Section 6 the important query correctness/performance properties, and Section 9 acceptance tests.
