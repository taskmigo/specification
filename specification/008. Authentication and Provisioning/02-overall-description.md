# 2. Overall Description

## 2.1 Web Authentication

Taskmigo Web configures Spring Authorization Server with OIDC endpoints, JDBC registered clients/authorizations/consents, RS256 JWT signing and resource-server JWT validation. Interactive accounts use the canonical Identity User model and are disabled unless ACTIVE.

## 2.2 API Authorization

Versioned endpoints `/api/v*/**` require a JWT principal with supported type, valid `user_id`, an ACTIVE persisted User, and the Request Authorization policy decision. Object Authorization is evaluated downstream by resource-specific operations for relevant rows.

## 2.3 Session Security

Interactive servlet authentication is stored in PostgreSQL-backed Spring Session. Session reads/writes and OAuth authorization/consent writes are guarded by User ACTIVE status and coordinated with deletion using a persisted User row lock.

## 2.4 Installation

The Migration app applies Flyway schema and then one-shot managed-resource reconciliation. It loads YAML Users, Roles, Statements, Groups and OAuth clients, validates reference consistency, and applies changes atomically with Serializable isolation and bounded retries.

## 2.5 Out of Scope

No organization-specific login realm, social login provider, SAML integration, customizable MFA, or external Keycloak provider is claimed by this implementation. The browser client resource is not a general public OAuth-client management API.
