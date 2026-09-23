# 4. Functional and Behavioral Requirements

## 4.1 Foundation Ownership

### ARCH-MOD-001 — Foundation role

`foundation` SHALL be a shared physical library containing only domain-neutral Taskmigo primitives and contracts plus third-party libraries intentionally established as common dependencies for multiple Taskmigo modules.

`foundation` MAY expose those common third-party libraries transitively to consuming modules. It SHALL NOT use dependency sharing as a reason to own bounded-context semantics, aggregate contracts, resource contracts, adapters, or persistence mappings.

Verification: Inspect `foundation` exports and dependency declarations, remove each domain context or supporting capability conceptually from the architecture, and confirm every Taskmigo-owned exported contract remains meaningful while every re-exported third-party dependency is intentionally part of the common technical baseline.
Traceability: [Architectural Boundary Test](02-overall-description.md#26-architectural-boundary-test); [Shared foundation dependencies](07-constraints.md#arch-con-003--shared-foundation-dependencies).

### ARCH-MOD-002 — Capability ownership

Each bounded context or independently meaningful supporting capability SHALL own its semantics, published contracts, validation rules, and lifecycle behavior outside `foundation`.

A domain concept SHALL have one canonical bounded-context owner. Another context MAY consume the owner's published contract or event but SHALL NOT redefine the concept's domain meaning.

Verification: Inspect ownership for Access Control, Identity, Language, Query Filtering, and future contexts and confirm domain or capability semantics are neither implemented in `foundation` nor duplicated across contexts.
Traceability: ARCH-MOD-001; [Domain and Module Categories](02-overall-description.md#22-domain-and-module-categories).

## 4.2 Named Domain and Supporting Modules

### ARCH-MOD-003 — Language ownership

`language` SHALL own Language syntax, compilation modes and profiles, type checking, Semantic AST, evaluation, partial evaluation, and language-level diagnostics. Consumer-specific queryability, authorization semantics, persistence mappings, aggregate semantics, and HTTP behavior SHALL remain outside `language`.

Language SHALL remain free to use a capability-appropriate internal model and SHALL NOT be required to introduce artificial aggregates, entities, or repositories solely to conform to DDD terminology.

Verification: Inspect the `language` module's Language contracts and dependencies and confirm consumer-specific semantics are external.
Traceability: [Language](../003.%20Language/README.md).

### ARCH-MOD-004 — Query ownership

`query` SHALL own Query Schemas, Query Fields, Query Paths, Query Predicates, Query Predicate composition, `FilteredQuery`, `filterBy` compilation, query validation, and query-specific client-input errors.

Resource-specific query schemas, persistence binders, aggregate repositories, authorization semantics, and lifecycle behavior SHALL remain with the consuming bounded context.

Verification: Inspect Query Filtering public contracts and compiler ownership and confirm resource-specific schemas and persistence behavior are not located in `foundation` or generic Query Filtering implementation.
Traceability: [Query Filtering](../004.%20Query%20Filtering/README.md).

### ARCH-MOD-005 — Access Control ownership

The Access Control bounded context, physically represented by `access-control`, SHALL own authorization policy semantics, authorization contexts and snapshots, Request Authorization decisions, Statement semantics, Object Authorization Schemas and Predicates, Role semantics, Role lifecycle, Role hierarchy rules, Role-to-Statement aggregation, Role binding semantics, and Authorization-specific Language integration.

Role SHALL have one canonical lifecycle and semantic owner in Access Control. Identity, web, application, or future resource contexts SHALL NOT redefine Role lifecycle, hierarchy, policy aggregation, or persistence semantics.

Access Control MAY expose published contracts that allow another bounded context to identify a subject, bind a Role to a subject reference, or coordinate an application use case without importing that context's internal resource model.

Verification: Inspect Role, Statement, authorization-decision, hierarchy, binding, and persistence ownership and confirm Access Control provides the canonical semantics and lifecycle while consumers use only published contracts.
Traceability: [Authorization](../002.%20Authorization/README.md); ARCH-MOD-007; ARCH-MOD-013; ARCH-MOD-014.

### ARCH-MOD-006 — Resource persistence ownership

A resource-owning bounded context SHALL own its resource-specific Query Schemas, Object Authorization Schemas, aggregate repositories, persistence entities or mappings, and trusted translations from Query or Object Authorization Predicates to its persistence model.

Generic `query`, `access-control`, `database`, and `foundation` modules SHALL NOT own another bounded context's resource-specific persistence topology merely because they define a reusable predicate or infrastructure contract consumed by that resource context.

Verification: Inspect resource-specific schemas, repositories, ORM entities, and persistence binders and confirm they are colocated with or explicitly owned by the resource bounded context.
Traceability: [Owner-controlled persistence translation](03-external-interface-requirements.md#arch-if-005--owner-controlled-persistence-translation).

### ARCH-MOD-007 — Identity ownership

The Identity bounded context, physically represented by `identity`, SHALL own Taskmigo identity resources such as users, groups, and membership relationships together with their domain lifecycle, resource-specific persistence, query integration, and identity-specific invariants.

Identity MAY consume Access Control published contracts to represent identity subjects in Role bindings, authorization requests, or coordinated application use cases. Identity SHALL NOT own or persist the canonical Role aggregate, Statement lifecycle, Role hierarchy semantics, or authorization-policy aggregation behavior.

Verification: Inspect identity-resource ownership and confirm User, Group, and Membership behavior remains Identity-owned while Role and Statement behavior remains Access-Control-owned.
Traceability: ARCH-MOD-005; ARCH-MOD-006; [Context Map](02-overall-description.md#23-context-map).

## 4.3 Adapter and Application Ownership

### ARCH-MOD-008 — Web ownership

`web` SHALL own HTTP and Spring-facing adaptation, including request extraction, Spring MVC argument resolution, public HTTP error representation, and Spring Security integration.

Web adapters MAY coordinate published application contracts from multiple bounded contexts but SHALL NOT implement domain invariants or redefine ubiquitous language.

Verification: Inspect bounded-context and supporting-capability modules and confirm web-framework adaptation is not required by their domain contracts.
Traceability: [Web adapter boundary](03-external-interface-requirements.md#arch-if-004--web-adapter-boundary).

### ARCH-MOD-009 — Application composition

The executable application roots `web`, `worker`, and `migration` SHALL compose published bounded-context, supporting-capability, inbound-port, outbound-port, and adapter contracts and SHALL NOT redefine reusable domain semantics. Their composition roots MAY reference concrete adapters and framework configuration only to perform wiring.

Verification: Inspect application-local contracts and confirm reusable domain semantics are allocated to the appropriate owning bounded context.
Traceability: [Composition-only application boundary](03-external-interface-requirements.md#arch-if-007--composition-only-application-boundary).

## 4.4 Logical Module Boundaries

### ARCH-MOD-010 — Spring Modulith application-module model

Each bounded context, supporting capability, infrastructure boundary, or adapter package boundary that participates in a Spring application and can be represented by [Spring Modulith](https://docs.spring.io/spring-modulith/reference/) SHALL be modeled as a Spring Modulith application module rather than relying only on developer convention.

Verification: Build the Spring Modulith `ApplicationModules` model for each executable application and confirm the expected Taskmigo logical modules are discovered or explicitly declared.
Traceability: [Spring Modulith primary enforcement](07-constraints.md#arch-con-010--spring-modulith-primary-enforcement).

### ARCH-MOD-011 — Published interfaces and explicit dependency contracts

A Spring Modulith application module SHALL expose cross-module types only through its module root package or explicitly declared named interfaces. Its declared allowed Taskmigo module dependencies SHALL be no broader than the relationships permitted by [Section 8.2](08-requirements-allocation-and-dependencies.md#82-allowed-dependency-model).

When a consumer requires only one published API or integration contract, the allowed dependency SHOULD target the corresponding named interface rather than the whole module API.

Verification: Inspect module metadata and verify cross-module references against the Spring Modulith module model.
Traceability: [Explicit interfaces and dependencies](07-constraints.md#arch-con-011--explicit-interfaces-and-dependencies).

## 4.5 Tactical DDD Requirements

### ARCH-MOD-012 — Domain, application, and infrastructure responsibilities

A bounded context with state-changing domain behavior SHALL keep domain semantics independent from application orchestration and outer technical implementations by applying Onion Architecture and Hexagonal Architecture.

The domain layer SHALL own domain invariants, aggregates, entities, value objects, domain services, and domain policies. The application layer SHALL own use-case orchestration, inbound ports, outbound ports, and transaction semantics without becoming the owner of domain invariants.

A driving adapter SHALL invoke an inbound port and SHALL NOT depend on the concrete application-service implementation or a driven adapter. A driven adapter SHALL implement or satisfy an outbound port and MAY depend inward on the application/domain contracts required by that port. A composition root SHALL wire those implementations and SHALL NOT become a reusable business-logic owner.

Application-owned transaction requirements such as atomicity, isolation, retry limits, and post-commit publication SHALL remain expressible without importing Spring transaction APIs into the application core. Spring or persistence-framework transaction mechanics SHALL be implemented by a driven adapter or composition-time mechanism behind an application-owned boundary.

Verification: Inspect representative Access Control, Identity, web, and migration use cases and confirm domain/application code remains framework-neutral, adapters point toward ports, and transaction framework mechanics remain outside the application core.
Traceability: [Tactical DDD Model](02-overall-description.md#24-tactical-ddd-model); ARCH-CON-013.

### ARCH-MOD-013 — Aggregate ownership

Each aggregate SHALL have exactly one owning bounded context. State-changing behavior for that aggregate SHALL enter through the aggregate root or an owning domain service when an invariant legitimately spans objects that cannot be modeled inside one aggregate.

Another bounded context SHALL refer to the aggregate through an opaque identifier, published contract, or event and SHALL NOT mutate the aggregate by loading or writing the owner's persistence representation directly.

Verification: Inspect aggregate roots, repositories, and cross-context mutations and confirm one canonical owner and no shared persistence mutation path exist.
Traceability: [Aggregate and Persistence Ownership](02-overall-description.md#25-aggregate-and-persistence-ownership); ARCH-CON-014.

### ARCH-MOD-014 — Cross-context integration

A bounded context SHALL integrate with another bounded context only through a deliberately published inbound port/API, a provider-owned outbound port implemented by the collaborating context, or an integration event. Consumers SHALL NOT import another context's private domain, application, or adapter packages.

Synchronous integration MAY be used when the consuming use case requires an immediate result from the owning context. Event-based integration SHOULD be used for independently evolving side effects, projections, history, notifications, and other behavior that does not require a synchronous domain decision.

Verification: Inspect cross-context calls and event consumers and confirm every dependency targets a published contract and no internal package or private persistence structure is used as an integration API.
Traceability: [Owner-published contracts](03-external-interface-requirements.md#arch-if-002--owner-published-contracts); [Cross-context event contracts](03-external-interface-requirements.md#arch-if-003--cross-context-event-contracts); ARCH-CON-015.

### ARCH-MOD-015 — Domain event ownership

A domain event SHALL be named and emitted by the bounded context that owns the completed domain-significant transition. Cross-context event contracts SHALL expose stable identifiers and outcome data needed by consumers without exposing mutable aggregate internals or private ORM entities.

Publication infrastructure MAY adapt a domain event into an integration event when the external contract requires a different representation.

Verification: Inspect representative domain and integration events and confirm ownership, payload boundaries, and adapter responsibility are explicit.
Traceability: ARCH-IF-003; ARCH-MOD-014.
