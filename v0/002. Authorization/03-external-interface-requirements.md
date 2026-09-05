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
  export default ({ request, principal, object }) => {
    return true;
  };
```

The canonical Statement SHALL contain the fields and nesting shown above.

`scope` controls how the policy is evaluated. `target.api` is the only target shape specified by this SRS.

Verification: Inspect the persisted Statement schema and API representation against the contract, then run a serialization contract test.
Traceability: [Scope](01-introduction.md#12-scope); [ECMAScript Policy Contract](02-overall-description.md#223-ecmascript-policy-contract).

### STMT-002 — Required policy

`policy` SHALL be a required, non-null, non-blank string.

The Statement SHALL be invalid when `policy` is missing, `null`, empty, or whitespace-only.

Verification: Test create and update requests for each invalid value and confirm that no invalid Statement becomes active.
Traceability: [ECMAScript Policy Contract](02-overall-description.md#223-ecmascript-policy-contract); TECH-004.

### STMT-003 — Required entry point

Every policy SHALL define a supported `export default` function or arrow function.

The decision function MAY declare no arguments or one object-pattern argument selecting supported roots.

Examples:

```js
export default () => true;
```

```js
export default ({ principal }) => {
  return principal.username === "admin";
};
```

A module with no supported default-exported decision function SHALL be rejected before the Statement becomes active.

Verification: Compile policies with a missing, named-only, and unsupported default export and confirm activation is rejected.
Traceability: [ECMAScript Policy Contract](02-overall-description.md#223-ecmascript-policy-contract); POLICY-001.

### STMT-004 — Boolean decision contract

The runtime result of the default-exported decision function SHALL be a boolean.

Taskmigo SHALL NOT require compile-time control-flow/type analysis to prove that every reachable execution path returns a boolean.

During authorization:

- a concrete decision result that is `true` or `false` is valid;
- a concrete result of `null`, `undefined`, string, number, object, or any other non-boolean value SHALL raise an authorization exception;
- falling through without a return is equivalent to `undefined` and SHALL raise an authorization exception;
- runtime truthy/falsy coercion SHALL NOT be used.

Authorization exceptions caused by an invalid policy result SHALL fail closed.

For Object Authorization, partial evaluation SHALL produce a boolean residual predicate. If the evaluated/residual result cannot represent a boolean authorization predicate, authorization SHALL raise an exception and fail closed.

Verification: Execute request and object policies returning each listed non-boolean value, including fall-through, and confirm an authorization exception and denial.
Traceability: [ECMAScript Policy Contract](02-overall-description.md#223-ecmascript-policy-contract); TECH-004.

### STMT-005 — Effect semantics

The policy determines whether a Statement matches. `effect` determines the result of a matched Statement.

```text
policy == true  -> apply effect
policy == false -> Statement does not match
```

An unconditional Statement SHALL be authored explicitly:

```js
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

`target_type`, `conditions[]`, and `statement_conditions` SHALL be removed from the final model. No compatibility execution path for legacy conditions is required.

Verification: Inspect the schema, API models, bootstrap data, and authorization execution path for the canonical fields and absence of legacy-condition execution.
Traceability: [Product Perspective](02-overall-description.md#21-product-perspective-and-baseline); [ECMAScript Policy Contract](02-overall-description.md#223-ecmascript-policy-contract).

## 3.2 Authorization Inputs and Operation Snapshot

### INPUT-001 — Policy roots

The decision function SHALL use these roots:

```text
principal
request
object
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

Verification: Provide a request with path variables and the minimum principal fields and confirm the policy input shape; reject or separately specify unsupported principal attributes.
Traceability: [Request Resource Authorization](02-overall-description.md#224-request-resource-authorization); [Product Perspective](02-overall-description.md#21-product-perspective-and-baseline).

### INPUT-002 — Object root

For `scope: request`, `object` contains named resources resolved through the request-resource contract in [Request Resources](03-external-interface-requirements.md#33-request-resources).

For `scope: object`, `object.*` remains symbolic during partial evaluation and is validated through the selected Filter Schema.

Verification: Partially evaluate a request policy with resolved resources and an object policy with symbolic object fields, confirming the two input modes.
Traceability: [Shared Object Filter](02-overall-description.md#222-shared-object-filter); OBJ-001.

### SNAPSHOT-001 — One snapshot per operation

Taskmigo SHALL establish exactly one immutable Authorization Snapshot for each request/authorization operation after resolving the relevant effective Statement state from the database.

The snapshot SHALL represent the effective authorization state required by that operation without prescribing a `List<Statement>` representation.

Request Authorization, request-resource authorization, and Object Authorization in the same operation SHALL consume that same snapshot and SHALL NOT independently resolve effective authorization state again.

The snapshot is request/operation-scoped materialization, not a cross-request cache.

Verification: Instrument effective-Statement resolution during an operation containing request, resource, and object authorization and confirm one shared snapshot is used.
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

## 3.3 Request Resources

### RES-001 — Scope restriction

The named export `resources` SHALL be valid only for `scope: request`.

A `scope: object` policy declaring `resources` SHALL be rejected before activation.

The default export remains mandatory regardless of scope.

Verification: Attempt to activate an object policy with a `resources` export and no default export, confirming rejection for both violations.
Traceability: [Request Resource Authorization](02-overall-description.md#224-request-resource-authorization); STMT-003.

### RES-002 — Declaration

A Request policy MAY declare:

```js
export function resources({ request, principal }) {
  return {
    project: resource("project", request.pathVariables.projectId),
    user: resource("user", request.pathVariables.userId),
  };
}

export default ({ principal, object }) => {
  return (
    object.project.ownerId === principal.id &&
    object.user.projectId === object.project.id
  );
};
```

`resources` SHALL return a statically analyzable object whose values are `resource(type, key)` descriptors.

`resource(type, key)` is a compiler intrinsic. It SHALL describe a lookup and SHALL NOT perform persistence access itself.

Verification: Compile a Request policy with one and multiple named resource descriptors and confirm the declarations are static and contain no persistence operation.
Traceability: [Request Resource Authorization](02-overall-description.md#224-request-resource-authorization); INPUT-001.

### RES-003 — Resource adapters

Resource types SHALL be resolved through registered adapters.

Resolution SHALL:

- deduplicate identical `(type, key)` lookups;
- batch compatible lookups where supported;
- avoid N+1 behavior;
- expose immutable policy input values rather than repositories or JPA entities.

Unknown resource types or required resource-resolution failures SHALL fail closed.

Verification: Resolve repeated and compatible resource descriptors, including unknown types and adapter failures, and confirm deduplication/batching and denial on required failures.
Traceability: [Request Resource Authorization](02-overall-description.md#224-request-resource-authorization); TECH-004.
