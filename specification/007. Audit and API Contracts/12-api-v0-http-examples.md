# 12. API v0 HTTP and JSON Reference

## 12.1 Scope and Conventions

This reference provides illustrative wire-level shapes for the **29 implemented API v0 HTTP operations**. The canonical machine-readable definition is the [generated OpenAPI snapshot](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/resources/static/api/docs/openapi.yaml), produced from the HTTP controllers at backend commit `9c1cd242fe4c5210fdd8dd88311e328a3784d0e1`. These examples are **not live HTTP captures**. UUIDs, timestamps and resource values are illustrative; response duration is not a service-level promise.

All documented routes use the `/api/v0` prefix and versioned API authentication/Request Authorization. For authenticated calls, send `Authorization: Bearer <access-token>`. JSON body operations use `Content-Type: application/json`; successful JSON representations use `application/json`.

A successful response uses the envelope shown below. A row's result shape describes the **`data` field**, not a bare top-level response. All resource creation routes return an appropriate `Location` header. Collection `OffsetMeta` includes pagination; other successful responses use `BasicMeta`. HTTP 401/403, request validation errors and resource-specific conflicts are described under [error examples](#1210-error-response-examples).

### Successful basic response

```json
{
  "success": true,
  "statusCode": 201,
  "message": {
    "code": "resource.ticket.created",
    "text": "Ticket created"
  },
  "error": null,
  "meta": {
    "execution": {
      "startedAt": "2026-11-10T01:00:00Z",
      "duration": 12
    }
  },
  "data": {
    "id": "22222222-2222-4222-8222-222222222222"
  }
}
```

### Successful paginated response

```json
{
  "success": true,
  "statusCode": 200,
  "message": {
    "code": "resource.user.listed",
    "text": "Users listed"
  },
  "error": null,
  "meta": {
    "execution": {
      "startedAt": "2026-11-10T01:00:00Z",
      "duration": 12
    },
    "pagination": {
      "type": "offset",
      "offset": {
        "currentPage": 1,
        "pageSize": 20,
        "totalItems": 1,
        "totalPages": 1
      }
    }
  },
  "data": [
    {
      "id": "11111111-1111-4111-8111-111111111111",
      "username": "sample",
      "firstName": "Sample",
      "lastName": "User",
      "emails": [
        "sample@example.test"
      ],
      "displayName": "Sample User",
      "status": "ACTIVE",
      "retainedAt": null
    }
  ]
}
```

A `null` value in a response example is literal JSON null. A DTO field annotated nullable may serialize as null, while some fields have omission rules noted below.

## 12.2 Implemented Endpoint Index

### Users

<!-- prettier-ignore -->
| Method | Path | Request / query | Success | `data` shape |
| --- | --- | --- | --- | --- |
|  `GET` | `/api/v0/users` | `page, pageSize, filterBy, sortBy` | `200` | `UserInfo[] + OffsetMeta` |
|  `POST` | `/api/v0/users` | `CreateUserRequest` | `201` | `{id} + BasicMeta; Location` |
|  `DELETE` | `/api/v0/users/{userId}` | `No body` | `200` | `null + BasicMeta` |
|  `PATCH` | `/api/v0/users/{userId}/statements` | `{statementIds?}` | `200` | `null + BasicMeta` |

### Groups, Roles, Statements

<!-- prettier-ignore -->
| Method | Path | Request / query | Success | `data` shape |
| --- | --- | --- | --- | --- |
|  `GET` | `/api/v0/groups` | `page, pageSize, filterBy, sortBy` | `200` | `GroupInfo[] + OffsetMeta` |
|  `POST` | `/api/v0/groups` | `CreateGroupRequest` | `201` | `{id} + BasicMeta; Location` |
|  `GET` | `/api/v0/roles` | `page, pageSize, filterBy, sortBy` | `200` | `RoleInfo[] + OffsetMeta` |
|  `POST` | `/api/v0/roles` | `CreateRoleRequest` | `201` | `{id} + BasicMeta; Location` |
|  `PATCH` | `/api/v0/roles/{roleId}/statements` | `{statementIds?}` | `200` | `null + BasicMeta` |
|  `GET` | `/api/v0/statements` | `page, pageSize, filterBy, sortBy` | `200` | `StatementInfo[] + OffsetMeta` |
|  `POST` | `/api/v0/statements` | `CreateStatementRequest` | `201` | `{id} + BasicMeta; Location` |
|  `DELETE` | `/api/v0/statements/{statementId}` | `No body` | `200` | `null + BasicMeta` |

