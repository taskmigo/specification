# 2. Overall Description

## 2.1 Query request lifecycle

For an operation that declares query support, Web binds optional `filterBy`, repeated `sortBy`, `page` and `pageSize`. A registered operation schema supplies allowed logical fields and operators. The validator compiles a typed opaque client predicate and ordered sort description, while the Authorization layer supplies a separate Object predicate.

Resource persistence binds **validated** schema paths to its own trusted fields and composes the query:

```text
Resource scope AND Object Authorization AND validated client filter
    → database-side sorting
    → one-based offset pagination
    → authorized items and authorized totalItems
```

The client cannot replace the resource scope or remove the Object predicate by providing a blank filter.

## 2.2 Filter language

FilterBy accepts a narrowly restricted `EXPRESSION` subset: field-to-literal equality/inequality and supported ordered comparisons, Boolean `&&`/`||`, and `contains(object.field, "text")` for approved string-like fields. The field reference is on the left for comparisons. Unknown, unsuitable, mismatched or unsupported expression forms return a client error instead of being ignored.

## 2.3 Multi-sort and pagination

Clients provide repeated `sortBy` parameters in priority order, with no prefix for ascending and `-` for descending. A leading `+`, duplicate, unknown or nonsortable path is invalid. Nullable sortable fields use nulls-last behavior. Public offset pagination begins at page **1**, defaults to **20** items and is limited to **100** items per page.

## 2.4 Runtime field availability

Dynamic Ticket fields derive from server-owned template/version metadata, not from client-supplied schema definitions. A global list query exposes only unambiguous compatible fields; Type-scoped and exact Ticket operations may have different safe field contexts. The exact schema identity is carried through compilation, Object Authorization and persistence binding.

## 2.5 Public metadata and errors

Generated OpenAPI uses `x-filter-by` and `x-sort-by` to advertise static operation-specific field capabilities. A response field is not automatically queryable. HTTP 400 with `INVALID_FILTER` or `INVALID_SORT` distinguishes invalid query requests; the shared v0 envelope defines status, message and error structure.

## 2.6 Non-goals

No OData/SQL DSL, `sortOrder` request parameter, client-provided schema, arbitrary expression sorting, cursor paging, implicit `+field` convention, arithmetic or general `IN` operator is included in this v0 contract.
