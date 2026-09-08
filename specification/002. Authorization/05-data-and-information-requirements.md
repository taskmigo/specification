# 5. Data and Information Requirements

## 5.1 Authorization State

The canonical Statement contract and operation snapshot define the authorization state used for one operation.

An `ObjectAuthorizationSchema<Q>` SHALL have a stable identity sufficient to distinguish incompatible changes to API-visible object paths, types, nullability, collection element contracts, and accepted operators.

An `ObjectAuthorizationPredicate<Q>` SHALL retain enough internal identity to prevent persistence binding under an incompatible Object Authorization Schema.

Verification: Change Object Authorization Schema properties independently and confirm stale compiled policies/predicates are not treated as compatible.
Traceability: AUTH-API-004; POLICY-004.

## 5.2 Data Integrity and Lifecycle

Statement state read from the database SHALL be authoritative for the current operation.

Authorization Snapshot, Authorization Context, and request-derived Object Authorization Predicates SHALL remain operation-scoped and SHALL NOT be reused as authorization input for unrelated later operations.

Policy inputs SHALL NOT expose repositories, entities, or arbitrary host APIs.

Verification: Execute sequential operations with changed Statement/schema state and inspect isolation.
Traceability: SNAPSHOT-002; SNAPSHOT-004; TECH-003.
