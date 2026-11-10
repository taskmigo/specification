# 4. Functional and Behavioral Requirements

This section defines the **runtime security and managed installation behavior** of Taskmigo's Web and Migration applications. OAuth and public API wire shapes are specified in [section 3](03-external-interface-requirements.md); User deletion states are owned by [Identity](../005.%20Identity%20and%20User%20Retention/README.md).

## 4.1 Token and Principal Security

### AUTHN-FR-001 — Interactive login eligibility

**Required behavior:** Interactive login SHALL resolve an Identity User with an existing stored credential and status `ACTIVE`. Missing credentials or any non-ACTIVE lifecycle state SHALL prevent successful interactive authentication.

**Managed identity:** A valid System User interactive principal SHALL receive its defined system authority; this is not a blanket permission for ordinary Users.

### AUTHN-FR-002 — JWT signing

The authorization server SHALL load RSA private signing material from its configured path and sign JWTs using `RS256` with the configured key ID. When development key generation is disabled, absence of the required signing key SHALL cause startup failure rather than silently generating a new identity.

### AUTHN-FR-003 — Development key generation

**Condition:** key autocreation is explicitly enabled and the configured key file is missing.

**Required behavior:** The system SHALL generate a 3072-bit RSA keypair, save the PEM private key with owner-restricted permissions where supported, and preserve an existing key on subsequent restarts. A deployed key SHALL not be overwritten just because autocreation is enabled.

### AUTHN-FR-004 — Request policy enforcement

Versioned API security SHALL reject unsupported/non-JWT authentications, unknown `principal_type`, absent or malformed `user_id`, a User not currently `ACTIVE`, or a denied Request Authorization decision.

**After success:** Web SHALL attach the same-operation Authorization Context for subsequent resource-specific Object Authorization, not evaluate a different principal snapshot for the same request.

## 4.2 Persistent Session and OAuth Grants

### AUTHN-FR-005 — Session persistence

Interactive HTTP sessions SHALL be persisted using JDBC/Spring Session. The default maximum inactive interval SHALL be **30 minutes** and the cookie name SHALL be `JSESSIONID`. Session persistence is not a substitute for current User lifecycle eligibility.

### AUTHN-FR-006 — Guarded authentication

An authenticated session read or save SHALL validate that the persisted User is still `ACTIVE`. When the session's referenced User is no longer eligible, authentication SHALL be denied and/or the session deleted instead of returning usable authenticated state.

### AUTHN-FR-007 — Guarded OAuth persistence

Interactive OAuth authorization and consent writes SHALL validate the referenced authenticated User and coordinate with the User lifecycle lock. A concurrent deletion/retention transition SHALL prevent post-deletion authorization or consent state from being reintroduced. The failure SHALL use an applicable OAuth error rather than a successful stale grant.

## 4.3 Managed Installation

### AUTHN-FR-008 — Installation validation

Before successful reconciliation, Migration SHALL reject duplicate managed User, Group, Role and Statement natural keys; invalid inter-resource references; duplicate internal OAuth client IDs; and attempts to adopt an existing unmanaged OAuth client as managed. Validation failures SHALL not leave a partially installed resource set.

### AUTHN-FR-009 — Reconciliation order

Migration SHALL handle explicitly absent managed entries and reconcile available resources in dependency order: **Statements, Roles, Groups, Users**, then configured OAuth client registrations. Reconciliation SHALL retain stable managed identities and use the provider-owned application interfaces.

### AUTHN-FR-010 — Transactional retry

The complete managed-resource reconciliation SHALL run within a `SERIALIZABLE` transaction, with no more than **three attempts** for supported transient database or constraint-related failures. Unsuccessful attempts SHALL not commit partial managed changes.

### AUTHN-FR-011 — Managed initial identities

The installed managed resource set SHALL include the reserved `system` User whose initial credential comes from `TM_SYSTEM_PASSWORD`, an `admin` User, a global Group, and their referenced Roles/Statements. The public runtime registration endpoint SHALL not weaken the privileged managed-identity rules.

### AUTHN-FR-012 — Managed secret preservation

OAuth client reconciliation SHALL compare the configured raw secret to the existing encoded secret safely. An unchanged matching encoded secret SHALL be preserved; a changed secret SHALL be encoded before persistence instead of being stored as plaintext.

## 4.4 Security acceptance boundary

Conformance requires live OAuth/HTTP integration tests exercising token claims, ACTIVE User checks, stale sessions, PKCE and redirect validation as well as reconciliation tests covering key stability, repeat execution, invalid references and secret handling. See [section 9](09-verification-validation-and-acceptance.md). Standard OAuth protocol errors remain distinct from Taskmigo API v0 errors.
