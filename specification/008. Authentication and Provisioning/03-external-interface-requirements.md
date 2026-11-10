# 3. External Interface Requirements

## 3.1 OAuth/OIDC

### AUTHN-API-001 — OAuth server

The Web application SHALL offer Spring Authorization Server endpoints with OIDC enabled, registered OAuth clients persisted through JDBC, and JWT validation of protected resource requests.

### AUTHN-API-002 — Browser client profile

The managed `browser` client SHALL support `authorization_code` and `refresh_token` grant types, require PKCE, and expose the configured redirect/logout URIs. Its configured defaults SHALL use `openid`/`profile` scopes, five-minute access tokens, eight-hour refresh tokens, and no refresh-token reuse.

### AUTHN-API-003 — Interactive principal

Interactive credentials SHALL be looked up from Identity's User service and rejected when no credential exists or User is not ACTIVE.

### AUTHN-API-004 — Token claims

For User access tokens, the server SHALL include `principal_type="user"`, `user_id`, and `principal_username` for an ACTIVE user when resolution succeeds. For client-credentials tokens it SHALL identify `principal_type="service"` and the client subject, and MAY attach System User claims when that managed User is ACTIVE.

## 3.2 API Security

### AUTHN-API-005 — Versioned API guard

`/api/v*/**` SHALL use JWT resource-server authentication followed by Request Authorization. Missing/invalid authentication SHALL be denied; an authenticated principal without the approved claims or ACTIVE User status SHALL not be authorized.

### AUTHN-API-006 — HTTP security errors

Versioned API security failures SHALL be rendered as 401 unauthorized or 403 forbidden in the matching API version's response format when its renderer is registered.

## 3.3 Internal Installation Interface

### AUTHN-API-007 — Managed resources

Migration SHALL load declarative `users.yaml`, `roles.yaml`, `statements.yaml`, `groups.yaml` and optional `security.yaml` OAuth client definitions from classpath resources, applying environment placeholder resolution to configured credentials.

### AUTHN-API-008 — Browser provisioning toggle

When `TM_BROWSER_AUTHENTICATION_ENABLED=false`, the Migration resource loader SHALL omit the managed browser-client definitions from its installation plan; it SHALL NOT infer external login configuration.

## 3.4 Versioned API Wire Examples

The [API v0 HTTP and JSON reference](../007.%20Audit%20and%20API%20Contracts/12-api-v0-http-examples.md) contains authenticated resource API requests and responses. OAuth/OIDC protocol routes are provided by Spring Authorization Server rather than by the 29 `/api/v0` resource controllers, and their protocol surface is not represented as additional v0 CRUD routes.
