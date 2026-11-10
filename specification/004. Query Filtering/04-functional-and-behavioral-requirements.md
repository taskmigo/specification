# 4. Functional and Behavioral Requirements

This section specifies **what a validated client query means** and how it must be executed safely. The [section 3 wire contract](03-external-interface-requirements.md) defines `filterBy`, `sortBy`, query allowlists and pagination; the owning resource module supplies the actual operation field metadata.

## 4.1 Compilation

### QRY-001 — Restricted Boolean query expression

**Required behavior:** `filterBy` SHALL be compiled in Language `EXPRESSION` mode using only enabled logical, equality, ordering and contains operations. Its final static result type SHALL be Boolean before the expression can become an operation-bound logical predicate.

**Failure boundary:** a non-Boolean result or disallowed feature SHALL not be interpreted as a successful unrestricted query.

### QRY-002 — Explicitly supported expression shapes

The validator SHALL recognize precisely the following expression categories when permitted by the operation Query Schema:

| Shape | Required meaning |
| --- | --- |
| Literal `true` or `false` | Match-all or match-none client predicate |
| `A && B`, `A || B` | Boolean combination of individually valid predicates |
| `object.field == literal` and `!=` | Schema-approved typed equality/inequality |
| `object.field > literal`, `>=`, `<`, `<=` | Schema-approved ordered typed comparison |
| `contains(object.field, "text")` | String containment for a field allowing CONTAINS |

Parentheses may group valid Boolean expressions. Every logical field and operator SHALL be allowlisted for the current operation.

### QRY-003 — Unsupported operations

**Required behavior:** Field-to-field comparison, literal-to-field comparison, bare object references, unsupported unary object references, general `IN`, arithmetic/modulo and arbitrary expression forms SHALL be rejected. The SQL backend's theoretical ability to evaluate an expression does not make it valid client syntax.

### QRY-004 — Strict typed comparisons

**Required behavior:** The Query Schema SHALL validate operator eligibility, logical field type and nullability. EQ/NE against `null` SHALL apply only to nullable fields; ordering on nonorderable fields SHALL fail. Date/time, UUID and enum fields MAY accept compatible serialized string literals only where the trusted persistence binder validates them.

### QRY-005 — Query identity

Every compiled logical predicate SHALL be associated with the resolved operation schema and its exact server-owned QueryFieldContext/source identities. Persistence SHALL reject an incompatible schema or runtime field snapshot instead of silently mapping a predicate to unrelated fields.

## 4.2 Sorting

### SORT-FR-001 — Multi-sort priority

When clients provide repeated `sortBy` fields, the query SHALL apply them **in the supplied order**, with the stated ascending/descending direction on each, before selecting the requested page.

### SORT-FR-002 — Null positioning

For any nullable sortable field, the trusted JPA binder SHALL order null/missing values **after nonnull values** regardless of ASC/DESC direction. The null rule is part of the observable ordering contract.

### SORT-FR-003 — Default stable order

Where the caller does not specify sorting, resource repositories SHALL apply the owner-defined stable default order, including UUID identifier ordering in implemented User/Ticket list queries. This requirement SHALL not be misread as an invented universal appended tie-breaker for every explicitly sorted list.

## 4.3 Authorization and Pagination

### PERSIST-002 — Authorized query composition

Each list query SHALL combine client-supplied predicates with its mandatory Object Authorization and any implicit resource scope (for example `ticketTypeId`) in the database. The intersection determines both visible items and `totalItems` **before offset pagination**.

### PERSIST-003 — Trusted translation

A resource module SHALL bind validated logical field predicates and ordered sorts through its own trusted typed JPA Criteria/Specification mappings. Client input SHALL not become an unchecked SQL fragment or raw persistence field path.

### PAGE-001 — Offset pagination

Public offset-paginated list operations SHALL use one-based `page` (default 1, minimum 1) and `pageSize` (default 20, inclusive range 1–100). Responses SHALL include `meta.pagination.type="offset"`, current page, page size, total authorized matching items and total pages.

### CONTEXT-001 — Dynamic Ticket fields

A Ticket list without Type scope SHALL allow only globally compatible dynamic fields. A list with `ticketTypeId` SHALL resolve the Type's approved version history; read/update Object Authorization SHALL resolve the exact template version pinned to the individual Ticket. The same context identity SHALL be used through compilation, authorization and binding.

## 4.4 Verification approach

A query is conforming only when syntax, operation allowlist, authorized result membership, sort priority, pagination and totals all match this SRS. [Section 9](09-verification-validation-and-acceptance.md) includes negative tests, high-volume database execution checks and generated OpenAPI metadata comparisons.
