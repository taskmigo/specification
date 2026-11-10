# 4. Functional and Behavioral Requirements

Security requirements enforce persisted ACTIVE User eligibility at login, token use, sessions and OAuth grant writes, and require atomic managed reconciliation.

## 4.1 Token and Principal Security

### AUTHN-FR-001 — Interactive login eligibility

**Normative requirement.** Interactive login SHALL require an existing User credential and the User's ACTIVE status. The System User SHALL be assigned its system authority in the interactive principal model.

### AUTHN-FR-002 — JWT signing

**Normative requirement.** The authorization server SHALL load an RSA private signing key from its configured path, use RS256 with key ID, and fail startup if the required key is absent when automatic development generation is disabled.

### AUTHN-FR-003 — Development key generation

**Normative requirement.** When explicitly configured to auto-create a missing key, key generation SHALL use a 3072-bit RSA keypair, write a PEM private key with restricted owner permissions where supported, and avoid overwriting an existing key.

### AUTHN-FR-004 — Request policy enforcement

**Normative requirement.** The Request Authorization manager SHALL reject non-JWT authentications, unknown `principal_type`, missing/malformed `user_id`, non-ACTIVE User, and Request Authorization denial. It SHALL attach same-operation Authorization Context to the HTTP request for subsequent Object Authorization resolution.

## 4.2 Persistent Session and OAuth Grants

### AUTHN-FR-005 — Session persistence

**Normative requirement.** Spring Session SHALL persist HTTP sessions in JDBC with a default maximum inactive interval of 30 minutes and `JSESSIONID` cookie naming.

### AUTHN-FR-006 — Guarded authentication

**Normative requirement.** Authenticated session retrieval and save SHALL verify persisted User ACTIVE status. An invalid session SHALL be deleted or denied, not restored as authenticated state.

### AUTHN-FR-007 — Guarded OAuth persistence

**Normative requirement.** Interactive OAuth authorization and consent writes SHALL validate the corresponding authenticated User and run through the User-session lifecycle lock. Ineligible writes SHALL fail using OAuth errors rather than recreating authorization/consent state after User deletion.

## 4.3 Managed Installation

### AUTHN-FR-008 — Installation validation

**Normative requirement.** Migration SHALL reject duplicate managed User/Group/Role/Statement keys, invalid references, duplicate internal OAuth client IDs and attempts to adopt an unmanaged existing OAuth client.

### AUTHN-FR-009 — Reconciliation order

**Normative requirement.** Migration SHALL handle explicitly absent managed entries, reconcile active Statements before Roles, Roles before Groups, and Groups before Users, and reconcile configured OAuth clients through their managed repository.

### AUTHN-FR-010 — Transactional retry

**Normative requirement.** The complete installation reconciliation SHALL run inside a `SERIALIZABLE` transaction; retries SHALL be bounded to three attempts for transient database or constraint-related failures.

### AUTHN-FR-011 — Managed initial identities

**Normative requirement.** Managed resources SHALL include the reserved `system` account with initial credential sourced from the configured `TM_SYSTEM_PASSWORD` placeholder, an `admin` account, a global Group and their referenced Roles/Statements. The managed initial System credential requirement SHALL not be weakened by public User registration.

### AUTHN-FR-012 — Managed secret preservation

**Normative requirement.** OAuth client reconciliation SHALL preserve the existing encoded secret when it matches the desired raw secret, and encode a changed secret rather than storing it in plaintext.
