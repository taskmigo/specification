# 1. Introduction

## 1.1 Purpose

This specification defines the source-derived Taskmigo API `filterBy`, `sortBy`, pagination, operation-scoped Query Schemas and database-side query execution, as implemented in backend commit `9c1cd242fe4c5210fdd8dd88311e328a3784d0e1`.

## 1.2 Scope

Query provides logical schema, allowlisted field/operator, expression compiler and typed predicate contracts. Web binds request parameters and resolves runtime schema context. Resource owners implement trusted database binding. Authorization provides independent Object predicates that SHALL combine with client filters.

## 1.3 Terms

- **Operation schema:** Query field catalog registered for one application operation (e.g. `tickets.list`).
- **Query field descriptor:** Logical field path, type, nullability, operator allowlist, sortable flag and stable source identity.
- **Runtime query context:** Server-owned immutable metadata for dynamic fields such as Ticket template fields.
- **Logical predicate:** Opaque, schema-bound expression that is not directly executable against untrusted SQL text.
- **Multi-sort:** Ordered list of fields with individual ASC/DESC directions.

## 1.4 Sources

- [Query FilterBy compiler](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/query/src/main/java/io/taskmigo/query/FilterByCompiler.java).
- [Web query options compiler](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/api/support/query/ListQueryOptionsCompiler.java).
- [Query schema validator](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/query/src/main/java/io/taskmigo/query/QuerySchemaValidator.java).
- [JPA sort binder](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/internal/jpa-query/src/main/java/io/taskmigo/jpaquery/JpaQuerySortBinder.java).

## 1.5 Document Layout

Sections 3 and 4 define the public and internal contract, Section 7 the safety constraints, Section 9 acceptance cases, and Section 10 superseded baseline assumptions.
