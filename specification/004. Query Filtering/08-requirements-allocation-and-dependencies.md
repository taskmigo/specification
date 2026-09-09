# 8. Requirements Allocation and Dependencies

## 8.1 Assumptions and Dependencies

- [Module Architecture](../001.%20Module%20Architecture/README.md) defines the mandatory dependency direction and module ownership constraints for Query Filtering and its consumers.
- [Language](../003.%20Language/README.md) defines expression syntax, Semantic AST, typing, Compilation Profiles, collection intrinsics, and evaluation semantics.
- Resource-owning modules define Query Schemas and persistence mappings for their API query surfaces.
- `web` owns HTTP extraction, Spring MVC argument resolution, and public HTTP error representation.

## 8.2 Requirements Allocation

- The `query` module SHALL define Query Schema and Query Predicate contracts, `FilteredQuery`, `filterBy` compilation, and query validation.
- The `query` module MAY depend on `foundation` and `language` as permitted by [Module Architecture](../001.%20Module%20Architecture/08-requirements-allocation-and-dependencies.md#82-allowed-dependency-model).
- The `query` module SHALL NOT depend on `authorization`, `identity`, `web`, or resource-specific persistence modules.
- The `language` module SHALL own Language expression syntax, typing, Semantic AST, quantifier semantics, and evaluation behavior.
- Resource-owning modules SHALL provide resource-specific Query Schemas and translate Query Predicates to persistence queries.
- `web` SHALL resolve generic `FilteredQuery<Q>` arguments and public client-input errors.
- Query Filtering SHALL NOT own resource-specific persistence topology.
- The `language` module SHALL NOT own Query Schema registration or persistence mappings.
