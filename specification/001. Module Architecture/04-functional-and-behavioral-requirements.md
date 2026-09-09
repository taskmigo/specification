# 4. Functional and Behavioral Requirements

## 4.1 Foundation Ownership

### ARCH-MOD-001 — Foundation role

`foundation` SHALL contain only framework-neutral primitives and contracts whose meaning remains valid independently of any one Taskmigo feature capability.

Verification: Remove each feature capability conceptually from the architecture and confirm every exported `foundation` contract remains meaningful without that feature.
Traceability: [Architectural Boundary Test](02-overall-description.md#24-architectural-boundary-test).

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
