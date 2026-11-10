# 3. External Interface Requirements

## 3.1 Published Module Contracts

### ARCH-IF-001 — Foundation contract neutrality

`:modules:foundation:core` SHALL export only framework-neutral, domain-neutral primitives. Spring-specific contracts SHALL belong to `:modules:foundation:spring`.

### ARCH-IF-002 — Owner-published contracts

Cross-context use cases SHALL be exposed through the owning module's root or explicitly published Spring Modulith named interface. Consumers SHALL NOT depend on another module's private implementation or persistence packages.

### ARCH-IF-003 — Cross-context event contracts

An integration event SHALL expose only the stable identifiers and immutable data its consumer needs. It SHALL NOT expose JPA entities, HTTP objects, or mutable aggregate internals.

## 3.2 Framework Adaptation

### ARCH-IF-004 — Web adapter boundary

`apps:web` SHALL own HTTP controllers, request binding, response envelopes, API versioning, OAuth endpoints, Spring Security, and transport-specific exception handling. Reusable business modules SHALL NOT own REST controllers.

## 3.3 Persistence

### ARCH-IF-005 — Owner-controlled persistence translation

Resource-owning contexts SHALL control mapping from Query/Object Authorization predicates to their own trusted JPA persistence fields. Reusable `internal:jpa-query` MAY provide binding primitives without acquiring resource ownership.

### ARCH-IF-006 — No persistence integration contract

A context SHALL NOT integrate with another context by importing its private JPA entities, repositories, or database schema as a callable business contract.

## 3.4 Composition

### ARCH-IF-007 — Composition-only application boundary

Executable apps SHALL assemble published use cases and framework adapters, without becoming owners of reusable domain invariants. Worker SHALL consume Identity's published retention use case instead of Identity internals.

For API-specific contracts, see [Authorization](../002.%20Authorization/README.md), [Query Filtering](../004.%20Query%20Filtering/README.md), [Identity and User Retention](../005.%20Identity%20and%20User%20Retention/README.md), and [Tickets](../006.%20Tickets%20and%20Dynamic%20Fields/README.md).

## 3.5 Consumer/Provider Contract Ownership

The following allocation is the source-backed module ownership boundary. It supplements [ARCH-IF-001–007](#31-published-module-contracts), rather than providing an alternate implementation architecture.

| Consumer                   | Provider and approved contract                                       | Forbidden shortcut                                                               |
| -------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Web API adapters           | Identity, Authorization, Ticket, Query and Audit published use cases | Business invariants in controllers or another context's private JPA repositories |
| Worker retention scheduler | Identity's published retention service                               | Direct mutation of Identity User rows                                            |
| User/Group workflows       | Authorization's published Role/Statement grants and Audit append     | Owning or duplicating Authorization grant state inside Identity                  |
| Authorization Object query | Query operation schemas and resource-owned persistence field binding | Raw SQL or unsafe JPA path access derived from policy text                       |
| Ticket custom fields       | Ticket-owned schema/version and internal EAV service interface       | Web/Worker importing the EAV implementation as a public business module          |
| Migration                  | Published installation and managed resource contracts                | Granting public applications unrestricted access to module internals             |

The [Module Architecture behavior](04-functional-and-behavioral-requirements.md#41-capability-ownership) defines ownership. Each consumer SHALL resolve its provider through a published boundary, and those boundaries SHALL be independently verifiable by Gradle/Spring Modulith/ArchUnit checks. All public HTTP field-level wire contracts SHALL be documented **in their owning module's section 3**, not duplicated in this architecture SRS.

## 3.6 Change and Compatibility Boundary

A new public endpoint, client-visible field, query operator, role or Object Authorization behavior SHALL update the owning module contract and its verification cases. A new cross-module dependency SHALL identify a provider-owned published interface and pass the applicable architecture rules. This architecture SRS SHALL NOT infer the existence of public APIs from internal application services, source package names, or generated dependency graphs.

[Implementation evidence](10-traceability-and-unresolved-issues.md#101-traceability) is tied to the reviewed backend revision, whereas normative architecture boundaries remain approved requirements. A failing implementation boundary is drift to be reported, not a reason to weaken the normative rule.
