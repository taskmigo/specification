# 10. Traceability and Unresolved Issues

## 10.1 Traceability

| Architectural concern                   | Requirements                                                                                           | Related specification                                     |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| Shared foundation library               | ARCH-MOD-001 • ARCH-CON-001 • ARCH-CON-002 • ARCH-CON-003 • ARCH-QUAL-001 • ARCH-QUAL-002              | All feature specifications.                               |
| Language module isolation               | ARCH-MOD-003 • ARCH-CON-004                                                                            | [Language](../003.%20Language/README.md).                 |
| Query capability ownership              | ARCH-MOD-004 • ARCH-CON-005                                                                            | [Query Filtering](../004.%20Query%20Filtering/README.md). |
| Authorization capability ownership      | ARCH-MOD-005 • ARCH-CON-006                                                                            | [Authorization](../002.%20Authorization/README.md).       |
| Role semantics and resource integration | ARCH-MOD-005 • ARCH-MOD-006 • ARCH-MOD-007 • ARCH-VER-003                                              | Authorization and Identity resource integration.          |
| Resource-specific persistence ownership | ARCH-MOD-006 • ARCH-CON-007                                                                            | Authorization and Query Filtering resource integrations.  |
| Identity resource ownership             | ARCH-MOD-007                                                                                           | Future Identity specification.                            |
| Web adaptation                          | ARCH-MOD-008 • ARCH-CON-008                                                                            | Feature specifications exposing public web behavior.      |
| Application composition                 | ARCH-MOD-009 • ARCH-CON-009                                                                            | Executable application specifications and configuration.  |
| Logical module boundary enforcement     | ARCH-MOD-010 • ARCH-MOD-011 • ARCH-CON-010 • ARCH-CON-011 • ARCH-CON-012 • ARCH-VER-005 • ARCH-VER-006 | All JVM implementation modules.                           |

## 10.2 Unresolved Issues

No unresolved module-ownership issue is recorded for version 0.5.0.

Role ownership is resolved by ARCH-MOD-005 through ARCH-MOD-007: `authorization` owns Role authorization contracts, hierarchy rules, and policy-aggregation semantics; a resource-owning module such as `identity` MAY own Role lifecycle, persistence, query mapping, and API-facing resource integration while consuming those Authorization-owned semantics.
