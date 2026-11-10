# 6. Quality and Performance Requirements

## 6.1 Security

### AUTHN-QUAL-001 — Fail-closed authorization

Missing identity claims, invalid principal type, stale User state, malformed JWT identity, or policy errors SHALL not grant access to protected endpoints.

### AUTHN-QUAL-002 — Post-deletion session safety

User deletion SHALL prevent older sessions and OAuth state writes from restoring a retained/tombstoned account as authenticated, including competing read/write operations.

### AUTHN-QUAL-003 — Credential storage

OAuth client secrets and User password hashes SHALL be stored encoded/hashed. Signed token production SHALL use the configured asymmetric RSA key rather than an ephemeral unsigned token.

## 6.2 Installation Consistency

### AUTHN-QUAL-004 — Atomic installation

Installation SHALL validate all declarations before applying them, preserve managed/unmanaged OAuth client ownership, and apply reconciliation in one serializable transaction.

### AUTHN-QUAL-005 — Idempotent reconciliation

Repeated installation with unchanged declarative resources SHALL preserve stable identities and avoid unnecessary secret re-encoding or resource mutation.
