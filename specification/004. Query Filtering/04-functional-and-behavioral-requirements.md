# 4. Functional and Behavioral Requirements

The query execution order matters: mandatory visibility and Object Authorization are composed in the database before sorting/pagination and total-count computation.

## 4.1 Compilation

### QRY-001 — Restricted Boolean query expression

**Normative requirement.** FilterBy SHALL compile in `EXPRESSION` mode using only logical, equality, ordering, and contains features. The final compiled source SHALL return Boolean before being converted to a logical query expression.

### QRY-002 — Explicitly supported expression shapes

**Normative requirement.** The validator SHALL accept literal true/false, AND/OR over valid subexpressions, field-to-literal equality/inequality/ordering, and `contains(object.field, "substring")` only for permitted string-like fields.

### QRY-003 — Unsupported operations

**Normative requirement.** Field-to-field comparison, reversed literal-field comparison, bare object references, unary object-reference expressions, `IN`, arithmetic and modulo SHALL be rejected rather than converted into an unsafe or unsupported database expression.

### QRY-004 — Strict typed comparisons

**Normative requirement.** The schema SHALL validate the field's operator set, type, and nullability. Dates/times and UUID/ENUM fields MAY use compatible serialized string literals that are validated by the persistence binder. Ordering SHALL be rejected for nonorderable fields.

### QRY-005 — Query identity

**Normative requirement.** The compiler SHALL bind the resulting logical expression to the identity of the resolved operation schema and exact server-owned runtime context. The persistence layer SHALL reject mismatched predicate identity.

## 4.2 Sorting

### SORT-FR-001 — Multi-sort priority

**Normative requirement.** Sorting SHALL apply requested fields in order, each with its own ascending/descending direction, before pagination.

### SORT-FR-002 — Null positioning

**Normative requirement.** For nullable sortable fields, the trusted JPA binder SHALL order missing/null values after present values regardless of ASC/DESC direction.

### SORT-FR-003 — Default stable order

**Normative requirement.** Where list controllers do not specify sorting, their resource repositories SHALL use stable identifier ordering as implemented (for example User/Ticket lists sort by UUID).

## 4.3 Authorization and Pagination

### PERSIST-002 — Authorized query composition

**Normative requirement.** List repositories SHALL combine client filters with Object Authorization and any implicit resource scope (for example Ticket Type) in the database before pagination.

### PERSIST-003 — Trusted translation

**Normative requirement.** Query metadata SHALL be compiled to trusted typed JPA Criteria/Specification predicates and order expressions, not interpreted as client-supplied SQL.

### PAGE-001 — Offset pagination

**Normative requirement.** List API parameters SHALL default to `page=1`, `pageSize=20`, require `page>=1`, and require `1<=pageSize<=100`. Response metadata SHALL report current page, size, total items, and total pages.

### CONTEXT-001 — Dynamic Ticket fields

**Normative requirement.** Ticket list SHALL use globally compatible fields or Type-scoped history when `ticketTypeId` is supplied. Ticket read/update Object Authorization SHALL use the stored Ticket's exact pinned template version.
