# 8. Requirements Allocation and Dependencies

## 8.1 Assumptions and Dependencies

- [Embedded Language](../003.%20Embedded%20Language/README.md) defines expression syntax, Semantic AST, typing, Compilation Profiles, collection intrinsics, and evaluation semantics.
- Resource-owning modules define Query Schemas and persistence mappings for their API query surfaces.
- `web` owns HTTP extraction, Spring MVC argument resolution, and public HTTP error representation.

## 8.2 Requirements Allocation

- Query Filtering SHALL define Query Schema/Query Predicate contracts and compile `filterBy`.
- Embedded Language SHALL own expression syntax, typing, Semantic AST, quantifier semantics, and evaluation behavior.
- Resource-owning modules SHALL provide Query Schemas and translate Query Predicates to persistence queries.
- `web` SHALL resolve generic `FilteredQuery<Q>` arguments and public client-input errors.
- Query Filtering SHALL NOT own resource-specific persistence topology.
- Embedded Language SHALL NOT own Query Schema registration or persistence mappings.
