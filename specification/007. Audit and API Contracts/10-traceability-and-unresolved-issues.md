# 10. Traceability and Unresolved Issues

## 10.1 Contract-to-Code Traceability

| Area                       | Requirement IDs             | Source                                                                                                                                                                                                         |
| -------------------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Audit append and privacy   | AUD-FR-001–005              | [Audit services](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/audit/src/main/java/io/taskmigo/audit/application)                                          |
| Audit query                | AUD-API-001–003, AUD-FR-006 | [Audit controller](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/api/v0/audit/AuditController.java)                         |
| Audit persistence          | AUD-DATA-001–003            | [JpaAuditLogStore](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/audit/src/main/java/io/taskmigo/audit/persistence/JpaAuditLogStore.java)                  |
| Envelope                   | API-IF-001–004              | [ApiResponse](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/api/v0/support/response/ApiResponse.java)                       |
| Errors                     | API-FR-001–005              | [ApiV0ExceptionHandler](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/api/v0/support/response/ApiV0ExceptionHandler.java)   |
| Generated query extensions | API-IF-005                  | [FilterByOpenApiCustomizer](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/openapi-generator/src/main/java/io/taskmigo/openapi/FilterByOpenApiCustomizer.java) |

## 10.2 Superseded Expectations

The old Authorization SRS describes a separate persisted Authorization Log ledger and public `/api/v0/authorization/logs` route. Those are not implemented in the reviewed code and SHALL NOT be documented as current capability.

## 10.3 Known Scope Limits

Audit query currently accepts only `user`. An internal cursor metadata type exists without a corresponding public cursor-paginated controller. Additional event types and public routes require their own implementation and spec review.
