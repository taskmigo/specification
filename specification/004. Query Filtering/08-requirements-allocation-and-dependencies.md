# 8. Requirements Allocation and Dependencies

## 8.1 Assumptions and Dependencies

- [Embedded Language](../003.%20Embedded%20Language/README.md) defines expression syntax, Semantic AST, typing, profiles, quantifiers, and evaluation semantics.
- [Authorization](../002.%20Authorization/README.md) may produce `QueryPredicate<Q>` for Object Authorization.
- Resource-owning modules define Query Schemas and persistence mappings for their API query surfaces.
- `web` owns HTTP extraction, Spring MVC argument resolution, and public HTTP error representation.

## 8.2 Requirements Allocation

- Query Filtering SHALL define the Query Schema/Query Predicate contracts, compile `filterBy`, and provide logical predicate composition.
- Embedded Language SHALL own expression syntax, typing, Semantic AST, quantifier semantics, and evaluation/partial-evaluation behavior.
- Authorization SHALL own Object Authorization policy semantics and MAY produce Query Predicates through the shared Query Filtering contract.
- Resource-owning modules SHALL provide Query Schemas and map logical paths/predicates to persistence.
- `web` SHALL resolve generic MVC query arguments and MAY invoke Authorization/Query Filtering APIs.
- Query Filtering SHALL NOT own Authorization decisions or resource-specific persistence topology.
