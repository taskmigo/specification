<!-- prettier-ignore-start -->

# 12. Tickets and Templates — API v0 Examples

The [normative module API contract](api-contract.md) defines the actual method/path, query parameters, request/response models and field requirements. These example values are illustrative, not captured runtime traffic; backend-generated OpenAPI MUST be checked against the authored contract. Shared response envelopes, error conventions and pagination are documented in the [common API v0 guide](../007.%20Audit%20and%20API%20Contracts/12-api-v0-http-examples.md).

## 12.1 Implemented Operations

<!-- prettier-ignore -->
|Method|Path|Request / query|Success|`data` shape|
|---|---|---|---|---|
|`GET`|`/api/v0/tickets`|`page, pageSize, ticketTypeId?, filterBy, sortBy`|`200`|`TicketInfo[] + OffsetMeta`|
|`POST`|`/api/v0/tickets`|`CreateTicketRequest`|`201`|`{id} + BasicMeta; Location`|
|`GET`|`/api/v0/tickets/{ticketId}`|`No body`|`200`|`TicketInfo + BasicMeta`|
|`PATCH`|`/api/v0/tickets/{ticketId}`|`UpdateTicketRequest`|`200`|`TicketInfo + BasicMeta`|
|`GET`|`/api/v0/ticket-types`|`No query options`|`200`|`TicketTypeInfo[] + BasicMeta`|
|`POST`|`/api/v0/ticket-types`|`{key,name}`|`201`|`{id} + BasicMeta; Location`|
|`GET`|`/api/v0/ticket-types/{ticketTypeId}`|`No body`|`200`|`TicketTypeInfo + BasicMeta`|
|`PATCH`|`/api/v0/ticket-types/{ticketTypeId}`|`{name?,status?}`|`200`|`TicketTypeInfo + BasicMeta`|
|`GET`|`/api/v0/ticket-types/{ticketTypeId}/templates`|`No body`|`200`|`TicketTemplateVersion[] + BasicMeta`|
|`POST`|`/api/v0/ticket-types/{ticketTypeId}/templates`|`No body`|`201`|`TicketTemplateVersion + BasicMeta; Location`|
|`GET`|`/api/v0/ticket-types/{ticketTypeId}/templates/{templateVersionId}`|`No body`|`200`|`TicketTemplateVersion + BasicMeta`|
|`PATCH`|`/api/v0/ticket-types/{ticketTypeId}/templates/{templateVersionId}`|`{fields:[TicketTemplateFieldRequest]}`|`200`|`TicketTemplateVersion + BasicMeta`|
|`POST`|`/api/v0/ticket-types/{ticketTypeId}/templates/{templateVersionId}/publish`|`No body`|`200`|`TicketTemplateVersion + BasicMeta`|
|`POST`|`/api/v0/ticket-types/{ticketTypeId}/templates/{templateVersionId}/retire`|`No body`|`200`|`TicketTemplateVersion + BasicMeta`|

## 12.2 Ticket Requests and Responses

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

## 12.3 Ticket Type and Template Requests and Responses

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

<!-- prettier-ignore-end -->
