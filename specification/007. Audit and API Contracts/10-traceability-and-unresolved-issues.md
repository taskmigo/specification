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

## 10.4 Module Contract Traceability and Baseline Discipline

The [backend source snapshot](https://github.com/taskmigo/taskmigo/tree/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server) is **observed implementation evidence**, not an automatic replacement for approved SRS requirements. The table below links existing normative IDs to interface contracts and objective acceptance obligations. The stated acceptance coverage does **not** claim those tests were run during this documentation edit.

| Requirement IDs | Behavior or interface | Normative SRS contract | Verification obligation |
| --- | --- | --- | --- |
| AUD-API-001–003, AUD-FR-001–007 | Audit list, sensitive values, access and order | [Audit list contract](03-external-interface-requirements.md#341-audit-list-request-and-response) | [Wire contract acceptance](09-verification-validation-and-acceptance.md#93-wire-contract-acceptance-matrix) |
| API-IF-001–005, API-FR-001–005 | Shared response envelope, error codes and OpenAPI extension naming | [Shared error matrix](03-external-interface-requirements.md#343-common-http-and-application-error-mapping) | [Wire contract acceptance](09-verification-validation-and-acceptance.md#93-wire-contract-acceptance-matrix) |

### 10.4.1 Source-to-spec reconciliation

Shared error responses have distinct `message.code` and `error.code`; a consumer must not assume the same value in both. Audit list does not offer arbitrary filtering/sorting and currently exposes `user` entity type only. HTTP 401 error-body shape depends on the version renderer and must be tested instead of guessed.

For future changes, classify a finding as **approved requirement**, **observed as-is**, **proposed to-be**, **conflict/drift**, or **unresolved** before rewriting the normative contract. Source evidence should identify the actual backend commit or generated artifact. OpenAPI generation and test presence alone are not conformance evidence; compare the owning module contract, generated schema, and executed test outcome.
