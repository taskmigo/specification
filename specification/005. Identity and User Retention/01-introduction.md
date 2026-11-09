# 1. Introduction

## 1.1 Purpose

This specification records Taskmigo Identity and User retention behavior implemented in the [Identity bounded context](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/identity) at backend commit `9c1cd242fe4c5210fdd8dd88311e328a3784d0e1`.

## 1.2 Scope

The capability SHALL own runtime User registration, Group and membership state, User status and deletion lifecycle, retention configuration, cleanup of direct authorization grants and sessions, and identity-specific visibility rules. Authorization policy semantics belong to [Authorization](../002.%20Authorization/README.md); audit storage belongs to [Audit and API Contracts](../007.%20Audit%20and%20API%20Contracts/README.md).

## 1.3 Terms

- **RETAINED:** Non-mutable User retained for the configured period; PII remains stored until tombstoning.
- **TOMBSTONE:** Terminal persisted User record whose identity/profile/credential PII is scrubbed while its stable ID is preserved.
- **System User:** Reserved managed account with username `system`; normal registration cannot create it and deletion is forbidden.
- **Retention duration:** Nonnegative whole-day ISO-8601 `Duration` used to determine when retained Users become tombstones.
- **Managed provisioning:** Startup reconciliation, separate from public runtime User creation.

## 1.4 References

- [User aggregate](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/identity/src/main/java/io/taskmigo/identity/user/domain/User.java).
- [User API controller](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/api/v0/auth/user/UserController.java).
- [Retention worker](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/worker/src/main/java/io/taskmigo/worker/retention/UserRetentionPurgeJob.java).
- [Schema](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/database/src/main/resources/db/migration/V1__schema.sql).

## 1.5 Document Organization

Sections 3–5 define public interfaces, lifecycle invariants and data, section 9 defines verification, and section 10 links requirements to implementation.
