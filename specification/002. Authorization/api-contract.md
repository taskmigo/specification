# API v0 contract — Authorization (Role, Statement)

**Normative interface specification.** Taskmigo backend implementations and their generated OpenAPI SHALL conform to this contract. Update this document through requirements review **before** changing endpoint behavior, and compare generated OpenAPI with `npm run openapi:check`. This document is not generated from OpenAPI.

The following operation table is authoritative for HTTP method/path, accepted query parameters, request DTO, successful status, response `data` DTO and per-route authorization. Responses use the [shared API envelope](../007.%20Audit%20and%20API%20Contracts/12-api-v0-http-examples.md), and all routes require Bearer Request Authorization unless explicitly noted. Documented errors are applicable operation errors in addition to common 500 failures; not every error is expected on every request.

## 1. Operation contracts

<!-- prettier-ignore -->
| Method | Path | Query parameters | JSON request DTO | Success HTTP | Response `data` | Message code | Authz | Errors |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `GET` | `/api/v0/roles` | `page,pageSize,filterBy,sortBy` | `-` | `200` | `RoleInfo[]` | `resource.role.listed` | `request` | `400,401,403,422` |
| `POST` | `/api/v0/roles` | `-` | `CreateRoleRequest` | `201` | `IdResponse` | `resource.role.created` | `request` | `400,401,403,409,415,422` |
| `PATCH` | `/api/v0/roles/{roleId}/statements` | `-` | `ReplaceRoleStatementsRequest` | `200` | `Void` | `resource.role.statements.updated` | `request` | `400,401,403,415,422` |
| `GET` | `/api/v0/statements` | `page,pageSize,filterBy,sortBy` | `-` | `200` | `StatementInfo[]` | `resource.statement.listed` | `request` | `400,401,403,422` |
| `POST` | `/api/v0/statements` | `-` | `CreateStatementRequest` | `201` | `IdResponse` | `resource.statement.created` | `request` | `400,401,403,409,415,422` |
| `DELETE` | `/api/v0/statements/{statementId}` | `-` | `-` | `200` | `Void` | `resource.statement.deleted` | `request` | `400,401,403,404,422` |

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

### CreateRoleRequest

| Field | JSON type | Required | Validation / meaning |
| --- | --- | --- | --- |
| `code` | `string` | yes | Nonblank; unique Role code |
| `displayName` | `string` | yes | Nonblank |
| `description` | `string` | no | Optional description |
| `roleIds` | `array<uuid>` | no | Unique child Role IDs; validate hierarchy, no cycles |

### ReplaceRoleStatementsRequest

| Field | JSON type | Required | Validation / meaning |
| --- | --- | --- | --- |
| `statementIds` | `array<uuid>` | no | Full replacement; omitted or null means empty set; unique IDs |

### RoleInfo

| Field | JSON type | Required | Validation / meaning |
| --- | --- | --- | --- |
| `id` | `uuid` | yes | Stable Role ID |
| `code` | `string` | yes | Role code |
| `displayName` | `string` | yes | Readable name |
| `description` | `string` | no | Omitted when null |
| `children` | `array<RoleInfo>` | no | Recursive; omitted when empty |

### CreateStatementRequest

| Field | JSON type | Required | Validation / meaning |
| --- | --- | --- | --- |
| `code` | `string` | yes | Unique, nonblank |
| `description` | `string` | no | Optional |
| `effect` | `enum:allow,deny` | yes | Request accepts lower-case; response uses upper-case |
| `scope` | `enum:request,object` | yes | Request accepts lower-case; response uses upper-case |
| `target` | `Target` | yes | Target includes API method and path |
| `policy` | `string` | yes | Nonblank policy source; compilation depends on scope |

### StatementInfo

| Field | JSON type | Required | Validation / meaning |
| --- | --- | --- | --- |
| `id` | `uuid` | yes | Stable Statement ID |
| `code` | `string` | yes | Statement code |
| `description` | `string` | no | Optional |
| `effect` | `enum:ALLOW,DENY` | yes | Upper-case response |
| `scope` | `enum:OBJECT,REQUEST` | yes | Upper-case response |
| `target` | `TargetResponse` | yes | Nested API target |
| `policy` | `string` | yes | Persisted policy source |

### Target

| Field | JSON type | Required | Validation / meaning |
| --- | --- | --- | --- |
| `api` | `ApiInfo` | yes | Required nested API target |

### ApiInfo

| Field | JSON type | Required | Validation / meaning |
| --- | --- | --- | --- |
| `method` | `string` | yes | HTTP method or wildcard * |
| `path` | `string` | yes | Whole-path bounded regex |

### TargetResponse

| Field | JSON type | Required | Validation / meaning |
| --- | --- | --- | --- |
| `api` | `ApiResponseData` | yes | Nested response target |

### ApiResponseData

| Field | JSON type | Required | Validation / meaning |
| --- | --- | --- | --- |
| `method` | `string` | yes | HTTP method or * |
| `path` | `string` | yes | Bounded regex path |

### Shared response DTOs

**`IdResponse`** is an object `{ "id": "<uuid>" }`. **`Void`** is JSON `null`. **`Type[]`** means a JSON array of `Type` inside `data`. These are wrapped in the common versioned envelope, not returned as bare JSON bodies. A successful creation SHALL use HTTP 201 with a `Location` header pointing to the created resource. `200` is expected for read, update, delete and other transitions listed above.

## 3. Authorization, validation and behavior

- Role and Statement list endpoints support Request Authorization and the approved query field catalogs defined in [Query Filtering](../004.%20Query%20Filtering/11-appendices.md#115-static-operation-capability-matrix). The current controllers do not resolve per-Role or per-Statement Object Authorization for these list operations.
- The Statement request uses `effect: "allow"|"deny"`, `scope: "request"|"object"`; response uses upper-case enums. Filtering/sorting targets the *logical* `method` and `path` fields, not their `target.api.*` JSON nesting.
- All create operations return `Location` and `data: {"id": "<uuid>"}`. The `PATCH` and `DELETE` operations above return `data: null` within the standard envelope. An empty/null Statement assignment array replaces previous grants with an empty direct set.

## 4. Concrete HTTP examples and verification

The [module-specific request/response examples](12-api-v0-examples.md) illustrate serialized bodies and success envelopes. The module's [External Interface Requirements](03-external-interface-requirements.md) and [behavioral SRS](04-functional-and-behavioral-requirements.md) specify further lifecycle invariants. To verify backend conformance, run `npm run openapi:check` with the generated backend OpenAPI; the contract checker reads these **authored tables** rather than copying generated schemas into specification.
