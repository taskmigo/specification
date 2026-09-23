# 9. Verification, Validation, and Acceptance Evidence

## 9.1 Verification Objectives

### ARCH-VER-001 — Foundation dependency verification

Architecture verification SHALL confirm that `foundation` has no project dependency on any higher-level Taskmigo module and that every third-party dependency it re-exports satisfies [ARCH-CON-003](07-constraints.md#arch-con-003--shared-foundation-dependencies).

Verification: Inspect the resolved build dependency graph, `foundation` dependency exposure, and representative consumers.
Traceability: ARCH-CON-001; ARCH-CON-003.

### ARCH-VER-002 — Context and supporting-capability verification

Architecture verification SHALL confirm that `language` and `query` remain consumer-neutral, that `access-control` does not depend on Identity internals, and that bounded-context dependencies follow [Section 8.2](08-requirements-allocation-and-dependencies.md#82-allowed-dependency-model).

Verification: Inspect the resolved project dependency graph and applicable [Spring Modulith](https://docs.spring.io/spring-modulith/reference/) module-boundary tests.
Traceability: ARCH-CON-004; ARCH-CON-005; ARCH-CON-006; ARCH-CON-007.

### ARCH-VER-003 — Domain ownership verification

Architecture verification SHALL confirm that Access Control owns Role lifecycle and persistence, Statement lifecycle and persistence, Role hierarchy, Role-to-Statement assignment, and subject-binding semantics. Identity SHALL own User, Group, Membership, and group hierarchy without persisting canonical Role or Statement state in Identity-owned entities.

Resource-specific Query Schemas, Object Authorization Schemas, repositories, ORM mappings, and persistence binders SHALL remain with the bounded context that owns the resource.

Verification: Inspect representative Access Control and Identity resources, aggregate or lifecycle services, repositories, ORM mappings, and persistence schema ownership.
Traceability: ARCH-MOD-005; ARCH-MOD-006; ARCH-MOD-007; ARCH-MOD-013; ARCH-CON-014.

### ARCH-VER-004 — Adapter boundary verification

Architecture verification SHALL confirm reusable lower-level modules do not depend on executable applications, driving adapters invoke inbound ports instead of concrete application services, and driven adapters satisfy owner-published outbound ports or adapt owner contracts without becoming owners of domain invariants. Verification SHALL include Identity's Access-Control-owned subject-resolution adapter and the Web/Migration Access-Control-owned Object Authorization target-resolution adapters.

Verification: Inspect the project/package dependency graph and representative `web`, `worker`, and `migration` adapters for adapter leakage, direct driving-to-driven coupling, and domain logic implemented in outer packages.
Traceability: ARCH-CON-008; ARCH-CON-009; ARCH-CON-013; ARCH-MOD-008; ARCH-MOD-009.

### ARCH-VER-005 — Spring Modulith verification

Every executable composition that contains Taskmigo Spring Modulith application modules SHALL run an automated Spring Modulith architecture test that constructs the applicable `ApplicationModules` model and invokes `verify()` or an equivalent verification path.

The test SHALL fail for module cycles, references to another module's internal packages, and violations of explicit `allowedDependencies` declarations.

Verification: Introduce one isolated representative violation for each failure category and confirm the architecture test rejects it.
Traceability: ARCH-MOD-010; ARCH-MOD-011; ARCH-CON-010; ARCH-CON-011.

### ARCH-VER-006 — ArchUnit tactical-boundary verification

Every bounded context or executable application using explicit domain, application, port, or adapter packages SHALL run automated [ArchUnit](https://www.archunit.org/getting-started) rules for the dependency direction required by [ARCH-CON-013](07-constraints.md#arch-con-013--tactical-layer-direction).

Every physical module containing additional architectural package boundaries not fully enforced by Spring Modulith SHALL also run ArchUnit rules for those remaining package restrictions.

Verification: Introduce representative forbidden domain-to-adapter, application-to-framework/adapter, driving-adapter-to-service/driven-adapter, inbound-port-to-implementation, and outbound-port-to-adapter dependencies and confirm the ArchUnit rules reject them.
Traceability: ARCH-CON-012; ARCH-CON-013; ARCH-QUAL-004.

### ARCH-VER-007 — Cross-context integration verification

Architecture verification SHALL confirm synchronous cross-context calls use provider-owned inbound APIs/ports or provider-owned outbound ports implemented by collaborators, asynchronous consumers use published event contracts, and no consumer imports another bounded context's private domain, application, or adapter packages.

Verification: Inspect cross-context imports, Spring Modulith named interfaces, event contracts, and representative integrations including Identity subject resolution for Access Control.
Traceability: ARCH-MOD-014; ARCH-MOD-015; ARCH-CON-015.

### ARCH-VER-008 — Persistence isolation verification

Architecture verification SHALL confirm one bounded context does not use another bounded context's private persistence tables, repositories, or ORM relationships as its integration contract.

Verification: Inspect repository queries, entity mappings, schema ownership, and integration tests for representative Access Control and Identity interactions.
Traceability: ARCH-CON-014; ARCH-QUAL-003; ARCH-IF-006.

## 9.2 Acceptance Conditions

A change affecting bounded-context ownership, project dependencies, persistence ownership, or architectural package boundaries is acceptable only when:

- Every domain concept has one canonical bounded-context owner.
- Role, Statement, Role hierarchy, Role-to-Statement assignment, and subject-binding semantics remain owned by Access Control.
- User, Group, Membership, and group hierarchy remain owned by Identity without Identity owning canonical Access Control resources.
- Every new Taskmigo project dependency edge is permitted by [Section 8.2](08-requirements-allocation-and-dependencies.md#82-allowed-dependency-model).
- No prohibited relationship from [Section 8.3](08-requirements-allocation-and-dependencies.md#83-prohibited-dependencies) is introduced.
- Every public context-specific contract remains owned and published by its defining bounded context or supporting capability.
- Cross-context integrations target provider-owned inbound APIs/ports, provider-owned outbound ports, or events rather than private packages or persistence structures.
- Driving adapters target inbound ports, and driven adapters implement or adapt owner-published outbound contracts without reversing ownership.
- Transaction semantics remain application-owned while Spring or persistence-framework transaction mechanics remain in composition or driven adapters.
- Gradle `api` exposure is limited to dependencies whose types occur in published contracts; framework/runtime dependencies remain implementation-scoped unless the public contract requires them.
- `foundation` continues to pass the [Architectural Boundary Test](02-overall-description.md#26-architectural-boundary-test), including the classification of shared third-party dependencies.
- Every representable bounded-context or logical module boundary passes Spring Modulith verification.
- Every applicable tactical or intra-physical-module package boundary passes its ArchUnit rules.
- Applicable automated architecture, build, and specification checks pass.

## 9.3 Validation

The architecture SHALL be considered valid for future product growth when a new domain capability can be introduced as a bounded context with its own ubiquitous language, persistence ownership, published contracts, and enforceable boundaries without moving its semantics into `foundation`, `database`, `web`, or an unrelated context.

Verification: Review at least one representative future-domain design against the context map and boundary-enforcement model or demonstrate the condition when the next independent domain capability is introduced.
Traceability: ARCH-QUAL-001; ARCH-QUAL-004; ARCH-MOD-014.
