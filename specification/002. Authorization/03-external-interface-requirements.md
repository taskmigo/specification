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
  const readable = request.method == "GET";
  return principal.enabled && readable;
```

The canonical Statement SHALL contain the fields and nesting shown above. `target.api` is the only target shape specified by this SRS.

Verification: Inspect persistence/API representation and run serialization contract tests.
Traceability: [Scope](01-introduction.md#12-scope); POLICY-001.

### STMT-002 — Required policy

`policy` SHALL be required, non-null, and non-blank. Invalid values SHALL NOT become active.

Verification: Test create/update with missing, null, empty, and whitespace-only policy.
Traceability: POLICY-001.

### STMT-003 — Required policy program

Every Statement `policy` SHALL satisfy the Embedded Language source contract in `PROGRAM` mode under the Authorization policy Compilation Profile.

Authorization SHALL NOT reject a policy before activation solely because its static result type is not `Bool`.

General function declarations/calls, modules, standalone/first-class lambdas, and entry-point wrappers SHALL remain invalid. Restricted collection lambdas and canonical intrinsics MAY be used when enabled by the Authorization profile and valid under the policy Environment Schema.

A policy failing parsing, profile validation, binding, control-flow validation, typing, scope validation, complexity limits, or required Object queryability validation SHALL NOT become active.

Verification: Activate valid multiple-result-type programs; test bounded quantifiers; reject general callable/module syntax, fall-through, unavailable roots, and unsupported query paths/operators.
Traceability: [Embedded Language Compilation Profile](../003.%20Embedded%20Language/03-external-interface-requirements.md#env-004--compilation-profile); POLICY-001 through POLICY-003.

### STMT-004 — Boolean decision contract

Authorization SHALL enforce Boolean policy results when a policy is evaluated or partially evaluated, not as a generic Embedded Language compilation restriction.

For Request Authorization, direct evaluation SHALL yield `Bool`; a concrete non-`Bool` result SHALL raise an authorization runtime exception and fail closed.

For Object Authorization, concrete `true`/`false` or a residual Semantic AST expression statically typed `Bool` SHALL be accepted; concrete/residual non-`Bool` results SHALL raise an authorization runtime exception and fail closed before queryability/persistence processing.

Verification: Activate valid non-`Bool` policies and verify runtime fail-closed behavior in each scope.
Traceability: [Embedded Language typed result](../003.%20Embedded%20Language/04-functional-and-behavioral-requirements.md#lang-002--typed-source-result); REQ-001; OBJ-001.

### STMT-005 — Effect semantics

A policy result of `true` applies the Statement effect; `false` means the Statement does not match. Unconditional policies SHALL be authored explicitly with `return true;`.

Verification: Test ALLOW/DENY with true/false policies.
Traceability: REQ-001.

### STMT-006 — Target semantics

`target.api.method` SHALL preserve exact-method-or-`*` behavior. `target.api.path` SHALL use full-match regular-expression semantics against the request path without query string. Target validation/regex compilation SHALL occur before repeated matching within an operation.

Verification: Test exact/wildcard methods, full path matching, and matcher reuse.
Traceability: PERF-004.

### STMT-007 — Canonical persistence and API contract

The canonical model SHALL persist/expose `effect`, `scope`, `target.api.method`, `target.api.path`, and `policy`. Legacy `target_type`, `conditions[]`, and `statement_conditions` execution SHALL be removed.

Verification: Inspect schema/API/bootstrap/execution paths.
Traceability: STMT-001.

## 3.2 Authorization Inputs and Operation Snapshot

### INPUT-001 — Policy roots

The Authorization Environment Schema SHALL expose:

```text
principal
request
object (Object Authorization only)
```

Minimum request paths SHALL include `request.method`, `request.path`, and `request.pathVariables`. Minimum principal paths SHALL include `principal.id` and `principal.username`.

Object paths SHALL derive from the applicable `QuerySchema<Q>` and MAY include nested/structured/collection paths permitted by that schema.

Verification: Validate scope-dependent roots and nested Query Schema object paths.
Traceability: [Query Schema](../004.%20Query%20Filtering/03-external-interface-requirements.md#schema-002--query-schema); POLICY-002.

### INPUT-002 — Object root and Request boundary

For Request scope, `object` SHALL be absent and references SHALL fail before activation. For Object scope, `object` SHALL remain symbolic during partial evaluation and its path/type contract SHALL be derived from `QuerySchema<Q>`.

Verification: Reject Request `object` references and partially evaluate Object policies with nested/collection symbolic fields.
Traceability: OBJ-001; OBJ-002.

### INPUT-003 — Request input availability

Request Authorization SHALL use only already-available `principal` and `request` values and SHALL NOT load business resources to complete those inputs.

Verification: Instrument business-resource access during Request Authorization.
Traceability: REQ-003.

### RES-001 — Resource root exclusion

A `resources` root SHALL NOT be part of the Authorization Environment Schema.

Verification: Reject Request/Object policies referencing `resources`.
Traceability: INPUT-001.

### RES-002 — No privileged resource-loading call

Authorization SHALL NOT provide `resource(...)` or another privileged business-resource-loading intrinsic. General call syntax remains invalid under Embedded Language.

Verification: Reject policies attempting `resource(...)` while permitting only canonical language intrinsics.
Traceability: [Embedded Language bounded intrinsic syntax](../003.%20Embedded%20Language/03-external-interface-requirements.md#syntax-004--static-paths-and-bounded-intrinsic-syntax).

### RES-003 — No Request resource resolution

Request Authorization SHALL NOT load business resources or invoke resource adapters. Effective-Statement resolution is authorization-state loading and remains required.

Verification: Instrument business-resource persistence and authorization-state resolution separately.
Traceability: INPUT-003; REQ-003.

### SNAPSHOT-001 — One snapshot per operation

The system SHALL establish exactly one immutable internal Authorization Snapshot after resolving effective Statement state. Request and Object Authorization in the same operation SHALL consume that same state and SHALL NOT independently re-resolve it.

Verification: Instrument one operation containing both paths.
Traceability: AUTH-API-002.

### SNAPSHOT-002 — Consistency

Authorization changes committed after snapshot creation SHALL NOT affect the current operation. The next operation SHALL query database state again and observe then-current authorization state without cache invalidation requirements.

Verification: Commit authorization changes between operations.
Traceability: PERF-005.

### SNAPSHOT-003 — Coherent creation

Snapshot creation SHALL avoid mixing incompatible concurrent authorization states and SHALL NOT require holding a database transaction for the full HTTP request solely to preserve snapshot semantics.

Verification: Inspect transaction boundaries under concurrent changes.
Traceability: [Operation Context](02-overall-description.md#221-resolution-and-operation-context).

### SNAPSHOT-004 — No cross-request reuse

An internal Authorization Snapshot and public `AuthorizationContext` SHALL NOT be reused as authorization input for a later unrelated operation.

Verification: Exercise sequential operations with state changes.
Traceability: AUTH-API-002.

## 3.3 Public Integration API

### AUTH-API-001 — Typed Request Authorization input

The public API SHALL accept typed principal/request values rather than caller-constructed Embedded Language root maps, with behavior equivalent to:

```java
public record AuthorizationPrincipal(UUID id, String username) {}
public record AuthorizationRequest(String method, String path, Map<String, String> pathVariables) {}
```

Verification: Inspect the public API and confirm callers do not construct `principal`/`request` language root maps.
Traceability: INPUT-001; INPUT-003.

### AUTH-API-002 — Opaque authorization context

The public operation handle SHALL provide behavior equivalent to:

```java
public interface AuthorizationContext {}
```

It SHALL NOT expose Authorization Snapshot, effective Statement internals, Semantic AST, Environment Schema, or mutable request state.

Verification: Inspect public visibility and lifecycle.
Traceability: SNAPSHOT-001; SNAPSHOT-004.

### AUTH-API-003 — Request Authorization API

The public Request Authorization API SHALL provide behavior equivalent to:

```java
public interface RequestAuthorization {
    RequestAuthorizationResult authorize(AuthorizationPrincipal principal, AuthorizationRequest request);
}

