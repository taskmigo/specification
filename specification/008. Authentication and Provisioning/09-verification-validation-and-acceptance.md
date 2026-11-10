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

## 9.5 Independent Client and Lifecycle Acceptance

| Scenario | Setup and request | Expected result |
| --- | --- | --- |
| Browser PKCE | Managed browser client requests authorization_code without the required verifier/challenge | Authorization is denied; valid configured code+PKCE completes |
| Redirect allowlist | Browser client requests an unregistered redirect URI | OAuth server rejects the request instead of redirecting to an arbitrary destination |
| Service principal | Client-credentials token is issued for an authorized OAuth client | `principal_type=service` and client subject, with System User claims only when eligible |
| Inactive User | Reuse a valid previously issued interactive token after the User is RETAINED | Versioned API request is denied even if the token signature remains valid |
| Session write race | Attempt session/OAuth consent persistence after a User becomes non-ACTIVE | The write is rejected or revoked without recreating usable credentials |
| Browser toggle | Run managed installation with browser authentication disabled | Browser client definitions are omitted from the installation plan |
| Secret preservation | Reconcile an unchanged managed client secret | Stored encoded secret is preserved; an altered secret is encoded before storage |

Assertions SHALL distinguish OAuth protocol errors, 401 unauthenticated API responses and 403 authenticated-but-forbidden API responses. The [configuration profile](03-external-interface-requirements.md#341-managed-browser-client-and-token-contract) SHALL be checked against the actual managed resource and authorization-server metadata.
