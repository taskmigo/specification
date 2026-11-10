# 3. External Interface Requirements

## 3.1 Statement Model

### STMT-001 — Stable identity

A Statement SHALL have stable UUID and unique code, optional description, effect, scope, API method/path target and nonblank policy source.

### STMT-002 — Effect

The external `effect` field SHALL accept exactly `allow` or `deny`, mapped to ALLOW/DENY domain values.

### STMT-003 — Scope

The external `scope` field SHALL accept exactly `request` or `object`, mapped to REQUEST/OBJECT domain values.

### STMT-004 — API target method

A Statement SHALL target an HTTP method literal or `*` wildcard and a path expression. The method and path SHALL be tested against the current operation.

### STMT-005 — Bounded path regex

The target path SHALL be matched as a complete path excluding query string using bounded RE2/J-compatible regular-expression syntax. The current subset permits printable ASCII expressions, up to 2000 characters and group nesting at most 32; unsupported extensions and counted repetition SHALL be rejected.

### STMT-006 — Policy source

A Statement SHALL retain policy source as a nonblank string. Structural creation SHALL not be described as compiling every Statement against every operation at write time.

### STMT-007 — Managed statements

Migration provisioning MAY reconcile a managed Statement by code while preserving its stable UUID; runtime API creation SHALL use a unique code.

## 3.2 Approved Inputs

### INPUT-001 — Principal root

Request and Object policy evaluation SHALL expose `principal.id` and `principal.username` as approved inputs.

### INPUT-002 — Request root

Policies SHALL expose approved `request.method`, `request.path`, and `request.pathVariables` fields. Unapproved HTTP headers, cookies, JPA entities or beans SHALL NOT become policy roots.

### INPUT-003 — Object root

Object-scope policies MAY reference `object.<path>` only where the target operation's Query Schema registers the logical field/operator; the `object` root SHALL NOT be available in Request-only policy evaluation.

## 3.3 Results and Snapshot

### RES-001 — Request result

Request Authorization SHALL return a boolean grant decision and same-operation Authorization Context.

### RES-002 — Object result

Object Authorization SHALL return an opaque logical predicate bound to an approved Query Schema and runtime `QueryFieldContext` for the operation, not raw JPA Criteria.

### RES-003 — Fail closed

Invalid context, failed policy evaluation, unauthorized target, or incompatible operation schema SHALL never become a permissive predicate or allow decision.

### SNAPSHOT-001 — Effective state

A Request evaluation SHALL capture current database-resolved effective Statements and approved roots for one operation.

### SNAPSHOT-002 — Immutable input

The snapshot SHALL make the effective Statement list and approved nested input data immutable to consumers of that operation.

### SNAPSHOT-003 — Context reuse

The Object Authorization phase SHALL reuse the same Request Authorization context/snapshot created for the authorized request.

### SNAPSHOT-004 — DB authority

Effective Statements SHALL be read from authoritative persistence when building a new operation snapshot; no cross-request caching guarantee or persisted policy revision field is required by the current implementation.

## 3.4 Public API

### AUTH-API-001 — Statements collection

`POST /api/v0/statements` SHALL create a Statement; `GET /api/v0/statements` SHALL return an authorized paginated/filterable/sortable list.

### AUTH-API-002 — Statement delete

`DELETE /api/v0/statements/{statementId}` SHALL delete the targeted Statement subject to Request Authorization and valid resource existence.

### AUTH-API-003 — Roles collection

`POST /api/v0/roles` SHALL create a Role from `code`, `displayName`, optional description and child `roleIds`. `GET /api/v0/roles` SHALL return an authorized list with nested children.

### AUTH-API-004 — Role statement replacement

`PATCH /api/v0/roles/{roleId}/statements` SHALL replace direct Statement grants for that Role.

### AUTH-API-005 — User statement replacement

`PATCH /api/v0/users/{userId}/statements` SHALL replace direct User Statement grants, with User lifecycle and Object Authorization constraints owned by Identity.

### AUTH-API-006 — Owner-specific object queries

Each resource-owning controller SHALL apply Object Authorization to supported list/read/update/delete target selection using the matching operation query schema. No object predicate SHALL be bypassed by client paging/filtering.

## 3.5 Superseded Public Interface

The prior `LOG-API-001`, `LOG-API-002`, and `LOG-API-003` described `GET /api/v0/authorization/logs` and related decision-log queries. These contracts are **withdrawn** because no such endpoint or persistence exists in the reviewed backend. See [traceability](10-traceability-and-unresolved-issues.md).

## 3.6 HTTP Operation Contract Inventory

