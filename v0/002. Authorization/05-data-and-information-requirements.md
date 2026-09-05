# 5. Data and Information Requirements

## 5.1 Authorization Data

The authorization data boundary is defined by the canonical Statement contract and the effective authorization state used to create an operation snapshot.

- [Statement contract](03-external-interface-requirements.md#31-statement-contract) defines the Statement fields, policy source, target, and canonical persistence/API contract.
- [Operation snapshot](03-external-interface-requirements.md#32-authorization-inputs-and-operation-snapshot) defines operation-scoped authorization state.
- [Object filtering](04-functional-and-behavioral-requirements.md#43-object-authorization-and-shared-filter-ast) defines object-field mapping, Filter AST, and persistence query translation.

## 5.2 Data Integrity, Privacy, and Lifecycle

Statement state read from the database is authoritative for the current operation. Invalid policy data SHALL not become active, and policy inputs SHALL not expose repositories, entities, or arbitrary host APIs. Retention, deletion, and regulatory requirements are Not applicable because they are not specified by the source authorization contract.
