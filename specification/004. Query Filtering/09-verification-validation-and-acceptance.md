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

## 9.5 Independent-Consumer Contract Scenarios

| Scenario                            | Request or condition                                                                                         | Expected outcome                                                                                       |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| Missing filter                      | Omit `filterBy` on an authorized list                                                                        | Only the client predicate becomes match-all; mandatory visibility and Object Authorization still apply |
| Distinct filter and response fields | Filter User list by `displayName`, which is a response field but not query-allowlisted                       | HTTP 400 `INVALID_FILTER`                                                                              |
| Mixed sort precedence               | Use `sortBy=title&sortBy=-createdAt` on Ticket list                                                          | ASC `title` then DESC `createdAt`; sorting precedes paging                                             |
| Unsupported sort                    | Use `sortBy=id` on Ticket list, where `id` is filterable but not sortable                                    | HTTP 400 `INVALID_SORT`                                                                                |
| Authorized total                    | More objects match a filter than the current User may see                                                    | `totalItems` counts only the authorized matching subset                                                |
| Dynamic schema mismatch             | A query predicate is compiled for one Ticket template context and bound against another incompatible context | Binding fails closed instead of widening the query                                                     |

Verification SHALL include operation-specific allowlists and OpenAPI `x-filter-by`/`x-sort-by` parity, not only parser unit tests. Large-data verification SHALL check SQL-side limiting and filtering rather than fetching all unauthorized records for in-memory comparison.
