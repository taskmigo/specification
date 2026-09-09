# 8. Requirements Allocation and Dependencies

## 8.1 Ownership Allocation

| Module                  | Required ownership                                                                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `foundation`            | Framework-neutral primitives and contracts that pass the architectural boundary test.                                                                         |
| `language`              | Language syntax, compilation, typing, Semantic AST, evaluation, partial evaluation, and language diagnostics.                                                 |
| `query`                 | Query Schema and Predicate contracts, `FilteredQuery`, `filterBy` compilation, and query validation.                                                          |
| `authorization`         | Authorization context and state, Statement semantics, Request Authorization, Object Authorization contracts, and authorization-specific language integration. |
| `identity`              | User, group, membership, and identity-resource semantics plus resource-specific query and persistence integration.                                            |
| `database`              | Shared persistence infrastructure without resource-specific domain ownership.                                                                                 |
| `web`                   | HTTP, Spring MVC, Spring Security, and public web error adaptation.                                                                                           |
| Executable applications | Composition of published module contracts for one runnable application.                                                                                       |

## 8.2 Allowed Dependency Model

The following dependency relationships are permitted by this architecture when required by the owning feature specification:

| Consumer                | Permitted architectural dependencies                                                                                   |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `foundation`            | None on other Taskmigo modules.                                                                                        |
| `language`              | `foundation`.                                                                                                          |
| `database`              | `foundation`.                                                                                                          |
| `query`                 | `foundation` • `language`.                                                                                             |
| `authorization`         | `foundation` • `language`.                                                                                             |
| `identity`              | `foundation` • `query` • `authorization` • `database` • `language` only when a direct capability contract requires it. |
| `web`                   | `foundation` • Capability modules • Resource-owning modules • Infrastructure modules required for web adaptation.      |
| Executable applications | Reusable modules required to compose that application.                                                                 |

A permitted dependency is not a requirement to declare that dependency. Each module SHALL declare only dependencies needed by its owned behavior.

## 8.3 Prohibited Dependencies

The following relationships SHALL be prohibited:

- `foundation` SHALL NOT depend on any higher-level Taskmigo module.
- `language` SHALL NOT depend on its consumers.
- `query` SHALL NOT depend on `authorization`, `identity`, `web`, or application modules.
- `authorization` SHALL NOT depend on `query`, `identity`, `web`, or application modules for core authorization semantics.
- `database` SHALL NOT become dependent on resource modules to obtain resource-specific domain semantics.
- Resource-owning modules SHALL NOT create dependency cycles with `query`, `authorization`, `database`, or `foundation`.
- `web` SHALL NOT be required by reusable lower-level modules.
- Executable applications SHALL NOT be required by reusable modules.

Verification: Generate or inspect the project dependency graph and confirm every edge is permitted by [Section 8.2](#82-allowed-dependency-model) and no relationship prohibited by this section exists.
Traceability: [Constraints](07-constraints.md).

## 8.4 Cross-Specification Allocation

- [Authorization](../002.%20Authorization/README.md) SHALL allocate Authorization-owned behavior to `authorization`, resource-specific Object Authorization schemas and binders to the owning resource module, and web adaptation to `web`.
- [Language](../003.%20Language/README.md) SHALL allocate its language behavior to `language` and consumer semantics to the consuming capability.
- [Query Filtering](../004.%20Query%20Filtering/README.md) SHALL allocate Query Filtering contracts and compilation to `query`, resource-specific schemas and persistence mappings to the resource-owning module, and Spring MVC adaptation to `web`.
- Future feature specifications SHALL identify their owning module and dependencies consistently with this specification.
