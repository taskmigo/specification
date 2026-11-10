# 10. Traceability and Unresolved Issues

## 10.1 Source Traceability

| Requirement group        | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| STMT-001–007, POLICY-005 | [Statement domain](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/authorization/src/main/java/io/taskmigo/authorization/statement/domain/Statement.java) and [target matcher](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/authorization/src/main/java/io/taskmigo/authorization/statement/StatementTargetPathMatcher.java) |
| POLICY-001–004           | [AuthorizationCompilationProfile](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/authorization/src/main/java/io/taskmigo/authorization/embeddedlanguage/AuthorizationCompilationProfile.java)                                                                                                                                                                                    |
| REQ-001–003              | [RequestAuthorizationService](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/authorization/src/main/java/io/taskmigo/authorization/request/application/service/RequestAuthorizationService.java)                                                                                                                                                                                 |
| OBJ-001–005              | [ObjectAuthorizationService](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/authorization/src/main/java/io/taskmigo/authorization/object/application/service/ObjectAuthorizationService.java)                                                                                                                                                                                    |
| SNAPSHOT-001–004         | [AuthorizationSnapshot](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/authorization/src/main/java/io/taskmigo/authorization/request/application/model/AuthorizationSnapshot.java)                                                                                                                                                                                               |
| AUTH-API-001–006         | [OpenAPI v0](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/resources/static/api/docs/openapi.yaml)                                                                                                                                                                                                                                                                    |
| QUAL-002                 | [JpaEffectiveStatementResolver](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/authorization/src/main/java/io/taskmigo/authorization/request/persistence/JpaEffectiveStatementResolver.java)                                                                                                                                                                                     |

## 10.2 Withdrawn or Reinterpreted Baseline Requirements

- **LOG-API-001–003, LOG-001–005, LOG-DATA-001–002:** Withdrawn. No independent Authorization decision-log table or HTTP endpoint exists. Entity Audit is documented elsewhere.
- **Cached compiled policy artifacts:** No persistent policy-revision/cached artifact storage is imposed; current implementation compiles matching Statement derivatives for each snapshot.
- **OBJECT PROGRAM mode:** Replaced with implemented EXPRESSION mode; local bindings/conditional control flow are Request-only.

Existing identifiers for still-valid Statements, request/object decisions, snapshots and public APIs are retained with updated implementation semantics.

## 10.3 Unresolved Feature Decisions

A future Authorization decision-history facility, durable evaluation trace, cross-request compiled-policy cache or broader policy operator support would be new capabilities and require separate implementation/specification. Do not treat them as already delivered.

## 10.4 Module Contract Traceability and Baseline Discipline

The [backend source snapshot](https://github.com/taskmigo/taskmigo/tree/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server) is **observed implementation evidence**, not an automatic replacement for approved SRS requirements. The table below links existing normative IDs to interface contracts and objective acceptance obligations. The stated acceptance coverage does **not** claim those tests were run during this documentation edit.

| Requirement IDs                   | Behavior or interface                                                   | Normative SRS contract                                                                                          | Verification obligation                                                                                  |
| --------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| AUTH-API-001–002, STMT-001–007    | Statements create/list/delete, field representation and query allowlist | [HTTP contract](03-external-interface-requirements.md#36-http-operation-contract-inventory)                     | [HTTP acceptance](09-verification-validation-and-acceptance.md#93-http-contract-and-security-acceptance) |
| AUTH-API-003–005, AUTH-FR-001–002 | Role list/create, assignment replacement, User assignment dependency    | [Role contract](03-external-interface-requirements.md#362-create-role-role-response-and-assignment-replacement) | [HTTP acceptance](09-verification-validation-and-acceptance.md#93-http-contract-and-security-acceptance) |
| OBJ-001–005, REQ-001–003          | Request and Object Authorization on resource queries                    | [Authorization requirements](04-functional-and-behavioral-requirements.md#42-request-authorization)             | [AUTH-VER-005–007](09-verification-validation-and-acceptance.md#91-required-scenarios)                   |

### 10.4.1 Source-to-spec reconciliation

Response enum casing, nested Statement API target shape, nullable Role description omission, assignment replacement and operation-specific filter/sort capabilities are now explicitly described. The old Authorization decision log is still withdrawn. A code change that exposes a new Role detail/mutation endpoint requires separate approval and a new contract.

For future changes, classify a finding as **approved requirement**, **observed as-is**, **proposed to-be**, **conflict/drift**, or **unresolved** before rewriting the normative contract. Source evidence should identify the actual backend commit or generated artifact. OpenAPI generation and test presence alone are not conformance evidence; compare the owning module contract, generated schema, and executed test outcome.
