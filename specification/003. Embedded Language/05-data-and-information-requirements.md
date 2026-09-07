# 5. Data and Information Requirements

## 5.1 Value and Schema Data

### DATA-001 — Immutable program values

Values supplied to evaluation SHALL be treated as immutable for the duration of the evaluation operation.

The Embedded Language SHALL NOT expose mutable host objects directly to program expressions. Supplied values SHALL be represented through the typed value boundary defined by the Environment Schema.

Verification: Supply mutable host data through an adapter, mutate the host object during a test, and confirm the program-visible value does not gain mutation capabilities.
Traceability: EVAL-IF-001; [Isolation and Host Access](07-constraints.md#74-isolation-and-host-access).

### DATA-002 — Environment Schema identity

A compiled program artifact SHALL be associated with the Environment Schema against which it was type-checked.

A compiled artifact SHALL NOT be reused under a schema whose roots, path types, or nullability are incompatible with the compiled artifact.

Verification: Reuse a compiled artifact with compatible and incompatible schema revisions and confirm incompatible reuse is rejected.
Traceability: ENV-001; DATA-003.

## 5.2 Compiled Program Artifacts

### DATA-003 — Compiled artifact metadata

A compiled program artifact SHALL contain the Semantic AST or be associated with it and enough immutable metadata to verify that it matches the exact source and compilation contract used to produce it.

At minimum, the identity SHALL cover:

- The program source content or a collision-resistant source fingerprint.
- The Embedded Language version.
- The Environment Schema identity or compatible revision fingerprint.
- The compiler contract required to preserve Semantic AST semantics.

Verification: Change each identity input independently and confirm a stale artifact cannot be treated as an exact match.
Traceability: [Compilation Reuse](06-quality-and-performance-requirements.md#63-compilation-reuse); LANG-001.

### DATA-004 — Source locations

The Semantic AST or associated diagnostic metadata SHALL preserve source spans sufficient to report the location of parse, binding, control-flow, type, and complexity errors to a program author.

Verification: Produce one error in each category and confirm diagnostics identify the relevant source range.
Traceability: DIAG-001; LANG-001.

## 5.3 Lifecycle and Persistence

The Embedded Language does not prescribe where source or compiled artifacts are persisted.

A compiled artifact MAY be cached as derived data when the artifact identity satisfies DATA-002 and DATA-003.

Retention, deletion, and regulatory requirements are Not applicable because no independent Embedded Language persistence store is specified.
