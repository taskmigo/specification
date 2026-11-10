# API v0 contract — Identity (User, Group, Configuration)

**Normative interface specification.** Taskmigo backend implementations and their generated OpenAPI SHALL conform to this contract. Update this document through requirements review **before** changing endpoint behavior, and compare generated OpenAPI with `npm run openapi:check`. This document is not generated from OpenAPI.

The following operation table is authoritative for HTTP method/path, accepted query parameters, request DTO, successful status, response `data` DTO and per-route authorization. Responses use the [shared API envelope](../007.%20Audit%20and%20API%20Contracts/12-api-v0-http-examples.md), and all routes require Bearer Request Authorization unless explicitly noted. Documented errors are applicable operation errors in addition to common 500 failures; not every error is expected on every request.

## 1. Operation contracts

<!-- prettier-ignore -->
| Method | Path | Query parameters | JSON request DTO | Success HTTP | Response `data` | Message code | Authz | Errors |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `GET` | `/api/v0/users` | `page,pageSize,filterBy,sortBy` | `-` | `200` | `UserInfo[]` | `resource.user.listed` | `request+object` | `400,401,403,422` |
| `POST` | `/api/v0/users` | `-` | `CreateUserRequest` | `201` | `IdResponse` | `resource.user.created` | `request` | `400,401,403,409,415,422` |
| `DELETE` | `/api/v0/users/{userId}` | `-` | `-` | `200` | `Void` | `resource.user.deleted` | `request+object` | `400,401,403,404,422` |
| `PATCH` | `/api/v0/users/{userId}/statements` | `-` | `ReplaceUserStatementsRequest` | `200` | `Void` | `resource.user.statements.updated` | `request+object` | `400,401,403,404,415,422` |
| `GET` | `/api/v0/groups` | `page,pageSize,filterBy,sortBy` | `-` | `200` | `GroupInfo[]` | `resource.group.listed` | `request+object` | `400,401,403,422` |
| `POST` | `/api/v0/groups` | `-` | `CreateGroupRequest` | `201` | `IdResponse` | `resource.group.created` | `request` | `400,401,403,409,415,422` |
| `GET` | `/api/v0/configuration` | `-` | `-` | `200` | `ApplicationConfiguration` | `resource.configuration.read` | `request` | `400,401,403,422` |
| `PATCH` | `/api/v0/configuration` | `-` | `PatchApplicationConfiguration` | `200` | `ApplicationConfiguration` | `resource.configuration.updated` | `request` | `400,401,403,415,422` |

### Query and path parameter definitions

| Parameter | Type | Required | Validation and semantics |
| --- | --- | --- | --- |
| `page` | integer | No | Defaults 1; minimum 1 (only on paginated routes). |
| `pageSize` | integer | No | Defaults 20; between 1 and 100 (only on paginated routes). |
| `filterBy` | string | No | Safe expression validated against the route's Query Schema. Only on declared list operations. |
| `sortBy` | repeated string | No | Ordered field list, `-field` descending; no `+field`. Only on declared list operations. |
| `{...Id}` | UUID | Yes | Every UUID placeholder in the route path is mandatory and must parse as a UUID. |

**Note:** A parameter absent from an operation's row SHALL NOT be exposed as an accepted option for that operation. For example, Ticket Type list has no paging or filtering parameters. Exact `filterBy` field/operator and `sortBy` lists are in [Query Filtering](../004.%20Query%20Filtering/11-appendices.md#115-static-operation-capability-matrix).

## 2. Request and response DTOs

These are **explicit JSON field contracts**. `Required=yes` means required in a request or guaranteed by the response model, except fields documented as nullable/omitted. Nested and array types refer to another field contract in this section. Generated OpenAPI must represent required request fields, allowed enum values, field types and response DTO properties consistently.

### CreateUserRequest

| Field | JSON type | Required | Validation / meaning |
| --- | --- | --- | --- |
| `username` | `string` | yes | Trimmed, nonblank, unique; system reserved |
| `firstName` | `string` | yes | Trimmed, nonblank |
| `lastName` | `string` | yes | Trimmed, nonblank |
| `emails` | `array<string>` | no | Unique valid email addresses; normalize lowercase |
| `roleIds` | `array<uuid>` | no | Unique initial Role IDs; omitted means none |
| `groupIds` | `array<uuid>` | no | Unique initial Group IDs; omitted means none |

