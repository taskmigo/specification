# 3. External Interface Requirements

## 3.1 Public User API

### ID-API-001 — User collection

`GET /api/v0/users` SHALL return an authorized, paginated, optionally filtered/sorted collection. Visible User fields SHALL be `id`, `username`, `firstName`, `lastName`, `emails`, `displayName`, `status`, and `retainedAt`.

### ID-API-002 — Runtime registration

`POST /api/v0/users` SHALL accept required nonblank `username`, `firstName`, `lastName`, optional `emails`, `roleIds`, and `groupIds`, and return the created UUID within the standard 201 envelope. Referenced Groups/Roles SHALL be validated before the transaction commits.

### ID-API-003 — User deletion

`DELETE /api/v0/users/{userId}` SHALL apply the configured retention lifecycle subject to Request and Object Authorization, including prohibition on deleting the System User or re-deleting a RETAINED User.

### ID-API-004 — Direct Statement replacement

`PATCH /api/v0/users/{userId}/statements` SHALL replace the User's direct `statementIds` set, subject to authorization and immutable retained-user rules. This endpoint does not update group or role assignments.

## 3.2 Group API

### ID-API-005 — Group creation and listing

`POST /api/v0/groups` SHALL accept `code`, `displayName`, optional `description`, `groupIds` of children, and `roleIds`. `GET /api/v0/groups` SHALL provide an authorized offset page whose entries contain nested `children`.

## 3.3 Configuration API

### ID-API-006 — Retention configuration

`GET /api/v0/configuration` SHALL return `retention.user` as canonical ISO-8601 days. `PATCH /api/v0/configuration` SHALL accept a nested `retention.user` string, reject unknown configuration keys and invalid precision, and return the effective configuration. A patch without the field SHALL leave it unchanged.

## 3.4 Internal Integration

### ID-API-007 — Identity use cases

Worker SHALL invoke `UserRetentionService.purgeExpiredUsers(Instant)`. Runtime consumers SHALL use published User, Group, Membership, and Configuration application services rather than direct Identity JPA classes.

## 3.5 Transport and Errors

User API input validation, domain failures and authorization failures SHALL follow [API v0 response contracts](../007.%20Audit%20and%20API%20Contracts/README.md). Lists SHALL obey [Query Filtering](../004.%20Query%20Filtering/README.md).

## 3.6 Runtime Credential and Assignment Contract

### ID-API-008 — Credential-free runtime registration

The public `POST /api/v0/users` request SHALL NOT accept an initial password/credential field as part of its defined request contract. The newly registered User SHALL not receive an interactive password hash from registration; ACTIVE status alone does not make the account immediately password-login-capable.

### ID-API-009 — Explicit initial grants

Only `roleIds` and `groupIds` supplied in the runtime registration request SHALL determine the User's initial direct Role and Group membership sets. When omitted or null, each set SHALL be empty; this endpoint SHALL NOT implicitly enroll the new User in the managed `global` Group.

Verification: Compare registration with omitted, empty and explicitly populated assignment lists.
