# 4. Functional and Behavioral Requirements

This chapter defines **which Taskmigo capability owns each contract and which dependencies are allowed**. The [module interface chapter](03-external-interface-requirements.md) defines cross-context use; [section 7](07-constraints.md) establishes forbidden dependencies. Requirements here are objectively verifiable through project graph and architecture tests, not user-facing HTTP operations.

## 4.1 Capability Ownership

### ARCH-MOD-001 — Foundation role

Foundation Core SHALL provide only domain-neutral primitives and contracts. Foundation Spring SHALL provide reusable generic Spring integration. Neither SHALL contain or persist a bounded context's User, Role, Statement, Ticket or other business aggregate.

### ARCH-MOD-002 — Canonical capability ownership

Each domain invariant, public application use case and persisted aggregate SHALL have **one owning bounded context or supporting capability**. An executable app or generic infrastructure module SHALL not become a second owner merely because it invokes or stores the capability.

### ARCH-MOD-003 — Language ownership

`:modules:internal:language` SHALL define the canonical source grammar, modes and compilation profiles, reference/type validation, evaluation, partial evaluation and diagnostics. Authorization and Query SHALL restrict their own allowed roots and feature subsets rather than fork the Language grammar.

### ARCH-MOD-004 — Query ownership

`:modules:query` SHALL provide operation-scoped Query Schemas, allowlisted field/operator metadata, typed opaque logical predicates, dynamic field contexts, client FilterBy compilation and logical sort requests. Specific JPA resource paths are not Query-owned public contracts.

### ARCH-MOD-005 — Authorization ownership

`:modules:authorization` SHALL own Roles, Statements, direct subject grants, effective Statement resolution and Request/Object Authorization. Identity SHALL not define a competing Role/Statement lifecycle or bypass Authorization grant ownership.

### ARCH-MOD-006 — Resource persistence ownership

Identity, Authorization and Ticket SHALL each own their resource aggregates, operation Query Schemas, query-to-persistence translations and repositories. Internal JPA Query MAY supply reusable typed binding functionality but SHALL not own resource-specific tables or field rules.

### ARCH-MOD-007 — Identity ownership

`:modules:identity` SHALL own Users, Groups, memberships, status transitions, User retention configuration and User-specific persistence. It SHALL coordinate grant revocation and privacy-safe audit through the Authorization/Audit providers' published contracts.

### ARCH-MOD-008 — Web ownership

Web SHALL own versioned HTTP controllers, OAuth and security adapters, response serialization and transport-specific exception handling. Web SHALL delegate business invariants to published domain/application use cases instead of duplicating them in controllers.

### ARCH-MOD-009 — Executable composition

Web, Worker and Migration SHALL be executable composition roots. Worker SHALL schedule published retention work instead of owning Identity mutation internals. Migration MAY own specialized installation transaction coordination while using the relevant business capability contracts.

## 4.2 Logical Boundaries

### ARCH-MOD-010 — Spring Modulith model

Applicable logical modules SHALL be declared and verified through Spring Modulith. Logical module verification SHALL complement, not replace, physical Gradle dependency boundaries and package-level architecture rules.

### ARCH-MOD-011 — Published interfaces and allowed dependencies

A consumer SHALL access another capability only through a provider-owned root interface or explicitly named published interface permitted by its `allowedDependencies`. Dependencies SHALL not be widened or private packages published solely to bypass a failed architecture check.

## 4.3 Tactical DDD

### ARCH-MOD-012 — Domain/application/persistence responsibility

The Domain layer SHALL contain framework-independent business behavior. Concrete Application services MAY own use-case transactions through Spring declarative `@Transactional`, but SHALL not depend directly on Web, concrete JPA/Spring Data repositories or persistence/configuration adapters. Persistence and configuration MAY depend inward toward Application and Domain.

A universal `port.in`/`port.out` package structure is not required; ports/adapters MAY be introduced only where they improve a real boundary.

### ARCH-MOD-013 — Aggregate ownership

Every aggregate's state-changing operation SHALL pass through its owning context's domain/application use case. Consumers SHALL not mutate other contexts' private database rows or repositories as an integration shortcut.

### ARCH-MOD-014 — Cross-context contracts

Synchronous cross-context calls SHALL use provider-owned published application contracts; asynchronous integration SHALL use published event models. A consumer SHALL not import another context's private domain, application implementation or persistence package.

### ARCH-MOD-015 — Domain event ownership

The context completing a domain transition SHALL own the event describing that change. A published event SHALL expose stable identifiers and immutable required data, not a mutable aggregate instance or web/JPA object.

## 4.4 Transaction Behavior

**Ordinary write operations** SHALL participate in or establish Spring `REQUIRED` transactions through owning application services. Reads MAY declare `readOnly=true`. Audit append and privacy operations SHALL require the existing business transaction with `MANDATORY` semantics. Specialized consistency requirements MAY justify `REQUIRES_NEW` or explicit isolation; Migration installation SHALL use `SERIALIZABLE` isolation with bounded retries.

These choices reflect the approved [server architecture](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/ARCHITECTURE.md). The architecture does not prescribe a shared callback-based transaction-runner abstraction.

## 4.5 Verification meaning

A graph or package import violating an ARCH-MOD rule SHALL be flagged by the appropriate [section 9 architecture validation](09-verification-validation-and-acceptance.md) and fixed at the ownership boundary. Successful compilation alone is not approval of a newly exposed internal interface.
