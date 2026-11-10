# 9. Verification, Validation, and Acceptance Evidence

## 9.1 Architecture Verification

### ARCH-VER-001 — Foundation

Tests SHALL detect any higher-level Taskmigo project dependency from Foundation Core.

### ARCH-VER-002 — Capability isolation

Tests SHALL detect Language/Query consumer-dependency inversion, wrong internal-module ownership, and unexpected project cycles.

### ARCH-VER-003 — Domain ownership

Tests SHALL verify that Role/Statement state belongs to Authorization, User/Group to Identity, and Ticket/Type to Ticket.

### ARCH-VER-004 — Executable isolation

Tests SHALL reject reusable modules depending on Web/Worker/Migration and executable applications importing internal-only module APIs.

### ARCH-VER-005 — Spring Modulith

Each applicable executable SHALL verify its Spring Modulith graph and published named interfaces.

### ARCH-VER-006 — ArchUnit Onion rules

The architecture tests SHALL reject outward Domain dependencies, forbidden concrete persistence use by application services, and disallowed framework imports.

### ARCH-VER-007 — Cross-context contract boundaries

Tests SHALL reject use of a provider's private packages in a consumer and SHALL permit deliberate named interfaces and published events.

### ARCH-VER-008 — Persistence isolation

Tests SHALL detect cross-context private repositories, ORM relationships and table access as integration shortcuts.

## 9.2 Implementation Evidence

- [Shared Onion architecture rules](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/testing/architecture).
- [Gradle internal dependency verifier](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/build-logic/src/main/java/io/taskmigo/buildlogic/InternalDependencyVerifier.java).
- [Web Modulith test](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/test/java/io/taskmigo/ModulithArchitectureTest.java).
- [Worker Modulith test](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/worker/src/test/java/io/taskmigo/ModulithArchitectureTest.java).

## 9.3 Acceptance

Conformance SHALL be established by applicable architecture tests and review of actual Gradle and Spring Modulith declarations. This document does not claim any CI verification has passed merely because tests exist.

## 9.4 Independent-Consumer Boundary Acceptance

The following scenarios SHALL complement the structural tests rather than replace them.

| Scenario               | Setup and action                                                            | Expected result                                                                                                           | Requirement                                                                                             |
| ---------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Published use case     | A consumer module calls a provider's published application interface        | The dependency is permitted by declared module boundaries and does not import private persistence or implementation types | [ARCH-IF-002](03-external-interface-requirements.md#arch-if-002--owner-published-contracts)             |
| Private adapter import | A consumer attempts to import an owning context's private repository/entity | Architecture validation rejects the dependency, even if compilation could otherwise succeed                               | [ARCH-IF-006](03-external-interface-requirements.md#arch-if-006--no-persistence-integration-contract)   |
| Composition boundary   | Worker triggers the Identity retention use case                             | Worker depends only on the published Identity contract and owns no User row mutation logic                                | [ARCH-IF-007](03-external-interface-requirements.md#arch-if-007--composition-only-application-boundary) |

Acceptance evidence SHALL be a real passing build/module verification run plus reviewed project graph; the presence of test classes alone is insufficient. Each new boundary deviation SHALL be linked to its proposed provider-owned contract rather than normalized as an exception.
