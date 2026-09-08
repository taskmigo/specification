# 8. Requirements Allocation and Dependencies

## 8.1 Assumptions and Dependencies

- [Embedded Language](../003.%20Embedded%20Language/README.md) defines language syntax, Compilation Profiles, Semantic AST, typing, intrinsics, evaluation, and partial evaluation.
- Statement policy uses `PROGRAM` mode with an Authorization-owned Compilation Profile.
- `target.api` is the only authorization target shape defined here.
- The database is authoritative for effective authorization state.
- Request and Object Authorization share one operation-scoped Authorization Context.
- Resource-owning modules define Object Authorization Schemas and persistence binders for governed resource query surfaces.
- `web` owns Spring Security/MVC adaptation.

## 8.2 Requirements Allocation

- Authorization SHALL define Statement policy semantics, effective authorization state, Request decisions, Object Authorization Schemas, and Object Authorization Predicates.
- Embedded Language SHALL parse, type, evaluate, and partially evaluate policy source.
- Resource-owning modules SHALL provide Object Authorization Schemas and map Object Authorization Predicates to persistence queries.
- `web` SHALL adapt Spring Security inputs/results and current-request Authorization Context access.
- Embedded Language SHALL NOT own Object Authorization queryability, persistence mappings, or authorization decision semantics.
