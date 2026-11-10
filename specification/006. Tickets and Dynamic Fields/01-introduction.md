# 1. Introduction

## 1.1 Purpose

This SRS defines the **Ticket and Ticket Type** capability, including public HTTP operations, Type lifecycle, editable/published/retired template versions, typed custom-field validation, historically pinned Ticket instances, and authorized list/read/update queries. It is written so an independent frontend or automated tester can use the API contract without inspecting backend controllers.

The reviewed implementation baseline is [backend commit `9c1cd242`](https://github.com/taskmigo/taskmigo/tree/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/ticket). Normative expectations, source evidence, and unresolved feature gaps are separated in [section 10](10-traceability-and-unresolved-issues.md).

## 1.2 Scope

Ticket owns Ticket and Ticket Type domain state, common Ticket fields, versioned templates, schema pinning and resource-specific query/persistence contracts. The reusable typed EAV implementation belongs to internal EAV and is **not a public generic EAV HTTP API**. Query owns filter/sort grammar and logical predicates; Authorization owns Request and Object policies; Web adapts those published services into versioned HTTP endpoints.

Creation requires an ACTIVE Type and an eligible PUBLISHED template. Existing Tickets remain associated with the version against which their custom-field values were validated. Template edits SHALL not rewrite historical Ticket values.

## 1.3 Domain vocabulary

| Term                  | Meaning                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| Ticket Type           | Named stable classification with immutable key and ACTIVE/RETIRED status                          |
| Template version      | DRAFT editable field set, PUBLISHED creation schema, or RETIRED historical schema                 |
| Field definition      | Stable field ID, key, label, data type, required flag and type-specific constraints               |
| EAV schema instance   | Typed value storage pinned to a particular historical schema version                              |
| Ticket common field   | Fixed API property such as title, status, creator or timestamps                                   |
| Dynamic query context | Server-owned compatible field metadata for a global, Type-specific or individual Ticket operation |
| Historical pinning    | Reading/updating an existing Ticket using the schema version it originally selected               |

## 1.4 Evidence and dependencies

- [Ticket REST controller](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/api/v0/ticket/TicketController.java).
- [Ticket Type REST controller](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/api/v0/ticket/TicketTypeController.java).
- [Ticket service implementation](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/ticket/src/main/java/io/taskmigo/ticket/application/TicketServiceImpl.java).
- [EAV service implementation](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/internal/eav/src/main/java/io/taskmigo/eav/schema/application/EavSchemaServiceImpl.java).

## 1.5 Consumer reading guide

Use [section 3](03-external-interface-requirements.md) for every available Ticket, Type and Template method/path plus field-level request/response shapes; [sections 4–5](04-functional-and-behavioral-requirements.md) for versioning and data invariants; [section 9](09-verification-validation-and-acceptance.md) for acceptance. A response field is not necessarily filterable or sortable; each operation's allowlist is specified explicitly.
