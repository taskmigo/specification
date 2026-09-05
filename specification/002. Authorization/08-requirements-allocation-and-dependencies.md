# 8. Requirements Allocation and Dependencies

## 8.1 Assumptions and Dependencies

- target.api is the only target shape defined by this SRS.
- The database is the authoritative source for effective authorization state.
- Request and Object Authorization share one operation-scoped snapshot.
- Request Authorization receives only the available `principal` and `request` inputs and does not load business resources.
- Object filtering is translated through a persistence-neutral Filter AST and then the resource query predicate.
- The initial object schema supports direct one-segment fields only.
- Future client filtering, relationship predicates, and additional operators require the separate specification described in [Appendix B](11-appendices.md#111-future-extensions).

## 8.2 Requirements Allocation

Not applicable. This SRS describes one authorization capability set and does not allocate requirements across future releases or separate products.
