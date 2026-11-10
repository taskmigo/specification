# 1. Introduction

## 1.1 Purpose

This SRS documents the implemented Taskmigo OAuth/OIDC authorization server, protected resource API, persistent sessions and managed installation/provisioning flow from backend commit `9c1cd242fe4c5210fdd8dd88311e328a3784d0e1`.

## 1.2 Scope

Web SHALL own authentication and JWT security adaptation; Migration SHALL reconcile managed Identity/Authorization/OAuth resources; Worker SHALL be a separately executable scheduled application. Authorization decision semantics remain in [Authorization](../002.%20Authorization/README.md).

## 1.3 Terminology

- **Interactive User:** Persisted User with initial credential, allowed to log in only when ACTIVE.
- **Service Principal:** OAuth `client_credentials` access-token principal, distinguished from interactive User claims.
- **Managed installation:** One-shot declarative reconciliation from resources under `apps/migration/src/main/resources/migration/`.
- **Browser client:** Internal OAuth registered client with authorization code, refresh token and PKCE.

## 1.4 Sources

- [OAuth server configuration](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/oauth/AuthorizationServerConfiguration.java).
- [API security configuration](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/security/ApiSecurityConfiguration.java).
- [Migration installer](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/migration/src/main/java/io/taskmigo/migration/installation/MigrationInstaller.java).
- [Browser registration](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/migration/src/main/resources/migration/security.yaml).

## 1.5 Organization

Sections 3–5 define the token, security, session, and provisioning contract; Section 9 records integration validation.
