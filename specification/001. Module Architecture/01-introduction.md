# 1. Introduction

## 1.1 Purpose

This Software Requirements Specification defines Domain-Driven Design for strategic and tactical ownership, Onion Architecture for inward dependency direction, and Hexagonal Architecture for explicit ports and adapters as the mandatory architecture model for Taskmigo software. It establishes bounded-context ownership, port and adapter direction, the role of shared technical modules, executable composition roots, and automated boundary enforcement.

This document is tailored to the software-requirements information-item guidance in [ISO/IEC/IEEE 29148:2018](https://committee.iso.org/standard/72089.html). It does not claim full conformance to the standard.

## 1.2 Scope

The Module Architecture capability SHALL:

- Define business semantics through bounded contexts and explicit ownership rather than through shared technical modules.
- Define Access Control as the bounded context owning authorization policy, Role, Statement, Role hierarchy, Role binding, Request Authorization, and Object Authorization semantics.
- Define Identity as the bounded context owning users, groups, and membership relationships without owning Access Control Role lifecycle or policy semantics.
- Define Language and Query Filtering as reusable supporting capabilities whose models remain consumer-neutral and do not require artificial aggregate or entity semantics.
- Define `foundation` as the project-wide shared library for feature-neutral primitives, contracts, and third-party libraries intentionally shared across Taskmigo modules.
- Define `database` as shared persistence infrastructure without domain-resource ownership.
- Define `web`, `worker`, and `migration` as the executable driving/composition roots.
- Require domain-oriented bounded contexts to separate domain semantics, application orchestration, inbound and outbound ports, and driving and driven adapters.
- Require cross-context integration through provider-owned published ports, APIs, or events rather than another context's internal packages or persistence tables.
- Require application-owned transaction semantics to remain distinct from Spring or persistence-framework transaction mechanics.
- Use [Spring Modulith](https://docs.spring.io/spring-modulith/reference/) as the primary mechanism for bounded-context and logical application-module boundaries where the architecture is representable by Spring Modulith.
- Use [ArchUnit](https://www.archunit.org/getting-started) as an automated package-boundary linter for tactical layers and package rules that are not fully represented by Spring Modulith.
- Preserve one-way dependency flow from generic shared infrastructure toward specialized domain contexts, adapters, and executable applications.

This specification SHALL NOT require every Java package to map one-to-one to a physical build module. A bounded context MAY occupy one physical module or a logically isolated package boundary when the required ownership and dependency rules remain mechanically enforceable.

## 1.3 Definitions, Acronyms, and Abbreviations

- **Aggregate:** A consistency boundary owned by exactly one bounded context and accessed for state-changing domain behavior through its aggregate root.
- **Application Layer:** The framework-neutral layer that coordinates use cases, transaction semantics, domain objects, inbound ports, outbound ports, and published integration without owning domain invariants.
- **Bounded Context:** A semantic ownership boundary in which domain terms, invariants, lifecycle behavior, and public contracts have one canonical meaning.
- **Context Map:** The normative relationships and dependency directions between Taskmigo bounded contexts and shared capabilities.
- **Domain Event:** A fact emitted by a bounded context to describe a completed domain-significant state transition without exposing internal persistence structures.
- **Domain Layer:** Framework-neutral domain behavior containing aggregates, entities, value objects, domain services, and domain policies. A domain-owned port is exceptional and exists only when a domain-neutral capability is required to express a domain invariant.
- **Composition Root:** The outermost wiring boundary that connects inbound ports to application services and outbound ports to driven adapters while owning framework configuration.
- **Driven Adapter:** An outer adapter that implements an outbound port using persistence, another bounded context, a framework, or an external system.
- **Driving Adapter:** An outer adapter that translates an external trigger or protocol into a call to an inbound port.
- **Executable Application:** One of the runnable composition roots `web`, `worker`, or `migration`.
- **Foundation Library:** The `foundation` physical library that provides feature-neutral shared code and intentionally project-wide third-party library dependencies to consuming modules.
- **Generic or Supporting Capability:** A reusable capability such as Language or Query Filtering whose semantic model supports domain contexts without itself being forced into aggregate-centric modeling.
- **Hexagonal Architecture:** The port-and-adapter model in which application behavior is entered through inbound ports and external dependencies are reached through outbound ports implemented by adapters.
- **Inbound Port:** An application-owned use-case contract invoked by a driving adapter or another authorized consumer.
- **Technical Infrastructure:** Persistence, messaging, framework integration, external systems, and other technical mechanisms. Technical infrastructure SHALL remain outside domain/application ownership and SHALL be reached through driven adapters or composition where a port boundary is required.
- **Onion Architecture:** The inward dependency model in which domain and application code do not depend on outer framework or adapter implementations.
- **Outbound Port:** A dependency contract owned by the core/capability that requires the dependency and implemented or satisfied by a driven adapter. The implementing adapter MAY live in another bounded context or executable application.
- **Physical Module:** A build-level module or produced library, such as a Gradle project or JAR boundary.
- **Published Contract:** A deliberately exposed API, named interface, event contract, or port intended for another bounded context or adapter to consume.
- **Resource-Owning Context:** A bounded context that owns a domain resource and its resource-specific persistence and query translation.
- **Spring Modulith Application Module:** A logical package-based module detected or declared by Spring Modulith and verified as part of an executable application composition.
- **Ubiquitous Language:** The Taskmigo domain terminology whose meaning is canonical within its owning bounded context and SHALL NOT be redefined by another context.

## 1.4 References

- [Spring Modulith reference documentation](https://docs.spring.io/spring-modulith/reference/) defines the application-module model, named interfaces, explicit allowed dependencies, events, and module verification used by this architecture.
- [ArchUnit Getting Started](https://www.archunit.org/getting-started) defines the architecture-test mechanism used for supplemental tactical-layer and package-boundary linting.
- [Authorization](../002.%20Authorization/README.md) defines Access Control authorization semantics and object authorization contracts.
- [Language](../003.%20Language/README.md) defines the standalone expression and policy language.
- [Query Filtering](../004.%20Query%20Filtering/README.md) defines typed client query filtering.

## 1.5 Overview

[Section 2](02-overall-description.md) defines the DDD context model and Onion/Hexagonal tactical model. [Section 4](04-functional-and-behavioral-requirements.md) defines normative context ownership, ports, adapters, and composition responsibilities. [Section 7](07-constraints.md) defines mandatory domain, persistence, dependency, and boundary-enforcement constraints. [Section 8](08-requirements-allocation-and-dependencies.md) defines the normative context map, port ownership, and allowed dependency relationships.
