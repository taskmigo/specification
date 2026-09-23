# 7. Constraints

## 7.1 Foundation Constraints

### ARCH-CON-001 — Foundation dependency floor

`foundation` SHALL NOT declare a project dependency on `language`, `query`, `access-control`, `identity`, `database`, `web`, any executable application module, or any future bounded-context or feature-capability module.

Verification: Inspect the `foundation` build configuration and transitive project dependency graph and confirm no prohibited Taskmigo project dependency exists.
Traceability: [Shared Technical Modules](02-overall-description.md#224-shared-technical-modules); [Foundation role](04-functional-and-behavioral-requirements.md#arch-mod-001--foundation-role).

### ARCH-CON-002 — No domain semantics in foundation

`foundation` SHALL NOT own types or behavior whose meaning depends on Access Control, Query Filtering, Language, Identity, HTTP, persistence topology, or another bounded context or feature-specific domain.

Verification: Inspect exported `foundation` packages and classify each public Taskmigo-owned type using the [Architectural Boundary Test](02-overall-description.md#26-architectural-boundary-test).
Traceability: ARCH-MOD-001; ARCH-MOD-002.

### ARCH-CON-003 — Shared foundation dependencies

`foundation` MAY declare and re-export third-party libraries intentionally established as common technical dependencies for multiple Taskmigo modules. A shared third-party dependency SHALL remain domain-neutral and SHALL NOT require `foundation` to depend on a higher-level Taskmigo project module.

A library used only by one bounded context, supporting capability, adapter, or executable application SHALL remain with that owner unless an architectural decision intentionally promotes the library into the project-wide technical baseline.

Verification: Inspect `foundation` dependency exposure and consumers and confirm re-exported libraries are intentionally shared while context-specific libraries remain scoped to their owners.
Traceability: [Foundation role](04-functional-and-behavioral-requirements.md#arch-mod-001--foundation-role); ARCH-QUAL-002.

## 7.2 Context and Capability Constraints

### ARCH-CON-004 — Language consumer neutrality

`language` SHALL NOT depend on `query`, `access-control`, `identity`, `web`, or resource-specific persistence modules. Consumer-specific roots, schemas, compilation profiles, and runtime values SHALL be supplied through Language contracts without importing consumer semantics into `language`.

Verification: Inspect `language` project dependencies and public packages and confirm consumer-specific semantics remain external.
Traceability: ARCH-MOD-003; [Language](../003.%20Language/README.md).

### ARCH-CON-005 — Query independence

`query` SHALL NOT depend on `access-control`, `identity`, `web`, or resource-specific persistence modules. Query Filtering MAY depend on `foundation` and `language` to implement its specification.

Verification: Inspect Query Filtering project dependencies and confirm resource and Access Control semantics are absent.
Traceability: ARCH-MOD-004; [Query Filtering](../004.%20Query%20Filtering/README.md).

### ARCH-CON-006 — Access Control independence

Core Access Control policy evaluation SHALL NOT depend on Identity domain types, web adapters, or another resource context's private persistence model. The `access-control` project MAY depend on `foundation`, `language`, `query`, and shared `database` infrastructure for its owned Role, Statement, binding, and authorization-resource behavior. Access Control-owned outbound ports such as effective-subject resolution SHALL NOT create a reverse Access Control dependency on Identity.

Access Control SHALL represent principals or subjects from another bounded context through opaque published references or ports rather than importing that context's entities or repositories.

Verification: Inspect `access-control` project dependencies, imports, authorization decision behavior, and subject integration and confirm no Identity entity or private repository is required by Access Control semantics.
Traceability: ARCH-MOD-005; ARCH-MOD-014; [Authorization](../002.%20Authorization/README.md).

### ARCH-CON-007 — Resource ownership does not invert dependencies

A resource-owning bounded context MAY depend on reusable supporting capabilities and shared infrastructure required by its specification, but those lower-level capabilities SHALL NOT depend back on the resource context's private domain or persistence model.

A context consuming another context's published contract SHALL NOT gain access to the owner's internal packages solely because both contexts run in the same process.

Verification: Inspect the project dependency graph and Spring Modulith model and confirm no prohibited cycle or private-package dependency exists.
Traceability: ARCH-MOD-006; [Allowed Dependency Model](08-requirements-allocation-and-dependencies.md#82-allowed-dependency-model).

## 7.3 Adapter and Application Constraints

### ARCH-CON-008 — Web is an adapter

`web` SHALL NOT be a dependency of `foundation`, `language`, `query`, `access-control`, `identity`, `database`, or another reusable lower-level module.

Verification: Inspect project dependencies and confirm `web` is only consumed at executable application composition or acts as a consumer of lower-level published contracts.
Traceability: ARCH-MOD-008.

### ARCH-CON-009 — Applications are dependency leaves

The executable application roots `web`, `worker`, and `migration` SHALL NOT be dependencies of reusable foundation, supporting-capability, bounded-context, technical-infrastructure, or adapter modules.

Verification: Inspect the project dependency graph and confirm executable application modules are dependency leaves.
Traceability: ARCH-MOD-009.

## 7.4 Boundary Enforcement Constraints

### ARCH-CON-010 — Spring Modulith primary enforcement

Every Taskmigo bounded-context or logical package boundary representable as a [Spring Modulith](https://docs.spring.io/spring-modulith/reference/) application module SHALL use Spring Modulith as its primary automated module-boundary mechanism.

Automated architecture tests SHALL construct the applicable `ApplicationModules` model and invoke `verify()` or an equivalent Spring Modulith verification path so module cycles, references to internal packages, and explicit allowed-dependency violations fail the build.

Verification: Run the Spring Modulith architecture verification for each executable composition and confirm representative cycle, internal-package, and disallowed-dependency violations are rejected.
Traceability: ARCH-MOD-010; ARCH-QUAL-004; ARCH-VER-005.

### ARCH-CON-011 — Explicit interfaces and dependencies

Spring Modulith application modules SHALL remain closed by default and SHALL NOT use open-module configuration as a general bypass for bounded-context boundaries. Cross-module access SHALL target the module root API package or a deliberately declared `@NamedInterface`.

A module with outgoing Taskmigo module dependencies SHALL constrain those dependencies with `@ApplicationModule(allowedDependencies = ...)` so the declaration is no broader than [Section 8.2](08-requirements-allocation-and-dependencies.md#82-allowed-dependency-model). When only a named interface is required, the allowed dependency SHALL target that named interface rather than the whole module API.

Verification: Inspect module metadata and run Spring Modulith verification to confirm internal-package access, undeclared dependencies, and overly broad interface use are rejected.
Traceability: ARCH-MOD-011; ARCH-VER-005.

### ARCH-CON-012 — ArchUnit package-boundary linting

When two or more architectural package boundaries reside within the same physical build module, or a required package-access rule is not directly represented by Spring Modulith verification, automated [ArchUnit](https://www.archunit.org/getting-started) rules SHALL enforce the remaining package dependency restrictions.

ArchUnit SHALL supplement rather than replace Spring Modulith for any boundary Spring Modulith can represent.

Verification: Add representative forbidden package references within one physical module and confirm the ArchUnit architecture test fails.
Traceability: ARCH-QUAL-004; ARCH-VER-006.

## 7.5 Tactical DDD Constraints

### ARCH-CON-013 — Tactical layer direction

Within a bounded context that uses explicit domain, application, port, and adapter packages, dependencies SHALL follow the DDD + Onion + Hexagonal model:

- Domain packages SHALL NOT depend on application packages, adapters, Spring, JPA/ORM APIs, web, or executable applications.
- Application-service packages MAY depend on domain types and application-owned inbound/outbound ports but SHALL NOT depend on concrete adapter implementations, Spring transaction APIs, JPA/ORM APIs, HTTP frameworks, or executable applications.
- Inbound ports SHALL NOT depend on application-service implementations, outbound ports, or adapters.
- Driving adapters SHALL depend on inbound ports and input models and SHALL NOT depend on concrete application-service implementations, outbound ports, or driven adapters.
- Outbound ports SHALL NOT depend on their driven-adapter implementations.
- Driven adapters SHALL depend inward on the owner-published ports and domain/application contracts they implement or translate. A driven adapter MAY live in another bounded context or executable application when it implements a port owned by the capability that requires the dependency.
- Composition roots MAY depend on inbound-port implementations, driven adapters, and framework configuration solely to wire the executable application.
- Application-owned transaction semantics SHALL be separated from framework transaction mechanics; Spring transaction types SHALL remain in composition or driven-adapter code. Identity and Access Control SHALL express transaction execution through application-owned transaction ports, while Migration SHALL express SERIALIZABLE/retry execution through its installation transaction port.

Equivalent package naming MAY be used when the same dependency direction is mechanically enforceable.

Verification: Run ArchUnit rules over representative bounded contexts and executable adapters and confirm forbidden domain-to-outer, application-to-adapter/framework, driving-adapter-to-implementation, and outbound-port-to-adapter dependencies fail the build.
Traceability: ARCH-MOD-012; ARCH-VER-006.

### ARCH-CON-014 — Persistence isolation

A bounded context SHALL NOT read, join, navigate through ORM relationships into, or write another bounded context's private persistence tables as an integration mechanism.

Cross-context database foreign keys MAY exist only when explicitly justified as a storage-integrity mechanism and SHALL NOT make private persistence structures a callable domain interface. Cross-context behavior SHALL continue to use published contracts or events.

Verification: Inspect repositories, ORM mappings, query specifications, and schema ownership and confirm cross-context behavior does not rely on another context's private persistence model.
Traceability: ARCH-MOD-013; ARCH-QUAL-003; ARCH-IF-006.

### ARCH-CON-015 — Cross-context integration contracts

A bounded context SHALL NOT import another bounded context's private domain, application, or adapter packages. Synchronous integration SHALL use an explicit provider-owned inbound API/port or a provider-owned outbound port implemented by the collaborator. Asynchronous integration SHALL use an explicit published event contract.

Integration events SHALL NOT expose private ORM entities, mutable aggregate instances, framework request objects, or persistence-specific query structures.

Verification: Inspect all cross-context imports, synchronous calls, and event payloads and confirm only published interfaces are consumed.
Traceability: ARCH-MOD-014; ARCH-MOD-015; ARCH-IF-002; ARCH-IF-003.
