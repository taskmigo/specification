# 1. Introduction

## 1.1 Purpose

This SRS specifies the **Identity and User Retention** capability from the perspectives of API consumers, resource administrators, security reviewers and auditors. It defines user registration, Group hierarchy, direct access-grant integration, User deletion and retention, lifecycle-safe authentication, privacy scrubbing, configuration and resource visibility.

Implementation evidence is pinned to [backend `9c1cd242`](https://github.com/taskmigo/taskmigo/tree/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/identity). The approved behavior here is normative; source code, tests and generated OpenAPI provide conformance evidence and do not automatically authorize changed requirements.

## 1.2 Scope

Identity owns User profile identity, Group and membership state, User lifecycle transitions, retention configuration and resource queries. Runtime registration creates a new ACTIVE User; deletion either moves it to RETAINED for a configured positive duration or directly to TOMBSTONE when retention is zero. The retention worker later tombstones eligible retained users while preserving stable User identity and privacy-safe audit history.

Authorization owns Role/Statement grants and Request/Object authorization policies. Audit owns transaction-bound event history and privacy scrubbing. Authentication owns token issuance and session guard behavior. Identity coordinates their **published integration contracts** without taking ownership of their tables.

## 1.3 Terms and lifecycle semantics

| Term                 | Meaning                                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| User                 | Stable UUID and identity/profile state                                                                                   |
| Group                | Acyclic hierarchy plus membership relationships                                                                          |
| Reserved System User | Managed account with username `system`, prohibited from runtime registration and deletion                                |
| RETAINED             | Read-only account whose PII remains until configured expiry; interactive access revoked                                  |
| TOMBSTONE            | Terminal preserved User UUID with explicitly enumerated PII purged                                                       |
| `retainedAt`         | Timestamp set when a User enters RETAINED; absent for direct zero-day tombstone                                          |
| `retention.user`     | Database-backed nonnegative whole-day ISO-8601 duration                                                                  |
| PII scrub            | Remove identifying profile, credential, relationship and sensitive audit values without deleting unrelated business data |

## 1.4 Evidence and related requirements

- [User controller](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/api/v0/auth/user/UserController.java).
- [User aggregate](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/identity/src/main/java/io/taskmigo/identity/user/domain/User.java).
- [Retention scheduler](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/worker/src/main/java/io/taskmigo/worker/retention/UserRetentionPurgeJob.java).
- [Authorization](../002.%20Authorization/README.md), [Audit](../007.%20Audit%20and%20API%20Contracts/README.md), [Authentication](../008.%20Authentication%20and%20Provisioning/README.md).

## 1.5 Consumer checklist

[Section 3](03-external-interface-requirements.md) specifies the exact public User, Group and Configuration HTTP contracts. [Section 4](04-functional-and-behavioral-requirements.md) specifies state transitions, validation, revocation and expiry. [Section 5](05-data-and-information-requirements.md) enumerates purge-sensitive fields. [Section 9](09-verification-validation-and-acceptance.md) defines observable pass/fail cases. Do not infer a generic status-change, User profile update or restoration API.
