# 8. Requirements Allocation and Dependencies

## 8.1 Assumptions and Dependencies

- [Embedded Language](../003.%20Embedded%20Language/README.md) defines language syntax, profiles, Semantic AST, typing, intrinsics, evaluation, and partial evaluation.
- [Query Filtering](../004.%20Query%20Filtering/README.md) defines Query Contracts, Query Schemas, Query Predicates, predicate composition, and persistence integration.
- Statement policy uses `PROGRAM` mode with an Authorization-owned Compilation Profile.
- `target.api` is the only authorization target shape defined here.
- The database is authoritative for effective authorization state.
- Request and Object Authorization share one operation-scoped authorization context.

## 8.2 Requirements Allocation

| Responsibility                                  | Authorization | Embedded Language | Query Filtering | Web/Resource |
| ----------------------------------------------- | ------------- | ----------------- | --------------- | ------------ |
| Define Statement policy semantics               | SHALL         | SHALL NOT         | SHALL NOT       | SHALL NOT    |
| Parse/type/evaluate policy language              | SHALL invoke  | SHALL             | SHALL NOT       | SHALL NOT    |
| Resolve effective authorization state           | SHALL         | SHALL NOT         | SHALL NOT       | SHALL NOT    |
| Define API-visible Query Schema                 | SHALL NOT     | SHALL NOT         | SHALL contract  | SHALL provide|
| Produce Object Authorization Query Predicate    | SHALL         | SHALL support     | SHALL contract  | MAY invoke   |
| Compile client `filterBy`                       | SHALL NOT     | SHALL support     | SHALL           | MAY invoke   |
| Map logical predicate to persistence            | SHALL NOT     | SHALL NOT         | SHALL contract  | SHALL        |
| Adapt Spring Security/MVC                       | SHALL contract| SHALL NOT         | SHALL contract  | SHALL        |
