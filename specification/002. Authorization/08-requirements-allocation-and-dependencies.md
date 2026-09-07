# 8. Requirements Allocation and Dependencies

## 8.1 Assumptions and Dependencies

- The [Embedded Language feature](../003.%20Embedded%20Language/README.md) defines program syntax, typing, evaluation, partial evaluation, diagnostics, and generic queryability contracts without imposing an Authorization-specific result type.
- Authorization requires every Statement policy to have static Embedded Language result type `Bool`.
- `target.api` is the only target shape defined by this SRS.
- The database is the authoritative source for effective authorization state.
- Request and Object Authorization share one operation-scoped snapshot.
- Request Authorization receives only the available `principal` and `request` inputs and does not load business resources.
- Object filtering is translated from residual typed Language IR through a persistence-neutral Filter AST and then the resource query predicate.
- The initial object schema supports direct one-segment fields only.
- Future client filtering, relationship predicates, and additional Filter AST operators require the separate specification described in [Appendix B](11-appendices.md#111-future-extensions-non-normative).

## 8.2 Requirements Allocation

The Embedded Language owns language syntax, typing, control flow, static program-result inference, evaluation, partial evaluation, and generic queryability semantics. This Authorization SRS owns the required `Bool` result contract for Statement policies, the `principal`, `request`, and `object` root contracts, Statement effects, scope rules, target matching, effective authorization resolution, Authorization Snapshots, residual Filter AST lowering, and persistence-side authorization filtering.

A valid non-`Bool` Embedded Language program MAY be consumed by another Taskmigo feature but SHALL NOT satisfy the Authorization Statement policy contract.

No other requirements allocation across products or future releases is specified.
