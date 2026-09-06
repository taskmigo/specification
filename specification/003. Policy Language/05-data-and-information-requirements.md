# 5. Data and Information Requirements

## 5.1 Value and Schema Data

### DATA-001 — Immutable policy values

Values supplied to evaluation SHALL be treated as immutable for the duration of the evaluation operation.

TPL SHALL NOT expose mutable host objects directly to policy expressions. Consumer-provided values SHALL be represented through the typed value boundary defined by the Environment Schema.

Verification: Supply mutable host data through an adapter, mutate the host object during a test, and confirm the policy-visible value does not gain mutation capabilities.
Traceability: EVAL-IF-001; [Isolation and Host Access](07-constraints.md#74-isolation-and-host-access).

### DATA-002 — Environment Schema identity

A compiled policy artifact SHALL be associated with the Environment Schema contract against which it was type-checked.

A compiled artifact SHALL NOT be reused under a schema whose roots, path types, nullability, or query capabilities are incompatible with the compiled artifact.

Verification: Reuse a compiled artifact with compatible and incompatible schema revisions and confirm incompatible reuse is rejected.
Traceability: ENV-001; DATA-003.

## 5.2 Compiled Policy Artifacts

### DATA-003 — Compiled artifact metadata

A compiled policy artifact SHALL contain or be associated with enough immutable metadata to verify that it matches the exact source and compilation contract used to produce it.

At minimum, the identity SHALL cover:

- The policy source content or a collision-resistant source fingerprint.
- The TPL language version.
- The Environment Schema identity or compatible revision fingerprint.
- The compiler contract required to preserve the parsed control-flow and typed Policy IR semantics.

Verification: Change each identity input independently and confirm a stale artifact cannot be treated as an exact match.
Traceability: [Compilation Reuse](06-quality-and-performance-requirements.md#63-compilation-reuse).

### DATA-004 — Source locations

Policy IR or associated diagnostic metadata SHALL preserve source spans sufficient to report the location of parse, binding, control-flow, type, complexity, and queryability errors to a policy author.

Verification: Produce one error in each category and confirm diagnostics identify the relevant source range.
Traceability: DIAG-001.

## 5.3 Lifecycle and Persistence

TPL does not prescribe where policy source or compiled artifacts are persisted.

A consumer MAY cache compiled artifacts as derived data when the artifact identity satisfies DATA-002 and DATA-003. Such caching SHALL NOT make policy source or authorization state less authoritative than the consuming feature's source-of-truth requirements.

Retention, deletion, and regulatory requirements are Not applicable because no independent TPL persistence store is specified.
