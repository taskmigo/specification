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

## 10.4 Managed Group Description Versus Runtime Behavior

The [managed `global` Group YAML](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/migration/src/main/resources/migration/groups.yaml) describes automatic assignment to all new Users. However, [runtime User registration](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/identity/src/main/java/io/taskmigo/identity/user/application/UserRegistrationApplicationService.java) assigns only the supplied `groupIds`; it does not load or auto-enroll `global`. Current implemented behavior is specified by [ID-FR-019](04-functional-and-behavioral-requirements.md#id-fr-019--no-implicit-group-or-role-assignment). Whether automatic global membership is desired remains a product decision, not an implied implemented feature.
