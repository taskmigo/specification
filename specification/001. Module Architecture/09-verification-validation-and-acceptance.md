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
