# 8. Requirements Allocation and Dependencies

## 8.1 Assumptions and Dependencies

- The [Embedded Language feature](../003.%20Embedded%20Language/README.md) defines program syntax, Semantic AST, typing, evaluation, partial evaluation, and diagnostics.
- `target.api` is the only target shape defined by this SRS.
- The database is the authoritative source for effective authorization state.
- Request and Object Authorization share one operation-scoped snapshot.
- Request Authorization receives only the available `principal` and `request` inputs and does not load business resources.
- Object filtering translates residual boolean Semantic AST expressions through a persistence-neutral Filter AST and then the resource query predicate.
- The initial object schema supports direct one-segment fields only.
- Future client filtering, relationship predicates, and additional Filter AST operators require the separate specification described in [Appendix B](11-appendices.md#111-future-extensions-non-normative).

## 8.2 Requirements Allocation

Embedded Language owns language syntax, Semantic AST, typing, control flow, evaluation, and partial evaluation. Authorization owns the Statement `policy` contract, Authorization Environment Schema, policy-result interpretation, Statement effects, scope rules, target matching, effective authorization resolution, Authorization Snapshots, Object queryability, Filter AST lowering, and persistence-side authorization filtering.

Request Authorization evaluates Embedded Language Semantic AST. Object Authorization partially evaluates Embedded Language Semantic AST and lowers residual boolean Semantic AST expressions to Filter AST.

No other requirements allocation across products or future releases is specified.
