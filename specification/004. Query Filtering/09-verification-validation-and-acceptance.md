# 9. Verification, Validation, and Acceptance Evidence

## 9.1 Filter Acceptance

### QRY-VER-001 — Valid expressions

Verify field-to-literal comparison, compound AND/OR, allowed contains, ISO-time/enum serialized literals, missing filter identity and parenthesized expressions.

### QRY-VER-002 — Unsafe/rejected expressions

Verify rejection of unknown/persistence-only path, unsupported operator, nonboolean expression, IN, arithmetic, bare object reference, field-to-field and literal-to-field comparisons, and contains on non-string fields.

### QRY-VER-003 — Null rules

Verify null EQ/NE for nullable fields, rejection of null ordering and null tests on nonnullable fields.

## 9.2 Sort Acceptance

### SORT-VER-001 — Multi-sort order

Verify `sortBy=name&sortBy=-createdAt` produces ASC name followed by DESC createdAt; verify priority and nulls-last behavior in generated database orders.

### SORT-VER-002 — Invalid sort

Verify blank field, leading `+`, duplicate, unknown and nonsortable field errors use `INVALID_SORT` and HTTP 400.

## 9.3 Context and Database

### QRY-VER-004 — Query identity

Verify that a field metadata/source identity change makes a compiled predicate incompatible with the prior schema/context.

### QRY-VER-005 — Authorization composition

Verify SQL-side client filtering, Object Authorization, type-scoped dynamic field resolution, sorting and pagination together for a large dataset.

### QRY-VER-006 — OpenAPI metadata

Verify operation-specific `x-filter-by` operator lists and `x-sort-by` sortable field allowlists match static registered Query Schemas.

## 9.4 Evidence

- [FilterByCompilerTest](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/query/src/test/java/io/taskmigo/query/FilterByCompilerTest.java).
- [Strict filter integration contract](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/query/src/test/java/io/taskmigo/query/Enhancement237FilterByStrictContractTest.java).
- [Multi-sort contract test](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/test/java/io/taskmigo/web/api/support/query/ListQueryMultiSortContractTest.java).
- [Ticket persistence query integration](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/ticket/src/test/java/io/taskmigo/ticket/persistence/TicketQueryPersistenceIntegrationTest.java).

## 9.5 Catalog Parity Acceptance

### QRY-VER-007 — Static fields, operators, and sortability

For each of the five list operations in the [static capability matrix](11-appendices.md#115-static-operation-capability-matrix), verify every supported field/operator and sortable field against its registered Query Schema and generated OpenAPI. Reject each unlisted field or operator with `INVALID_FILTER` or `INVALID_SORT` as applicable.

### QRY-VER-008 — Statement aliases and distinct Object schemas

Verify `object.method` is supported by the Statement list while `object.target.api.method` is not; separately verify the User deletion and statement-update Object Authorization schemas are not interchangeable.
