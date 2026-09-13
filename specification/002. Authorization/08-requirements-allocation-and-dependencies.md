# 8. Requirements Allocation and Dependencies

## 8.1 Assumptions and Dependencies

- [Module Architecture](../001.%20Module%20Architecture/README.md) defines the mandatory dependency direction and module ownership constraints for Authorization and its consumers.
- [Language](../003.%20Language/README.md) defines language syntax, Compilation Profiles, Semantic AST, typing, intrinsics, evaluation, and partial evaluation.
- Statement policy uses `PROGRAM` mode with an Authorization-owned Compilation Profile.
- `target.api` is the only authorization target shape defined here.
- The database is authoritative for effective authorization state.
- Effective persisted Statements expose database-owned revision metadata for Authorization-layer derived-artifact freshness.
- Request and Object Authorization share one operation-scoped Authorization Context.
- Resource-owning modules define Object Authorization Schemas and persistence binders for governed resource query surfaces.
- Authorization owns the framework-neutral Object target applicability resolver contract.
- `web` owns Spring Security/MVC adaptation and derives Object target applicability from actual MVC handler metadata.

## 8.2 Requirements Allocation

- The `authorization` module SHALL define Statement policy semantics, effective authorization state, effective Statement revision semantics, Request decisions, Object Authorization Schemas, Object Authorization Predicates, the Object target applicability resolver contract, and Authorization-specific Language integration.
- The `authorization` module MAY depend on `foundation` and `language` as permitted by [Module Architecture](../001.%20Module%20Architecture/08-requirements-allocation-and-dependencies.md#82-allowed-dependency-model).
- The `authorization` module SHALL NOT depend on `identity`, `query`, `web`, or resource-specific persistence modules for its core authorization semantics.
- The `language` module SHALL parse, type, evaluate, and partially evaluate Language policy source and SHALL preserve the compiled-artifact metadata required by Language DATA-003.
- The persistence adapter responsible for effective Statement resolution SHALL return the current persisted Statement together with its database-owned revision metadata.
- Resource-owning modules SHALL provide resource-specific Object Authorization Schemas and map Object Authorization Predicates to persistence queries.
- `web` SHALL adapt Spring Security inputs/results and current-request Authorization Context access and SHALL derive Object Authorization target applicability from MVC handler mappings and typed Object Authorization predicate integration points.
- Executable non-web applications MAY provide explicit Object target metadata through the Authorization-owned target resolver contract when transport-derived metadata is unavailable.
- The `language` module SHALL NOT own Object Authorization queryability, target applicability, persistence mappings, or authorization decision semantics.
