# 10. Traceability and Unresolved Issues

## 10.1 Traceability

| Architectural concern                     | Requirements                                                                                            | Related specification                                     |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Shared foundation library                 | ARCH-MOD-001 • ARCH-CON-001 • ARCH-CON-002 • ARCH-CON-003 • ARCH-QUAL-001 • ARCH-QUAL-002               | All feature specifications.                               |
| Language supporting capability            | ARCH-MOD-003 • ARCH-CON-004                                                                             | [Language](../003.%20Language/README.md).                 |
| Query supporting capability               | ARCH-MOD-004 • ARCH-CON-005                                                                             | [Query Filtering](../004.%20Query%20Filtering/README.md). |
| Access Control bounded context            | ARCH-MOD-005 • ARCH-CON-006 • ARCH-MOD-013 • ARCH-MOD-014                                               | [Authorization](../002.%20Authorization/README.md).       |
| Role and Statement canonical ownership    | ARCH-MOD-005 • ARCH-MOD-013 • ARCH-VER-003                                                              | Authorization and Access Control persistence.             |
| Subject binding and Identity integration  | ARCH-MOD-005 • ARCH-MOD-007 • ARCH-MOD-014 • ARCH-CON-015 • ARCH-VER-007                                | Authorization and Identity integration.                   |
| Resource-specific persistence ownership   | ARCH-MOD-006 • ARCH-CON-007 • ARCH-CON-014 • ARCH-VER-008                                               | All resource-owning bounded contexts.                     |
| Identity bounded context                  | ARCH-MOD-007 • ARCH-CON-006 • ARCH-VER-003                                                              | Future Identity specification.                            |
| Web adaptation                            | ARCH-MOD-008 • ARCH-CON-008                                                                             | Feature specifications exposing public web behavior.      |
| Application composition                   | ARCH-MOD-009 • ARCH-CON-009                                                                             | `web`, `worker`, and `migration` composition.              |
| Spring Modulith boundary enforcement      | ARCH-MOD-010 • ARCH-MOD-011 • ARCH-CON-010 • ARCH-CON-011 • ARCH-VER-005                                | All JVM implementation modules.                           |
| DDD + Onion + Hexagonal package enforcement | ARCH-MOD-012 • ARCH-CON-012 • ARCH-CON-013 • ARCH-VER-004 • ARCH-VER-006                              | Bounded contexts and executable adapter boundaries.       |
| Gradle public dependency exposure            | ARCH-DATA-004 • ARCH-QUAL-002 • ARCH-CON-011                                                           | Reusable Java-library contracts.                           |
| Cross-context integration and persistence | ARCH-MOD-014 • ARCH-MOD-015 • ARCH-CON-014 • ARCH-CON-015 • ARCH-QUAL-003 • ARCH-VER-007 • ARCH-VER-008 | All bounded-context integrations.                         |

## 10.2 Unresolved Issues

No unresolved bounded-context ownership or port/adapter-direction issue is recorded for version 0.7.0.

Role ownership is intentionally revised from version 0.5.0. Access Control is now the sole canonical owner of Role lifecycle, Role persistence, Role hierarchy, Statement lifecycle, Role-to-Statement assignment, and subject-binding semantics. Identity owns User, Group, Membership, and group hierarchy and integrates with Access Control through published inbound contracts or by implementing the Access-Control-owned subject-resolution outbound port.

The Java package namespace used for Authorization APIs MAY remain `io.taskmigo.authorization`; package vocabulary does not change the canonical bounded-context identity `access-control` or permit Identity to regain ownership of Access Control resources.

The normative tactical model for state-changing bounded contexts is DDD + Onion Architecture + Hexagonal Architecture. Supporting capabilities MAY use a simpler structure when no meaningful port/adapter boundary exists.
