# 10. Traceability and Unresolved Issues

## 10.1 Traceability

Each normative requirement has a stable identifier and observable verification objective. Cross-feature consumers SHALL reference the requirement IDs and section links defined by this SRS rather than duplicating language semantics.

## 10.2 Unresolved Issues

No unresolved language-semantic conflict is recorded for version 0.6.2.

Concrete deployment values for configurable compiler limits are implementation/configuration decisions provided every active configuration preserves finite limits.

Consumer-specific Compilation Profiles belong to consumer specifications and may only restrict the canonical language.

General-purpose function declarations/calls, first-class or standalone lambdas, recursion, general loops, additional intrinsics, and additional schema-defined types require an explicit future specification revision.

## 10.3 Backend Source Alignment

The physical project is `:modules:internal:language`. [CompilationFeature](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/internal/language/src/main/java/io/taskmigo/language/CompilationFeature.java) includes `UNARY_NOT` and `CONTAINS_INTRINSIC`, and the [ANTLR grammar](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/internal/language/src/main/antlr/io/taskmigo/language/antlr/EmbeddedLanguage.g4) recognizes `contains(...)`. Consumer-specific profiles in Authorization and Query are narrower than the canonical Language grammar.
