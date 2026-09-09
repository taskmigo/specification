# 7. Constraints

## 7.1 Foundation Constraints

### ARCH-CON-001 — Foundation dependency floor

`foundation` SHALL NOT declare a project dependency on `language`, `query`, `authorization`, `identity`, `database`, `web`, any executable application module, or any future feature capability module.

Verification: Inspect the `foundation` build configuration and transitive project dependency graph and confirm no prohibited project dependency exists.
Traceability: [Foundation](02-overall-description.md#221-foundation); [Foundation role](04-functional-and-behavioral-requirements.md#arch-mod-001--foundation-role).

### ARCH-CON-002 — No feature semantics in foundation

`foundation` SHALL NOT own types or behavior whose meaning depends on Query Filtering, Authorization, Language, Identity, HTTP, persistence topology, or another feature-specific domain.

Verification: Inspect exported `foundation` packages and classify each public type using the [Architectural Boundary Test](02-overall-description.md#24-architectural-boundary-test).
Traceability: ARCH-MOD-001; ARCH-MOD-002.

### ARCH-CON-003 — Framework isolation

`foundation` SHALL NOT require Spring Framework, Spring Boot, Spring Modulith, Spring Data, JPA, ANTLR, HTTP frameworks, or application-framework lifecycle behavior as part of its public API or runtime initialization.

Verification: Inspect `foundation` compile/runtime dependencies and execute representative contracts without framework bootstrapping.
Traceability: [Foundation contract neutrality](03-external-interface-requirements.md#arch-if-001--foundation-contract-neutrality); ARCH-QUAL-004.

## 7.2 Capability Constraints

### ARCH-CON-004 — Language consumer neutrality

`language` SHALL NOT depend on `query`, `authorization`, `identity`, `web`, or resource-specific persistence modules. Consumer-specific roots, schemas, compilation profiles, and runtime values SHALL be supplied through Language contracts without importing consumer semantics into the `language` module.

Verification: Inspect `language` project dependencies and public packages and confirm consumer-specific semantics remain external.
Traceability: ARCH-MOD-003; [Language](../003.%20Language/README.md).

### ARCH-CON-005 — Query independence

`query` SHALL NOT depend on `authorization`, `identity`, `web`, or resource-specific persistence modules. Query Filtering MAY depend on `foundation` and `language` to implement its specification.

Verification: Inspect Query Filtering project dependencies and confirm resource and authorization semantics are absent.
Traceability: ARCH-MOD-004; [Query Filtering](../004.%20Query%20Filtering/README.md).

### ARCH-CON-006 — Authorization independence

`authorization` SHALL NOT depend on `identity`, `query`, `web`, or resource-specific persistence modules for its core authorization semantics. Authorization MAY depend on `foundation` and `language`.

Verification: Inspect Authorization project dependencies and confirm authorization decisions and predicates can be defined independently of concrete identity-resource persistence.
Traceability: ARCH-MOD-005; [Authorization](../002.%20Authorization/README.md).

### ARCH-CON-007 — Resource ownership does not invert dependencies

A resource-owning module MAY depend on `query`, `authorization`, `database`, and lower-level modules as required by its specification, but those lower-level modules SHALL NOT depend back on that resource-owning module.

Verification: Inspect the project dependency graph and confirm no cycle or upward dependency from lower-level capability modules to their resource consumers.
Traceability: ARCH-MOD-006; [Allowed Dependency Model](08-requirements-allocation-and-dependencies.md#82-allowed-dependency-model).

## 7.3 Adapter and Application Constraints

### ARCH-CON-008 — Web is an adapter

`web` SHALL NOT be a dependency of `foundation`, `language`, `query`, `authorization`, `identity`, or `database`.

Verification: Inspect project dependencies and confirm `web` is only consumed at application-composition level or acts as a consumer of lower-level modules.
Traceability: ARCH-MOD-008.

### ARCH-CON-009 — Applications are dependency leaves

Executable application modules SHALL NOT be dependencies of reusable foundation, capability, resource, infrastructure, or adapter modules.

Verification: Inspect the project dependency graph and confirm executable application modules are dependency leaves.
Traceability: ARCH-MOD-009.
