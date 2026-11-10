<!-- prettier-ignore-start -->

# 12. Identity and Configuration — API v0 Examples

The [normative module API contract](api-contract.md) defines the actual method/path, query parameters, request/response models and field requirements. These example values are illustrative, not captured runtime traffic; backend-generated OpenAPI MUST be checked against the authored contract. Shared response envelopes, error conventions and pagination are documented in the [common API v0 guide](../007.%20Audit%20and%20API%20Contracts/12-api-v0-http-examples.md).

## 12.1 Implemented Operations

<!-- prettier-ignore -->
|Method|Path|Request / query|Success|`data` shape|
|---|---|---|---|---|
|`GET`|`/api/v0/users`|`page, pageSize, filterBy, sortBy`|`200`|`UserInfo[] + OffsetMeta`|
|`POST`|`/api/v0/users`|`CreateUserRequest`|`201`|`{id} + BasicMeta; Location`|
|`DELETE`|`/api/v0/users/{userId}`|`No body`|`200`|`null + BasicMeta`|
|`PATCH`|`/api/v0/users/{userId}/statements`|`{statementIds?}`|`200`|`null + BasicMeta`|
|`GET`|`/api/v0/groups`|`page, pageSize, filterBy, sortBy`|`200`|`GroupInfo[] + OffsetMeta`|
|`POST`|`/api/v0/groups`|`CreateGroupRequest`|`201`|`{id} + BasicMeta; Location`|
|`GET`|`/api/v0/configuration`|`No body`|`200`|`ApplicationConfiguration + BasicMeta`|
|`PATCH`|`/api/v0/configuration`|`{retention?:{user?:string}}`|`200`|`ApplicationConfiguration + BasicMeta`|

## 12.2 User and Group Requests and Responses

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

## 12.3 Configuration Requests and Responses

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

<!-- prettier-ignore-end -->
