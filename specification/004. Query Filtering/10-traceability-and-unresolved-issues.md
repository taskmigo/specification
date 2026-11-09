# 10. Traceability and Unresolved Issues

## 10.1 Source Traceability

| Requirements | Implementation |
| --- | --- |
| SCHEMA-001–004, DATA-001 | [QuerySchemaView](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/query/src/main/java/io/taskmigo/query/QuerySchemaView.java) |
| PRED-001–002, FILTER-001–003 | [FilterByCompiler](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/query/src/main/java/io/taskmigo/query/FilterByCompiler.java) and [validator](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/query/src/main/java/io/taskmigo/query/QuerySchemaValidator.java) |
| SORT-001–003 | [ListQueryOptionsCompiler](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/api/support/query/ListQueryOptionsCompiler.java) |
| SORT-FR-001–003 | [JpaQuerySortBinder](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/internal/jpa-query/src/main/java/io/taskmigo/jpaquery/JpaQuerySortBinder.java) |
| CONTEXT-001, DATA-004 | [TicketQueryFieldCatalog](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/ticket/src/main/java/io/taskmigo/ticket/application/TicketQueryFieldCatalog.java) |
| PAGE-001 | [OffsetPageRequest](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/api/v0/support/pagination/OffsetPageRequest.java) |
| SCHEMA-004, SORT-003 | [OpenAPI customizer](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/openapi-generator/src/main/java/io/taskmigo/openapi/FilterByOpenApiCustomizer.java) |

## 10.2 Superseded Old Filtering Claims

Prior descriptions of broad membership/`IN` operators, quantifiers, generic language program statements, and unrestricted object-field comparisons are superseded. Current `filterBy` is a strict Boolean field-to-literal subset. The prior separate `sortOrder` parameter and explicit `+field` convention are not implemented; multi-sort uses ordered repeated `sortBy` values and `-field` for descending.

## 10.3 Deliberately Unspecified

A generalized SQL DSL, a public client-supplied dynamic Query Schema, arbitrary expressions in sorting, and cursor pagination are not implemented in the reviewed query operation surface. Source snapshot: `9c1cd242fe4c5210fdd8dd88311e328a3784d0e1`.
