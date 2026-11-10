# 8. Requirements Allocation and Dependencies

## 8.1 Assumptions and Dependencies

- [Module Architecture](../001.%20Module%20Architecture/README.md) defines the mandatory dependency direction and consumer-neutral boundary for the `:modules:internal:language` module.
- The Environment Schema defines root names, structured paths, types, nullability, and symbolic availability.
- Each compilation supplies a Compilation Profile selecting one mode and enabled feature families.
- Each evaluation operation supplies required roots as known or unknown values.
- The parser frontend depends on the ANTLR Java runtime.
- Consumer-specific purposes, queryability, authorization semantics, and persistence translation remain external.

## 8.2 Requirements Allocation

- The `:modules:internal:language` module SHALL parse canonical `PROGRAM` and `EXPRESSION` sources and enforce supplied Compilation Profiles.
- The `:modules:internal:language` module SHALL bind/type-check roots, structured paths, locals, restricted lambdas, and bounded intrinsics.
- The `:modules:internal:language` module SHALL validate complete typed return flow in `PROGRAM`, produce typed Semantic AST, and evaluate/partially evaluate it.
- The current `:modules:internal:language` project has no direct Taskmigo module dependencies; future changes SHALL preserve its downstream consumer independence.
- The `:modules:internal:language` module SHALL NOT depend on `query`, `authorization`, `identity`, `web`, or resource-specific persistence modules.
- External consumers SHALL supply root/path contracts, Compilation Profiles, and runtime values.
- External consumers SHALL own queryability, authorization semantics, persistence mappings, and other consumer-specific semantics.
