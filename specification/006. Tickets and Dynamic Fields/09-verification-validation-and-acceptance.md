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

## 9.3 Public Contract Acceptance Matrix

| Scenario | Setup and action | Expected outcome |
| --- | --- | --- |
| Ticket creation | Create with valid Type, published template, required `title`/`status` | HTTP 201, `data.id` and Location; Ticket pins Type and template |
| Partial Ticket update | Patch only one optional `customFields` key; patch another optional key with null | Other keys remain unchanged; null clears only the supplied optional field |
| Query metadata distinction | Try Ticket `filterBy=object.id == "<UUID>"` then `sortBy=id` | EQ filter is valid; `sortBy=id` returns `INVALID_SORT` |
| Scope and security | List with `ticketTypeId`, a filter and a restricted Object Authorization predicate | Page data and `totalItems` reflect the intersection of all three scopes before pagination |
| Type list transport | Call `GET /ticket-types` | Nonpaginated Type array with BasicMeta, not an offset page |
| Template replace | PATCH a DRAFT template with `fields` list that omits an old field | Returned DRAFT fields reflect full replacement; prior published Ticket data is unchanged |
| Lifecycle errors | Publish a non-DRAFT template or retire a non-PUBLISHED template | State conflict is rejected according to the shared error contract |
| Historical fields | Read a Ticket after its Type publishes a new template | Existing Ticket remains pinned to its original field version and values |

Each case SHALL assert its documented field types and error envelope in addition to the business outcome. The operation set in [section 3](03-external-interface-requirements.md#34-explicit-http-operation-inventory) defines which HTTP routes require contract coverage; it SHALL NOT be expanded by inventing Ticket delete or Type delete routes.
