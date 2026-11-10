# 8. Requirements Allocation and Dependencies

Ticket owns its external behavior; internal EAV and JPA Query implement reusable technical primitives. Neither internal module becomes an independently exposed Web API.

## 8.1 Owning Implementations

- **Ticket domain/application:** Type lifecycle, common Ticket fields, API-facing use cases, version pinning.
- **Internal EAV:** Schema version lifecycle, typed field metadata, typed field values, validation, query field catalog.
- **Query:** Operation-scoped logical fields, compiler, sort and predicate model.
- **Internal JPA Query:** Trusted JPA field binding and order specifications.
- **Authorization:** Request/Object policies and compiled Object Authorization predicate.
- **Web:** Versioned HTTP controllers, request validation, response serialization and runtime query-field resolver.

## 8.2 Dependency Model

`:modules:ticket` SHALL depend on public Query and Authorization contracts and MAY use `:modules:internal:eav`/`:modules:internal:jpa-query` as implementation dependencies. `:apps:web` SHALL use Ticket's published application services without directly importing EAV internals.

## 8.3 Operation Schema Ownership

Ticket SHALL own list/read/update query schemas; the Web `TicketQueryFieldContextSource` SHALL select global, Type-scoped, or per-Ticket contexts based on the matched operation. The Query and EAV modules SHALL NOT import Ticket-specific domain models.

## 8.4 Related Specifications

- [Architecture](../001.%20Module%20Architecture/README.md).
- [Query Filtering](../004.%20Query%20Filtering/README.md).
- [Authorization](../002.%20Authorization/README.md).
- [API Contracts](../007.%20Audit%20and%20API%20Contracts/README.md).
