<!-- prettier-ignore-start -->

# 12. Audit — API v0 Examples

The field names, accepted parameters and response schemas are specified in [this module's OpenAPI](openapi.yaml); the JSON values in the examples are illustrative rather than captured runtime traffic. Shared response envelopes, error conventions and pagination are documented in the [common API v0 guide](../007.%20Audit%20and%20API%20Contracts/12-api-v0-http-examples.md).

## 12.1 Implemented Operations


<!-- prettier-ignore -->
|Method|Path|Request / query|Success|`data` shape|
|---|---|---|---|---|
|`GET`|`/api/v0/audit/{entityType}/logs`|`entityType=user, page, pageSize`|`200`|`AuditLog[] + OffsetMeta`|

## 12.2 Audit Requests and Responses

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

<!-- prettier-ignore-end -->
