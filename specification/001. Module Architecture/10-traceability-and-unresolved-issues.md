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

## 10.4 Module Contract Traceability and Baseline Discipline

The [backend source snapshot](https://github.com/taskmigo/taskmigo/tree/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server) is **observed implementation evidence**, not an automatic replacement for approved SRS requirements. The table below links existing normative IDs to interface contracts and objective acceptance obligations. The stated acceptance coverage does **not** claim those tests were run during this documentation edit.

| Requirement IDs               | Behavior or interface                                                            | Normative SRS contract                                                                                   | Verification obligation                                                                                            |
| ----------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| ARCH-IF-002, ARCH-MOD-010–014 | Published interfaces, Gradle project boundaries and Spring Modulith declarations | [Module boundary contract](03-external-interface-requirements.md#35-consumerprovider-contract-ownership) | [ARCH-VER-001–008](09-verification-validation-and-acceptance.md#91-architecture-verification)                      |
| ARCH-IF-007, ARCH-MOD-009     | Worker retention composition                                                     | [Module boundary contract](03-external-interface-requirements.md#35-consumerprovider-contract-ownership) | [Independent acceptance](09-verification-validation-and-acceptance.md#94-independent-consumer-boundary-acceptance) |

### 10.4.1 Source-to-spec reconciliation

The documented project-dependency and application-interface boundaries are normative architecture constraints. Physical project metadata is observed evidence; do not infer a new public API from module classes or rewrite the approved constraints merely to match a current dependency shortcut.

For future changes, classify a finding as **approved requirement**, **observed as-is**, **proposed to-be**, **conflict/drift**, or **unresolved** before rewriting the normative contract. Source evidence should identify the actual backend commit or generated artifact. OpenAPI generation and test presence alone are not conformance evidence; compare the owning module contract, generated schema, and executed test outcome.
