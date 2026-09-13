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
  return principal.username != "" && readable;
```

The canonical Statement SHALL contain the fields and nesting shown above. `target.api` is the only target shape specified by this SRS.

Verification: Inspect persistence/API representation and run serialization contract tests.
Traceability: [Scope](01-introduction.md#12-scope); POLICY-001.

### STMT-002 — Required policy field

`policy` SHALL be required, non-null, and non-blank as part of the canonical Statement structure.

Creating or updating a Statement SHALL NOT compile, bind, type-check, execute, or perform Object queryability validation on `policy`, and SHALL NOT require resolving the Statement target to an Object Authorization Schema.

Verification: Test create/update with structurally valid but semantically invalid Language source and confirm persistence succeeds; separately reject missing, null, empty, and whitespace-only policy values as structural contract violations.
Traceability: POLICY-003.

### STMT-003 — Runtime policy program

When a target-matching Statement participates in authorization, its `policy` SHALL satisfy the Language source contract in `PROGRAM` mode under the Authorization policy Compilation Profile and the Environment Schema for the current authorization scope.

Authorization SHALL NOT reject a persisted policy solely because its static result type is not `Bool`. Boolean enforcement SHALL occur when the policy is evaluated or partially evaluated under STMT-004.

General function declarations/calls, modules, standalone/first-class lambdas, and entry-point wrappers SHALL remain invalid. Restricted collection lambdas and canonical intrinsics MAY be used when enabled by the Authorization profile and valid under the current Environment Schema.

A runtime failure in parsing, profile validation, binding, control-flow validation, typing, scope validation, complexity limits, or Object queryability validation SHALL be an Authorization error, SHALL fail closed, and SHALL be logged under LOG-003.

Verification: Persist semantically invalid policy source without pre-validation, then execute matching Request and Object Authorization and verify runtime error logging plus fail-closed behavior.
Traceability: [Language Compilation Profile](../003.%20Language/03-external-interface-requirements.md#env-004--compilation-profile); POLICY-001 through POLICY-003; LOG-003.

### STMT-004 — Boolean decision contract

Authorization SHALL enforce Boolean policy results when a policy is evaluated or partially evaluated, not as a generic Language compilation restriction.

For Request Authorization, direct evaluation SHALL yield `Bool`; a concrete non-`Bool` result SHALL raise an authorization runtime exception and fail closed.

For Object Authorization, concrete `true`/`false` or a residual Semantic AST expression statically typed `Bool` SHALL be accepted; concrete/residual non-`Bool` results SHALL raise an authorization runtime exception and fail closed before queryability or persistence processing.

Verification: Persist valid non-`Bool` policies and verify runtime fail-closed behavior in each scope.
Traceability: [Language typed result](../003.%20Language/04-functional-and-behavioral-requirements.md#lang-002--typed-source-result); REQ-001; OBJ-001.

### STMT-005 — Effect semantics

A policy result of `true` applies the Statement effect; `false` means the Statement does not match. Unconditional policies SHALL be authored explicitly with `return true;`.

Verification: Test ALLOW/DENY with true/false policies.
Traceability: REQ-001.

### STMT-006 — Target semantics

`target.api.method` SHALL preserve exact-method-or-`*` behavior. `target.api.path` SHALL use full-match regular-expression semantics against the request path without query string. Target regex compilation and matching validation SHALL occur at runtime before repeated matching within an authorization operation.

A malformed target encountered by an authorization operation SHALL be treated as an Authorization error, SHALL fail closed, and SHALL be logged under LOG-003.

Verification: Test exact/wildcard methods, full path matching, matcher reuse, and runtime malformed-target failure.
Traceability: PERF-004; LOG-003.

### STMT-007 — Canonical persistence and API contract

The canonical model SHALL persist/expose `effect`, `scope`, `target.api.method`, `target.api.path`, and `policy` without requiring authorization semantic validation at create/update time.

Verification: Inspect schema/API/bootstrap/execution paths and persist semantically invalid policy or target source for runtime validation.
Traceability: STMT-001 through STMT-003.

## 3.2 Authorization Inputs and Operation Snapshot

### INPUT-001 — Policy roots

The Authorization Environment Schema SHALL expose:

```text
principal
request
object (Object Authorization only)
```

Minimum request paths SHALL include `request.method`, `request.path`, and `request.pathVariables`. Minimum principal paths SHALL include `principal.id` and `principal.username`.

Object paths SHALL derive from the `ObjectAuthorizationSchema<Q>` supplied to the current Object Authorization operation and MAY include nested structured and collection paths permitted by that schema.

Verification: Validate scope-dependent roots and nested Object Authorization Schema paths at runtime.
Traceability: AUTH-API-004; POLICY-002.

### INPUT-002 — Object root and Request boundary

For Request scope, `object` SHALL be absent and runtime references to it SHALL fail closed. For Object scope, `object` SHALL remain symbolic during partial evaluation and its path/type contract SHALL derive from the `ObjectAuthorizationSchema<Q>` supplied to the current Object Authorization operation.

Verification: Persist Request policies referencing `object` and verify runtime fail-closed behavior; partially evaluate Object policies with nested/collection symbolic fields.
Traceability: OBJ-001; OBJ-002; LOG-003.

### INPUT-003 — Request input availability

Request Authorization SHALL use only already-available `principal` and `request` values and SHALL NOT load business resources to complete those inputs.

Verification: Instrument business-resource access during Request Authorization.
Traceability: REQ-003.

### RES-001 — Resource root exclusion

A `resources` root SHALL NOT be part of the Authorization Environment Schema.

Verification: Execute Request/Object policies referencing `resources` and verify fail-closed runtime errors.
Traceability: INPUT-001; LOG-003.

### RES-002 — No privileged resource-loading call

Authorization SHALL NOT provide `resource(...)` or another privileged business-resource-loading intrinsic. General call syntax remains invalid under Language.

Verification: Execute policies attempting `resource(...)` while permitting only canonical language intrinsics and verify fail-closed runtime errors.
Traceability: [Language bounded intrinsic syntax](../003.%20Language/03-external-interface-requirements.md#syntax-004--static-paths-and-bounded-intrinsic-syntax); LOG-003.

### RES-003 — No Request resource resolution

Request Authorization SHALL NOT load business resources or invoke resource adapters. Effective-Statement resolution remains required authorization-state loading.

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
Traceability: [Resolution and Operation Context](02-overall-description.md#221-resolution-and-operation-context).

### SNAPSHOT-004 — No cross-request reuse

An internal Authorization Snapshot and public `AuthorizationContext` SHALL NOT be reused as authorization input for a later unrelated operation.

Verification: Exercise sequential operations with state changes.
Traceability: AUTH-API-002.

## 3.3 Public Integration API

### AUTH-API-001 — Typed Request Authorization input

The public API SHALL accept typed principal/request values rather than caller-constructed Language root maps, with behavior equivalent to:

```java
public record AuthorizationPrincipal(UUID id, String username) {}
public record AuthorizationRequest(String method, String path, Map<String, String> pathVariables) {}
```

Verification: Inspect the public API and confirm callers do not construct `principal`/`request` language root maps.
Traceability: INPUT-001; INPUT-003.

### AUTH-API-002 — Opaque Authorization Context

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
    RequestAuthorizationResult authorize(
        AuthorizationPrincipal principal,
        AuthorizationRequest request
    );
}

public record RequestAuthorizationResult(
    boolean granted,
    AuthorizationContext context
) {}
```

