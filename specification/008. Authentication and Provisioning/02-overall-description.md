# 2. Overall Description

## 2.1 Authentication and protected-resource pipeline

Web exposes Spring Authorization Server/OIDC capability, JDBC-backed OAuth registration/authorization/consent and RS256-signed JWTs. Interactive login resolves the persisted Identity User and rejects absent credentials or non-ACTIVE lifecycle state. Versioned resource endpoints validate JWT and principal claims, check the current persisted User, and evaluate Request Authorization before reaching a controller.

## 2.2 Principal kinds and claims

| Principal | Claim semantics | Versioned API eligibility |
| --- | --- | --- |
| User | `principal_type=user`, `user_id` UUID string and `principal_username` | Referenced User must be ACTIVE; Request Authorization must allow the operation |
| Service | `principal_type=service` and registered-client subject; optional System User claims only if active | Must not bypass persisted User identity and Request Authorization requirements |
| Missing/invalid | No valid supported principal or claims | Denied; distinguish unauthenticated 401 from authenticated forbidden 403 |

A token signature being valid is **not sufficient** when the referenced User has been deleted, retained, disabled or otherwise made ineligible.

## 2.3 Managed browser OAuth client

The managed `browser` client permits authorization code plus refresh token grants with PKCE, configured redirect/logout URI allowlists, `openid`/`profile` scopes, five-minute access tokens and eight-hour non-reusable refresh tokens. The resources are provisioned only when the browser authentication toggle allows them. Application clients must respect the actual deployed registration and protocol metadata.

## 2.4 Session and deletion coordination

Spring Session stores authenticated sessions in JDBC and identifies the User by stable UUID. Session reads and writes verify lifecycle eligibility; OAuth authorization/consent writes are guarded against races with User deletion. Invalidated sessions and grants cannot recreate an authenticated identity after a User becomes RETAINED or TOMBSTONE.

## 2.5 Managed installation

Migration reads declarative Users, Roles, Statements, Groups and optional OAuth client definitions. It validates unique keys/references, resolves managed entries in dependency order and reconciles them inside a SERIALIZABLE transaction with bounded retries. It must not adopt an unrelated OAuth client merely because its ID matches a managed declaration; unchanged encoded secrets should be preserved.

## 2.6 Scope exclusions

Identity Groups do not imply Organization or realm-specific login. No social login, SAML, MFA enrollment, third-party Keycloak broker flow or generic public OAuth client administration is included. External protocol endpoints are defined by the deployed authorization-server configuration, not copied into a speculative Taskmigo REST inventory.
