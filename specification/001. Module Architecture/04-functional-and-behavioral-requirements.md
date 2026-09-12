# 4. Functional and Behavioral Requirements

## 4.1 Foundation Ownership

### ARCH-MOD-001 — Foundation role

`foundation` SHALL be a shared physical library containing only feature-neutral Taskmigo primitives and contracts plus third-party libraries intentionally established as common dependencies for multiple Taskmigo modules.

`foundation` MAY expose those common third-party libraries transitively to consuming modules. It SHALL NOT use dependency sharing as a reason to own capability-specific semantics, resource contracts, adapters, or persistence mappings.

Verification: Inspect `foundation` exports and dependency declarations, remove each feature capability conceptually from the architecture, and confirm every Taskmigo-owned exported contract remains meaningful while every re-exported third-party dependency is intentionally part of the common technical baseline.
Traceability: [Architectural Boundary Test](02-overall-description.md#24-architectural-boundary-test); [Shared foundation dependencies](07-constraints.md#arch-con-003--shared-foundation-dependencies).

### ARCH-MOD-002 — Capability ownership

Each independently meaningful capability SHALL own its capability-specific semantics, public contracts, validation rules, and lifecycle behavior outside `foundation`.

Verification: Inspect module ownership for Language, Query Filtering, Authorization, Identity, and future capabilities and confirm feature semantics are not implemented in `foundation`.
Traceability: ARCH-MOD-001; [Standalone Capability Modules](02-overall-description.md#222-standalone-capability-modules).

## 4.2 Named Capability Modules

### ARCH-MOD-003 — Language ownership

`language` SHALL own Language syntax, compilation modes and profiles, type checking, Semantic AST, evaluation, partial evaluation, and language-level diagnostics. Consumer-specific queryability, authorization semantics, persistence mappings, and HTTP behavior SHALL remain outside `language`.

Verification: Inspect the `language` module's Language contracts and dependencies and confirm consumer-specific semantics are external.
Traceability: [Language](../003.%20Language/README.md).

### ARCH-MOD-004 — Query ownership

`query` SHALL own Query Schemas, Query Fields, Query Paths, Query Predicates, Query Predicate composition, `FilteredQuery`, `filterBy` compilation, query validation, and query-specific client-input errors.

Verification: Inspect Query Filtering public contracts and compiler ownership and confirm they are not located in `foundation` or a resource-specific module.
Traceability: [Query Filtering](../004.%20Query%20Filtering/README.md).

### ARCH-MOD-005 — Authorization ownership

`authorization` SHALL own authorization policy semantics, authorization contexts and snapshots, Request Authorization decisions, Statement authorization semantics, Object Authorization Schemas, Object Authorization Predicates, and Authorization-specific Language integration.

Verification: Inspect Authorization public contracts and engine behavior and confirm they are not located in `foundation`, `identity`, or `web`.
Traceability: [Authorization](../002.%20Authorization/README.md).

### ARCH-MOD-006 — Resource persistence ownership

A resource-owning module SHALL own its Query Schemas, Object Authorization Schemas, and trusted translations from Query or Object Authorization Predicates to its persistence model.

Verification: Inspect resource-specific schemas and persistence binders and confirm they are colocated with or explicitly owned by the resource capability rather than by `query`, `authorization`, `foundation`, or `database`.
Traceability: [Resource-owned persistence translation](03-external-interface-requirements.md#arch-if-004--resource-owned-persistence-translation).

### ARCH-MOD-007 — Identity ownership

`identity` SHALL own Taskmigo identity resources such as users, groups, and membership relationships together with their resource-specific persistence and query integration.

Authorization concepts whose meaning is defined by policy evaluation SHALL remain owned by `authorization`, even when they refer to identity resources.

Verification: Inspect identity-resource ownership and confirm authorization-engine semantics are not moved into `identity` merely because they operate on users or groups.
Traceability: ARCH-MOD-005; ARCH-MOD-006.

## 4.3 Adapter and Application Ownership

### ARCH-MOD-008 — Web ownership

`web` SHALL own HTTP and Spring-facing adaptation, including request extraction, Spring MVC argument resolution, public HTTP error representation, and Spring Security integration.

Verification: Inspect capability modules and confirm web-framework adaptation is not required by their public contracts.
Traceability: [Web adapter boundary](03-external-interface-requirements.md#arch-if-003--web-adapter-boundary).

### ARCH-MOD-009 — Application composition

Executable application modules SHALL compose published capability, infrastructure, and adapter contracts and SHALL NOT redefine reusable capability semantics.

Verification: Inspect application-local contracts and confirm reusable semantics are allocated to the appropriate lower-level module.
Traceability: [Composition-only application boundary](03-external-interface-requirements.md#arch-if-005--composition-only-application-boundary).

## 4.4 Logical Module Boundaries

### ARCH-MOD-010 — Spring Modulith application-module model

Each capability, resource, infrastructure, or adapter package boundary that participates in a Spring application and can be represented by [Spring Modulith](https://docs.spring.io/spring-modulith/reference/) SHALL be modeled as a Spring Modulith application module rather than relying only on developer convention.

Verification: Build the Spring Modulith `ApplicationModules` model for each executable application and confirm the expected Taskmigo logical modules are discovered or explicitly declared.
Traceability: [Spring Modulith primary enforcement](07-constraints.md#arch-con-010--spring-modulith-primary-enforcement).

### ARCH-MOD-011 — Published interfaces and explicit dependency contracts

A Spring Modulith application module SHALL expose cross-module types only through its module root package or explicitly declared named interfaces. Its declared allowed Taskmigo module dependencies SHALL be no broader than the relationships permitted by [Section 8.2](08-requirements-allocation-and-dependencies.md#82-allowed-dependency-model).

Verification: Inspect module metadata and verify cross-module references against the Spring Modulith module model.
Traceability: [Explicit interfaces and dependencies](07-constraints.md#arch-con-011--explicit-interfaces-and-dependencies).
