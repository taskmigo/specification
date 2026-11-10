<!-- prettier-ignore-start -->

# 12. Authorization — API v0 Examples

The [normative module API contract](api-contract.md) defines the actual method/path, query parameters, request/response models and field requirements. These example values are illustrative, not captured runtime traffic; backend-generated OpenAPI MUST be checked against the authored contract. Shared response envelopes, error conventions and pagination are documented in the [common API v0 guide](../007.%20Audit%20and%20API%20Contracts/12-api-v0-http-examples.md).

## 12.1 Implemented Operations

<!-- prettier-ignore -->
|Method|Path|Request / query|Success|`data` shape|
|---|---|---|---|---|
|`GET`|`/api/v0/roles`|`page, pageSize, filterBy, sortBy`|`200`|`RoleInfo[] + OffsetMeta`|
|`POST`|`/api/v0/roles`|`CreateRoleRequest`|`201`|`{id} + BasicMeta; Location`|
|`PATCH`|`/api/v0/roles/{roleId}/statements`|`{statementIds?}`|`200`|`null + BasicMeta`|
|`GET`|`/api/v0/statements`|`page, pageSize, filterBy, sortBy`|`200`|`StatementInfo[] + OffsetMeta`|
|`POST`|`/api/v0/statements`|`CreateStatementRequest`|`201`|`{id} + BasicMeta; Location`|
|`DELETE`|`/api/v0/statements/{statementId}`|`No body`|`200`|`null + BasicMeta`|

## 12.2 Role and Statement Requests and Responses

### Create Role

`POST /api/v0/roles` body:

```json
{
  "code": "reviewer",
  "displayName": "Reviewer",
  "description": "May review tickets",
  "roleIds": []
}
```

HTTP 201 returns `data: {"id": "<new UUID>"}`. `GET /api/v0/roles` returns recursive objects with `id`, `code`, `displayName`, optional `description`, and optional `children`:

```json
{
  "id": "55555555-5555-4555-8555-555555555555",
  "code": "reviewer",
  "displayName": "Reviewer",
  "description": "May review tickets"
}
```

When serialized, a null `description` and an empty `children` list are omitted from Role responses.

### Replace Role Statements

`PATCH /api/v0/roles/55555555-5555-4555-8555-555555555555/statements` request:

```json
{
  "statementIds": [
    "33333333-3333-4333-8333-333333333333"
  ]
}
```

HTTP 200 returns `data: null` with message code `resource.role.statements.updated`. Omitted or null `statementIds` is treated as empty.

### Create Statement

`POST /api/v0/statements` body; `effect` and `scope` are lower-case request values:

```json
{
  "code": "ticket-read",
  "description": "Permit ticket reads",
  "effect": "allow",
  "scope": "request",
  "target": {
    "api": {
      "method": "GET",
      "path": "/api/v0/tickets/.*"
    }
  },
  "policy": "return true;"
}
```

HTTP 201 returns `data: {"id": "<new UUID>"}`. `GET /api/v0/statements` returns the following item, with **upper-case enum values** and nested `target.api`:

```json
{
  "id": "33333333-3333-4333-8333-333333333333",
  "code": "ticket-read",
  "description": "Permit ticket reads",
  "effect": "ALLOW",
  "scope": "REQUEST",
  "target": {
    "api": {
      "method": "GET",
      "path": "/api/v0/tickets/.*"
    }
  },
  "policy": "return true;"
}
```

In `filterBy` and `sortBy`, these last two target fields are referenced as logical `method` and `path`, not `target.api.method` and `target.api.path`. `DELETE /api/v0/statements/{statementId}` returns HTTP 200 with `data: null`.

## 12.3 Cross-Context User Statements

The `PATCH /api/v0/users/{userId}/statements` route uses Authorization's grant service, but its HTTP controller and User lifecycle constraints belong to **Identity**. See the [Identity API examples](../005.%20Identity%20and%20User%20Retention/12-api-v0-examples.md) and [Identity OpenAPI](../005.%20Identity%20and%20User%20Retention/openapi.yaml).

<!-- prettier-ignore-end -->
