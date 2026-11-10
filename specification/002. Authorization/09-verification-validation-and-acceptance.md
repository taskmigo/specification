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

## 9.3 HTTP Contract and Security Acceptance

| Scenario                     | Required assertion                                                                                                                                                           | Related contract                                                                                                |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Statement creation           | A valid body produces HTTP 201, UUID `data.id`, Location header; invalid lowercase effect/scope or missing mandatory fields is rejected with the applicable validation error | [Statement contract](03-external-interface-requirements.md#361-create-statement-and-statement-response)         |
| Statement projection         | List response returns nested `target.api.method`/`path`; the enum-valued response is not assumed identical to lowercase request input                                        | [Statement contract](03-external-interface-requirements.md#361-create-statement-and-statement-response)         |
| Role recursive projection    | List response exposes `children`; nullable `description` and empty child projection follow the documented omission rules                                                     | [Role contract](03-external-interface-requirements.md#362-create-role-role-response-and-assignment-replacement) |
| Direct Statement replacement | Sending a nonempty `statementIds` set replaces previous direct assignments; omission or null clears them; inherited grants remain separately resolved                        | [AUTH-API-004](03-external-interface-requirements.md#auth-api-004--role-statement-replacement)                  |
| Query metadata               | For both Role and Statement lists, only declared filter operators and sort fields are accepted and emitted in OpenAPI extensions                                             | [Allowlist](03-external-interface-requirements.md#363-allowed-filter-and-sort-fields)                           |
| Object security              | A list with inaccessible objects reports only accessible records and authorized `totalItems`; invalid policies fail closed                                                   | [Object authorization](04-functional-and-behavioral-requirements.md#43-object-authorization)                    |

For the interface scenarios, verify the HTTP envelope and application error code, not merely the HTTP status. This matrix describes acceptance obligations; no test run is claimed here.
