# 3. External Interface Requirements

## 3.1 Query Schema

### SCHEMA-001 — Operation identity

Every filterable/sortable operation SHALL have one registered Query Schema with a stable operation identifier. A Web route using query options SHALL declare the operation by `@QueryOperation`.

### SCHEMA-002 — Field metadata

A field descriptor SHALL identify logical path, type, nullability, allowed operators, sortable capability and stable persistence source identity. Public fields SHALL be allowlisted independently of JPA entity structure.

### SCHEMA-003 — Operator allowlist

`filterBy` SHALL accept only expressions composed of fields/operators explicitly allowed by the corresponding operation schema; valid symbolic operators are EQ, NE, GT, GTE, LT, LTE and CONTAINS, plus boolean AND/OR composition.

### SCHEMA-004 — Runtime context

The Query Schema SHALL resolve the operation's server-owned runtime field context, and schema identity SHALL include effective runtime field metadata/source identity to prevent incompatible binding.

## 3.2 Predicate Model

### PRED-001 — Opaque logical predicate

Compilation SHALL produce an immutable opaque logical predicate typed to the Query Contract, not raw SQL, arbitrary JPA expressions or executable dynamic code.

### PRED-002 — Identity predicate

An absent, null or blank `filterBy` SHALL compile to an always-true logical predicate for the declared schema.

## 3.3 Filter Request

### FILTER-001 — Expression syntax

The `filterBy` parameter SHALL contain a Boolean expression using the `object` root and approved comparisons/logical composition. Example: `object.status == "ACTIVE" && object.createdAt >= "2026-01-01T00:00:00Z"`.

### FILTER-002 — Invalid input

Malformed syntax, non-Boolean expression, unknown field, unapproved operator or unsupported expression form SHALL return HTTP 400 with code `INVALID_FILTER` and SHALL NOT be ignored.

### FILTER-003 — Field-to-literal comparisons

Comparison SHALL use an `object.<field>` reference on the left and a literal on the right. Null comparison SHALL be permitted only for EQ/NE on nullable fields; `contains` requires a string-like field and a string literal.

## 3.4 Spring/Web Binding

### SPRING-001 — Query binding

Web SHALL bind optional `filterBy` and repeated `sortBy` to `ListQueryOptions` and compile them for the method's declared Query Schema and server-owned runtime context.

## 3.5 Persistence Binding

### PERSIST-001 — Resource-owned mapping

A resource's persistence adapter SHALL map logical predicates/sorts to trusted JPA paths using its own Query Schema; no client-provided raw field, SQL identifier or expression SHALL bypass schema validation.

## 3.6 Multi-Sort Request

### SORT-001 — Repeated field order

Clients SHALL supply `sortBy=name&sortBy=-createdAt`. Field order SHALL determine sort precedence. Ascending SHALL be the default; a leading `-` SHALL indicate descending.

### SORT-002 — Input rejection

A `+` prefix, empty field, duplicate logical field, unknown path or nonsortable field SHALL return HTTP 400 with error code `INVALID_SORT`.

### SORT-003 — Static documentation

Generated OpenAPI SHALL expose supported filter paths/operators via `x-filter-by` and sortable paths via `x-sort-by` for registered operation schemas.
