# 8. Requirements Allocation and Dependencies

## 8.1 Ownership Allocation

| Architectural owner | Required ownership                                                                                                                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `foundation`        | Domain-neutral shared primitives and contracts plus third-party libraries intentionally established as common technical dependencies across Taskmigo modules.                                                       |
| `language`          | Language syntax, compilation, typing, Semantic AST, evaluation, partial evaluation, and language diagnostics.                                                                                                       |
| `query`             | Query Schema and Predicate contracts, `FilteredQuery`, `filterBy` compilation, and query validation.                                                                                                                |
| `access-control`    | Access Control bounded context: Role lifecycle and hierarchy, Statement lifecycle, subject bindings, authorization context and state, Request Authorization, Object Authorization, and policy evaluation semantics. |
| `identity`          | Identity bounded context: User, Group, Membership, group hierarchy, identity lifecycle, identity-resource query integration, and published subject-resolution adaptation for Access Control.                        |
| `database`          | Shared persistence infrastructure without bounded-context resource ownership.                                                                                                                                       |
| `web`               | HTTP, Spring MVC, Spring Security, public web error adaptation, and the web executable composition root.                                                                                                            |
| `worker`            | Background-job driving adapters and worker executable composition without reusable domain ownership.                                                                                                                |
| `migration`         | Installation/provisioning driving adapters, migration-local application orchestration, and migration executable composition without reusable bounded-context ownership.                                             |

Role, Statement, Role hierarchy, Role-to-Statement assignment, and subject-to-Role or subject-to-Statement binding semantics SHALL be owned by `access-control`. Identity resources SHALL refer to Access Control concepts only through published Access Control contracts or opaque identifiers required by those contracts.

Non-runtime support projects SHALL remain outside the runtime architectural dependency graph:

- `:testing:architecture` SHALL contain reusable ArchUnit enforcement only, be consumed through test dependencies, and SHALL NOT become a production abstraction.
- `:benchmarks:authorization` SHALL remain a JMH benchmark harness rather than a runtime module. Its current Taskmigo project dependency is `:modules:language`, and benchmark code SHALL NOT establish runtime ownership or dependency direction.

## 8.2 Allowed Dependency Model

The current Taskmigo runtime project graph SHALL match the implemented architecture below. A future project edge change requires a corresponding architectural decision and specification update.

| Consumer         | Current direct Taskmigo project dependencies                                             |
| ---------------- | ---------------------------------------------------------------------------------------- |
| `foundation`     | None.                                                                                    |
| `language`       | None.                                                                                    |
| `database`       | None.                                                                                    |
| `query`          | `foundation` • `language`.                                                               |
| `access-control` | `foundation` • `language` • `query` • `database`.                                        |
| `identity`       | `foundation` • `query` • `access-control` • `database` • `language`.                     |
| `web`            | `foundation` • `query` • `access-control` • `database` • `identity`.                     |
| `worker`         | None on Taskmigo runtime projects until a real background job requires a published port. |
| `migration`      | `database` • `access-control` • `identity`.                                              |

The logical Gradle project `:modules:access-control` MAY remain physically located at `server/modules/authorization`; the Java namespace MAY remain `io.taskmigo.authorization`.

The direct project graph does not grant private-package access. Spring Modulith named interfaces and allowed dependencies SHALL constrain cross-module published contracts, and ArchUnit SHALL constrain package-level Onion/Hexagonal direction.

The current reusable-library exposure SHALL be:

- `:modules:identity` SHALL expose Foundation, Query, and Access Control through Gradle `api` because its published contracts use those types; Database and Language SHALL remain implementation dependencies.
- `:modules:access-control` SHALL expose Foundation, Language, and Query through Gradle `api`; Database and Spring Boot SHALL remain implementation dependencies.
- `:modules:query` SHALL expose Foundation and Language through Gradle `api`.
- `:modules:database` SHALL expose only the Jakarta Persistence API required by its public Criteria helper; Spring Data JPA SHALL remain an implementation dependency.
- Executable applications SHALL use implementation-scoped project dependencies because they are composition leaves rather than reusable libraries.

An outbound subject-resolution port declared by Access Control and implemented by an Identity driven adapter does not create a reverse Access Control → Identity project dependency. Likewise, Access-Control-owned Object Authorization target-resolution ports MAY be implemented by runtime-specific driven adapters in `web` or `migration` without making Access Control depend on either executable application.

