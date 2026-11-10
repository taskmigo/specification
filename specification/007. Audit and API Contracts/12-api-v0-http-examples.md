# 12. API v0 — Shared Conventions and Module OpenAPI Index

## 12.1 Why OpenAPI Is Split by Module

API definitions are maintained alongside their owning bounded-context specifications rather than grouped into one large reference document. Each `openapi.yaml` is a **self-contained OpenAPI 3.1 document** with that module's paths, transitive request/response component schemas, and OAuth2 security scheme. Common schema objects may be repeated between generated snapshots so that each module specification can be opened and validated independently.

The four module snapshots are derived from the backend [generated API v0 OpenAPI](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/resources/static/api/docs/openapi.yaml) at commit `9c1cd242fe4c5210fdd8dd88311e328a3784d0e1`. The backend's generated aggregate remains the **implementation source of truth**. The module files are generated/read-only snapshots, not separately implemented HTTP services.

## 12.2 Module OpenAPI Index

<!-- prettier-ignore -->
| Module | Scope | API operations | OpenAPI | JSON examples |
| --- | --- | --- | --- | --- |
| Authorization | Roles and Statements | 6 | [openapi.yaml](../002.%20Authorization/openapi.yaml) | [Examples](../002.%20Authorization/12-api-v0-examples.md) |
| Identity & User Retention | Users, Groups, Configuration, User Statements | 8 | [openapi.yaml](../005.%20Identity%20and%20User%20Retention/openapi.yaml) | [Examples](../005.%20Identity%20and%20User%20Retention/12-api-v0-examples.md) |
| Tickets & Dynamic Fields | Tickets, Types, Template versions | 14 | [openapi.yaml](../006.%20Tickets%20and%20Dynamic%20Fields/openapi.yaml) | [Examples](../006.%20Tickets%20and%20Dynamic%20Fields/12-api-v0-examples.md) |
| Audit | User entity audit logs | 1 | [openapi.yaml](openapi.yaml) | [Examples](12-api-v0-examples.md) |

Each operation is recorded in exactly one module document, following **HTTP controller ownership**. For example, the User Statement mutation endpoint is in Identity, even though the Authorization module provides its grant logic. Query Filtering is a supporting capability and has no standalone versioned HTTP controller. Spring Authorization Server exposes OAuth/OIDC protocol endpoints separately; its endpoints are not fabricated as v0 resource APIs.

## 12.3 Standard Success Envelope

Every v0 resource API response uses the common envelope (`success`, `statusCode`, `message`, `error`, `meta`, `data`) constructed by `ApiResponseFactory`. The example values below are illustrative:

```json
{
  "success": true,
  "statusCode": 200,
  "message": {
    "code": "resource.configuration.read",
    "text": "Configuration read"
  },
  "error": null,
  "meta": {
    "execution": {
      "startedAt": "2026-11-10T01:00:00Z",
      "duration": 12
    }
  },
  "data": {
    "retention": {
      "user": "P30D"
    }
  }
}
```

Created resources use HTTP 201 and an appropriate `Location` header. Paginated collection responses additionally include `meta.pagination`:

```json
{
  "type": "offset",
  "offset": {
    "currentPage": 1,
    "pageSize": 20,
    "totalItems": 1,
    "totalPages": 1
  }
}
```

`page` defaults to 1, `pageSize` to 20, and page size must be from 1 through 100 on supported offset-paginated endpoints. Not every list is paginated: Ticket Types and Template versions currently return an unpaginated array. Optional `filterBy` and repeated `sortBy` are supported only where declared in the operation and Query Schema.

## 12.4 Standard Error Envelope

Error responses set `success=false`, `data=null` and contain structured `error` details. For an unsupported sort field, HTTP 400 has the following illustrative structure:

```json
{
  "success": false,
  "statusCode": 400,
  "message": {
    "code": "query.sort.invalid",
    "text": "Invalid sortBy expression"
  },
  "error": {
    "code": "INVALID_SORT",
    "message": "Unsupported sort field"
  },
  "meta": {
    "execution": {
      "startedAt": "2026-11-10T01:00:00Z",
      "duration": 12
    }
  },
  "data": null
}
```

Malformed JSON returns HTTP 400; body validation generally uses HTTP 422 and may include `error.formErrors`. Failed authentication/authorization normally yields HTTP 401/403. Domain failures can produce 400, 404, 409, or 422 depending on the operation. See [API v0 exception handling](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/api/v0/support/response/ApiV0ExceptionHandler.java).

## 12.5 Authentication and Source Traceability

Resource operations require an applicable Bearer token, validated User state, and Request Authorization. Their Object Authorization and query filtering vary by module. OAuth2 login and token issuance are provided by Spring Authorization Server and are described under [Authentication and Provisioning](../008.%20Authentication%20and%20Provisioning/README.md), not listed as extra `/api/v0` CRUD operations.

Static query-field/operator information is documented under [Query Filtering](../004.%20Query%20Filtering/11-appendices.md#115-static-operation-capability-matrix). The source-derived OpenAPI files are checked for missing schema references and operation overlap; see `scripts/validate-module-openapi.mjs`.

## 12.6 Regenerating OpenAPI Snapshots

The backend still emits one aggregated, authoritative OpenAPI document. When backend controllers or DTOs change, regenerate module snapshots from that document rather than editing the four files independently.

```bash
node scripts/module-openapi.mjs --generate ../taskmigo/server/apps/web/src/main/resources/static/api/docs/openapi.yaml
npm run openapi:check
```

The relative backend path above assumes that the `specification` and `taskmigo` checkouts share a parent directory; any local path to the backend-generated OpenAPI can be passed. The generator preserves path ownership, includes only transitively referenced component schemas, and checks all module files for syntax and unresolved references. The CI check verifies the committed module snapshots' internal integrity and complete 29-operation baseline; it does **not** independently detect later backend changes unless a newer backend OpenAPI is supplied and the snapshots are regenerated.
