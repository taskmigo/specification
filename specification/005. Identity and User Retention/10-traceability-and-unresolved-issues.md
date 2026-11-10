# 10. Traceability and Unresolved Issues

## 10.1 Source Traceability

| Contract                       | Requirement IDs            | Implementation                                                                                                                                                                                                                                 |
| ------------------------------ | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| User registration and identity | ID-API-002, ID-FR-001–005  | [UserRegistrationApplicationService](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/identity/src/main/java/io/taskmigo/identity/user/application/UserRegistrationApplicationService.java)   |
| Delete and Retain              | ID-FR-006–009              | [DefaultUserDeletionLifecycleService](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/identity/src/main/java/io/taskmigo/identity/user/application/DefaultUserDeletionLifecycleService.java) |
| Tombstone and audit scrub      | ID-FR-010–011, ID-DATA-003 | [DefaultUserTombstoneService](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/identity/src/main/java/io/taskmigo/identity/user/application/DefaultUserTombstoneService.java)                 |
| Batch retention                | ID-FR-012–013              | [DefaultUserRetentionService](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/identity/src/main/java/io/taskmigo/identity/user/application/DefaultUserRetentionService.java)                 |
| Config                         | ID-API-006, ID-FR-015–016  | [DefaultConfigurationService](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/identity/src/main/java/io/taskmigo/identity/configuration/application/DefaultConfigurationService.java)        |
| User visibility                | ID-FR-017                  | [JpaUserQueryRepository](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/identity/src/main/java/io/taskmigo/identity/user/persistence/JpaUserQueryRepository.java)                           |

## 10.2 Deliberately Unspecified

The v0 implementation does not expose a generic User status-transition endpoint or User restoration use case; this SRS SHALL NOT invent their behavior. `ACTIVE`, `SUSPENDED`, and `DISABLED` are persisted statuses without a general public transition contract. No special operator-only listing exemption beyond the actual Authorization rules is implied.

## 10.3 Source Snapshot

This is an implementation-derived baseline, pinned to backend commit `9c1cd242fe4c5210fdd8dd88311e328a3784d0e1`. Changes to runtime behavior after that snapshot require a new review of specification parity.

## 10.4 Module Contract Traceability and Baseline Discipline

The [backend source snapshot](https://github.com/taskmigo/taskmigo/tree/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server) is **observed implementation evidence**, not an automatic replacement for approved SRS requirements. The table below links existing normative IDs to interface contracts and objective acceptance obligations. The stated acceptance coverage does **not** claim those tests were run during this documentation edit.

| Requirement IDs               | Behavior or interface                                            | Normative SRS contract                                                                                  | Verification obligation                                                                          |
| ----------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| ID-API-001–002, ID-FR-001–003 | User create/list projections and filter metadata                 | [User HTTP contract](03-external-interface-requirements.md#361-create-and-list-user-fields)             | [HTTP scenarios](09-verification-validation-and-acceptance.md#93-public-http-contract-scenarios) |
| ID-API-003–004, ID-FR-006–014 | User deletion, retention/tombstone, direct Statement replacement | [Mutation contract](03-external-interface-requirements.md#362-user-delete-and-direct-statements)        | [Lifecycle verification](09-verification-validation-and-acceptance.md#91-behavioral-cases)       |
| ID-API-005–006, ID-FR-015–017 | Group projection, configuration, visibility                      | [Group/configuration contracts](03-external-interface-requirements.md#363-create-and-list-group-fields) | [HTTP scenarios](09-verification-validation-and-acceptance.md#93-public-http-contract-scenarios) |

### 10.4.1 Source-to-spec reconciliation

User and Group list fields are not equivalent to query allowlists. Direct-Statement PATCH null/omission semantics and configuration PATCH absence semantics have been made explicit. No generic User read/update or Group mutation operation has been fabricated. Retained User visibility remains policy-driven rather than a hardcoded System User exception.

For future changes, classify a finding as **approved requirement**, **observed as-is**, **proposed to-be**, **conflict/drift**, or **unresolved** before rewriting the normative contract. Source evidence should identify the actual backend commit or generated artifact. OpenAPI generation and test presence alone are not conformance evidence; compare the owning module contract, generated schema, and executed test outcome.