The returned context SHALL represent the same operation state used to make the Request decision.

Verification: Authorize a request and reuse the returned context for Object Authorization without a second Statement resolution.
Traceability: SNAPSHOT-001; REQ-001.

### AUTH-API-004 — Object Authorization API

Object Authorization SHALL expose authorization-owned logical schema and predicate contracts with behavior equivalent to:

```java
public interface ObjectAuthorizationSchema<Q> {
    Class<Q> objectType();
    Optional<ObjectAuthorizationField> field(ObjectAuthorizationPath path);
    Collection<ObjectAuthorizationField> fields();
}

public interface ObjectAuthorizationField {
    ObjectAuthorizationPath path();
    ResolvableType type();
    boolean nullable();
    Set<ObjectAuthorizationOperator> operators();
}

public interface ObjectAuthorizationPredicate<Q> {
    boolean isAlwaysTrue();
    boolean isAlwaysFalse();
}

public interface ObjectAuthorization {
    <Q> ObjectAuthorizationPredicate<Q> authorize(
        AuthorizationContext context,
        ObjectAuthorizationSchema<Q> schema
    );
}
```

The schema SHALL identify API-visible object paths independently of persistence entities. The predicate SHALL remain opaque to integration consumers.

Verification: Authorize simple, nested, composed, and collection object schemas and confirm no JPA entity or string target key is required by the public API.
Traceability: OBJ-001 through OBJ-005.

