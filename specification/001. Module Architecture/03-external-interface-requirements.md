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
