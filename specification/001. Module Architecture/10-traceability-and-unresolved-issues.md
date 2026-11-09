# 10. Traceability and Unresolved Issues

## 10.1 Traceability

| Concern                             | Requirement references                     | Implementation evidence                                                                                                                                                                                  |
| ----------------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Domain, application and persistence | ARCH-MOD-012 • ARCH-CON-013 • ARCH-VER-006 | [Server architecture](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/ARCHITECTURE.md)                                                                         |
| Physical modules                    | ARCH-DATA-001 • ARCH-DATA-004              | [Gradle settings](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/settings.gradle.kts)                                                                         |
| Named interfaces                    | ARCH-MOD-010 • ARCH-MOD-011 • ARCH-CON-011 | [Spring Modulith tests](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/web/src/test/java/io/taskmigo/ModulithArchitectureTest.java)                      |
| Transactions                        | ARCH-MOD-012 • ARCH-CON-013                | [Migration installer](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/apps/migration/src/main/java/io/taskmigo/migration/installation/MigrationInstaller.java) |
| Public resource ownership           | ARCH-MOD-005 • ARCH-MOD-007 • ARCH-MOD-006 | [Authorization](../002.%20Authorization/README.md) • [Tickets](../006.%20Tickets%20and%20Dynamic%20Fields/README.md)                                                                                     |

## 10.2 Superseded Baseline

The former normative requirement to use Hexagonal Architecture, mandatory driving/driven port packages, and application-owned transaction runner ports is superseded. The old `:modules:access-control`, `:modules:language`, and `:modules:database` compile-contract assumptions are superseded by current Gradle project identities and dependencies. Existing stable ARCH-* requirement identifiers are retained with corrected contracts.

## 10.3 Unresolved Issues

No new architecture runtime SLAs or module decomposition mandates are introduced in this code-alignment revision. Future changes to runtime module topology require updating the project graph and its tests.
