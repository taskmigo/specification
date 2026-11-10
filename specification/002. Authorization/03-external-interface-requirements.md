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

## 3.6 Operation-Specific Query and Response Fields

### AUTH-API-007 — Statement query aliases

The Statement list operation SHALL expose `method` and `path` as logical `filterBy` and `sortBy` fields. Its HTTP response SHALL nest these values at `target.api.method` and `target.api.path`. A client SHALL NOT assume that every response JSON property path is a supported query path.

Verification: Compare `GET /api/v0/statements` with [Static query capabilities](../004.%20Query%20Filtering/11-appendices.md#115-static-operation-capability-matrix) and the Statement Query Schema.

### AUTH-API-008 — Role list projection

The Role list SHALL expose `id`, `code`, `displayName`, optional `description`, and recursive `children`. The response serializer SHALL omit `children` when empty and omit `description` when null. This differs from the Group projection, which includes a `children` array.

Verification: Compare Roles with and without children and description in a list response.

## HTTP/JSON Examples

See the [API v0 HTTP and JSON reference](../007.%20Audit%20and%20API%20Contracts/12-api-v0-http-examples.md) for concrete method/path, input DTO, sample request, successful response, and error envelope for the Authorization APIs.
