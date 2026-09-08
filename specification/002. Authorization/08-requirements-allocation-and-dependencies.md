# 8. Requirements Allocation and Dependencies

## 8.1 Assumptions and Dependencies

- [Embedded Language](../003.%20Embedded%20Language/README.md) defines language syntax, profiles, Semantic AST, typing, intrinsics, evaluation, and partial evaluation.
- [Query Filtering](../004.%20Query%20Filtering/README.md) defines Query Contracts, Query Schemas, Query Predicates, predicate composition, and persistence integration.
- Statement policy uses `PROGRAM` mode with an Authorization-owned Compilation Profile.
- `target.api` is the only authorization target shape defined here.
- The database is authoritative for effective authorization state.
- Request and Object Authorization share one operation-scoped authorization context.

## 8.2 Requirements Allocation

- Authorization SHALL define Statement policy semantics, resolve effective authorization state, and produce Object Authorization Query Predicates.
- Embedded Language SHALL parse, type, evaluate, and partially evaluate policy source.
- Query Filtering SHALL define the public Query Schema/Query Predicate contracts and client `filterBy` compilation.
- Resource-owning modules SHALL provide Query Schemas and map logical predicates to persistence.
- `web` SHALL adapt Spring Security/MVC and MAY invoke Authorization and Query Filtering public APIs.
- Authorization SHALL NOT own client `filterBy` compilation or logical-to-persistence field mappings.
- Embedded Language SHALL NOT own queryability, persistence mappings, or Authorization decision semantics.