The operations below constitute the public Authorization-owned HTTP surface in the [reviewed backend snapshot](https://github.com/taskmigo/taskmigo/tree/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/api/v0/auth/authorization). All use the [API v0 envelope](../007.%20Audit%20and%20API%20Contracts/03-external-interface-requirements.md#32-api-response-envelope). The [Query Filtering contract](../004.%20Query%20Filtering/03-external-interface-requirements.md) owns shared query grammar, error behavior, and pagination rules.

| Operation    | Method and route                          | Request                                                   | Successful data and status                                                                                                                          |
| ------------ | ----------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| AUTH-API-001 | `POST /api/v0/statements`                 | Create Statement body                                     | HTTP 201, `data.id` UUID, `Location: /api/v0/statements/{id}`                                                                                       |
| AUTH-API-001 | `GET /api/v0/statements`                  | `page`, `pageSize`, `filterBy`, repeated `sortBy`         | HTTP 200, Statement array and offset pagination metadata                                                                                            |
| AUTH-API-002 | `DELETE /api/v0/statements/{statementId}` | UUID path identifier                                      | HTTP 200, `data=null`                                                                                                                               |
| AUTH-API-003 | `POST /api/v0/roles`                      | Create Role body                                          | HTTP 201, `data.id` UUID, `Location: /api/v0/roles/{id}`                                                                                            |
| AUTH-API-003 | `GET /api/v0/roles`                       | `page`, `pageSize`, `filterBy`, repeated `sortBy`         | HTTP 200, Role array and offset pagination metadata                                                                                                 |
| AUTH-API-004 | `PATCH /api/v0/roles/{roleId}/statements` | UUID path identifier and direct Statement assignment body | HTTP 200, `data=null`                                                                                                                               |
| AUTH-API-005 | `PATCH /api/v0/users/{userId}/statements` | UUID path identifier and direct Statement assignment body | HTTP 200, `data=null`; User lifecycle rules are [Identity-owned](../005.%20Identity%20and%20User%20Retention/03-external-interface-requirements.md) |

All operations SHALL require the applicable Request Authorization decision. List operations SHALL additionally resolve their operation-specific Object Authorization predicates; permitted list results and `totalItems` SHALL reflect the authorized collection before pagination. The User assignment operation SHALL use Identity's User mutation Object Authorization; other operations SHALL NOT be described as object-scoped unless their registered resource operation declares it.

### 3.6.1 Create Statement and Statement response

| Field               | Create request                                              | Statement response            |
| ------------------- | ----------------------------------------------------------- | ----------------------------- |
| `id`                | Not accepted as client-assigned identity                    | UUID, required                |
| `code`              | Required nonblank string, unique                            | String, required              |
| `description`       | Optional string                                             | Nullable string               |
| `effect`            | Required exact lowercase `allow` or `deny`                  | Enum `ALLOW` or `DENY`        |
| `scope`             | Required exact lowercase `request` or `object`              | Enum `REQUEST` or `OBJECT`    |
| `target.api.method` | Required method or `*` under [target rules](#34-public-api) | String at `target.api.method` |
| `target.api.path`   | Required bounded target path expression                     | String at `target.api.path`   |
| `policy`            | Required nonblank source string                             | String, required              |

Creation SHALL reject missing or invalid field constraints according to the shared [validation contract](../007.%20Audit%20and%20API%20Contracts/04-functional-and-behavioral-requirements.md#42-api-v0-error-semantics). The response SHALL not be assumed to be a copy of the request: enums are domain enum names.

### 3.6.2 Create Role, Role response and assignment replacement

| Field         | Create Role request                                            | Role list item                                            |
| ------------- | -------------------------------------------------------------- | --------------------------------------------------------- |
| `id`          | Server-assigned                                                | UUID, required                                            |
| `code`        | Required nonblank string, unique                               | String, required                                          |
| `displayName` | Required nonblank string                                       | String, required                                          |
| `description` | Optional string                                                | Optional string; omitted when null                        |
| `roleIds`     | Optional set of child Role UUIDs; referenced Roles SHALL exist | Not projected directly                                    |
| `children`    | Not accepted in create body                                    | Recursive Role projections; empty collections are omitted |

For `PATCH /api/v0/roles/{roleId}/statements`, the request body SHALL be an object with optional `statementIds` as a set of nonnull UUIDs. An omitted or null `statementIds` SHALL replace the direct grant set with an empty set, **not** preserve existing grants. The operation SHALL be treated as replacement, not additive assignment. This rule also applies to the Identity-owned User assignment endpoint.

### 3.6.3 Allowed filter and sort fields

`filterBy` SHALL use field-to-literal expressions over `object.<field>`. `sortBy` SHALL accept repeated field names with an optional leading `-` for descending order. The allowlists below are per-operation; they are not the complete set of response fields.

| Operation ID                     | Field                                   | Allowed filter operators | Sortable |
| -------------------------------- | --------------------------------------- | ------------------------ | -------- |
| `access-control.statements.list` | `id`                                    | EQ, NE                   | Yes      |
| `access-control.statements.list` | `code`, `description`, `method`, `path` | EQ, NE, CONTAINS         | Yes      |
| `access-control.roles.list`      | `id`                                    | EQ, NE                   | Yes      |
| `access-control.roles.list`      | `code`, `displayName`, `description`    | EQ, NE, CONTAINS         | Yes      |

The Statement list's `method` and `path` query fields refer to the stored API target; these are **logical query fields**, not top-level response properties. Unsupported fields or operators SHALL yield `INVALID_FILTER`; unsupported or duplicate sorting SHALL yield `INVALID_SORT`. Generated OpenAPI SHALL expose these static allowlists via `x-filter-by` and `x-sort-by` as required by [API-IF-005](../007.%20Audit%20and%20API%20Contracts/03-external-interface-requirements.md#api-if-005--query-capability-metadata).

### 3.6.4 Failure and absence boundaries

Missing/invalid request-body fields SHALL use HTTP 422 with `VALIDATION_ERROR`; malformed JSON SHALL use HTTP 400 with `MALFORMED_REQUEST`. Authorization rejection SHALL use the shared 401/403 security handling. An invalid Statement or Role reference, duplicate business code, or failed hierarchy validation SHALL follow the owning domain error mapping; do not infer a uniform status for all such cases without examining the typed domain exception. The current public Role surface contains **no GET-by-ID or generic Role update/delete operation**.
