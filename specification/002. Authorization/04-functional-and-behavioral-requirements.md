# 4. Functional and Behavioral Requirements

The following requirements define **authorization semantics independent of HTTP serialization**. Public Statement/Role request and response shapes are specified in [section 3](03-external-interface-requirements.md). These rules SHALL be verified against the same operation context and resource Query Schema, not a different evaluation snapshot.

## 4.1 Policy Compilation and Evaluation

### POLICY-001 — Per-scope Language profile

**Request policies:** SHALL compile in Language `PROGRAM` mode, using only the approved Request profile. Their evaluated decision SHALL be a valid Boolean.

**Object policies:** SHALL compile in Language `EXPRESSION` mode; `principal` and `request` roots are supplied as known values while approved `object` paths may remain symbolic for later database binding.

### POLICY-002 — Explicit feature gating

The system SHALL accept only features enabled by the policy's **actual scope-specific Compilation Profile**. Request policies may use permitted local `const` bindings and conditional statements; Object policies SHALL NOT use those statements. Generic Language support for arithmetic, arbitrary `IN`, quantifiers or other syntax SHALL NOT imply their availability in a policy.

### POLICY-003 — Safe policy evaluation

An invalid Request policy value, compile/evaluation error or malformed context SHALL be treated as denial. An Object partial-evaluation failure, unsupported expression form, missing field allowlist entry or incompatible Query Schema SHALL likewise fail closed. No failure may be replaced with an always-true predicate.

### POLICY-004 — Per-operation artifact lifetime

For each operation snapshot, matching Statements SHALL be compiled under the applicable profile before execution. The implementation SHALL NOT rely on a global compiled-policy cache, persisted Statement revision or unvalidated artifact reuse for security correctness.

### POLICY-005 — Safe method and path targeting

A Statement SHALL apply only where its declared HTTP method matches exactly or is `*`, and its bounded RE2/J-compatible path expression matches the **complete request path excluding query parameters**. Invalid, unbounded or unsupported targets SHALL not grant access.

## 4.2 Request Authorization

### REQ-001 — Default deny

Request Authorization SHALL deny an operation unless at least one matching **effective allow** Statement evaluates to true. An absence of applicable Statements or a set containing only nonmatching allows is not permission.

### REQ-002 — Deny overrides

A matching effective deny SHALL override any allows for the same operation. A policy execution error SHALL cause denial, not a deferred or provisional permission; callers must not ignore failures and proceed.

### REQ-003 — Same-operation context

Once a request is authorized, downstream Object Authorization SHALL reuse its immutable effective Statement list and approved principal/request input roots. A new HTTP operation SHALL create a fresh operation snapshot rather than treating the previous request's grant set as current.

## 4.3 Object Authorization

### OBJ-001 — Allow/deny predicate composition

For the target resource operation, the logical authorization predicate SHALL be:

```text
(allow_1 OR allow_2 OR ... OR allow_n)
AND NOT (deny_1 OR deny_2 OR ... OR deny_m)
```

An empty allow set SHALL produce false. Denies SHALL exclude matching objects even when an allow also matches. The expression represents an operation-scoped typed predicate—not raw client SQL.

### OBJ-002 — Safe partial evaluation

Known principal and request values SHALL be specialized while unresolved, schema-approved `object` field references remain as typed residual expressions. Unknown or malformed principal/request data SHALL not be treated as free variables granting access.

### OBJ-003 — Allowlisted object paths

Every referenced logical `object.<field>` and requested operator SHALL be declared for the target operation's Query Schema and exact runtime QueryFieldContext. Unknown paths, incompatible types or disallowed operators SHALL be rejected before persistence binding.

### OBJ-004 — Database execution

Each resource owner SHALL translate the approved logical predicate using **trusted resource-owned mappings** and apply it in the database before list pagination, read target selection, update or delete. Fetching unrestricted records and filtering them afterward in JVM memory SHALL not satisfy the authorization contract.

### OBJ-005 — Context and schema identity

The final predicate SHALL carry the exact operation Query Schema and runtime field context identity. An incompatible identity at persistence binding SHALL be rejected rather than broadened, silently ignored or converted into a permissive default.

## 4.4 Effective Subject and Role Hierarchy

### AUTH-FR-001 — Effective grants

Effective Statements SHALL resolve direct subject grants and Statements reached through direct Role assignments and transitive Role hierarchy. Identity SHALL supply the effective User and Group subject data through a published contract; Authorization SHALL retain ownership of Role, Statement and grant resolution.

### AUTH-FR-002 — Acyclic Role hierarchy

Role child relationships SHALL be acyclic, validate every referenced child Role and keep direct edges and transitive closure consistent. A cycle or invalid reference SHALL prevent a successful hierarchy mutation.

## 4.5 Superseded Decision Logging

The previous normative `LOG-001` through `LOG-005` requirements for a separate persisted Authorization decision-event ledger are **withdrawn** from the reviewed implementation baseline. This does not remove the separate [Entity Audit](../007.%20Audit%20and%20API%20Contracts/README.md) obligations for authorized User/Role-related mutations.

## 4.6 Verification boundary

A conforming implementation must demonstrate **both** correct request decisions and correct authorized resource membership/counts under combined client filtering. [Section 9](09-verification-validation-and-acceptance.md) specifies fail-closed, deny-overrides, per-operation snapshot and object-query scenarios.
