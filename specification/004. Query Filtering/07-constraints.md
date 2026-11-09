# 7. Constraints

## 7.1 Filter Surface

### TECH-001 — Explicit operation

Filter options SHALL require exactly one registered Query Schema for the operation; ambiguous/missing registrations SHALL fail rather than silently selecting a schema.

### TECH-002 — Restricted syntax

Comparison SHALL use a field reference from `object` on the left and literal on the right; `IN`, arithmetic, collection quantifiers, field-to-field comparisons, unsupported unary forms and arbitrary code SHALL NOT be accepted.

### TECH-003 — Type/null constraints

Null comparisons SHALL use only equality/inequality on nullable paths; CONTAINS SHALL use a string-like path and string literal; ordering SHALL use a supported orderable type.

### TECH-004 — Trusted persistence binding

Resource owners SHALL bind logical fields/operators/sorts against their registered Query Schema and exact runtime context. They SHALL reject mismatched compiled schema identity.

## 7.2 Sorting and Pagination

### TECH-005 — Sort prefix

A leading plus sign SHALL be invalid; leading minus sign SHALL mean DESC; absent sign SHALL mean ASC. Duplicates and unsupported sort fields SHALL be errors.

### TECH-006 — Sorting before page slicing

The database SHALL apply request-specific sort and authorization/filter predicates before the requested offset slice, including nulls-last ordering for nullable fields.

## 7.3 Public Documentation

### TECH-007 — Operation metadata

Generated OpenAPI SHALL publish only statically available field/operator/sort metadata. Runtime EAV fields MAY vary by Ticket Type and historical template scope and SHALL NOT be assumed present in the static snapshot.
