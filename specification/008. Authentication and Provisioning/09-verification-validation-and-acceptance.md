# 9. Verification, Validation, and Acceptance Evidence

## 9.1 Authentication

### AUTHN-VER-001 — OAuth code/PKCE and tokens

Verify configured browser client accepts code+PKCE and refresh while enforcing registered client, allowed scopes, token duration and refresh reuse configuration.

### AUTHN-VER-002 — Principal claims and policy

Verify correct User/service claims, stale User rejection, missing/malformed UUID denial and Request Authorization context propagation.

### AUTHN-VER-003 — Signing key

Verify existing key loading, absent-key failure when required, configured development generation and stable signing identity across restart.

## 9.2 Session Lifecycle

### AUTHN-VER-004 — Session revocation

Verify authenticated sessions are not returned or recreated after User deletion and session writes are rejected when User is not ACTIVE.

### AUTHN-VER-005 — OAuth guard

Verify interactive OAuth authorization/consent writes fail when User lifecycle changes, while explicitly permitted client-credentials persistence follows the service-principal contract.

## 9.3 Installation

### AUTHN-VER-006 — Idempotent managed reconciliation

Verify repeated runs reconcile existing Users/Roles/Statements/Groups/clients without adopting unmanaged clients or rotating unchanged encoded secrets.

### AUTHN-VER-007 — Atomic failure and retry

Verify invalid references/duplicates fail, Serializable transaction prevents partial installation, and transient failures retry at most three times.

## 9.4 Evidence

- [Migration tests](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/migration/src/test).
- [OAuth and security implementation](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/oauth).
- [Session security implementation](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/security/session).

## 9.5 Managed Policy and Credential Acceptance

### AUTHN-VER-008 — Managed role grants and denied targets

Verify `system-operator` and `administrator` receive the declared Request/GET Object grants; User deletion/statement-mutation Deny Statements override allows; the administrator User list excludes `system`; and `basic-user` supplies no direct policy Statements.

### AUTHN-VER-009 — Managed versus runtime creation

Verify `system` and `admin` receive their explicitly configured Roles and Group membership, whereas public User creation with omitted role/group IDs receives none and does not create an initial credential.
