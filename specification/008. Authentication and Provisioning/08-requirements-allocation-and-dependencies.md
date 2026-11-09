# 8. Requirements Allocation and Dependencies

## 8.1 Modules

- **Web:** OAuth/OIDC server, resource-server security, token claims, JWT key management, request guard, Spring Session, guarded OAuth persistence.
- **Identity:** Canonical User identity/status and User-session lifecycle checks, persistent OAuth/session storage entities.
- **Authorization:** Request and Object policy decisions.
- **Migration:** Flyway execution, YAML loading, managed resource validation/reconciliation, internal browser-client provisioning.
- **Database:** JDBC/JPA runtime support and single major-version `V1__schema.sql`.
- **Worker:** Scheduler only, not an alternate authorization server or schema migration owner.

## 8.2 Integration

Web SHALL consult the published Identity service for account state. Web security SHALL delegate Request decision semantics to Authorization without importing its private persistence. Migration SHALL use provider-owned Identity and Authorization provisioning APIs.

## 8.3 Related SRSs

[Authorization](../002.%20Authorization/README.md) owns policy syntax and deny-overrides decision semantics. [Identity](../005.%20Identity%20and%20User%20Retention/README.md) owns account deletion/status. [Audit and API](../007.%20Audit%20and%20API%20Contracts/README.md) owns API v0 error envelopes.
