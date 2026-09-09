# 8. Requirements Allocation and Dependencies

## 8.1 Assumptions and Dependencies

- [Module Architecture](../001.%20Module%20Architecture/README.md) defines the mandatory dependency direction and consumer-neutral boundary for the `language` module.
- The Environment Schema defines root names, structured paths, types, nullability, and symbolic availability.
- Each compilation supplies a Compilation Profile selecting one mode and enabled feature families.
- Each evaluation operation supplies required roots as known or unknown values.
- The parser frontend depends on the ANTLR Java runtime.
- Consumer-specific purposes, queryability, authorization semantics, and persistence translation remain external.

## 8.2 Requirements Allocation

- The `language` module SHALL parse canonical `PROGRAM` and `EXPRESSION` sources and enforce supplied Compilation Profiles.
- The `language` module SHALL bind/type-check roots, structured paths, locals, restricted lambdas, and bounded intrinsics.
- The `language` module SHALL validate complete typed return flow in `PROGRAM`, produce typed Semantic AST, and evaluate/partially evaluate it.
- The `language` module MAY depend on `foundation` as permitted by [Module Architecture](../001.%20Module%20Architecture/08-requirements-allocation-and-dependencies.md#82-allowed-dependency-model).
- The `language` module SHALL NOT depend on `query`, `authorization`, `identity`, `web`, or resource-specific persistence modules.
- External consumers SHALL supply root/path contracts, Compilation Profiles, and runtime values.
- External consumers SHALL own queryability, authorization semantics, persistence mappings, and other consumer-specific semantics.
