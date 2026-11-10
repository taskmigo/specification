# 8. Requirements Allocation and Dependencies

Query owns the logical contract; resource owners own its binding; Web owns HTTP parsing; Authorization supplies independent mandatory predicates.

## 8.1 Module Allocation

- **`:modules:query`:** Opaque query predicate and sort contracts, operation Query Schema, field descriptors, compiler and schema validator.
- **`:modules:internal:language`:** Syntax, typing, profile-aware parsing and expression mapping.
- **`:modules:internal:jpa-query`:** Generic trusted Criteria/JPA expression and sort binders.
- **Identity/Authorization/Ticket persistence:** Resource-specific Query Schemas, object-authorization integration and JPA field mappings.
- **Web:** `ListQueryOptions`, `ListQueryOptionsCompiler`, runtime context resolution, HTTP errors and pagination.
- **OpenAPI generator:** `x-filter-by` and `x-sort-by` extensions on declared query operations.

## 8.2 Operation Context Sources

Resource modules define the fields permitted for their operations; Web SHALL resolve a unique operation schema and runtime metadata through `@QueryOperation` and appropriate `QueryFieldContextSource`. Ticket's dynamic context SHALL come from stored EAV definitions, not client-supplied field declarations.

## 8.3 Dependency Direction

Query SHALL NOT depend on Authorization or a resource owner; resource owners SHALL depend on the Query published API. The Query module MAY depend on internal Language as an implementation detail. Web SHALL NOT import internal JPA Query/EAV implementation types directly.

## 8.4 Related Specifications

[Authorization](../002.%20Authorization/README.md), [Ticket and Dynamic Fields](../006.%20Tickets%20and%20Dynamic%20Fields/README.md), [API v0](../007.%20Audit%20and%20API%20Contracts/README.md).
