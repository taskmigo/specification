# 4. Functional and Behavioral Requirements

## 4.1 Policy Compilation and Evaluation

### POLICY-001 — Per-scope Language profile

Request Statements SHALL compile in Language `PROGRAM` mode. Object Statements SHALL compile in Language `EXPRESSION` mode, preserving `principal` and `request` roots while leaving approved `object` paths symbolic for database filtering.

### POLICY-002 — Explicit feature gating

A policy SHALL use only features allowed by its authorization scope's compilation profile. Request supports local bindings and conditionals; Object policy does not. Arithmetic, arbitrary `IN` and collection quantifiers SHALL NOT be implicitly supported merely because the generic Language grammar can represent them.

### POLICY-003 — Safe policy evaluation

Request policy evaluation errors and malformed result types SHALL fail closed. Object partial evaluation errors, unsupported expression forms, or query-schema mapping failures SHALL fail closed.

### POLICY-004 — Per-operation artifact lifetime

Executable Statement derivatives SHALL be compiled for matching Statements in one operation snapshot. A global compiled-policy cache or persisted Statement revision SHALL NOT be assumed by this baseline.

### POLICY-005 — Safe method and path targeting

Target matching SHALL use exact method or `*`, and bounded regular-expression full-path matching without query string. Invalid target expressions SHALL not grant access.

## 4.2 Request Authorization

### REQ-001 — Default deny

An operation with no matching effective allow SHALL be denied.

### REQ-002 — Deny overrides

A matching deny policy SHALL override all matching allows. A policy execution error SHALL result in denial, not provisional access.

### REQ-003 — Same-operation context

The authorized request SHALL retain its immutable effective Statement snapshot and approved roots for downstream Object Authorization; re-evaluating another HTTP operation SHALL resolve a new snapshot.

## 4.3 Object Authorization

### OBJ-001 — Allow/deny predicate composition

The logical predicate SHALL evaluate as `(allow1 OR allow2 ... ) AND NOT (deny1 OR deny2 ... )`. No allows SHALL mean false. Denies SHALL override allows for matching objects.

### OBJ-002 — Safe partial evaluation

Object-scope policies SHALL evaluate known principal/request data while preserving unresolved approved Object references as a symbolic residual expression.

### OBJ-003 — Allowlisted object paths

Every Object field/operator used by a predicate SHALL be validated against the operation's Query Schema and exact runtime field context.

### OBJ-004 — Database execution

Resource-specific persistence adapters SHALL bind Object predicates through trusted path-to-JPA mappings and execute them before pagination or target mutation. They SHALL NOT filter unrestricted fetched rows in JVM memory.

### OBJ-005 — Context and schema identity

Object predicates SHALL remain scoped to the same operation Query Schema identity and runtime field snapshot; mismatches SHALL be rejected rather than silently broadened.

## 4.4 Effective Subject and Role Hierarchy

### AUTH-FR-001 — Effective grants

Effective Statements SHALL include direct subject Statements and those reached through direct Role grants and transitive Role hierarchy relationships after Identity supplies effective User/Group subjects.

### AUTH-FR-002 — Acyclic Role hierarchy

Role hierarchy updates SHALL reject cycles, validate referenced child Roles and keep transitive closure consistent with direct edges.

## 4.5 Superseded Decision Logging

The former `LOG-001` through `LOG-005` requirements to persist an Authorization decision log are withdrawn from the implemented baseline. User mutation audit, where present, is specified separately in [Audit and API Contracts](../007.%20Audit%20and%20API%20Contracts/README.md).
