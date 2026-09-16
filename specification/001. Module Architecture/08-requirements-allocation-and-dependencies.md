# 8. Requirements Allocation and Dependencies

## 8.1 Ownership Allocation

| Architectural owner     | Required ownership                                                                                                                                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `foundation`            | Domain-neutral shared primitives and contracts plus third-party libraries intentionally established as common technical dependencies across Taskmigo modules.                                                       |
| `language`              | Language syntax, compilation, typing, Semantic AST, evaluation, partial evaluation, and language diagnostics.                                                                                                       |
| `query`                 | Query Schema and Predicate contracts, `FilteredQuery`, `filterBy` compilation, and query validation.                                                                                                                |
| `access-control`        | Access Control bounded context: Role lifecycle and hierarchy, Statement lifecycle, subject bindings, authorization context and state, Request Authorization, Object Authorization, and policy evaluation semantics. |
| `identity`              | Identity bounded context: User, Group, Membership, group hierarchy, identity lifecycle, identity-resource query integration, and published subject-resolution adaptation for Access Control.                        |
| `database`              | Shared persistence infrastructure without bounded-context resource ownership.                                                                                                                                       |
| `web`                   | HTTP, Spring MVC, Spring Security, and public web error adaptation.                                                                                                                                                 |
| Executable applications | Composition of published contracts for one runnable application.                                                                                                                                                    |

Role, Statement, Role hierarchy, Role-to-Statement assignment, and subject-to-Role or subject-to-Statement binding semantics SHALL be owned by `access-control`. Identity resources SHALL refer to Access Control concepts only through published Access Control contracts or opaque identifiers required by those contracts.

## 8.2 Allowed Dependency Model

The following Taskmigo project-module dependency relationships are permitted when required by the owning specification:

| Consumer                | Permitted architectural dependencies                                                                                                         |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `foundation`            | None on other Taskmigo modules.                                                                                                              |
| `language`              | `foundation`.                                                                                                                                |
| `database`              | `foundation`.                                                                                                                                |
| `query`                 | `foundation` • `language`.                                                                                                                   |
| `access-control`        | `foundation` • `language` • `query` when Access Control resources expose Query Filtering • `database` for owned persistence.                 |
| `identity`              | `foundation` • `query` • `access-control` published interfaces • `database` • `language` only when a direct capability contract requires it. |
| `web`                   | `foundation` • Supporting capabilities • Bounded-context modules • Infrastructure modules required for web adaptation.                       |
| Executable applications | Reusable modules required to compose that application.                                                                                       |

A permitted dependency is not a requirement to declare that dependency. Each module SHALL declare only dependencies needed by its owned behavior.

An SPI declared by `access-control` and implemented by `identity` does not create a reverse `access-control` → `identity` project dependency. The interface SHALL be owned and published by `access-control`; the Identity adapter SHALL depend on that interface and be discovered or wired by executable composition.

Third-party libraries intentionally exposed through `foundation` under [ARCH-CON-003](07-constraints.md#arch-con-003--shared-foundation-dependencies) are shared technical dependencies and do not create additional Taskmigo project-module edges.

For [Spring Modulith](https://docs.spring.io/spring-modulith/reference/) application modules, `@ApplicationModule(allowedDependencies = ...)` declarations SHALL encode a subset of this table and SHALL NOT widen the permitted dependency model.

## 8.3 Prohibited Dependencies

The following relationships SHALL be prohibited:

- `foundation` SHALL NOT depend on any higher-level Taskmigo module.
- `language` SHALL NOT depend on its consumers.
- `query` SHALL NOT depend on `access-control`, `identity`, `web`, or application modules.
- `access-control` SHALL NOT depend on `identity`, `web`, an executable application, or another resource context's private domain or persistence packages.
- `database` SHALL NOT become dependent on bounded-context modules to obtain resource-specific domain semantics.
- Bounded contexts SHALL NOT create project cycles or use private-package imports to simulate bidirectional ownership.
- Bounded contexts SHALL NOT use another context's persistence tables or ORM entities as their integration API.
- `web` SHALL NOT be required by reusable lower-level modules.
- Executable applications SHALL NOT be required by reusable modules.
- Spring Modulith application modules SHALL NOT reference another module's internal packages or use open-module configuration to bypass the allowed dependency model.
- Domain packages SHALL NOT depend outward on application, infrastructure, web, or executable application packages when tactical DDD package layers are present.

Verification: Generate or inspect the project dependency graph, Spring Modulith module model, and ArchUnit tactical-layer rules and confirm every edge is permitted by [Section 8.2](#82-allowed-dependency-model) and no relationship prohibited by this section exists.
Traceability: [Constraints](07-constraints.md).

## 8.4 Cross-Specification Allocation

- [Authorization](../002.%20Authorization/README.md) SHALL allocate authorization behavior to the Access Control bounded context, including Role lifecycle, Role hierarchy, Statement lifecycle, subject bindings, policy evaluation, Request Authorization, and Object Authorization contracts.
- [Language](../003.%20Language/README.md) SHALL allocate Language behavior to `language` and consumer semantics to the consuming bounded context or capability.
- [Query Filtering](../004.%20Query%20Filtering/README.md) SHALL allocate Query Filtering contracts and compilation to `query`, resource-specific schemas and persistence mappings to the resource-owning bounded context, and Spring MVC adaptation to `web`.
- Identity implementations SHALL own User, Group, Membership, and identity-resource behavior while implementing Access Control subject-resolution ports without redefining Access Control semantics.
- Future feature specifications SHALL identify their bounded-context or supporting-capability owner and dependencies consistently with this specification.

## 8.5 Context Integration Model

The following relationships are normative:

| Provider        | Consumer                         | Integration style                                                                                             | Contract ownership                                                                    |
| --------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Access Control  | Identity                         | Synchronous published API for Role and subject-binding operations when required by Identity-facing use cases. | Access Control.                                                                       |
| Access Control  | Identity adapter                 | Access-Control-owned subject-resolution SPI implemented by Identity.                                          | Access Control interface; Identity implementation.                                    |
| Language        | Access Control / Query           | Consumer-neutral compilation, Semantic AST, evaluation, or partial-evaluation contracts.                      | Language.                                                                             |
| Query           | Resource-owning contexts         | Typed Query Predicate contracts and compilation.                                                              | Query for generic contracts; resource context for schema and persistence translation. |
| Bounded context | Independent side-effect consumer | Published integration event when synchronous coupling is unnecessary.                                         | Event-producing bounded context.                                                      |

A context MAY maintain a local projection derived from another context's events. The projection is owned by the consuming context and SHALL NOT be treated as authoritative state for the producing context's invariants.

## 8.6 Enforcement Allocation

The architecture constraints SHALL be allocated to enforcement mechanisms as follows:

| Concern                                                               | Primary enforcement                                                                                   |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Physical Taskmigo project dependencies                                | Build dependency graph plus specification review.                                                     |
| Bounded-context cycles and access to module internals                 | Spring Modulith verification.                                                                         |
| Explicit module dependencies and published named interfaces           | Spring Modulith `@ApplicationModule(allowedDependencies = ...)`, `@NamedInterface`, and verification. |
| Tactical domain/application/infrastructure dependency direction       | ArchUnit architecture rules.                                                                          |
| Package boundaries inside one physical module not fully modeled above | ArchUnit architecture rules.                                                                          |
| Cross-context persistence isolation                                   | Architecture tests plus repository and schema-ownership verification.                                 |

ArchUnit rules MAY duplicate a critical Spring Modulith boundary as defense in depth, but they SHALL NOT be used as a substitute for declaring a representable Spring Modulith application-module boundary.
