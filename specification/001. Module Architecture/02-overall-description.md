# 2. Overall Description

## 2.1 Architectural Context

Taskmigo SHALL organize domain semantics by bounded context before mapping those semantics to physical build modules, packages, databases, framework adapters, or executable applications. A physical module name MAY remain stable while its role is clarified by the bounded-context model.

The architecture distinguishes domain contexts from reusable supporting capabilities and technical modules. Domain contexts own business terminology, invariants, aggregates, lifecycle behavior, and resource-specific persistence. Supporting capabilities provide reusable semantic models without inheriting ownership of the business resources that consume them. Technical modules provide framework, persistence, or composition facilities without becoming domain owners.

Logical boundaries are enforced primarily with [Spring Modulith](https://docs.spring.io/spring-modulith/reference/). [ArchUnit](https://www.archunit.org/getting-started) supplements that model for tactical layer dependencies, package boundaries that coexist within one physical build module, and architectural package rules that require additional static checks.

## 2.2 Domain and Module Categories

### 2.2.1 Access Control Bounded Context

The Access Control bounded context SHALL be implemented by the `access-control` module. The existing Authorization API namespace MAY remain `io.taskmigo.authorization`; the physical module identity reflects the bounded context rather than the narrower operation name. Access Control owns authorization policy semantics, Role, Statement, Role hierarchy, Role binding, effective authorization state, Request Authorization decisions, Object Authorization predicates, and authorization-specific Language integration.

Role is part of the Access Control ubiquitous language. Its lifecycle, persistence contract, hierarchy invariants, and policy aggregation semantics SHALL have one canonical owner in Access Control rather than being divided between Access Control and Identity.

### 2.2.2 Identity Bounded Context

The Identity bounded context SHALL be implemented by the `identity` module unless a future specification intentionally changes the physical mapping. Identity owns users, groups, membership relationships, identity-resource lifecycle, identity-resource query schemas, and identity-resource persistence translation.

Identity MAY consume Access Control published contracts to bind Roles to identity subjects or to expose coordinated application use cases. Identity SHALL NOT redefine Role, Statement, policy aggregation, or Role hierarchy semantics.

### 2.2.3 Reusable Supporting Capabilities

The following reusable capabilities remain independently owned but SHALL NOT be modeled as business bounded contexts merely to apply tactical DDD patterns:

- `language` owns Language syntax, compilation modes and profiles, typing, Semantic AST, evaluation, partial evaluation, and language diagnostics.
- `query` owns Query Schemas, Query Fields, Query Paths, Query Predicates, `FilteredQuery`, `filterBy` compilation, and query validation.

Language and Query Filtering SHALL remain consumer-neutral. Their consumers own resource-specific schemas, adapters, and persistence translations.

### 2.2.4 Shared Technical Modules

`foundation` is the dependency floor and shared technical library. It contains feature-neutral primitives and contracts. It MAY re-export a third-party library only when that library is intentionally established as a project-wide common technical dependency.

`database` owns shared persistence infrastructure that is not specific to one bounded context or resource. Domain entities, aggregate repositories, resource-specific mappings, and domain query translation SHALL remain with their owning context.

### 2.2.5 Adapter and Application Modules

`web` owns HTTP, Spring MVC, Spring Security, and public error adaptation. The executable applications `web`, `worker`, and `migration` are driving/composition roots. They compose published domain, supporting-capability, infrastructure, and adapter contracts without becoming canonical owners of reusable domain semantics.

## 2.3 Context Map

The normative semantic relationships are:

```text
                         ┌────────────────────┐
                         │       web          │
                         │ inbound adaptation │
                         └─────────┬──────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
          ┌──────────────────┐          ┌──────────────────┐
          │     Identity     │          │  Access Control  │
          │ User / Group /   │─────────▶│ Role / Statement │
          │ Membership       │ published│ Policy / Decision│
          └────────┬─────────┘ contract └────────┬─────────┘
                   │                             │
                   ▼                             ▼
                query                         language
                   │                             │
                   └─────────────┬───────────────┘
                                 ▼
                    shared technical modules
                    foundation / database
```

The diagram describes semantic ownership rather than requiring every illustrated relationship to be a direct build dependency. The normative dependency model is defined in [Section 8.2](08-requirements-allocation-and-dependencies.md#82-allowed-dependency-model).

Future product domains such as task, project, workspace, or notification SHALL be introduced as independent bounded contexts when they own distinct business terminology, invariants, lifecycle, or persistence. They SHALL integrate through published contracts or events and SHALL NOT obtain ownership by placing code in `foundation`, `database`, or application modules.

## 2.4 Tactical DDD Model

A bounded context containing state-changing domain behavior SHALL combine DDD tactical modeling with Onion Architecture and Hexagonal Architecture. Code dependencies SHALL point toward domain/application-owned contracts rather than from inner behavior toward outer technical implementations.

```text
driving adapter ──▶ inbound port ◀── application service ──▶ domain
                                         │
                                         ▼
                                    outbound port ◀── driven adapter

composition root wires the concrete implementations
```

The package names MAY vary when an equivalent enforceable structure is used. The following responsibilities SHALL remain distinct:

- The domain layer owns aggregates, entities, value objects, domain services, and domain policies required to express invariants and SHALL remain framework-neutral.
- The application layer owns use-case orchestration, inbound ports, outbound ports, transaction semantics, and publication of completed outcomes without owning domain invariants.
- Driving adapters translate external protocols or triggers into inbound-port calls and SHALL NOT depend on concrete application-service implementations or driven adapters.
- Driven adapters implement outbound ports or adapt core-owned contracts to persistence, cross-context integration, messaging, framework, and external-system concerns without defining domain invariants. Adapter-local technical helpers MAY exist inside the driven adapter when they do not leak back into domain/application contracts.
- Composition roots wire inbound ports to application services and outbound ports to driven adapters and MAY depend on concrete framework types required for composition. Executable applications MAY also host runtime-specific driven adapters when they implement published outbound ports required by a bounded context.
- Spring transaction managers, transaction templates, ORM APIs, and equivalent mechanics SHALL remain outside the framework-neutral application core; the application SHALL own required atomicity, isolation, retry, and post-commit semantics through plain orchestration or an application-owned transaction port.

Reusable supporting capabilities such as `language` and `query` MAY use a capability-appropriate internal structure instead of artificial aggregate, repository, port, or adapter abstractions when no such boundary exists.

## 2.5 Aggregate and Persistence Ownership

An aggregate and its state-changing invariants SHALL have exactly one owning bounded context. Another context MAY refer to the aggregate through an opaque identifier, a published contract, or an integration event but SHALL NOT mutate the aggregate through shared persistence structures.

Persistence topology is an implementation detail of the owning context. Closure tables, JPA entities, database indexes, join tables, cache keys, and similar structures SHALL NOT define the ubiquitous language unless the owning domain specification explicitly makes the concept part of domain semantics.

A bounded context SHALL NOT use direct reads, joins, foreign-key navigation through ORM mappings, or writes against another context's private persistence tables as an integration contract.

## 2.6 Architectural Boundary Test

A Taskmigo-owned type is a candidate for `foundation` only when its meaning remains valid after removing any one domain context or reusable supporting capability from the product.

A third-party library is a candidate for shared distribution through `foundation` only when it is intentionally part of the common technical baseline for multiple modules and does not introduce domain ownership into `foundation`.

Domain terminology, aggregate behavior, lifecycle rules, policy semantics, query semantics, framework adaptation, resource-specific persistence, and cross-context integration logic fail this boundary test and SHALL be owned outside `foundation`.

## 2.7 Boundary Enforcement Model

A physical build module, bounded context, and Spring Modulith application module do not need to map one-to-one. Taskmigo SHALL use Spring Modulith for every bounded-context or logical application-module boundary representable by its module model, allowed-dependency declarations, named interfaces, event publication, and verification rules.

ArchUnit SHALL enforce Onion/Hexagonal dependency direction, port/adapter restrictions, framework neutrality, and any package restrictions not fully represented by Spring Modulith. ArchUnit supplements rather than replaces Spring Modulith for boundaries Spring Modulith can represent.