### Tickets

<!-- prettier-ignore -->
| Method | Path | Request / query | Success | `data` shape |
| --- | --- | --- | --- | --- |
|  `GET` | `/api/v0/tickets` | `page, pageSize, ticketTypeId?, filterBy, sortBy` | `200` | `TicketInfo[] + OffsetMeta` |
|  `POST` | `/api/v0/tickets` | `CreateTicketRequest` | `201` | `{id} + BasicMeta; Location` |
|  `GET` | `/api/v0/tickets/{ticketId}` | `No body` | `200` | `TicketInfo + BasicMeta` |
|  `PATCH` | `/api/v0/tickets/{ticketId}` | `UpdateTicketRequest` | `200` | `TicketInfo + BasicMeta` |

### Ticket Types and Templates

<!-- prettier-ignore -->
| Method | Path | Request / query | Success | `data` shape |
| --- | --- | --- | --- | --- |
|  `GET` | `/api/v0/ticket-types` | `No query options` | `200` | `TicketTypeInfo[] + BasicMeta` |
|  `POST` | `/api/v0/ticket-types` | `{key,name}` | `201` | `{id} + BasicMeta; Location` |
|  `GET` | `/api/v0/ticket-types/{ticketTypeId}` | `No body` | `200` | `TicketTypeInfo + BasicMeta` |
|  `PATCH` | `/api/v0/ticket-types/{ticketTypeId}` | `{name?,status?}` | `200` | `TicketTypeInfo + BasicMeta` |
|  `GET` | `/api/v0/ticket-types/{ticketTypeId}/templates` | `No body` | `200` | `TicketTemplateVersion[] + BasicMeta` |
|  `POST` | `/api/v0/ticket-types/{ticketTypeId}/templates` | `No body` | `201` | `TicketTemplateVersion + BasicMeta; Location` |
|  `GET` | `/api/v0/ticket-types/{ticketTypeId}/templates/{templateVersionId}` | `No body` | `200` | `TicketTemplateVersion + BasicMeta` |
|  `PATCH` | `/api/v0/ticket-types/{ticketTypeId}/templates/{templateVersionId}` | `{fields:[TicketTemplateFieldRequest]}` | `200` | `TicketTemplateVersion + BasicMeta` |
|  `POST` | `/api/v0/ticket-types/{ticketTypeId}/templates/{templateVersionId}/publish` | `No body` | `200` | `TicketTemplateVersion + BasicMeta` |
|  `POST` | `/api/v0/ticket-types/{ticketTypeId}/templates/{templateVersionId}/retire` | `No body` | `200` | `TicketTemplateVersion + BasicMeta` |

### Configuration and Audit

<!-- prettier-ignore -->
| Method | Path | Request / query | Success | `data` shape |
| --- | --- | --- | --- | --- |
|  `GET` | `/api/v0/configuration` | `No body` | `200` | `ApplicationConfiguration + BasicMeta` |
|  `PATCH` | `/api/v0/configuration` | `{retention?:{user?:string}}` | `200` | `ApplicationConfiguration + BasicMeta` |
|  `GET` | `/api/v0/audit/{entityType}/logs` | `entityType=user, page, pageSize` | `200` | `AuditLog[] + OffsetMeta` |

