# 9. Verification, Validation, and Acceptance Evidence

## 9.1 Acceptance Cases

### TKT-VER-001 — Type lifecycle

Verify creation with unique key, stable key on update, ACTIVE/RETIRED transitions, and rejection of new Ticket creation for retired Types or absent current PUBLISHED template.

### TKT-VER-002 — Template lifecycle

Verify draft creation/copied fields, field replacement, publication and retirement, including invalid state transitions and immutable published field identity.

### TKT-VER-003 — Custom-field types

Verify STRING/NUMBER/BOOLEAN/DATE/DATETIME/UUID/ENUM validation, required/optional behavior, constraint boundaries, duplicate and unknown keys, and null patch removal behavior.

### TKT-VER-004 — Historical schema preservation

Verify an existing Ticket remains readable and patchable with its pinned version after subsequent template publication/retirement and schema changes do not rewrite old Ticket data.

### TKT-VER-005 — Authorized list and item

Verify Request and Object Authorization on list/read/update, missing/unauthorized item response, and database-side filtering/sorting before offset pagination.

### TKT-VER-006 — Dynamic field ambiguity

Verify global compatible-field intersection, per-Type history and per-Ticket exact-version schema, with ambiguous key/UUID/type fields excluded from global scopes.

## 9.2 Test Evidence

- [Ticket API integration tests](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/test/java/io/taskmigo/web/api/v0/ticket/TicketApiIntegrationTest.java).
- [Ticket query persistence integration tests](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/ticket/src/test/java/io/taskmigo/ticket/persistence/TicketQueryPersistenceIntegrationTest.java).
- [EAV module implementation](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/internal/eav).
- [Ticket Type application service](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/ticket/src/main/java/io/taskmigo/ticket/type/application/TicketTypeServiceImpl.java).

These are code evidence links, not an assertion that all CI checks passed for the documentation update.

## 9.3 Type Collection and Constraint Cases

### TKT-VER-007 — Type list boundary

Verify the Type collection is ordered by key, includes all persisted Types in a basic unpaginated response, and does not accept the Ticket list's filter/sort/paging parameters as functional query options. Verify Request Authorization remains enforced and no Object Authorization predicate is applied to Type/Template endpoints.

### TKT-VER-008 — Constraint validation boundaries

Verify invalid negative/decimal STRING lengths, inverted min/max for STRING/NUMBER/DATE/DATETIME, duplicate/blank ENUM options, and values incompatible with BOOLEAN/UUID/DATE/DATETIME types are rejected. Verify existing historical instances remain pinned to the version that validated them.

### TKT-VER-009 — Dynamic field path interpretation

Verify a registered custom field with key `severity` is queryable as `object.severity`, is not automatically queryable as `object.customFields.severity`, and is rejected when the operation's history/context makes the key ambiguous or unavailable.

## Module OpenAPI Contract Verification

Verify that [this module's OpenAPI](openapi.yaml) contains only its controller-owned `/api/v0` paths; all referenced component schemas resolve locally; requests/responses match the backend-generated aggregate; and the [JSON examples](12-api-v0-examples.md) demonstrate relevant success/error behavior. Shared DTO envelopes may be copied into each standalone module snapshot. Validation is automated by `npm run openapi:check` in the specification repository.
