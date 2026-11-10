# 5. Data and Information Requirements

Statement identity, role hierarchy and immutable operation snapshots are the data contracts. Identity's User/Group data remains owned by Identity.

## 5.1 Statement State

### STATE-001 — Canonical Statement

**Normative requirement.** A persisted Statement SHALL have ID, code, description, effect, scope, API target method/path and policy source. Managed reconciliation preserves ID/code while allowing updates to other fields. No persisted policy revision is required by current code.

### STATE-002 — Subject and hierarchy associations

**Normative requirement.** Direct Role/Statement assignments SHALL use persisted subject bindings distinct from hierarchy/closure and managed User/Group state. Effective grants SHALL combine applicable direct and inherited records.

## 5.2 Policy Operation State

An `AuthorizationSnapshot` SHALL contain User UUID, immutable executable Statement artifacts and approved immutable policy input roots. `StatementExecutionArtifact` SHALL hold target matching and compiled source derived for the current operation.

## 5.3 Retired Authorization Log Requirements

The old `LOG-DATA-001` and `LOG-DATA-002` prescribed a separate persisted decision log table, decision outcomes, actor snapshots and query indexes. These requirements are withdrawn: only the Entity Audit `audit_logs` data model exists in the backend. Do not interpret this withdrawal as disabling the independent Audit capability.

## 5.4 Roles and Grants

Role and Group hierarchy closure tables and subject-role/subject-statement bindings SHALL follow the ownership and integrity constraints in the [version 1 schema](https://github.com/taskmigo/taskmigo/blob/9c1cd242fe4c5210fdd8dd88311e328a3784d0e1/server/modules/database/src/main/resources/db/migration/V1__schema.sql).
