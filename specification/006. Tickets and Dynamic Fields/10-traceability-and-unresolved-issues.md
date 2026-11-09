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
