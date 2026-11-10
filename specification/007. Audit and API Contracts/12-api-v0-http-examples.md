<!-- prettier-ignore-start -->

# API v0 — Shared HTTP conventions and normative module contracts

## 1. Specification-first contract model

**The Taskmigo specification is the source of truth for API design.** Each bounded context owns an authored `api-contract.md` documenting the methods, paths, query/path parameters, body DTOs, response fields, required/optional data, validation, successful HTTP status, error codes, policy boundary and lifecycle semantics.

The backend generates a single aggregate OpenAPI for clients and tooling. That generated file is an **output of implementation** and SHALL be checked against the authored contract; it SHALL NOT overwrite or redefine the requirement. A disagreement is either a backend implementation/documentation defect or an explicitly reviewed specification change.

## 2. Module API contract index

<!-- prettier-ignore -->
| Module                      | Normative contract                                                                                        | Illustrative HTTP/JSON examples                                               | Operations |
| --------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ---------- |
| Authorization               | [Role and Statement API contract](../002.%20Authorization/api-contract.md)                                | [Examples](../002.%20Authorization/12-api-v0-examples.md)                     | 6          |
| Identity and User Retention | [User, Group and Configuration API contract](../005.%20Identity%20and%20User%20Retention/api-contract.md) | [Examples](../005.%20Identity%20and%20User%20Retention/12-api-v0-examples.md) | 8          |
| Tickets and Dynamic Fields  | [Ticket, Type and Template API contract](../006.%20Tickets%20and%20Dynamic%20Fields/api-contract.md)      | [Examples](../006.%20Tickets%20and%20Dynamic%20Fields/12-api-v0-examples.md)  | 14         |
| Audit                       | [Audit API contract](api-contract.md)                                                                     | [Examples](12-api-v0-examples.md)                                             | 1          |

The 29 API v0 operations have one HTTP controller owner apiece. For example, `PATCH /api/v0/users/{userId}/statements` belongs to Identity's HTTP contract even though it delegates grant changes to Authorization. Query Filtering exposes supporting DSL and schema capabilities; it does not have an additional HTTP controller. OAuth2/OIDC authorization server endpoints are specified separately under [Authentication and Provisioning](../008.%20Authentication%20and%20Provisioning/README.md).

## 3. Standard success response envelope

All API v0 resource responses SHALL use `success`, `statusCode`, `message`, `error`, `meta` and `data`. On success, `error` is null. The `data` schema is specified separately by the owning operation contract. These are **illustrative JSON values**, not live captures:

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

HTTP 201 creates SHALL include a `Location` header and the specified resource/identifier payload. HTTP 200 shall use the same envelope for reads, updates and deletes, including `data: null` where indicated by the operation contract.

## 4. Pagination and query rules

Offset-paginated APIs accept `page` (default 1, minimum 1) and `pageSize` (default 20, range 1–100). Response `meta.pagination` is:

```json
{
  "type": "offset",
  "offset": {
    "currentPage": 1,
    "pageSize": 20,
    "totalItems": 42,
    "totalPages": 3
  }
}
```

Operations that support `filterBy` and repeated `sortBy` SHALL validate requests against their operation-scoped Query Schema and the [static field/operator catalogue](../004.%20Query%20Filtering/11-appendices.md#115-static-operation-capability-matrix). The supporting DSL and runtime dynamic-field constraints are specified by Query Filtering, not inferred from arbitrary response JSON keys. Ticket Type and Template lists are not offset-paginated in the current contract.

## 5. Error response envelope

A failure response SHALL set `success=false`, `data=null`, and `error` to structured machine-readable information. For example, HTTP 400 for invalid sorting has this *illustrative* structure:

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

Invalid or malformed requests, failed authorization, missing resources and domain conflicts use HTTP 400/401/403/404/409/415/422/500 as applicable to each module's authored endpoint table. Error message text is not a stable identifier; clients SHALL use documented machine-readable codes. Specific input validation may additionally include `formErrors`.

## 6. Generated OpenAPI conformance verification

After changing API requirements, update the owning `api-contract.md` and acceptance requirements first. Backend code implements the desired behavior, and the backend OpenAPI generator produces `server/apps/web/src/main/resources/static/api/docs/openapi.yaml`. The checker compares the **generated output against authored specification**:

```bash
npm run openapi:check
npm run openapi:strict
```

In CI, the specification repo checks out `taskmigo/taskmigo` on `next` under `_backend` and reads the backend-generated OpenAPI. Locally, pass a source YAML path explicitly:

```bash
node scripts/check-openapi-against-spec.mjs ../taskmigo/server/apps/web/src/main/resources/static/api/docs/openapi.yaml --strict
```

The comparator verifies all authored operations, accepted query/path parameter names, request DTOs, expected successful statuses, response data schemas, documented error statuses, DTO field names/types, required request fields and enums. It rejects extra generated endpoints not specified in any module. **Neither command generates or edits the authored contract.**

### Known backend documentation mismatches

The current backend generator omits **HTTP 200 successful response documentation on eight Ticket Type/Template operations**, despite controllers returning 200. It also omits the related `TicketTypeInfo` output component. These are implementation-generated documentation defects; the normative Ticket contract deliberately retains the correct 200 behavior and response types.

The normal `openapi:check` CI command reports these named, narrowly allowlisted existing gaps and **fails for any other drift**. The `openapi:strict` command treats even the known gaps as failures, and should pass once the backend OpenAPI generator is repaired. These exceptions must be reviewed/removed when the backend is corrected; they must not expand silently.

## 7. Change control and versioning

- A spec/API change SHALL update its owning module's API contract, field definitions, examples and relevant verification requirements before backend behavior is changed.
- Backend generated OpenAPI SHALL be regenerated and evaluated against that contract. Inconsistencies SHALL be fixed in the backend generator/DTO/controller or resolved through an explicit requirements change.
- The specification CI uses the current backend `next` snapshot for comparison and does not itself run the entire backend integration-test suite. Endpoint behavior must additionally be checked with API integration and E2E tests.

<!-- prettier-ignore-end -->
