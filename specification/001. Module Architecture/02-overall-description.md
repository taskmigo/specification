# 2. Overall Description

## 2.1 Architecture choice

Taskmigo deliberately combines **bounded contexts, Onion dependency direction, and a modular-monolith deployment model**. No requirement mandates mandatory Hexagonal `port.in`/`port.out` packages or a callback-based transaction runner in every module. Port/adapter patterns may be used selectively where they clarify a boundary.

## 2.2 Capability ownership

| Owner | Responsibilities | Ownership exclusions |
| --- | --- | --- |
| Authorization | Role, Statement, effective grants and Request/Object Authorization | User/Group identity data |
| Identity | User, Group, membership, lifecycle, retention and configuration | Role and Statement lifecycle |
| Ticket | Ticket/Type/template state, version-pinned custom fields, resource queries | Generic language parser or global authorization rules |
| Query | Operation query schemas, allowed filtering/sorting and opaque logical predicates | Business-specific JPA mappings |
| Audit | Transactional entity audit, privacy scrubbing and audit queries | Authorization decision-history feature |
| Internal Language | Source grammar, typed compilation/evaluation, partial evaluation and diagnostics | Consumer-specific policies |
| Internal JPA Query | Trusted reusable criteria and sort binding | Resource ownership |
| Internal EAV | Typed versioned schemas, field instances and generic EAV query support | Ticket HTTP API |
| Foundation Core/Spring | Domain-neutral primitives and generic Spring support | Business aggregates |
| Database | Shared runtime database wiring and schema migration resources | Cross-context domain repositories |

Physical project names and dependencies are mapped in [section 8](08-requirements-allocation-and-dependencies.md); each owner SHALL expose published interfaces rather than private implementation types.

## 2.3 Runtime composition

Web adapts public HTTP/OAuth/security operations to published use cases. Worker triggers scheduled retention activity through Identity's exposed service. Migration installs database and managed resource state through dedicated transaction coordination. The OpenAPI generator and benchmark/test projects are tooling rather than new product runtimes.

## 2.4 Dependency model

The default direction is from infrastructure, persistence and configuration **toward application and domain**. Domain rules SHALL not depend on Spring, JPA, web or executable modules. Concrete application services may use Spring declarative transactions without turning domain models into framework adapters. Cross-context synchronous work uses provider-owned contracts; event consumers receive stable published event data.

## 2.5 Operational constraints

Gradle constrains physical project relationships, Spring Modulith verifies published logical interfaces and permitted dependencies, and ArchUnit enforces package-level Onion rules. These mechanisms complement one another; passing a single mechanism does not imply complete architecture conformance.

## 2.6 Boundary of this SRS

No universal API shape, latency SLO, database query strategy or source package name is invented here. Such behavior belongs to a feature owner. The architecture SRS can be changed only with a recorded ownership/dependency decision and updated conformance evidence.
