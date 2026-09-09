# 8. Requirements Allocation and Dependencies

## 8.1 Assumptions and Dependencies

- [Module Architecture](../001.%20Module%20Architecture/README.md) defines the mandatory dependency direction and module ownership constraints for Authorization and its consumers.
- [Language](../003.%20Language/README.md) defines language syntax, Compilation Profiles, Semantic AST, typing, intrinsics, evaluation, and partial evaluation.
- Statement policy uses `PROGRAM` mode with an Authorization-owned Compilation Profile.
- `target.api` is the only authorization target shape defined here.
- The database is authoritative for effective authorization state.
- Request and Object Authorization share one operation-scoped Authorization Context.
- Resource-owning modules define Object Authorization Schemas and persistence binders for governed resource query surfaces.
- `web` owns Spring Security/MVC adaptation.

## 8.2 Requirements Allocation

- The `authorization` module SHALL define Statement policy semantics, effective authorization state, Request decisions, Object Authorization Schemas, Object Authorization Predicates, and Authorization-specific Language integration.
- The `authorization` module MAY depend on `foundation` and `language` as permitted by [Module Architecture](../001.%20Module%20Architecture/08-requirements-allocation-and-dependencies.md#82-allowed-dependency-model).
- The `authorization` module SHALL NOT depend on `identity`, `query`, `web`, or resource-specific persistence modules for its core authorization semantics.
- The `language` module SHALL parse, type, evaluate, and partially evaluate Language policy source.
- Resource-owning modules SHALL provide resource-specific Object Authorization Schemas and map Object Authorization Predicates to persistence queries.
- `web` SHALL adapt Spring Security inputs/results and current-request Authorization Context access.
- The `language` module SHALL NOT own Object Authorization queryability, persistence mappings, or authorization decision semantics.
