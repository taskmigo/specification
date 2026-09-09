# 10. Traceability and Unresolved Issues

## 10.1 Traceability

| Architectural concern                   | Requirements                                              | Related specification                                     |
| --------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------- |
| Foundation as dependency floor          | ARCH-MOD-001 • ARCH-CON-001 • ARCH-CON-002 • ARCH-CON-003 | All feature specifications.                               |
| Language module isolation               | ARCH-MOD-003 • ARCH-CON-004                               | [Language](../003.%20Language/README.md).                 |
| Query capability ownership              | ARCH-MOD-004 • ARCH-CON-005                               | [Query Filtering](../004.%20Query%20Filtering/README.md). |
| Authorization capability ownership      | ARCH-MOD-005 • ARCH-CON-006                               | [Authorization](../002.%20Authorization/README.md).       |
| Resource-specific persistence ownership | ARCH-MOD-006 • ARCH-CON-007                               | Authorization and Query Filtering resource integrations.  |
| Identity resource ownership             | ARCH-MOD-007                                              | Future Identity specification.                            |
| Web adaptation                          | ARCH-MOD-008 • ARCH-CON-008                               | Feature specifications exposing public web behavior.      |
| Application composition                 | ARCH-MOD-009 • ARCH-CON-009                               | Executable application specifications and configuration.  |

## 10.2 Unresolved Issues

### ARCH-TBR-001 — Role resource ownership

The canonical ownership of the Role resource is TBR. It SHALL be resolved by its domain semantics: a Role defined primarily as an authorization-policy aggregation belongs to `authorization`; a Role with independent identity-management lifecycle semantics may belong to `identity` while its authorization semantics remain in `authorization`.

Resolution condition: Resolve when the Role contract and lifecycle are next materially revised or when an Identity specification is introduced.

Owner: Taskmigo architecture maintainers.

### ARCH-TBR-002 — Automated enforcement mechanism

The specific build or architecture-testing mechanism used to enforce module dependency rules is TBR. The mechanism selected SHALL satisfy [ARCH-QUAL-003](06-quality-and-performance-requirements.md#arch-qual-003--module-boundary-verification) without changing the normative dependency model.

Resolution condition: Resolve when automated module-boundary enforcement is introduced into the implementation repository.

Owner: Taskmigo implementation maintainers.
