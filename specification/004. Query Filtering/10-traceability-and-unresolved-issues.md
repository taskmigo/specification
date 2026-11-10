# 10. Traceability and Unresolved Issues

## 10.1 Source Traceability

| Requirements                 | Implementation                                                                                                                                                                                                                                                                                                                                                       |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SCHEMA-001–004, DATA-001     | [QuerySchemaView](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/query/src/main/java/io/taskmigo/query/QuerySchemaView.java)                                                                                                                                                                                      |
| PRED-001–002, FILTER-001–003 | [FilterByCompiler](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/query/src/main/java/io/taskmigo/query/FilterByCompiler.java) and [validator](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/query/src/main/java/io/taskmigo/query/QuerySchemaValidator.java) |
| SORT-001–003                 | [ListQueryOptionsCompiler](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/api/support/query/ListQueryOptionsCompiler.java)                                                                                                                                                         |
| SORT-FR-001–003              | [JpaQuerySortBinder](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/internal/jpa-query/src/main/java/io/taskmigo/jpaquery/JpaQuerySortBinder.java)                                                                                                                                                                |
| CONTEXT-001, DATA-004        | [TicketQueryFieldCatalog](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/ticket/src/main/java/io/taskmigo/ticket/application/TicketQueryFieldCatalog.java)                                                                                                                                                        |
| PAGE-001                     | [OffsetPageRequest](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/api/v0/support/pagination/OffsetPageRequest.java)                                                                                                                                                               |
| SCHEMA-004, SORT-003         | [OpenAPI customizer](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/openapi-generator/src/main/java/io/taskmigo/openapi/FilterByOpenApiCustomizer.java)                                                                                                                                                              |

## 10.2 Superseded Old Filtering Claims

Prior descriptions of broad membership/`IN` operators, quantifiers, generic language program statements, and unrestricted object-field comparisons are superseded. Current `filterBy` is a strict Boolean field-to-literal subset. The prior separate `sortOrder` parameter and explicit `+field` convention are not implemented; multi-sort uses ordered repeated `sortBy` values and `-field` for descending.

## 10.3 Deliberately Unspecified

A generalized SQL DSL, a public client-supplied dynamic Query Schema, arbitrary expressions in sorting, and cursor pagination are not implemented in the reviewed query operation surface. Source snapshot: `9c1cd242fe4c5210fdd8dd88311e328a3784d0e1`.

## 10.4 Module Contract Traceability and Baseline Discipline

The [backend source snapshot](https://github.com/taskmigo/taskmigo/tree/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server) is **observed implementation evidence**, not an automatic replacement for approved SRS requirements. The table below links existing normative IDs to interface contracts and objective acceptance obligations. The stated acceptance coverage does **not** claim those tests were run during this documentation edit.

| Requirement IDs               | Behavior or interface                                | Normative SRS contract                                                                                    | Verification obligation                                                                                       |
| ----------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| FILTER-001–003, QRY-001–005   | Approved filter grammar and per-operation allowlists | [Client contract](03-external-interface-requirements.md#37-client-query-contract-for-each-list-operation) | [Consumer scenarios](09-verification-validation-and-acceptance.md#95-independent-consumer-contract-scenarios) |
| SORT-001–003, SORT-FR-001–003 | Ordered multi-sort, null semantics, invalid sort     | [Sort interface](03-external-interface-requirements.md#36-multi-sort-request)                             | [Sort verification](09-verification-validation-and-acceptance.md#92-sort-acceptance)                          |
| PAGE-001, PERSIST-002–003     | Authorized, scope-aware SQL-side paging and totals   | [Pagination interface](03-external-interface-requirements.md#371-pagination-and-access-semantics)         | [Query/authorization integration](09-verification-validation-and-acceptance.md#93-context-and-database)       |

### 10.4.1 Source-to-spec reconciliation

The global grammar does not define the allowed fields for every operation. Only the owning module's referenced field table is authoritative for each operation. Static OpenAPI extensions cannot promise dynamically scoped Ticket custom fields.

For future changes, classify a finding as **approved requirement**, **observed as-is**, **proposed to-be**, **conflict/drift**, or **unresolved** before rewriting the normative contract. Source evidence should identify the actual backend commit or generated artifact. OpenAPI generation and test presence alone are not conformance evidence; compare the owning module contract, generated schema, and executed test outcome.
