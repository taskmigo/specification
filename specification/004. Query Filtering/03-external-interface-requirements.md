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

## 3.7 Client Query Contract for Each List Operation

The Query module defines **shared syntax, validation and typed operation binding**; the owning resource module defines the field allowlist. A response field SHALL NOT be assumed filterable merely because it appears in JSON. Use the following canonical operation contracts for field/operator and sort metadata.

| Operation ID                     | Owning module                                                                                                                          | Query field allowlist                                             |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `access-control.roles.list`      | [Authorization](../002.%20Authorization/03-external-interface-requirements.md#363-allowed-filter-and-sort-fields)                      | `id`, `code`, `displayName`, `description`                        |
| `access-control.statements.list` | [Authorization](../002.%20Authorization/03-external-interface-requirements.md#363-allowed-filter-and-sort-fields)                      | `id`, `code`, `description`, `method`, `path`                     |
| `identity.users.list`            | [Identity](../005.%20Identity%20and%20User%20Retention/03-external-interface-requirements.md#365-per-operation-query-field-allowlists) | `id`, `username`, `firstName`, `lastName`, `status`, `retainedAt` |
| `identity.groups.list`           | [Identity](../005.%20Identity%20and%20User%20Retention/03-external-interface-requirements.md#365-per-operation-query-field-allowlists) | `id`, `code`, `displayName`, `description`                        |
| `tickets.list`                   | [Tickets](../006.%20Tickets%20and%20Dynamic%20Fields/03-external-interface-requirements.md#343-ticket-list-filter-and-sort-allowlists) | Static Ticket fields plus compatible runtime template fields      |

For the current v0 query grammar, these externally observable rules SHALL hold:

| Input                                                          | Expected behavior                                                                                  |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `filterBy` omitted, empty or blank                             | Match-all **client** predicate; Object Authorization and mandatory resource visibility still apply |
| `filterBy=object.status == "ACTIVE"`                           | Valid only where the operation schema declares `status` and the EQ operator                        |
| `filterBy=contains(object.title, "fix")`                       | Valid only where `title` supports CONTAINS and has a compatible string-like type                   |
| Repeated `sortBy=title&sortBy=-createdAt`                      | Apply ascending `title` then descending `createdAt` where both fields are sortable                 |
| `sortBy=+title`, repeated field, unknown field                 | HTTP 400 with `error.code=INVALID_SORT`                                                            |
| Unknown field, field-to-field comparison, unsupported operator | HTTP 400 with `error.code=INVALID_FILTER`                                                          |

Examples illustrate the grammar but SHALL NOT expand a particular operation's allowlist. The canonical request parameters are `filterBy` and ordered repeated `sortBy`; `sortOrder`, arbitrary client SQL, and implicit `+field` syntax are not accepted.

### 3.7.1 Pagination and access semantics

All current supported offset-paginated collection operations SHALL default to `page=1`, `pageSize=20`, reject `page<1` or `pageSize` outside 1–100, and return `meta.pagination.type="offset"` with `offset.currentPage`, `pageSize`, `totalItems`, and `totalPages`. For a list operation, filter, owner-specific implicit scope, and Object Authorization SHALL affect the database query before the requested page is cut. The reported total SHALL reflect **accessible matching objects**, not inaccessible objects hidden by policy. The owning module remains responsible for the exact default ordering and its data-specific visibility rules.

### 3.7.2 OpenAPI metadata

The operation's static `x-filter-by` and `x-sort-by` metadata SHALL be generated from registered Query Schemas. Runtime custom fields are context-dependent and SHALL not be presented as a single unconditional static allowlist. Use [API Contract](../007.%20Audit%20and%20API%20Contracts/03-external-interface-requirements.md#33-openapi) for wire-format verification and error envelopes.