public record RequestAuthorizationResult(boolean granted, AuthorizationContext context) {}
```

The returned context SHALL represent the same operation state used to make the Request decision.

Verification: Authorize a request and reuse the returned context for Object Authorization without a second Statement resolution.
Traceability: SNAPSHOT-001; REQ-001.

### AUTH-API-004 — Object Authorization API

The public Object Authorization API SHALL integrate with Query Filtering through behavior equivalent to:

```java
public interface ObjectAuthorization {
    <Q> QueryPredicate<Q> authorize(AuthorizationContext context, QuerySchema<Q> schema);
}
```

The API SHALL accept a logical Query Schema, not an entity/table identifier, and SHALL return an opaque typed Query Predicate.

Verification: Authorize simple and composed Query Contracts and confirm no JPA entity or string target key is required by the public API.
Traceability: OBJ-001 through OBJ-005; [Query Predicate](../004.%20Query%20Filtering/03-external-interface-requirements.md#pred-001--typed-opaque-query-predicate).

### AUTH-API-005 — Spring Security and MVC adaptation

`web` SHALL adapt Request Authorization through Spring Security `AuthorizationManager<RequestAuthorizationContext>` or an equivalent Spring Security authorization extension point. A granted `AuthorizationContext` SHALL be propagated within the current request so Spring MVC query resolution can consume the same context.

Spring adapters SHALL remain outside core Authorization semantics.

Verification: Inspect Spring Security integration and confirm one context crosses the security-to-MVC boundary.
Traceability: AUTH-API-003; [Query Filtering Spring MVC interface](../004.%20Query%20Filtering/03-external-interface-requirements.md#spring-001--authorized-query-argument).