The optional `filterBy` and repeated `sortBy` query parameters are supported only on the five list routes that declare them; see the exact [field/operator catalog](../004.%20Query%20Filtering/11-appendices.md#115-static-operation-capability-matrix). `page` defaults to 1, `pageSize` to 20, and page size must be between 1 and 100. `sortBy=-createdAt&sortBy=title` requests two ordered sort clauses. Ticket dynamic custom field paths use `object.<fieldKey>` rather than `object.customFields.<fieldKey>`.

## 12.3 User and Group Payloads

### Create User

`POST /api/v0/users` body (`username`, `firstName` and `lastName` required; all other properties optional):

```json
{
  "username": "sample",
  "firstName": "Sample",
  "lastName": "User",
  "emails": [
    "sample@example.test"
  ],
  "roleIds": [
    "55555555-5555-4555-8555-555555555555"
  ],
  "groupIds": [
    "44444444-4444-4444-8444-444444444444"
  ]
}
```

Successful HTTP 201 `data`:

```json
{
  "id": "11111111-1111-4111-8111-111111111111"
}
```

This route does **not** accept a password property in its defined DTO, does not initialize login credentials, and does not assign the `global` Group implicitly when `groupIds` is omitted. `GET /api/v0/users` returns UserInfo objects with `id`, `username`, `firstName`, `lastName`, `emails`, `displayName`, `status`, and nullable `retainedAt`. Tombstoned rows are excluded; `RETAINED` visibility follows Object Authorization.

### Delete User and replace direct Statements

`DELETE /api/v0/users/11111111-1111-4111-8111-111111111111` has no JSON body. It returns HTTP 200, message code `resource.user.deleted` and `data: null`. The deletion lifecycle uses the configured retention duration, so HTTP 200 does not imply that the User row has been physically removed.

`PATCH /api/v0/users/11111111-1111-4111-8111-111111111111/statements` body:

```json
{
  "statementIds": [
    "33333333-3333-4333-8333-333333333333"
  ]
}
```

The response is HTTP 200 with message code `resource.user.statements.updated` and `data: null`. An omitted or null `statementIds` array is treated as empty (replace all direct Statements).

### Create Group and list Groups

`POST /api/v0/groups` body:

```json
{
  "code": "engineering",
  "displayName": "Engineering",
  "description": "Engineering team",
  "groupIds": [],
  "roleIds": [
    "55555555-5555-4555-8555-555555555555"
  ]
}
```

HTTP 201 returns `data: {"id": "<new UUID>"}` and a `Location` header. A `GET /api/v0/groups` item has the following `data` shape:

```json
{
  "id": "44444444-4444-4444-8444-444444444444",
  "code": "engineering",
  "displayName": "Engineering",
  "description": "Engineering team",
  "children": []
}
```

The Group list is offset-paginated and authorized by a Group Object predicate. Group `children` is a recursive array.

## 12.4 Role and Statement Payloads

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

## 12.5 Ticket Payloads

### Create Ticket

`POST /api/v0/tickets` requires a valid ACTIVE Ticket Type with a current PUBLISHED template. Example:

```json
{
  "ticketTypeId": "66666666-6666-4666-8666-666666666666",
  "title": "Cannot sign in",
  "status": "OPEN",
  "customFields": {
    "severity": "HIGH"
  }
}
```

A successful response is HTTP 201 with message code `resource.ticket.created`, `data: {"id": "<new UUID>"}` and `Location: /api/v0/tickets/<new UUID>`.

### Read Ticket

`GET /api/v0/tickets/22222222-2222-4222-8222-222222222222` yields a full `TicketInfo` in `data`:

```json
{
  "id": "22222222-2222-4222-8222-222222222222",
  "ticketTypeId": "66666666-6666-4666-8666-666666666666",
  "templateVersionId": "77777777-7777-4777-8777-777777777777",
  "title": "Cannot sign in",
  "status": "OPEN",
  "createdBy": "11111111-1111-4111-8111-111111111111",
  "createdAt": "2026-11-10T01:00:00Z",
  "updatedAt": "2026-11-10T01:00:00Z",
  "customFields": {
    "severity": "HIGH"
  }
}
```

`GET /api/v0/tickets` returns an array of these objects plus offset pagination in `meta`. It additionally accepts `ticketTypeId` to restrict results. The template version ID is the historical pinned version, not necessarily the current template.

### Patch Ticket

`PATCH /api/v0/tickets/22222222-2222-4222-8222-222222222222` body:

```json
{
  "status": "IN_PROGRESS",
  "customFields": {
    "severity": "MEDIUM"
  }
}
```

Only supplied common/custom fields change. A custom field set to JSON `null` on PATCH removes its stored value if optional; a missing field is left unchanged. The server responds HTTP 200 with a complete updated `TicketInfo` object, not a bare UUID.

## 12.6 Ticket Type and Template Payloads

### Create, list, read, update Ticket Type

`POST /api/v0/ticket-types` body:

```json
{
  "key": "bug",
  "name": "Bug"
}
```

HTTP 201 returns `data: {"id": "<new UUID>"}`. `GET /api/v0/ticket-types` returns an **unpaginated** key-ordered array. `GET /api/v0/ticket-types/{ticketTypeId}` and `PATCH /api/v0/ticket-types/{ticketTypeId}` return a single Type object:

```json
{
  "id": "66666666-6666-4666-8666-666666666666",
  "key": "bug",
  "name": "Bug",
  "status": "ACTIVE",
  "createdAt": "2026-11-10T01:00:00Z",
  "updatedAt": "2026-11-10T01:00:00Z"
}
```

`PATCH /api/v0/ticket-types/{ticketTypeId}` body may include `name` and/or `status` (`ACTIVE` or `RETIRED`); Type `key` is immutable.

### Create draft and replace fields

`POST /api/v0/ticket-types/{ticketTypeId}/templates` takes no request body and returns HTTP 201 with the entire new draft template and Location. `PATCH /api/v0/ticket-types/{ticketTypeId}/templates/{templateVersionId}` takes a required `fields` array, replacing every draft field:

```json
{
  "fields": [
    {
      "fieldId": "88888888-8888-4888-8888-888888888888",
      "key": "severity",
      "label": "Severity",
      "dataType": "ENUM",
      "required": true,
      "constraints": {
        "options": [
          "LOW",
          "MEDIUM",
          "HIGH"
        ]
      }
    }
  ]
}
```

`fieldId` is optional for a new definition. A returned template representation (also the item shape in list and read responses) is:

```json
{
  "id": "77777777-7777-4777-8777-777777777777",
  "version": 1,
  "status": "DRAFT",
  "fields": [
    {
      "fieldId": "88888888-8888-4888-8888-888888888888",
      "key": "severity",
      "label": "Severity",
      "dataType": "ENUM",
      "required": true,
      "constraints": {
        "options": [
          "LOW",
          "MEDIUM",
          "HIGH"
        ]
      }
    }
  ],
  "publishedAt": null,
  "retiredAt": null
}
```

`GET /api/v0/ticket-types/{ticketTypeId}/templates` returns an unpaginated array of template representations; its `/{templateVersionId}` counterpart returns one. `POST` on the `/{templateVersionId}/publish` or `/{templateVersionId}/retire` subroute takes no request body and returns HTTP 200 with the updated full template representation. A published template has `status: "PUBLISHED"` and `publishedAt`; a retired one has `status: "RETIRED"` and `retiredAt`.

## 12.7 Configuration Payloads

`GET /api/v0/configuration` returns `data` shaped as:

```json
{
  "retention": {
    "user": "P30D"
  }
}
```

`PATCH /api/v0/configuration` body:

```json
{
  "retention": {
    "user": "P1D"
  }
}
```

HTTP 200 returns the effective configuration under the same shape, for example `data: {"retention": {"user": "P1D"}}`. Retention uses nonnegative whole 24-hour days and canonicalizes the returned value to `P<n>D`; unknown properties are rejected.

## 12.8 Audit Payloads

`GET /api/v0/audit/user/logs?page=1&pageSize=20` returns `AuditLog[]` under the paginated envelope. Example `data` entry:

```json
{
  "id": "99999999-9999-4999-8999-999999999999",
  "entityType": "user",
  "entityId": "11111111-1111-4111-8111-111111111111",
  "actor": {
    "id": "11111111-1111-4111-8111-111111111111",
    "username": "Unknown user"
  },
  "occurredAt": "2026-11-10T01:00:00Z",
  "changes": [
    {
      "field": "username",
      "before": null,
      "after": null,
      "sensitive": true
    },
    {
      "field": "status",
      "before": "RETAINED",
      "after": "TOMBSTONE",
      "sensitive": false
    }
  ]
}
```

Only entity type `user` is currently queryable. The endpoint requires unrestricted User Object visibility, and the server orders by `occurredAt` descending and then `id` descending. It does not expose `filterBy` or `sortBy`.

## 12.9 Request and Response Field Rules

- **Required fields:** The `CreateUserRequest` requires `username`, `firstName`, `lastName`; `CreateTicketRequest` requires `ticketTypeId`, `title`, `status`; `CreateTicketTypeRequest` requires `key`, `name`; `CreateStatementRequest` requires `code`, `effect`, `scope`, `target`, `policy`; Role/Group creation requires `code`, `displayName`; a template fields replacement requires `fields`.

- **Enums:** Create Statement uses `effect=allow|deny`, `scope=request|object`; returned Statement enums use `ALLOW|DENY` and `REQUEST|OBJECT`. Type status uses `ACTIVE|RETIRED`; template status uses `DRAFT|PUBLISHED|RETIRED`. A Ticket's `status` is currently a nonblank string, not a controlled enum.

- **Arrays:** Registration `emails`, `roleIds`, `groupIds` and direct `statementIds` are collections. Template `fields` is an array. Do not infer that supplying a subset to a replacement endpoint preserves omitted members; Statement grants and template fields are full replacements.

- **Timing:** `meta.execution.startedAt` and `duration` are runtime metadata. UUIDs and timestamps shown here are examples, not reserved application IDs.

- **OpenAPI caveat:** The generated snapshot does not declare a 200 response for some Ticket Type/Template controller operations, despite their implementations returning `ResponseEntity.ok(...)`. Treat this as a documentation mismatch to resolve in the generator/annotations, rather than inventing a different wire status.

## 12.10 Error Response Examples

Unsupported sort field example, HTTP 400:

```json
{
  "success": false,
  "statusCode": 400,
  "message": {
    "code": "query.sort.invalid",
    "text": "Unknown sortBy field 'priority'"
  },
  "error": {
    "code": "INVALID_SORT",
    "message": "Unknown sortBy field 'priority'"
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

Invalid request body example, HTTP 422:

```json
{
  "success": false,
  "statusCode": 422,
  "message": {
    "code": "validation.failed",
    "text": "Request validation failed"
  },
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "formErrors": {
      "title": "must not be blank"
    }
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

The actual field-level message content can vary by validator and field. Malformed JSON is mapped to HTTP 400 with error `MALFORMED_REQUEST`; invalid `filterBy` to 400 `INVALID_FILTER`; invalid `sortBy` to 400 `INVALID_SORT`. Authorization failures yield 401 or 403, while missing resources and business/domain conflicts may yield 404, 409 or 422 according to the owning exception handler. Do not assume every route implements every status advertised by the common OpenAPI error annotations.

## 12.11 Traceability

These DTO shapes are based on the current [v0 HTTP controllers](https://github.com/taskmigo/taskmigo/tree/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/api/v0), the [API response factory](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/api/v0/support/response/ApiResponseFactory.java), and the [generated OpenAPI snapshot](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/resources/static/api/docs/openapi.yaml). The [Authorization SRS](../002.%20Authorization/README.md), [Identity SRS](../005.%20Identity%20and%20User%20Retention/README.md), and [Ticket SRS](../006.%20Tickets%20and%20Dynamic%20Fields/README.md) remain authoritative for resource-specific behavior; this descriptive reference does not introduce new normative feature requirements.
