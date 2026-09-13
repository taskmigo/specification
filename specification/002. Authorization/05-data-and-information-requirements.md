# 5. Data and Information Requirements

## 5.1 Authorization State

The canonical Statement contract and operation snapshot define the authorization state used for one operation.

An `ObjectAuthorizationSchema<Q>` SHALL have a stable identity sufficient to distinguish incompatible changes to API-visible object paths, types, nullability, collection element contracts, and accepted operators.

An `ObjectAuthorizationPredicate<Q>` SHALL retain enough internal identity to prevent persistence binding under an incompatible Object Authorization Schema.

Verification: Change Object Authorization Schema properties independently and confirm stale compiled policies/predicates are not treated as compatible.
Traceability: AUTH-API-004; POLICY-004.

### STATE-001 — Effective Statement revision metadata

Every effective persisted Statement resolved for an authorization operation SHALL include database-owned revision metadata sufficient to distinguish successive committed versions of the same Statement.

A persistence timestamp such as `updated_at` MAY be used as that revision when it strictly advances for successive committed changes to the corresponding Statement row. The revision is internal persistence metadata and SHALL NOT become part of the canonical Statement contract defined by STMT-001 and STMT-007.

The effective-Statement persistence adapter SHALL return the current revision together with the current Statement after the required database lookup.

Verification: Persist a Statement, resolve it, update the persisted Statement, resolve it again, and confirm the revision changes while the canonical Statement representation remains unchanged by the metadata field.
Traceability: POLICY-004; PERF-004.

### STATE-002 — Derived artifact revision identity

After current Statement state has been loaded from the database, Authorization MAY use the effective Statement revision from STATE-001 as the Statement-revision component of derived execution-artifact identity.

Reuse SHALL additionally require compatible Language/compiler identity, scope Environment Schema identity, Compilation Profile identity, and, for Object Authorization, the identity of the `ObjectAuthorizationSchema<Q>` supplied to the current operation as required by POLICY-004.

The effective Statement revision is an Authorization-layer freshness signal. It SHALL NOT replace the exact-source and compilation-contract metadata required inside a Language compiled artifact by [Language DATA-003](../003.%20Language/05-data-and-information-requirements.md#data-003--compiled-artifact-metadata).

Verification: Reuse a derived artifact for the same database revision, then independently change the Statement revision, compiler contract, Environment Schema, Compilation Profile, and supplied Object Authorization Schema identity and confirm each incompatible case prevents reuse.
Traceability: POLICY-004; [Language DATA-003](../003.%20Language/05-data-and-information-requirements.md#data-003--compiled-artifact-metadata).

## 5.2 Authorization Log Data

### LOG-DATA-001 — Persisted Authorization Log record

Each persisted Authorization Log SHALL have a unique `id` and `createdAt` timestamp and SHALL record:

- An `authorizationType` of `REQUEST` or `OBJECT`.
- An `outcome` of `ALLOWED`, `DENIED`, or `ERROR`.
- A `level` of `INFO`, `WARNING`, or `ERROR` consistent with LOG-002 and LOG-003.
- The request HTTP method and path used by the authorization operation.
- The principal identifier when one is available to the authorization operation.
- The Object Authorization type or query-surface identifier when `authorizationType` is `OBJECT` and that identifier is available.
- A stable error code and safe diagnostic message when `outcome` is `ERROR`.

Fields that do not apply to an outcome or authorization type MAY be absent or null. Persisted/public diagnostic text SHALL NOT include stack traces, secrets, raw credentials, or internal persistence/compiler implementation details.

Verification: Persist all Request/Object outcome variants and inspect required fields, enum constraints, conditional fields, and diagnostic redaction.
Traceability: LOG-001 through LOG-004; LOG-API-003.

### LOG-DATA-002 — Log ordering identity

Authorization Log persistence SHALL preserve `createdAt` and unique `id` values sufficient for deterministic ordering by `createdAt` descending and then `id` descending as required by LOG-API-002.

Verification: Persist multiple logs with identical or near-identical timestamps and confirm repeated paginated reads use deterministic ordering.
Traceability: LOG-API-002.

## 5.3 Data Integrity and Lifecycle

Statement state read from the database SHALL be authoritative for the current operation.

Authorization Snapshot, Authorization Context, and request-derived Object Authorization Predicates SHALL remain operation-scoped and SHALL NOT be reused as authorization input for unrelated later operations.

Authorization Logs SHALL be historical outputs of authorization operations and SHALL NOT participate in effective Statement resolution or authorization decisions.

Policy inputs SHALL NOT expose repositories, entities, or arbitrary host APIs.

Verification: Execute sequential operations with changed Statement/schema state, inspect snapshot isolation, and confirm persisted logs do not affect subsequent decisions.
Traceability: SNAPSHOT-002; SNAPSHOT-004; LOG-005; TECH-003.