Third-party libraries intentionally exposed through `foundation` under [ARCH-CON-003](07-constraints.md#arch-con-003--shared-foundation-dependencies) are shared technical dependencies and do not create additional Taskmigo project-module edges.

For [Spring Modulith](https://docs.spring.io/spring-modulith/reference/) application modules, `@ApplicationModule(allowedDependencies = ...)` declarations SHALL encode no broader access than this graph and the named interfaces actually consumed.

## 8.3 Prohibited Dependencies

The following relationships SHALL be prohibited:

- `foundation` SHALL NOT depend on any higher-level Taskmigo module.
- `language` SHALL NOT depend on its consumers.
- `query` SHALL NOT depend on `access-control`, `identity`, `web`, or application modules.
- `access-control` SHALL NOT depend on `identity`, `web`, an executable application, or another resource context's private domain or persistence packages.
- `database` SHALL NOT depend on Taskmigo bounded-context or supporting-capability projects to obtain resource-specific domain semantics.
- Bounded contexts SHALL NOT create project cycles or use private-package imports to simulate bidirectional ownership.
- Bounded contexts SHALL NOT use another context's persistence tables or ORM entities as their integration API.
- `web` SHALL NOT be required by reusable lower-level modules.
- `web`, `worker`, and `migration` SHALL NOT be required by reusable modules, and `worker` SHALL remain free of Taskmigo runtime-project dependencies until a concrete background-job adapter requires a published port.
- Spring Modulith application modules SHALL NOT reference another module's internal packages or use open-module configuration to bypass the allowed dependency model.
- Domain/application packages and ports SHALL NOT depend outward on concrete driving/driven adapters or executable applications when Onion/Hexagonal package boundaries are present.

Verification: Generate or inspect the project dependency graph, Spring Modulith module model, and ArchUnit tactical-layer rules and confirm every edge is permitted by [Section 8.2](#82-allowed-dependency-model) and no relationship prohibited by this section exists.
Traceability: [Constraints](07-constraints.md).

## 8.4 Cross-Specification Allocation

- [Authorization](../002.%20Authorization/README.md) SHALL allocate authorization behavior to the Access Control bounded context, including Role lifecycle, Role hierarchy, Statement lifecycle, subject bindings, policy evaluation, Request Authorization, and Object Authorization contracts.
- [Language](../003.%20Language/README.md) SHALL allocate Language behavior to `language` and consumer semantics to the consuming bounded context or capability.
- [Query Filtering](../004.%20Query%20Filtering/README.md) SHALL allocate Query Filtering contracts and compilation to `query`, persistence-neutral expression/predicate models to `query :: model`, resource-specific schemas and JPA binding to the resource-owning Identity or Access Control driven adapter, and Spring MVC adaptation to `web`.
- Identity implementations SHALL own User, Group, Membership, and identity-resource behavior while implementing Access Control subject-resolution outbound ports without redefining Access Control semantics.
- Access Control SHALL own Object Authorization's persistence-neutral expression/predicate model and publish it through the `object-model` named interface for resource-owned driven persistence binders.
- Future feature specifications SHALL identify their bounded-context or supporting-capability owner and dependencies consistently with this specification.

## 8.5 Context Integration Model

The following relationships are normative:

| Provider        | Consumer                         | Integration style                                                                                             | Contract ownership                                                                    |
| --------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Access Control  | Identity                         | Synchronous published API for Role and subject-binding operations when required by Identity-facing use cases. | Access Control.                                                                       |
| Access Control  | Identity driven adapter          | Access-Control-owned subject-resolution outbound port implemented from Identity-owned state.                  | Access Control port; Identity implementation.                                         |
| Access Control  | Web driven adapter               | Access-Control-owned Object Authorization target-resolution port implemented from Spring MVC route metadata.  | Access Control port; Web implementation.                                              |
| Access Control  | Migration driven adapter         | Access-Control-owned Object Authorization target-resolution port implemented from migration-known routes.     | Access Control port; Migration implementation.                                        |
| Language        | Access Control / Query           | Consumer-neutral compilation, Semantic AST, evaluation, or partial-evaluation contracts.                      | Language.                                                                             |
| Query           | Resource-owning contexts         | Typed Query Predicate contracts and compilation.                                                              | Query for generic contracts; resource context for schema and persistence translation. |
| Bounded context | Independent side-effect consumer | Published integration event when synchronous coupling is unnecessary.                                         | Event-producing bounded context.                                                      |

A context MAY maintain a local projection derived from another context's events. The projection is owned by the consuming context and SHALL NOT be treated as authoritative state for the producing context's invariants.

## 8.6 Enforcement Allocation

The architecture constraints SHALL be allocated to enforcement mechanisms as follows:

| Concern                                                               | Primary enforcement                                                                                   |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Physical Taskmigo project dependencies                                | Build dependency graph plus specification review.                                                     |
| Gradle `api` versus `implementation` exposure                         | Build configuration plus published-contract inspection.                                               |
| Bounded-context cycles and access to module internals                 | Spring Modulith verification.                                                                         |
| Explicit module dependencies and published named interfaces           | Spring Modulith `@ApplicationModule(allowedDependencies = ...)`, `@NamedInterface`, and verification. |
| DDD + Onion + Hexagonal domain/application/port/adapter direction     | ArchUnit architecture rules.                                                                          |
| Driving/driven adapter and framework-neutral application boundaries   | ArchUnit architecture rules.                                                                          |
| Package boundaries inside one physical module not fully modeled above | ArchUnit architecture rules.                                                                          |
| Cross-context persistence isolation                                   | Architecture tests plus repository and schema-ownership verification.                                 |

ArchUnit rules MAY duplicate a critical Spring Modulith boundary as defense in depth, but they SHALL NOT be used as a substitute for declaring a representable Spring Modulith application-module boundary.
