# 3. External Interface Requirements

## 3.1 Statement Contract

### STMT-001 — Canonical model

```yaml
name: <name>
description: <description>
effect: allow | deny
scope: request | object

target:
  api:
    method: <HTTP method | *>
    path: <full-match path regex>

policy: |
  export default () => principal.enabled && request.method == "GET";
```

The canonical Statement SHALL contain the fields and nesting shown above.

`scope` controls how the policy is evaluated. `target.api` is the only target shape specified by this SRS.

Verification: Inspect the persisted Statement schema and API representation against the contract, then run a serialization contract test.
Traceability: [Scope](01-introduction.md#12-scope); [Policy Language Contract](02-overall-description.md#223-policy-language-contract).

### STMT-002 — Required policy

`policy` SHALL be a required, non-null, non-blank TPL source string.

The Statement SHALL be invalid when `policy` is missing, `null`, empty, or whitespace-only.

Verification: Test create and update requests for each invalid value and confirm that no invalid Statement becomes active.
Traceability: [Policy Language Contract](02-overall-description.md#223-policy-language-contract); POLICY-001.

### STMT-003 — Required default export

Every policy SHALL satisfy the [TPL source contract](../003.%20Policy%20Language/03-external-interface-requirements.md#31-source-contract), including exactly one supported `export default` policy function whose result has static type `Bool`.

Supported examples include:

```text
export default function() {
  return true;
}
```

```text
export default () => principal.username == "admin";
```

A policy that fails TPL parsing, export validation, binding, function-call validation, type checking, scope validation, or applicable queryability validation SHALL be rejected before the Statement becomes active.

Verification: Compile every supported default-export form and invalid missing/multiple defaults, non-boolean results, unavailable roots, and unsupported residual operations.
Traceability: [Policy Language Contract](02-overall-description.md#223-policy-language-contract); POLICY-001 through POLICY-003.

### STMT-004 — Boolean decision contract

A valid active Statement policy SHALL have a supported default export whose result satisfies the TPL static `Bool` contract.

During authorization:

- A direct TPL evaluation SHALL return `true` or `false`, or an evaluation failure.
- A concrete non-boolean result SHALL NOT be accepted as a decision.
- Runtime truthy/falsy coercion SHALL NOT be used.
- An Object policy partial evaluation SHALL return a concrete boolean or a residual boolean Policy IR predicate.

An evaluation failure or invalid residual contract SHALL raise an authorization exception and fail closed.

Verification: Compile non-boolean/fall-through default functions and non-boolean concise arrows and confirm activation is rejected; inject typed-input or function-evaluation failures and confirm authorization fails closed.
Traceability: [TPL boolean policy result](../003.%20Policy%20Language/04-functional-and-behavioral-requirements.md#lang-002--boolean-default-policy-result); TECH-004; REQ-001.

### STMT-005 — Effect semantics

The policy determines whether a Statement matches. `effect` determines the result of a matched Statement.

```text
policy == true  -> apply effect
policy == false -> Statement does not match
```

An unconditional Statement SHALL be authored explicitly, for example:

```text
export default () => true;
```

Verification: Evaluate matching allow and deny Statements with true and false policy results and confirm that only true results apply the declared effect.
Traceability: [Scope](01-introduction.md#12-scope); REQ-001.

### STMT-006 — Target semantics

`target.api.method` SHALL preserve the current exact-method-or-`*` semantics.

`target.api.path` SHALL preserve the current full-match regular-expression semantics against the request path without the query string.

Method/path validation and regular-expression compilation SHALL occur before or when building the request-scoped executable representation. Authorization evaluation SHALL reuse the compiled matcher within the same operation.

A compiled target matcher MAY be reused across operations only as a derived artifact keyed by the exact Statement state loaded from the database for the current operation. Such reuse SHALL NOT eliminate the required database Statement lookup.

Verification: Test exact and wildcard methods, full path matching without query strings, matcher reuse within an operation, and changed database Statement state across operations.
Traceability: [Product Perspective](02-overall-description.md#21-product-perspective-and-baseline); PERF-004.

### STMT-007 — Canonical persistence and API contract

The canonical Statement model SHALL store and expose:

```text
effect
scope
target.api.method
target.api.path
policy
```

`target_type`, `conditions[]`, and `statement_conditions` SHALL be removed from the final model. No compatibility execution path for legacy conditions or ECMAScript policy source is required.

Verification: Inspect the schema, API models, bootstrap data, and authorization execution path for the canonical fields and absence of legacy-condition/ECMAScript execution.
Traceability: [Product Perspective](02-overall-description.md#21-product-perspective-and-baseline); [Policy Language Contract](02-overall-description.md#223-policy-language-contract).

## 3.2 Authorization Inputs and Operation Snapshot

### INPUT-001 — Policy roots

The Authorization TPL Environment Schema SHALL expose these scope-dependent roots:

```text
principal
request
object (Object Authorization only)
```

The minimum request shape is:

```text
request.method
request.path
request.pathVariables
```

`request.path` remains the concrete request path string. `request.pathVariables` is a map of resolved route/path variables.

The minimum principal shape preserves the currently exposed identity values:

```text
principal.id
principal.username
```

Additional principal attributes require an explicit typed authorization contract.

Verification: Provide a request with path variables and the minimum principal fields and confirm the TPL Environment Schema/input shape; reject or separately specify unsupported principal attributes.
Traceability: [Request Authorization Input Boundary](02-overall-description.md#224-request-authorization-input-boundary); [TPL Environment Schema](../003.%20Policy%20Language/03-external-interface-requirements.md#32-compilation-environment).

### INPUT-002 — Object root and Request boundary

For `scope: request`, the `object` root SHALL be absent from the TPL Environment Schema. A Request policy that references `object` SHALL be rejected before activation.

For `scope: object`, `object.*` remains symbolic during partial evaluation and is validated through the selected Filter Schema and TPL queryability contract.

Verification: Compile Request policies that use `principal` and `request` and confirm they are accepted; reject `object` references. Partially evaluate an Object policy with symbolic object fields and confirm that Object input remains supported.
Traceability: [Request Authorization Input Boundary](02-overall-description.md#224-request-authorization-input-boundary); [Shared Object Filter](02-overall-description.md#222-shared-object-filter); OBJ-001.

### INPUT-003 — Request input availability

For `scope: request`, Taskmigo SHALL supply only the `principal` and `request` values already available at the time of authorization. Request Authorization SHALL NOT obtain additional business data to complete those inputs.

Verification: Evaluate a Request policy using the supported `principal` and `request` fields with no business-resource lookup and confirm the supplied values are the complete policy input.
Traceability: [Request Authorization Input Boundary](02-overall-description.md#224-request-authorization-input-boundary); REQ-003.

### RES-001 — Resource root exclusion

The `resources` root SHALL not be part of the Authorization TPL Environment Schema for either authorization scope. A policy that references `resources` SHALL be rejected before activation.

Verification: Attempt to activate Request and Object policies referencing `resources` and confirm both are rejected before activation.
Traceability: INPUT-001; [TPL static reference resolution](../003.%20Policy%20Language/04-functional-and-behavioral-requirements.md#ref-001--static-reference-resolution).

### RES-002 — No resource-loading utility function

TPL and the Authorization consumer SHALL NOT provide a built-in `resource(...)` function or another privileged utility function for loading business resources.

An undeclared call to `resource(...)` SHALL be rejected by TPL. A source-declared zero-argument function named `resource` SHALL have no privileged behavior and SHALL NOT gain access to repositories or resource adapters.

Verification: Reject undeclared `resource(...)` calls and confirm a locally declared `resource()` cannot access business-resource loading facilities.
Traceability: [Request Authorization Input Boundary](02-overall-description.md#224-request-authorization-input-boundary); [TPL source-declared functions](../003.%20Policy%20Language/04-functional-and-behavioral-requirements.md#func-001--source-declared-named-helper-functions).

### RES-003 — No resource resolution

Request Authorization SHALL NOT load business resources or invoke resource adapters. Statement database resolution and the operation snapshot remain required authorization inputs and are not business-resource loading.

Verification: Instrument resource adapters and business-resource persistence during Request Authorization and confirm neither is invoked; confirm required Statement database resolution still occurs.
Traceability: [Request Authorization Input Boundary](02-overall-description.md#224-request-authorization-input-boundary); REQ-003; TECH-004.

### SNAPSHOT-001 — One snapshot per operation

Taskmigo SHALL establish exactly one immutable Authorization Snapshot for each request/authorization operation after resolving the relevant effective Statement state from the database.

The snapshot SHALL represent the effective authorization state required by that operation without prescribing a `List<Statement>` representation.

Request Authorization and Object Authorization in the same operation SHALL consume that same snapshot and SHALL NOT independently resolve effective authorization state again.

The snapshot is request/operation-scoped materialization, not a cross-request cache.

Verification: Instrument effective-Statement resolution during an operation containing Request and Object Authorization and confirm one shared snapshot is used.
Traceability: [Scope](01-introduction.md#12-scope); [Resolution and Operation Snapshot](02-overall-description.md#221-resolution-and-operation-snapshot).

### SNAPSHOT-002 — Consistency

Authorization-state changes committed after snapshot creation SHALL NOT affect the current operation.

The next operation SHALL query the database again, create a new snapshot, and observe the then-current authorization state.

```text
request A -> DB resolve -> snapshot S1 -> ALLOW
authorization state changes in DB
request A continues with S1
request B -> DB resolve -> snapshot S2 -> observes new state
```

The same rule applies to long-running operations.

No cache invalidation, TTL expiry, or inter-node cache synchronization SHALL be required for request B to observe the new Statement state.

Verification: Commit an authorization change between two operations and confirm the first retains its snapshot while the second observes the committed state without cache intervention.
Traceability: [Scope](01-introduction.md#12-scope); PERF-005.

### SNAPSHOT-003 — Coherent creation

Snapshot creation SHALL not mix incompatible authorization states when hierarchy, assignments, or Statements change concurrently.

The authorization system SHALL not keep a database transaction open for the full HTTP request solely to preserve snapshot semantics.

Verification: Inspect transaction boundaries and exercise a long-running request while authorization state changes concurrently.
Traceability: [Integration and Consistency](02-overall-description.md#225-integration-and-consistency).

### SNAPSHOT-004 — No cross-request snapshot reuse

An Authorization Snapshot SHALL be discarded when its operation ends and SHALL NOT be reused as authorization input for a later request/operation.

Verification: Exercise sequential operations with distinct authorization changes and confirm each operation creates and consumes a distinct snapshot.
Traceability: [Scope](01-introduction.md#12-scope); PERF-004.
