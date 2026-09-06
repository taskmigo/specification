# 8. Requirements Allocation and Dependencies

## 8.1 Assumptions and Dependencies

- The [Policy Language feature](../003.%20Policy%20Language/README.md) defines TPL syntax, typing, evaluation, partial evaluation, diagnostics, and queryability contracts.
- `target.api` is the only target shape defined by this SRS.
- The database is the authoritative source for effective authorization state.
- Request and Object Authorization share one operation-scoped snapshot.
- Request Authorization receives only the available `principal` and `request` inputs and does not load business resources.
- Object filtering is translated from residual typed Policy IR through a persistence-neutral Filter AST and then the resource query predicate.
- The initial object schema supports direct one-segment fields only.
- Future client filtering, relationship predicates, and additional Filter AST operators require the separate specification described in [Appendix B](11-appendices.md#111-future-extensions-non-normative).

## 8.2 Requirements Allocation

TPL owns policy-language semantics through the dependency above. This Authorization SRS owns Statement effects, target matching, effective authorization resolution, Authorization Snapshots, scope-dependent TPL Environment Schemas, residual Filter AST lowering, and persistence-side authorization filtering.

No other requirements allocation across products or future releases is specified.
