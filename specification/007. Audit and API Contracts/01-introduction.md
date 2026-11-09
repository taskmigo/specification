# 1. Introduction

## 1.1 Purpose

This specification records the actual Entity Audit service and versioned API v0 envelope, pagination, documentation and error handling provided by Taskmigo's Web and Audit modules at backend revision `9c1cd242fe4c5210fdd8dd88311e328a3784d0e1`.

## 1.2 Scope

Entity Audit SHALL provide transaction-bound append, query, and User PII scrubbing. API v0 SHALL provide consistent success/error and offset-pagination representations. Authorization decision logging is not part of this implementation.

## 1.3 Definitions

- **Audit Event:** Immutable description of a completed business mutation and its field changes.
- **Sensitive change:** Field-change marker carrying no before/after value.
- **API Envelope:** Response containing success, status, message, error, metadata and data.
- **Execution metadata:** Server start instant and elapsed processing duration.
- **Authorization Log:** Separate policy-decision history proposed in previous documentation but not implemented by current backend.

## 1.4 Sources

- [Audit query API](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/api/v0/audit/AuditController.java).
- [Audit store](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/audit/src/main/java/io/taskmigo/audit/persistence/JpaAuditLogStore.java).
- [API envelope](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/api/v0/support/response/ApiResponse.java).
- [Generated OpenAPI](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/resources/static/api/docs/openapi.yaml).

## 1.5 Document Map

Sections 3–5 define public API contracts and Audit behavior. Section 10 records deliberately absent API and authorization-log capabilities.
