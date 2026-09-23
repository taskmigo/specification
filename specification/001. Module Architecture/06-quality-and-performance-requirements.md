# 6. Quality and Performance Requirements

## 6.1 Maintainability

### ARCH-QUAL-001 — Independent bounded-context evolution

A bounded context SHALL be evolvable without requiring unrelated bounded contexts to accept its ubiquitous language, aggregate model, public contracts, persistence model, or context-specific libraries through `foundation`.

Project-wide technical libraries intentionally shared through `foundation` MAY be visible transitively to unrelated modules without transferring domain ownership.

Verification: Inspect transitive dependencies from `foundation` and cross-context dependencies and confirm that shared dependencies are part of the common technical baseline rather than dependencies introduced solely for one domain context.
Traceability: [Foundation role](04-functional-and-behavioral-requirements.md#arch-mod-001--foundation-role); [Shared foundation dependencies](07-constraints.md#arch-con-003--shared-foundation-dependencies).

### ARCH-QUAL-002 — Shared dependency discipline

Third-party dependencies intentionally used as a common technical baseline across multiple Taskmigo modules MAY be centralized and re-exported by `foundation`. Context-specific or adapter-specific third-party dependencies SHALL remain scoped to the owning bounded context, supporting capability, or adapter unless an architectural decision establishes them as project-wide dependencies.

For reusable `java-library` projects, Gradle `api` exposure SHALL be limited to dependencies whose types are part of published contracts. Spring Boot, Spring Data JPA, and other framework/runtime wiring SHALL remain `implementation` or runtime dependencies unless a published contract necessarily exposes their API. The shared `database` project MAY expose Jakarta Persistence because its public Criteria helper uses Jakarta Criteria types, but SHALL NOT expose the Spring Data JPA starter as a public API dependency.

Verification: Inspect dependency declarations and consumers and confirm every dependency re-exported by `foundation` is intentionally shared, context-specific libraries remain local to their owners, and `api` versus `implementation` exposure matches the types present in published contracts.
Traceability: ARCH-QUAL-001; [Shared foundation dependencies](07-constraints.md#arch-con-003--shared-foundation-dependencies).

### ARCH-QUAL-003 — Persistence-model isolation

A bounded context SHALL be able to change its private persistence representation without requiring another bounded context to update direct table access, ORM relationships, repository implementations, or persistence queries.

Verification: Inspect cross-context persistence access and confirm consumers depend only on published contracts or event data rather than private persistence topology.
Traceability: [No persistence integration contract](03-external-interface-requirements.md#arch-if-006--no-persistence-integration-contract); ARCH-CON-014.

## 6.2 Testability

### ARCH-QUAL-004 — Boundary verification

The automated architecture test suite SHALL detect prohibited dependencies defined by this specification before a change is accepted. [Spring Modulith](https://docs.spring.io/spring-modulith/reference/) SHALL provide the primary bounded-context and logical-module verification, and [ArchUnit](https://www.archunit.org/getting-started) SHALL provide supplemental tactical-layer and package-boundary linting where required by [ARCH-CON-012](07-constraints.md#arch-con-012--archunit-package-boundary-linting) and [ARCH-CON-013](07-constraints.md#arch-con-013--tactical-layer-direction).

Verification: Introduce representative prohibited context, package, persistence, and layer dependencies in isolated verification scenarios and confirm the applicable architecture test fails.
Traceability: [Prohibited Dependencies](08-requirements-allocation-and-dependencies.md#83-prohibited-dependencies); [Architecture acceptance](09-verification-validation-and-acceptance.md#92-acceptance-conditions).

## 6.3 Portability

### ARCH-QUAL-005 — Domain runtime neutrality

Domain semantics and feature-neutral `foundation` contracts SHALL NOT require initialization of an HTTP runtime, persistence runtime, executable application runtime, or unrelated framework adapter merely to exercise domain behavior.

A domain implementation MAY use narrowly scoped framework annotations when an architectural decision establishes them as non-semantic implementation metadata, but correctness of the domain model SHALL NOT depend on adapter or persistence runtime behavior.

Verification: Exercise representative Access Control and Identity domain behavior without starting public HTTP adapters and confirm domain correctness does not require another bounded context's driven adapters or technical runtime.
Traceability: [Tactical DDD Model](02-overall-description.md#24-tactical-ddd-model); ARCH-CON-013.

## 6.4 Performance

This architecture specification introduces no independent runtime latency or throughput target. Feature-specific performance requirements SHALL remain in the specification that owns the behavior being measured.
