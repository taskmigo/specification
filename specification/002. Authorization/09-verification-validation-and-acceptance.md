# 9. Verification, Validation, and Acceptance Evidence

## 9.1 Required Scenarios

### AUTH-VER-001 — Request default deny

Verify no effective allow leads to denied access and matching deny overrides allow.

### AUTH-VER-002 — Fail closed

Verify invalid policy result, evaluation error, missing authorization context or invalid path target never grants access.

### AUTH-VER-003 — Compiler profiles

Verify REQUEST accepts permitted program constructs and rejects disallowed features, while OBJECT accepts permitted expression constructs and rejects local bindings, conditional flow, IN/arithmetic and unsupported quantifiers.

### AUTH-VER-004 — Effective grants

Verify direct User/Group Statements, Role assignments and transitive Role inheritance contribute as specified, with no duplicate grant amplification.

### AUTH-VER-005 — Object predicate correctness

Verify `(any allow) AND NOT (any deny)` and operation-scoped Query Schema validation, including runtime custom fields.

### AUTH-VER-006 — Database authorization

Verify list/read/update/delete object restrictions are enforced by database predicates rather than post-query collection filtering.

### AUTH-VER-007 — Runtime policy changes

Verify a new operation uses current DB grants/policy source rather than stale cached Statement artifacts.

### AUTH-VER-008 — No fabricated Authorization Log API

Verify the current OpenAPI surface does not claim `GET /api/v0/authorization/logs`. Audit coverage SHALL be verified independently.

## 9.2 Evidence

- [RequestAuthorizationDecider](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/authorization/src/main/java/io/taskmigo/authorization/request/domain/RequestAuthorizationDecider.java).
- [ObjectAuthorizationPredicateComposer](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/authorization/src/main/java/io/taskmigo/authorization/object/domain/ObjectAuthorizationPredicateComposer.java).
- [Authorization policy compilation profiles](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/authorization/src/main/java/io/taskmigo/authorization/embeddedlanguage/AuthorizationCompilationProfile.java).
- [Web ObjectAuthorization integration tests](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/test/java/io/taskmigo/web/security/objectauthorization/ObjectAuthorizationRouteIntegrationTest.java).

This SRS describes required test coverage, not a claim that the tests have run during document generation.
