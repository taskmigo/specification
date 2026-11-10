# 3. External Interface Requirements

This chapter specifies observable OAuth client/claim behavior and internal installation interfaces. Standard OAuth discovery metadata owns actual protocol endpoint locations; Taskmigo v0 resource routes remain separate.

## 3.1 OAuth/OIDC

### AUTHN-API-001 — OAuth server

**Normative requirement.** The Web application SHALL offer Spring Authorization Server endpoints with OIDC enabled, registered OAuth clients persisted through JDBC, and JWT validation of protected resource requests.

### AUTHN-API-002 — Browser client profile

**Normative requirement.** The managed `browser` client SHALL support `authorization_code` and `refresh_token` grant types, require PKCE, and expose the configured redirect/logout URIs. Its configured defaults SHALL use `openid`/`profile` scopes, five-minute access tokens, eight-hour refresh tokens, and no refresh-token reuse.

### AUTHN-API-003 — Interactive principal

**Normative requirement.** Interactive credentials SHALL be looked up from Identity's User service and rejected when no credential exists or User is not ACTIVE.

### AUTHN-API-004 — Token claims

**Normative requirement.** For User access tokens, the server SHALL include `principal_type="user"`, `user_id`, and `principal_username` for an ACTIVE user when resolution succeeds. For client-credentials tokens it SHALL identify `principal_type="service"` and the client subject, and MAY attach System User claims when that managed User is ACTIVE.

## 3.2 API Security

### AUTHN-API-005 — Versioned API guard

**Normative requirement.** `/api/v*/**` SHALL use JWT resource-server authentication followed by Request Authorization. Missing/invalid authentication SHALL be denied; an authenticated principal without the approved claims or ACTIVE User status SHALL not be authorized.

### AUTHN-API-006 — HTTP security errors

**Normative requirement.** Versioned API security failures SHALL be rendered as 401 unauthorized or 403 forbidden in the matching API version's response format when its renderer is registered.

## 3.3 Internal Installation Interface

### AUTHN-API-007 — Managed resources

**Normative requirement.** Migration SHALL load declarative `users.yaml`, `roles.yaml`, `statements.yaml`, `groups.yaml` and optional `security.yaml` OAuth client definitions from classpath resources, applying environment placeholder resolution to configured credentials.

### AUTHN-API-008 — Browser provisioning toggle

**Normative requirement.** When `TM_BROWSER_AUTHENTICATION_ENABLED=false`, the Migration resource loader SHALL omit the managed browser-client definitions from its installation plan; it SHALL NOT infer external login configuration.

## 3.4 Consumer-Facing Security and OAuth Profile

The OAuth/OIDC endpoints are provided by the configured authorization-server framework; they are **not** the same API surface as Taskmigo's `/api/v0/**` resource controllers. The public OAuth discovery/authorization/token/JWKS/logout operations SHALL be taken from the configured authorization-server metadata and verified by integration tests rather than inventing a parallel proprietary route inventory in this SRS.

### 3.4.1 Managed browser client and token contract

| Property               | Configured baseline                                                          |
| ---------------------- | ---------------------------------------------------------------------------- |
| Client ID              | `browser`                                                                    |
| Client authentication  | `client_secret_basic`; configured secret is supplied through the environment |
| Grant types            | `authorization_code`, `refresh_token`                                        |
| Scopes                 | `openid`, `profile`                                                          |
| PKCE                   | Required                                                                     |
| Authorization consent  | Not required by the managed client defaults                                  |
| Redirect URI           | `${TM_BROWSER_HOST_NAME:http://localhost}/api/auth/callback`                 |
| Post-logout URI        | `${TM_BROWSER_HOST_NAME:http://localhost}/`                                  |
| Access-token duration  | `PT5M`                                                                       |
| Refresh-token duration | `PT8H`                                                                       |
| Refresh-token reuse    | Disabled                                                                     |

The [managed security resource](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd88311e328a3784d0e1/server/apps/migration/src/main/resources/migration/security.yaml) provides source-backed deployment defaults, not a license to assume browser provisioning is enabled for every installation. The `TM_BROWSER_AUTHENTICATION_ENABLED=false` gate remains authoritative.

### 3.4.2 JWT claims and authorization outcome

| Principal path                 | Required access-token claims                                          | Access boundary                                                                        |
| ------------------------------ | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Interactive User               | `principal_type=user`, `user_id` as UUID string, `principal_username` | The referenced User SHALL be ACTIVE; Request Authorization SHALL permit the operation  |
| Client credentials             | `principal_type=service` and client subject                           | System User claims MAY be added only if an ACTIVE managed System User exists           |
| Unknown or malformed principal | No successful grant implied                                           | Missing/malformed `user_id`, invalid principal type or non-ACTIVE User SHALL be denied |

For the versioned `/api/v*/**` API, absence/invalidity of credentials SHALL be distinguished from authenticated but forbidden requests: HTTP 401 versus HTTP 403. [API envelope rendering](../007.%20Audit%20and%20API%20Contracts/03-external-interface-requirements.md) applies when the corresponding API version's renderer is registered. A service token SHALL NOT be interpreted as an interactive User token merely because its subject resembles a username.

### 3.4.3 Internal installation and state integration

Managed installation SHALL read `users.yaml`, `roles.yaml`, `statements.yaml`, `groups.yaml`, and optionally `security.yaml` with configured placeholder resolution; this is not a public runtime HTTP administration API. User lifecycle revocation is owned by [Identity](../005.%20Identity%20and%20User%20Retention/README.md). Session and OAuth authorization persistence SHALL guard against inactive or retained User state as defined by [AUTHN-FR-005–007](04-functional-and-behavioral-requirements.md#42-persistent-session-and-oauth-grants).

### 3.4.4 Not exposed

This baseline SHALL NOT assert user-organization login routing, social federation, MFA enrollment, or runtime OAuth client self-registration as implemented public features. Each requires an approved specification and source-backed interface contract before consumers rely on it.
