# 8. Requirements Allocation and Dependencies

## 8.1 Assumptions and Dependencies

- [Embedded Language](../003.%20Embedded%20Language/README.md) defines expression syntax, Semantic AST, typing, profiles, quantifiers, and evaluation semantics.
- [Authorization](../002.%20Authorization/README.md) may produce `QueryPredicate<Q>` for Object Authorization.
- Resource-owning modules define Query Schemas and persistence mappings for their API query surfaces.
- `web` owns HTTP extraction, Spring MVC argument resolution, and public HTTP error representation.

## 8.2 Requirements Allocation

| Responsibility                                      | Query Filtering | Embedded Language | Authorization | Resource Module | Web |
| --------------------------------------------------- | --------------- | ----------------- | ------------- | --------------- | --- |
| Define expression syntax/typing                     | SHALL NOT       | SHALL             | SHALL NOT     | SHALL NOT       | SHALL NOT |
| Define API-visible Query Schema                     | SHALL contract  | SHALL NOT         | SHALL NOT     | SHALL provide   | SHALL NOT |
| Compile `filterBy`                                  | SHALL           | SHALL execute     | SHALL NOT     | SHALL NOT       | MAY invoke |
| Produce Object Authorization predicate              | SHALL contract  | SHALL support     | SHALL         | SHALL NOT       | MAY invoke |
| Compose logical predicates                          | SHALL           | SHALL NOT         | MAY invoke    | MAY invoke      | MAY invoke |
| Map logical paths to persistence                    | SHALL contract  | SHALL NOT         | SHALL NOT     | SHALL            | SHALL NOT |
| Resolve generic MVC query argument                  | SHALL contract  | SHALL NOT         | MAY provide input | SHALL NOT    | SHALL |
