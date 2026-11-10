# 8. Requirements Allocation and Dependencies

Audit owns storage and scrub; Web owns transport; Identity owns User lifecycle; Authorization owns access decisions. Each uses published contracts.

## 8.1 Owning Modules

- **Audit module:** Event and model contracts, append/query/privacy application services, JPA storage.
- **Identity:** Emits User audit events and invokes privacy scrub after tombstoning.
- **Web:** API v0 response envelope, request execution timing, validation/error mapping, pagination and Audit controller.
- **OpenAPI generator:** Produces generated v0 API documentation from controllers and Query Schema field metadata.
- **Authorization:** Protects API routes and supplies Object Authorization predicates for Audit visibility.

## 8.2 Transaction Dependencies

Audit append/privacy use Spring propagation `MANDATORY`. The application mutation that invokes them SHALL own a transaction. Audit list uses a read-only transaction.

## 8.3 Cross-Feature Interfaces

[User Retention](../005.%20Identity%20and%20User%20Retention/README.md) owns the user deletion lifecycle. [Authorization](../002.%20Authorization/README.md) owns decisions; Audit does not imply a decision log. [Query Filtering](../004.%20Query%20Filtering/README.md) owns `filterBy` and `sortBy` semantics.
