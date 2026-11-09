# 10. Traceability and Unresolved Issues

## 10.1 Implementation Traceability

| Area | Requirement IDs | Code evidence |
| --- | --- | --- |
| OAuth server, claims | AUTHN-API-001–004 | [AuthorizationServerConfiguration](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/oauth/AuthorizationServerConfiguration.java) |
| API security | AUTHN-API-005–006 | [RequestAuthorizationManager](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/security/RequestAuthorizationManager.java) |
| Signing keys | AUTHN-FR-002–003 | [SigningKeyStore](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/oauth/SigningKeyStore.java) |
| Session guard | AUTHN-FR-005–007 | [GuardedSessionRepository](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/main/java/io/taskmigo/web/security/session/GuardedSessionRepository.java) |
| Managed installation | AUTHN-FR-008–012 | [MigrationInstaller](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/migration/src/main/java/io/taskmigo/migration/installation/MigrationInstaller.java) |
| Installed browser client | AUTHN-API-002 | [security.yaml](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/migration/src/main/resources/migration/security.yaml) |

## 10.2 Not Implemented by This Baseline

Organization-specific authentication, social login federation, SAML, MFA configuration and general client self-registration are not implemented public contracts. No behavior for those capabilities SHALL be inferred.

## 10.3 Snapshot Scope

Source commit `9c1cd242fe4c5210fdd8dd88311e328a3784d0e1` is the audited implementation reference; later changes need their own conformance assessment.
