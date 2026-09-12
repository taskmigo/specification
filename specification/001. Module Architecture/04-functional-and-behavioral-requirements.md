# 4. Functional and Behavioral Requirements

## 4.1 Foundation Ownership

### ARCH-MOD-001 — Foundation role

`foundation` SHALL be a shared physical library containing only feature-neutral Taskmigo-owned primitives and contracts.

`foundation` SHALL NOT act as the repository's third-party dependency distribution mechanism. Cross-cutting build and tooling dependencies SHALL be supplied through build conventions, while runtime or capability dependencies SHALL be declared by the module that owns the behavior requiring them.

Verification: Inspect `foundation` exports and dependency declarations, remove each feature capability conceptually from the architecture, and confirm every Taskmigo-owned exported contract remains meaningful and no unrelated build/tooling dependency is re-exported through `foundation`.
Traceability: [Architectural Boundary Test](02-overall-description.md#24-architectural-boundary-test); [Foundation constraints](07-constraints.md#71-foundation-constraints).

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

## 4.5 Build Convention Ownership

### ARCH-MOD-012 — Build convention ownership

Cross-cutting Java build behavior shared by multiple Taskmigo projects SHALL be owned by repository build logic implemented as reusable Gradle convention plugins or an equivalent centrally maintained mechanism.

The shared convention layer SHALL include the Java language/toolchain baseline, nullness annotation availability, Error Prone and NullAway configuration, formatting, style checks, and common architecture-test tooling defined by [Section 12](12-build-conventions-and-tooling-baseline.md).

Verification: Inspect representative module build files and confirm repeated build-tool configuration is supplied by the convention layer rather than copied into every module.
Traceability: [Build Convention Layer](02-overall-description.md#225-build-convention-layer); ARCH-CON-013.

### ARCH-MOD-013 — Dependency declaration expresses ownership

A Taskmigo project dependency SHALL exist because the consumer uses a semantic, infrastructure, resource, or adapter contract owned by that project. A project dependency SHALL NOT be introduced solely to inherit unrelated third-party build/tool dependencies.

Third-party libraries required by runtime or feature behavior SHALL be declared by the owning module with the narrowest correct Gradle scope. Cross-cutting build-only dependencies SHALL be applied through build conventions.

Verification: Inspect project dependencies and representative third-party declarations and confirm project edges reflect Taskmigo ownership rather than dependency-distribution convenience.
Traceability: ARCH-MOD-001; [Dependency scope discipline](07-constraints.md#arch-con-014--dependency-scope-discipline).