### AUTH-API-005 — Spring Security and MVC adaptation

`web` SHALL adapt Request Authorization through Spring Security `AuthorizationManager<RequestAuthorizationContext>` or an equivalent Spring Security authorization extension point.

A granted `AuthorizationContext` SHALL be available within the current HTTP request and MAY be exposed to MVC handlers through a `HandlerMethodArgumentResolver`.

Spring adapters SHALL remain outside core Authorization semantics.

Verification: Inspect Spring Security integration and confirm the same context is available to subsequent Object Authorization in the current request.
Traceability: AUTH-API-002; AUTH-API-003.

### AUTH-API-006 — Resource-owned persistence binder

For a JPA-backed resource, persistence integration MAY provide behavior equivalent to:

```java
public interface ObjectAuthorizationPredicateBinder<Q, E> {
    Class<Q> objectType();
    Class<E> domainType();
    PredicateSpecification<E> bind(ObjectAuthorizationPredicate<Q> predicate);
}
```

The resource-owning module SHALL own the trusted mapping from Object Authorization paths/operators to persistence expressions and joins.

A custom repository adapter MAY be used when one JPA root is not an appropriate representation.

Verification: Bind simple, nested, computed, and collection Object Authorization predicates without exposing entity types through core Authorization APIs.
Traceability: OBJ-002; OBJ-004.

## 3.4 Authorization Log HTTP API

### LOG-API-001 — Authorization Log retrieval

The v0 HTTP API SHALL expose `GET /api/v0/authorization/logs` to retrieve persisted Authorization Logs.

The endpoint SHALL itself be subject to normal Request Authorization and SHALL NOT bypass authorization because it exposes authorization diagnostics.

Verification: Request the endpoint with granted and denied principals and confirm normal Request Authorization applies.
Traceability: LOG-001; TECH-003.

### LOG-API-002 — Offset pagination

`GET /api/v0/authorization/logs` SHALL use the v0 offset-pagination contract with one-based `page` and `pageSize` query parameters. The default values SHALL be `page=1` and `pageSize=20`; `pageSize` SHALL accept values from 1 through 100 inclusive.

The response SHALL expose the returned log items together with offset pagination metadata containing the current page, page size, total matching items, and total pages.

Logs SHALL be ordered deterministically by `createdAt` descending and then `id` descending before pagination.

Verification: Exercise default, boundary, invalid, empty, first, middle, and final pages and verify deterministic ordering plus pagination metadata.
Traceability: LOG-DATA-001.

### LOG-API-003 — Public log representation

The public Authorization Log representation SHALL expose, at minimum, `id`, `createdAt`, `authorizationType`, `outcome`, `level`, request method, request path, and the principal identifier when available.

Object Authorization logs SHALL additionally identify the Object Authorization type or query surface when available. Error logs SHALL expose a stable error code and a safe diagnostic message and SHALL NOT expose stack traces or internal persistence/compiler implementation details.

Verification: Serialize Request/Object allowed, denied, and error records and inspect redaction of internal exception details.
Traceability: LOG-DATA-001; LOG-002; LOG-003.
