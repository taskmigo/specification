# 7. Constraints

## 7.1 Authentication Scope

### AUTHN-CON-001 — No realm assumption

The existence of Identity Groups SHALL NOT be interpreted as Organization-aware login or realm selection; no such public API is implemented.

### AUTHN-CON-002 — Active principal requirement

Only ACTIVE User status SHALL satisfy interactive login, authenticated session validity, and protected API Request Authorization.

### AUTHN-CON-003 — No bypass through client credentials

A `service` token with no valid ACTIVE linked System User identity SHALL NOT bypass the versioned API's persisted User and policy checks.

### AUTHN-CON-004 — Session lifecycle coordination

Guarded session and OAuth state writes SHALL use User lifecycle eligibility so post-deletion state is not reintroduced.

## 7.2 Installation Integrity

### AUTHN-CON-005 — Managed-resource ownership

The reconciler SHALL NOT take ownership of an OAuth client that is not already marked managed.

### AUTHN-CON-006 — Dedicated schema migration

Flyway schema initialization SHALL remain owned by the Migration application; Web and Worker SHALL use database runtime support without independently executing feature migrations.

### AUTHN-CON-007 — No secret disclosure

Raw configuration secrets or private signing keys SHALL NOT be included in versioned API response bodies or policy input roots.
