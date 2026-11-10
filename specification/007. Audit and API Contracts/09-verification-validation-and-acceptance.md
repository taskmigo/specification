# 9. Verification, Validation, and Acceptance Evidence

## 9.1 Acceptance Tests

### AUD-VER-001 — Append with mutation

Verify append occurs within the calling mutation transaction and rollback prevents orphan Audit history.

### AUD-VER-002 — Sensitive diff

Verify sensitive before/after values are always null, and any attempt to construct a sensitive diff with values is rejected.

### AUD-VER-003 — User scrub

Verify tombstoning preserves audit rows/UUIDs while anonymizing actor usernames and scrubbing identifying User change values.

### AUD-VER-004 — Audit read

Verify only `user` is accepted, records sort by latest occurredAt/id, and restricted User visibility denies the endpoint.

### API-VER-001 — Response envelope

Verify standard response envelope fields, execution timing, creation Location header and nullable error/data semantics.

### API-VER-002 — Validation and client query errors

Verify malformed body 400, body validation 422, filter/sort errors 400 with appropriate distinct codes, and domain 400/404/409/422 mapping.

### API-VER-003 — Pagination and generated schema

Verify defaults 1/20, max pageSize 100, matching offset metadata and OpenAPI field/operator `x-filter-by`/`x-sort-by` extensions.

## 9.2 Source Evidence

- [Audit API integration tests](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/test/java/io/taskmigo/web/api/v0/audit/AuditApiIntegrationTest.java).
- [OpenAPI generation integration tests](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/openapi-generator/src/test/java/io/taskmigo/openapi/OpenApiGenerationIntegrationTest.java).
- [API response factory](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/api/v0/support/response/ApiResponseFactory.java).

Test references do not indicate that test jobs were executed as part of authoring.

## 9.3 HTTP/JSON Contract Verification

### API-VER-004 — Endpoint and payload parity

Verify that every operation in the [API v0 HTTP/JSON reference](12-api-v0-http-examples.md#122-module-openapi-index) exists in the generated OpenAPI, that its request fields and successful response `data` shape match the controller DTO, and that the v0 envelope includes `success`, `statusCode`, `message`, `error`, `meta` and `data`.

### API-VER-005 — Examples and generated responses

Validate example JSON syntax and compare create, paginated list, detail, patch, no-data mutation, and validation/error envelopes with API integration tests. Detect discrepancies between controller-returned 200 statuses and the generated OpenAPI status list.

## Module OpenAPI Contract Verification

Verify that [this module's OpenAPI](openapi.yaml) contains only its controller-owned `/api/v0` paths; all referenced component schemas resolve locally; requests/responses match the backend-generated aggregate; and the [JSON examples](12-api-v0-examples.md) demonstrate relevant success/error behavior. Shared DTO envelopes may be copied into each standalone module snapshot. Validation is automated by `npm run openapi:check` in the specification repository.
