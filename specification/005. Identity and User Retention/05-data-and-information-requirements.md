# 5. Data and Information Requirements

## 5.1 User Data

### ID-DATA-001 — Persistent User identity

`users.id` SHALL remain a stable UUID in ACTIVE, RETAINED and TOMBSTONE states. User status SHALL be one of `ACTIVE`, `SUSPENDED`, `DISABLED`, `RETAINED`, and `TOMBSTONE`; no transition API for SUSPENDED/DISABLED is specified here.

### ID-DATA-002 — Lifecycle fields

`retained_at` SHALL be populated for RETAINED Users, optional for TOMBSTONE where direct deletion occurred, and absent for ordinary states. `tombstoned_at` SHALL be populated only for TOMBSTONE.

### ID-DATA-003 — Identifying data purge

`username`, `first_name`, `last_name`, and `password_hash` SHALL be null for TOMBSTONE. `user_emails` SHALL contain no identifying emails for TOMBSTONE. Profile and credentials SHALL remain present for ordinary and RETAINED Users.

## 5.2 Identity Relations

### ID-DATA-004 — Group and grant links

Group memberships SHALL belong to Identity. Role/Statement direct grants SHALL belong to Authorization subject bindings. Removal during deletion SHALL preserve referenced User UUID relationships where the owning business aggregate requires historical identity.

### ID-DATA-005 — Hierarchy closure

Group hierarchy SHALL persist immediate parent-child edges and corresponding reachability closure to support deterministic hierarchy queries.

## 5.3 Configuration

### ID-DATA-006 — User retention key

Database application configuration SHALL persist `retention.user` as a normalized ISO-8601 duration, defaulting to `P30D` when no value is stored.

## 5.4 Audit History

PII scrub applies to the User's audit actor username and User identifying field diffs. Audit entity history SHALL remain queryable under [Audit rules](../007.%20Audit%20and%20API%20Contracts/README.md).
