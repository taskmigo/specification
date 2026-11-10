# 10. Traceability and Unresolved Issues

## 10.1 Implementation Map

| Behavior              | Requirements             | Source                                                                                                                                                                                                                        |
| --------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ticket API            | TKT-API-001–004          | [TicketController](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/api/v0/ticket/TicketController.java)                                      |
| Type and template API | TKT-API-005–008          | [TicketTypeController](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/api/v0/ticket/TicketTypeController.java)                              |
| Ticket schema pinning | TKT-FR-007–011           | [TicketServiceImpl](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/ticket/src/main/java/io/taskmigo/ticket/application/TicketServiceImpl.java)                             |
| EAV typed validation  | TKT-FR-009, TKT-DATA-005 | [EavValueValidator](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/internal/eav/src/main/java/io/taskmigo/eav/schema/domain/EavValueValidator.java)                        |
| Query snapshots       | TKT-FR-012–015           | [TicketQueryFieldCatalog](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/ticket/src/main/java/io/taskmigo/ticket/application/TicketQueryFieldCatalog.java)                 |
| Persistence and query | TKT-QUAL-001–003         | [JpaTicketQueryRepositoryAdapter](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/ticket/src/main/java/io/taskmigo/ticket/persistence/JpaTicketQueryRepositoryAdapter.java) |

## 10.2 Open Questions

The implementation does not specify project association, a status workflow, assignee, comment thread, file attachment, or Ticket delete API. These are not present-tense requirements and SHALL NOT be inferred from the Ticket naming.

## 10.3 Source Snapshot

Based on backend commit `9c1cd242fe4c5210fdd8dd88311e328a3784d0e1`; subsequent implementation changes require renewed contract review.

## 10.4 Module Contract Traceability and Baseline Discipline

The [backend source snapshot](https://github.com/taskmigo/taskmigo/tree/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server) is **observed implementation evidence**, not an automatic replacement for approved SRS requirements. The table below links existing normative IDs to interface contracts and objective acceptance obligations. The stated acceptance coverage does **not** claim those tests were run during this documentation edit.

| Requirement IDs | Behavior or interface | Normative SRS contract | Verification obligation |
| --- | --- | --- | --- |
| TKT-API-001–004, TKT-FR-007–015 | Ticket create/list/read/update and runtime field semantics | [Ticket HTTP contract](03-external-interface-requirements.md#34-explicit-http-operation-inventory) | [Contract matrix](09-verification-validation-and-acceptance.md#93-public-contract-acceptance-matrix) |
| TKT-API-005–008, TKT-FR-001–006 | Ticket Type and Template lifecycle | [Type and Template contract](03-external-interface-requirements.md#342-ticket-type-and-template-schemas) | [Contract matrix](09-verification-validation-and-acceptance.md#93-public-contract-acceptance-matrix) |
| TKT-FR-012–015 | Authorized Ticket field queries and compatible dynamic schema context | [Query allowlist](03-external-interface-requirements.md#343-ticket-list-filter-and-sort-allowlists) | [TKT-VER-005–006](09-verification-validation-and-acceptance.md#91-acceptance-cases) |

### 10.4.1 Source-to-spec reconciliation

Ticket Type/template operations are nonpaginated; Ticket list uses offset paging. Ticket `id` is filterable but not sortable in the reviewed static Query Schema. New dynamic field keys cannot be promised by the generated static OpenAPI document. A public Ticket DELETE remains out of scope.

For future changes, classify a finding as **approved requirement**, **observed as-is**, **proposed to-be**, **conflict/drift**, or **unresolved** before rewriting the normative contract. Source evidence should identify the actual backend commit or generated artifact. OpenAPI generation and test presence alone are not conformance evidence; compare the owning module contract, generated schema, and executed test outcome.
