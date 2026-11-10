# 1. Introduction

## 1.1 Purpose

This SRS defines **how Taskmigo authenticates principals, issues OAuth/OIDC tokens, protects versioned HTTP APIs, persists and revokes interactive sessions, and installs managed identity/security resources**. It separates OAuth protocol endpoints from Taskmigo's own `/api/v0/**` resource contracts, and separates runtime authentication from one-shot managed installation.

The reviewed backend evidence is [commit `9c1cd242`](https://github.com/taskmigo/taskmigo/tree/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server). OAuth client defaults are sourced from the [managed browser definition](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/migration/src/main/resources/migration/security.yaml); they are not universal guarantees for arbitrary clients.

## 1.2 Scope

Web configures the authorization server, JWT claims, request security and session persistence. Identity is authoritative for whether the User remains ACTIVE. Authorization evaluates the Request policy and passes an operation context to relevant Object Authorization checks. Migration installs schema and reconciles managed Users, Groups, Roles, Statements and OAuth registered clients under dedicated transactional guarantees.

## 1.3 Terminology

| Term              | Meaning                                                                                      |
| ----------------- | -------------------------------------------------------------------------------------------- |
| Interactive User  | Identity User with a configured password credential and ACTIVE lifecycle state               |
| Service principal | Client-credentials token subject marked `principal_type=service`, distinct from a User login |
| PKCE              | Proof Key for Code Exchange required by the managed browser authorization-code client        |
| Registered client | Persisted OAuth client identity with allowed grants, redirects, scopes and secrets           |
| Guarded session   | Persisted authenticated session that rechecks User lifecycle eligibility                     |
| Managed resource  | Declaratively configured identity/authorization/client record reconciled by Migration        |
| Managed client    | Registered OAuth client explicitly marked as owned by the installation reconciler            |

## 1.4 Source and related contracts

- [Authorization server configuration](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/oauth/AuthorizationServerConfiguration.java).
- [Versioned API security configuration](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/security/ApiSecurityConfiguration.java).
- [Migration installer](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/migration/src/main/java/io/taskmigo/migration/installation/MigrationInstaller.java).
- [Identity](../005.%20Identity%20and%20User%20Retention/README.md), [Authorization](../002.%20Authorization/README.md) and [API errors](../007.%20Audit%20and%20API%20Contracts/README.md).

## 1.5 Consumer guidance

[Section 3](03-external-interface-requirements.md) provides the managed browser profile, JWT claim contract, HTTP 401/403 behavior and installation resource interfaces. [Section 4](04-functional-and-behavioral-requirements.md) defines security and lifecycle invariants. [Section 9](09-verification-validation-and-acceptance.md) gives integration acceptance cases. The framework's actual OAuth endpoint paths must be verified from deployed discovery metadata, not guessed as fixed proprietary routes.
