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

## 9.3 Wire Contract Acceptance Matrix

| Scenario | Input/condition | Expected response contract |
| --- | --- | --- |
| Field validation | Required JSON body field missing or malformed by Bean Validation | HTTP 422, `message.code=validation.failed`, `error.code=VALIDATION_ERROR`, field map |
| Malformed JSON | Unreadable request body | HTTP 400, `request.malformed`, `MALFORMED_REQUEST` |
| Query rejection | Unsupported `filterBy` or `sortBy` on a list route | HTTP 400 with distinct `INVALID_FILTER` or `INVALID_SORT`; no unrestricted fallback |
| Audited User page | GET `/audit/user/logs?page=1&pageSize=20` with unrestricted User visibility | HTTP 200, offset metadata, ordered Audit records with field-level `sensitive` markers |
| Restricted Audit | Same request with a nontrivial User Object predicate | HTTP 403, not a partial or silently filtered Audit page |
| Sensitive change | Audit event has `sensitive=true` | Corresponding before/after JSON values are null |
| Generated contract | Compare an owning module's endpoint/allowlist against checked-in OpenAPI | Method, path, response schema and `x-filter-by`/`x-sort-by` metadata agree or a drift item is recorded |

The shared [error matrix](03-external-interface-requirements.md#343-common-http-and-application-error-mapping) is the canonical source for application error-code assertions. Test existence is not the same as execution evidence.
