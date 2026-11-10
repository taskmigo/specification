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

## 3.6 Module-Owned HTTP Contract Catalogue

The contracts below are the public API surface at the [reviewed backend revision](https://github.com/taskmigo/taskmigo/tree/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/api/v0). They use the [shared response envelope](../007.%20Audit%20and%20API%20Contracts/03-external-interface-requirements.md#32-api-response-envelope). List query syntax and pagination follow [Query Filtering](../004.%20Query%20Filtering/03-external-interface-requirements.md).

| Requirement | Method and route | Input | Successful result |
| --- | --- | --- | --- |
| ID-API-001 | `GET /api/v0/users` | `page`, `pageSize`, `filterBy`, repeated `sortBy` | HTTP 200, User array plus offset metadata |
| ID-API-002 | `POST /api/v0/users` | Create User JSON | HTTP 201, `data.id` UUID and `Location: /api/v0/users/{id}` |
| ID-API-003 | `DELETE /api/v0/users/{userId}` | UUID path identifier | HTTP 200 with `data=null` |
| ID-API-004 | `PATCH /api/v0/users/{userId}/statements` | UUID path identifier, replacement JSON | HTTP 200 with `data=null` |
| ID-API-005 | `GET /api/v0/groups` | `page`, `pageSize`, `filterBy`, repeated `sortBy` | HTTP 200, Group array plus offset metadata |
| ID-API-005 | `POST /api/v0/groups` | Create Group JSON | HTTP 201, `data.id` UUID and `Location: /api/v0/groups/{id}` |
| ID-API-006 | `GET /api/v0/configuration` | No request body | HTTP 200, configuration object |
| ID-API-006 | `PATCH /api/v0/configuration` | Configuration patch JSON | HTTP 200, effective configuration object |

Each protected operation SHALL pass Request Authorization. User list, User delete, and User direct-Statement replacement SHALL use their operation-specific Object Authorization contexts; Group list SHALL use its own Object Authorization context. No User GET-by-ID, User general PATCH, Group GET-by-ID, Group PATCH/DELETE, or generic public User status-transition endpoint is included in this source-backed v0 surface.

### 3.6.1 Create and list User fields

| Wire field | Create User request | List User response |
| --- | --- | --- |
| `id` | Server-assigned | UUID, required |
| `username` | Required, nonblank string | String for visible non-tombstone User |
| `firstName`, `lastName` | Each required and nonblank | Strings for visible non-tombstone User |
| `emails` | Optional set of nonblank valid email strings | Set of normalized email strings |
| `roleIds`, `groupIds` | Optional sets of nonnull UUID references, validated atomically | Not included |
| `displayName` | Derived by server; not supplied | String |
| `status` | Server-assigned initially ACTIVE | One of `ACTIVE`, `SUSPENDED`, `DISABLED`, `RETAINED` |
| `retainedAt` | Server-managed | Nullable ISO-8601 instant |

Omitted optional grant/membership sets SHALL not imply inventing grants. Normalization and the managed `system` reservation are specified in [ID-FR-001–003](04-functional-and-behavioral-requirements.md#41-identity-registration-and-grouping). The response status field is not a public status-change input.

### 3.6.2 User delete and direct Statements

`DELETE /api/v0/users/{userId}` SHALL apply the effective retention duration and the User's lifecycle/access constraints; it SHALL return no User projection. A repeated delete of RETAINED or TOMBSTONE User is **not** an idempotent success promise. The outcome and sensitive side effects are described in [User Deletion Lifecycle](04-functional-and-behavioral-requirements.md#42-user-deletion-lifecycle).

`PATCH /api/v0/users/{userId}/statements` SHALL accept `{"statementIds": ["<UUID>"]}` where elements are UUIDs. `statementIds` omitted or null SHALL mean an empty direct-Statement set; all other existing direct grants SHALL be replaced atomically. This operation SHALL NOT alter Role or Group memberships. Both target operations SHALL be subject to applicable Object Authorization and mutable User checks.

### 3.6.3 Create and list Group fields

| Wire field | Create Group request | List Group response |
| --- | --- | --- |
| `id` | Server-assigned | UUID, required |
| `code`, `displayName` | Required nonblank strings | Strings, required |
| `description` | Optional string | Optional string; omitted if null |
| `groupIds` | Optional set of nonnull child Group UUIDs | Not exposed directly |
| `roleIds` | Optional set of nonnull Role UUIDs | Not exposed |
| `children` | Not supplied | Recursive Group projections, including empty lists |

Group code uniqueness and acyclic child relationships are [functional rules](04-functional-and-behavioral-requirements.md#41-identity-registration-and-grouping). The Group list is an authorized paginated collection; a create request does not directly specify the recursive response projection.

### 3.6.4 Configuration request and response

`GET` and `PATCH /api/v0/configuration` expose a `data.retention.user` string. For PATCH, the request is an object containing optional `retention: {user: <duration>}`. Missing `retention`, missing `user`, or null `user` SHALL leave the existing configuration unchanged. Unknown top-level or nested keys SHALL be rejected. Valid durations and canonical `P<n>D` response formatting follow [ID-FR-015–016](04-functional-and-behavioral-requirements.md#44-configuration). The effective default absent persistence is `P30D`.

### 3.6.5 Per-operation query field allowlists

| Query operation | Field | Allowed filter operators | Sortable |
| --- | --- | --- | --- |
| `identity.users.list` | `id` | EQ, NE | Yes |
| `identity.users.list` | `username`, `firstName`, `lastName` | EQ, NE, CONTAINS | Yes |
| `identity.users.list` | `status` | EQ, NE | Yes |
| `identity.users.list` | `retainedAt` | EQ, NE, GT, GTE, LT, LTE | Yes |
| `identity.groups.list` | `id` | EQ, NE | Yes |
| `identity.groups.list` | `code`, `displayName`, `description` | EQ, NE, CONTAINS | Yes |

`emails` and `displayName` in the User response are **not** automatically filterable/sortable fields. Lists SHALL apply Object Authorization and the implicit TOMBSTONE exclusion before pagination and total-count computation. Static generated OpenAPI metadata SHALL advertise only approved static allowlists; invalid filter/sort shall be rejected per [FILTER-002 and SORT-002](../004.%20Query%20Filtering/03-external-interface-requirements.md).

### 3.6.6 Error boundaries

Invalid body fields SHALL use the [shared validation envelope](../007.%20Audit%20and%20API%20Contracts/04-functional-and-behavioral-requirements.md#42-api-v0-error-semantics); malformed bodies, invalid query options and authorization failures SHALL not succeed silently. Domain-level conflicts (duplicate username, immutable lifecycle, invalid linked IDs) SHALL use the typed domain exception mapping, which is not interchangeable with syntactic request validation. Error response examples SHALL not guess unverified per-condition codes.
