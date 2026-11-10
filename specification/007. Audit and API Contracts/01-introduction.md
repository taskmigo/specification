# 1. Introduction

## 1.1 Purpose

This SRS establishes two related Taskmigo contracts: **transactional Entity Audit**, including privacy-safe User history, and the **shared versioned API v0 response/error/pagination format** used by resource modules. It distinguishes required product behavior from generated OpenAPI implementation evidence so an independent client can deserialize responses and assert errors correctly.

The reviewed implementation is pinned to [backend `9c1cd242`](https://github.com/taskmigo/taskmigo/tree/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server). Generated [OpenAPI v0](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/resources/static/api/docs/openapi.yaml) is a parity target, not the only specification of intended behavior.

## 1.2 Scope

The Audit capability records entity mutations, sensitive-field markers, transaction-atomic append and privacy scrubbing. It supports the implemented User audit-list route under strict authorization and offset paging. The API contract defines success/error envelope fields, status and machine error codes, execution metadata, pagination data and operation-specific generated filtering/sorting extension metadata.

Domain-specific endpoints, required/optional resource fields and allowed query paths are owned by **their respective module SRS**. This shared contract SHALL not invent resource operations by extrapolating an internal service or generated component type.

## 1.3 Vocabulary

| Term               | Meaning                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------- |
| Audit event        | Stable UUID plus entity, actor, occurrence and ordered field changes                    |
| Sensitive change   | Field marker with `sensitive=true` and null before/after values                         |
| User privacy scrub | Remove historical identifying values while retaining audit event identities and linkage |
| Response envelope  | `success`, `statusCode`, `message`, `error`, `meta` and `data`                          |
| Machine error code | Stable `error.code` distinct from `message.code` and human text                         |
| Offset pagination  | One-based `page` and `pageSize` with `totalItems` and `totalPages`                      |
| Authorization Log  | Separate persistent policy-decision history, not implemented in this baseline           |

## 1.4 Evidence and related SRS

- [Audit controller](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/api/v0/audit/AuditController.java).
- [Audit storage](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/audit/src/main/java/io/taskmigo/audit/persistence/JpaAuditLogStore.java).
- [Response envelope implementation](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/api/v0/support/response/ApiResponse.java).
- [Identity retention](../005.%20Identity%20and%20User%20Retention/README.md) for PII lifecycle; [Query Filtering](../004.%20Query%20Filtering/README.md) for filter/sort grammar.

## 1.5 Contract use

A client starts with [section 3](03-external-interface-requirements.md) for envelope, audit response field and error mappings. Implementers read [section 4](04-functional-and-behavioral-requirements.md) for privacy and transaction rules, and testers read [section 9](09-verification-validation-and-acceptance.md) for observable assertions. An example success response in the appendix is not a measured service-latency guarantee.
