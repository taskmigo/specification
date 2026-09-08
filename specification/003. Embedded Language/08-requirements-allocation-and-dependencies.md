# 8. Requirements Allocation and Dependencies

## 8.1 Assumptions and Dependencies

- The Environment Schema defines root names, structured paths, types, nullability, and symbolic availability.
- Each compilation supplies a Compilation Profile selecting one mode and enabled feature families.
- Each evaluation operation supplies required roots as known or unknown values.
- The parser frontend depends on the ANTLR Java runtime.
- Consumer-specific purposes, queryability, and persistence translation remain external.

## 8.2 Requirements Allocation

- Embedded Language SHALL parse canonical `PROGRAM` and `EXPRESSION` sources and enforce supplied Compilation Profiles.
- Embedded Language SHALL bind/type-check roots, structured paths, locals, restricted lambdas, and bounded intrinsics.
- Embedded Language SHALL validate complete typed return flow in `PROGRAM`, produce typed Semantic AST, and evaluate/partially evaluate it.
- External consumers SHALL supply root/path contracts, Compilation Profiles, and runtime values.
- External consumers SHALL own queryability, persistence mappings, and consumer-specific semantics.
