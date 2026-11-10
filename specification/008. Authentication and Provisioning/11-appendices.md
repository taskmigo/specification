# 11. Appendices

The diagrams illustrate validated request and installation flows; the managed defaults may vary by deployment configuration.

## 11.1 Request Authorization Flow

```mermaid
flowchart TB
    jwt[JWT resource request] --> claims[Validate principal claims]
    claims --> active[Check persisted User ACTIVE]
    active --> policy[Resolve current Request policies]
    policy --> decision{Allowed?}
    decision -->|Yes| controller[Web controller]
    decision -->|No| reject[401 or 403]
    controller --> object[Object Authorization when applicable]
    object --> database[Authorized database query]
```

## 11.2 Managed Resource Reconciliation

```mermaid
flowchart TB
    yaml[Read YAML and environment] --> validation[Validate managed keys and references]
    validation --> tx[SERIALIZABLE transaction]
    tx --> absent[Delete explicitly absent resources]
    absent --> statements[Reconcile Statements]
    statements --> roles[Reconcile Roles]
    roles --> groups[Reconcile Groups]
    groups --> users[Reconcile Users]
    users --> clients[Reconcile OAuth clients]
```

## 11.3 Security Defaults

The managed browser OAuth client uses PKCE, authorization-code and refresh-token grants, five-minute access tokens, eight-hour non-reusable refresh tokens; server session default inactivity is 30 minutes. These are configuration defaults, not guarantees for external clients.
