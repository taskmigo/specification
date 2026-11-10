# 10. Traceability and Unresolved Issues

## 10.1 Implementation Traceability

| Area                     | Requirement IDs   | Code evidence                                                                                                                                                                                                    |
| ------------------------ | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OAuth server, claims     | AUTHN-API-001–004 | [AuthorizationServerConfiguration](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/oauth/AuthorizationServerConfiguration.java) |
| API security             | AUTHN-API-005–006 | [RequestAuthorizationManager](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/security/RequestAuthorizationManager.java)        |
| Signing keys             | AUTHN-FR-002–003  | [SigningKeyStore](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/oauth/SigningKeyStore.java)                                   |
| Session guard            | AUTHN-FR-005–007  | [GuardedSessionRepository](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/security/session/GuardedSessionRepository.java)      |
| Managed installation     | AUTHN-FR-008–012  | [MigrationInstaller](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/migration/src/main/java/io/taskmigo/migration/installation/MigrationInstaller.java)          |
| Installed browser client | AUTHN-API-002     | [security.yaml](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/migration/src/main/resources/migration/security.yaml)                                             |

## 10.2 Not Implemented by This Baseline

Organization-specific authentication, social login federation, SAML, MFA configuration and general client self-registration are not implemented public contracts. No behavior for those capabilities SHALL be inferred.

## 10.3 Snapshot Scope

Source commit `9c1cd242fe4c5210fdd8dd88311e328a3784d0e1` is the audited implementation reference; later changes need their own conformance assessment.

## 10.4 Module Contract Traceability and Baseline Discipline

The [backend source snapshot](https://github.com/taskmigo/taskmigo/tree/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server) is **observed implementation evidence**, not an automatic replacement for approved SRS requirements. The table below links existing normative IDs to interface contracts and objective acceptance obligations. The stated acceptance coverage does **not** claim those tests were run during this documentation edit.

| Requirement IDs | Behavior or interface | Normative SRS contract | Verification obligation |
| --- | --- | --- | --- |
| AUTHN-API-001–006, AUTHN-FR-001–007 | OAuth client, principal claims, JWT security, interactive sessions | [Security interface](03-external-interface-requirements.md#34-consumer-facing-security-and-oauth-profile) | [Client acceptance](09-verification-validation-and-acceptance.md#95-independent-client-and-lifecycle-acceptance) |
| AUTHN-API-007–008, AUTHN-FR-008–012 | Managed YAML resource definitions and browser toggle | [Provisioning interface](03-external-interface-requirements.md#343-internal-installation-and-state-integration) | [Installation verification](09-verification-validation-and-acceptance.md#93-installation) |

### 10.4.1 Source-to-spec reconciliation

The documented managed browser client default values come from pinned migration resources. The active OAuth route inventory shall be obtained from runtime authorization-server metadata rather than invented fixed application routes. Organization login, social federation and MFA are not current public contracts.

For future changes, classify a finding as **approved requirement**, **observed as-is**, **proposed to-be**, **conflict/drift**, or **unresolved** before rewriting the normative contract. Source evidence should identify the actual backend commit or generated artifact. OpenAPI generation and test presence alone are not conformance evidence; compare the owning module contract, generated schema, and executed test outcome.
