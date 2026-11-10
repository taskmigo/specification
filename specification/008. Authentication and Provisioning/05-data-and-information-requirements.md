# 5. Data and Information Requirements

Registered OAuth clients, grants, signing keys, sessions and declarative managed resource identities have explicit persistence/lifecycle ownership.

## 5.1 OAuth Persistence

### AUTHN-DATA-001 — JDBC OAuth tables

**Normative requirement.** Registered clients, authorizations and consents SHALL be persisted in the corresponding JDBC/Spring Authorization Server database tables, not treated as transient in-memory state.

### AUTHN-DATA-002 — Token claim contracts

**Normative requirement.** User access-token claims SHALL distinguish interactive User versus service credentials. API authorization SHALL require an ACTIVE persisted User corresponding to the token's `user_id`.

## 5.2 Signing Keys

### AUTHN-DATA-003 — External signing key

**Normative requirement.** Private signing keys SHALL be loaded from external configured key material, and a generated development key SHALL remain file-backed rather than recreated on each restart.

## 5.3 Sessions

### AUTHN-DATA-004 — Persistent session identity

**Normative requirement.** Spring Session's stored authenticated principal SHALL contain a stable User UUID separate from display username. Deletion/retention SHALL invalidate stored sessions referencing that User ID.

## 5.4 Managed Resource Definitions

### AUTHN-DATA-005 — Declarative resource keys

**Normative requirement.** Managed Users, Roles, Groups and Statements SHALL use stable natural keys for reconciliation, and OAuth registered clients SHALL use configured client IDs with a marker distinguishing managed from unmanaged registrations.
