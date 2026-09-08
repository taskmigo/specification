# 8. Requirements Allocation and Dependencies

## 8.1 Assumptions and Dependencies

- The [Embedded Language feature](../003.%20Embedded%20Language/README.md) defines source modes, Compilation Profiles, Semantic AST, typing, evaluation, partial evaluation, and diagnostics.
- Statement `policy` uses Embedded Language `PROGRAM` mode with the Authorization policy Compilation Profile defined by STMT-003 and POLICY-001.
- `target.api` is the only target shape defined by this SRS.
- The database is the authoritative source for effective authorization state.
- Request and Object Authorization share one operation-scoped snapshot.
- Request Authorization receives only the available `principal` and `request` inputs and does not load business resources.
- Object filtering validates residual boolean Semantic AST expressions against Filter Schema and compiles the validated expressions directly to the resource query predicate.
- The initial object schema supports direct one-segment fields only.
- A separate Filter AST is not part of the normative Authorization contract.
- Future client filtering and relationship predicates require the separate specification described in [Appendix B](11-appendices.md#111-future-extensions-non-normative).

## 8.2 Requirements Allocation

Embedded Language owns canonical language syntax, source modes, Compilation Profile semantics, Semantic AST, typing, control flow, evaluation, and partial evaluation. Authorization owns the Statement `policy` contract, selection of the Authorization policy Compilation Profile, Authorization Environment Schema, policy-result interpretation, Statement effects, scope rules, target matching, effective authorization resolution, Authorization Snapshots, Object queryability, Filter Schema mapping, Object Predicate composition, and persistence-side authorization filtering.

Request Authorization evaluates Embedded Language Semantic AST. Object Authorization partially evaluates Embedded Language Semantic AST and uses residual boolean Semantic AST expressions directly as Object Predicates after Authorization-owned queryability validation.

Persistence adapters own translation from a validated Object Predicate plus Filter Schema to the persistence query API. Any implementation-private persistence representation SHALL NOT redefine Authorization or Embedded Language semantics.

No other requirements allocation across products or future releases is specified.
