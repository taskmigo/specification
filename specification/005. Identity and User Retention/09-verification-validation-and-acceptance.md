# 9. Verification, Validation, and Acceptance Evidence

## 9.1 Behavioral Cases

### ID-VER-001 — Registration and normalization

Verify trimming, normalized email uniqueness, reserved System User protection, atomic Role/Group assignment, and rollback on invalid references.

### ID-VER-002 — Immediate purge

With `P0D`, verify direct TOMBSTONE, null username/names/password, cleared emails/grants/memberships/sessions, preserved UUID, and no synthetic `retainedAt`.

### ID-VER-003 — Retention path

With a positive duration, verify RETAINED and nonnull `retainedAt`, no immediate PII purge, cleared access, immutable retained state, and sensitive audit markers.

### ID-VER-004 — Expiry, concurrency and idempotence

Verify expired retained Users become TOMBSTONE after batch processing, non-expired Users remain retained, concurrent workers use `SKIP LOCKED`, each successful cleanup is atomic, and failures are isolated by User.

### ID-VER-005 — Visibility and authentication

Verify TOMBSTONE is excluded from normal User lists and lookups, RETAINED is subject to Object Authorization, and inactive/retained/tombstoned sessions cannot be reused.

### ID-VER-006 — Configuration

Verify default `P30D`, persisted GET/PATCH, canonical duration, acceptance of `PT24H`, and rejection of sub-day, negative, malformed or unknown-property inputs.

## 9.2 Implementation Test Evidence

- [User deletion lifecycle integration tests](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/test/java/io/taskmigo/web/api/v0/auth/user/UserDeletionLifecycleIntegrationTest.java).
- [Retention worker integration tests](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/test/java/io/taskmigo/UserRetentionWorkerIntegrationTest.java).
- [User API tests](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/test/java/io/taskmigo/web/api/v0/auth/user/UserApiIntegrationTest.java).
- [Configuration API tests](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/test/java/io/taskmigo/web/api/v0/configuration/ConfigurationApiIntegrationTest.java).

These test files are evidence of intended coverage, not a claim that the test suite has been executed successfully as part of this documentation update.
