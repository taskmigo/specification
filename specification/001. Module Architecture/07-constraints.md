# 7. Constraints

## 7.1 Foundation Constraints

### ARCH-CON-001 — Foundation dependency floor

`foundation` SHALL NOT declare a project dependency on `language`, `query`, `authorization`, `identity`, `database`, `web`, any executable application module, or any future feature capability module.

Verification: Inspect the `foundation` build configuration and transitive project dependency graph and confirm no prohibited Taskmigo project dependency exists.
Traceability: [Foundation](02-overall-description.md#221-foundation); [Foundation role](04-functional-and-behavioral-requirements.md#arch-mod-001--foundation-role).

### ARCH-CON-002 — No feature semantics in foundation

`foundation` SHALL NOT own types or behavior whose meaning depends on Query Filtering, Authorization, Language, Identity, HTTP, persistence topology, or another feature-specific domain.

Verification: Inspect exported `foundation` packages and classify each public Taskmigo-owned type using the [Architectural Boundary Test](02-overall-description.md#24-architectural-boundary-test).
Traceability: ARCH-MOD-001; ARCH-MOD-002.

### ARCH-CON-003 — Shared foundation dependencies

`foundation` MAY declare and re-export third-party libraries that are intentionally established as common technical dependencies for multiple Taskmigo modules. A shared third-party dependency SHALL remain feature-neutral and SHALL NOT require `foundation` to depend on a higher-level Taskmigo project module.

A library used only by one capability, resource, adapter, or executable application SHALL remain with that owner unless an architectural decision intentionally promotes the library into the project-wide technical baseline.

Verification: Inspect `foundation` dependency exposure and consumers and confirm re-exported libraries are intentionally shared while capability-specific libraries remain scoped to their owners.
Traceability: [Foundation role](04-functional-and-behavioral-requirements.md#arch-mod-001--foundation-role); ARCH-QUAL-002.

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

## 7.4 Boundary Enforcement Constraints

### ARCH-CON-010 — Spring Modulith primary enforcement

Every Taskmigo logical package boundary that can be represented as a [Spring Modulith](https://docs.spring.io/spring-modulith/reference/) application module SHALL use Spring Modulith as its primary automated module-boundary mechanism.

Automated architecture tests SHALL construct the applicable `ApplicationModules` model and invoke `verify()` or an equivalent Spring Modulith verification path so module cycles, references to internal packages, and explicit allowed-dependency violations fail the build.

Verification: Run the Spring Modulith architecture verification for each executable composition and confirm representative cycle, internal-package, and disallowed-dependency violations are rejected.
Traceability: ARCH-MOD-010; ARCH-QUAL-003; ARCH-VER-005.

### ARCH-CON-011 — Explicit interfaces and dependencies

Spring Modulith application modules SHALL remain closed by default and SHALL NOT use open-module configuration as a general bypass for architectural boundaries. Cross-module access SHALL target the module root API package or a deliberately declared `@NamedInterface`.

A module with outgoing Taskmigo module dependencies SHALL constrain those dependencies with `@ApplicationModule(allowedDependencies = ...)` so the declaration is no broader than [Section 8.2](08-requirements-allocation-and-dependencies.md#82-allowed-dependency-model). When only a named interface is required, the allowed dependency SHALL target that named interface rather than the whole module API.

Verification: Inspect module metadata and run Spring Modulith verification to confirm internal-package access, undeclared dependencies, and overly broad interface use are rejected.
Traceability: ARCH-MOD-011; ARCH-VER-005.

### ARCH-CON-012 — ArchUnit package-boundary linting

When two or more architectural package boundaries reside within the same physical build module, or a required package-access rule is not directly represented by Spring Modulith verification, automated [ArchUnit](https://www.archunit.org/getting-started) rules SHALL enforce the remaining package dependency restrictions.

ArchUnit SHALL supplement rather than replace Spring Modulith for any boundary Spring Modulith can represent.

Verification: Add representative forbidden package references within one physical module and confirm the ArchUnit architecture test fails.
Traceability: ARCH-QUAL-003; ARCH-VER-006.
