# 10. Traceability and Unresolved Issues

Keep canonical semantics separate from consumer-profile restrictions and backend evidence. Unapproved JavaScript-like syntax is not a requirement.

## 10.1 Traceability

Each normative requirement has a stable identifier and observable verification objective. Cross-feature consumers SHALL reference the requirement IDs and section links defined by this SRS rather than duplicating language semantics.

## 10.2 Unresolved Issues

No unresolved language-semantic conflict is recorded for version 0.6.2.

Concrete deployment values for configurable compiler limits are implementation/configuration decisions provided every active configuration preserves finite limits.

Consumer-specific Compilation Profiles belong to consumer specifications and may only restrict the canonical language.

General-purpose function declarations/calls, first-class or standalone lambdas, recursion, general loops, additional intrinsics, and additional schema-defined types require an explicit future specification revision.

## 10.3 Backend Source Alignment

The physical project is `:modules:internal:language`. [CompilationFeature](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/internal/language/src/main/java/io/taskmigo/language/CompilationFeature.java) includes `UNARY_NOT` and `CONTAINS_INTRINSIC`, and the [ANTLR grammar](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/internal/language/src/main/antlr/io/taskmigo/language/antlr/EmbeddedLanguage.g4) recognizes `contains(...)`. Consumer-specific profiles in Authorization and Query are narrower than the canonical Language grammar.

## 10.4 Module Contract Traceability and Baseline Discipline

The [backend source snapshot](https://github.com/taskmigo/taskmigo/tree/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server) is **observed implementation evidence**, not an automatic replacement for approved SRS requirements. The table below links existing normative IDs to interface contracts and objective acceptance obligations. The stated acceptance coverage does **not** claim those tests were run during this documentation edit.

| Requirement IDs                  | Behavior or interface                           | Normative SRS contract                                                                    | Verification obligation                                                                                  |
| -------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| SYNTAX-001–004, ENV-001–004      | Compiler source modes, schema/profile features  | [Compilation interface](03-external-interface-requirements.md#32-compilation-environment) | [Consumer acceptance](09-verification-validation-and-acceptance.md#93-consumer-compatibility-acceptance) |
| EVAL-IF-001–002, PARTIAL-001–005 | Direct and partial evaluation result boundaries | [Evaluation contract](03-external-interface-requirements.md#33-evaluation-interface)      | [Execution acceptance](09-verification-validation-and-acceptance.md#92-execution-acceptance)             |

### 10.4.1 Source-to-spec reconciliation

The internal Language compiler/evaluator is not a standalone public REST service. Profile gating belongs to consumers: source grammar support alone SHALL NOT be used as evidence that client filtering or authorization permits the construct. Compiler resource-limit values are not invented by this update.

For future changes, classify a finding as **approved requirement**, **observed as-is**, **proposed to-be**, **conflict/drift**, or **unresolved** before rewriting the normative contract. Source evidence should identify the actual backend commit or generated artifact. OpenAPI generation and test presence alone are not conformance evidence; compare the owning module contract, generated schema, and executed test outcome.