### UserInfo

| Field | JSON type | Required | Validation / meaning |
| --- | --- | --- | --- |
| `id` | `uuid` | yes | Stable User ID |
| `username` | `string` | yes | Username |
| `firstName` | `string` | yes | Name |
| `lastName` | `string` | yes | Name |
| `emails` | `array<string>` | yes | Normalized unique emails |
| `displayName` | `string` | yes | Derived full name |
| `status` | `enum:ACTIVE,SUSPENDED,DISABLED,RETAINED` | yes | TOMBSTONE excluded from public User lists |
| `retainedAt` | `date-time` | no | Nullable timestamp on retained lifecycle |

### ReplaceUserStatementsRequest

| Field | JSON type | Required | Validation / meaning |
| --- | --- | --- | --- |
| `statementIds` | `array<uuid>` | no | Full replacement; omitted or null means empty |

### CreateGroupRequest

| Field | JSON type | Required | Validation / meaning |
| --- | --- | --- | --- |
| `code` | `string` | yes | Nonblank unique Group code |
| `displayName` | `string` | yes | Nonblank |
| `description` | `string` | no | Optional |
| `groupIds` | `array<uuid>` | no | Unique child Group IDs; acyclic |
| `roleIds` | `array<uuid>` | no | Unique Role IDs |

### GroupInfo

| Field | JSON type | Required | Validation / meaning |
| --- | --- | --- | --- |
| `id` | `uuid` | yes | Stable Group ID |
| `code` | `string` | yes | Group code |
| `displayName` | `string` | yes | Name |
| `description` | `string` | no | Optional |
| `children` | `array<GroupInfo>` | yes | Recursive list; empty list allowed |

### PatchApplicationConfiguration

| Field | JSON type | Required | Validation / meaning |
| --- | --- | --- | --- |
| `retention` | `PatchRetentionConfiguration` | no | Optional; unknown properties rejected |

### PatchRetentionConfiguration

| Field | JSON type | Required | Validation / meaning |
| --- | --- | --- | --- |
| `user` | `string` | no | ISO-8601 nonnegative whole-day duration; P0D immediate |

### ApplicationConfiguration

| Field | JSON type | Required | Validation / meaning |
| --- | --- | --- | --- |
| `retention` | `RetentionConfiguration` | yes | Effective application retention configuration |

### RetentionConfiguration

| Field | JSON type | Required | Validation / meaning |
| --- | --- | --- | --- |
| `user` | `string` | yes | Canonical P<n>D value; default P30D |

### Shared response DTOs

**`IdResponse`** is an object `{ "id": "<uuid>" }`. **`Void`** is JSON `null`. **`Type[]`** means a JSON array of `Type` inside `data`. These are wrapped in the common versioned envelope, not returned as bare JSON bodies. A successful creation SHALL use HTTP 201 with a `Location` header pointing to the created resource. `200` is expected for read, update, delete and other transitions listed above.

## 3. Authorization, validation and behavior

- User registration does not accept or generate password credentials, does not enroll in the `global` Group by default, and uses only explicit Role/Group IDs. Registration status is ACTIVE without interactive login until credentials are separately provisioned.
- `DELETE` applies configured retention: `P0D` produces an immediate TOMBSTONE, positive retention produces RETAINED until worker cleanup. System User and already-retained User deletion are denied; deletion does not physically remove the User record. Audit scrubbing and session/grant revocation follow [Identity lifecycle requirements](04-functional-and-behavioral-requirements.md).
- List User excludes TOMBSTONE and applies Object Authorization. Group list also uses Object Authorization. Configuration is database-backed; unknown configuration properties and sub-day retention values are rejected.
- All create operations return `Location` and `data: {"id": "<uuid>"}`. User delete and direct Statement replacement return `data: null`.

## 4. Concrete HTTP examples and verification

The [module-specific request/response examples](12-api-v0-examples.md) illustrate serialized bodies and success envelopes. The module's [External Interface Requirements](03-external-interface-requirements.md) and [behavioral SRS](04-functional-and-behavioral-requirements.md) specify further lifecycle invariants. To verify backend conformance, run `npm run openapi:check` with the generated backend OpenAPI; the contract checker reads these **authored tables** rather than copying generated schemas into specification.
