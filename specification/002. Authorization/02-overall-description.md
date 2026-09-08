# 2. Overall Description

## 2.1 Product Perspective and Baseline

Authorization is consumed by Spring Security/web adapters and resource query paths. The target model separates HTTP adaptation, authorization semantics, logical query predicates, and persistence translation.

```text
Spring Security/web
        ↓
RequestAuthorization
        ↓
AuthorizationContext
        ↓
ObjectAuthorization + QuerySchema<Q>
        ↓
QueryPredicate<Q>
        ↓
Query Filtering/resource persistence adapter
        ↓
database before pagination
```

The target model SHALL exclude duplicate effective-Statement resolution within one operation, unrestricted hierarchy loading on the hot path, public exposure of Authorization Snapshot/Semantic AST, and a second public predicate AST.

## 2.2 Product Functions

The authorization system provides:

- Request decisions using effective Request Statements.
- Database-side Object Authorization using logical Query Predicates.
- Direct and inherited User, Group, Role, and Statement semantics.
- One operation-scoped immutable authorization state shared across Request and Object Authorization.
- `PROGRAM` policy compilation and Semantic AST execution/partial evaluation.
- Query Schema validation for API-visible nested/composed object paths and supported operators.
- Fail-closed behavior for authorization failures.

### 2.2.1 Resolution and Operation Context

The system SHALL resolve relevant effective Statements from the database once per authorization operation, create one immutable internal snapshot, expose only an opaque `AuthorizationContext` to external consumers, and discard operation state when the operation ends.

### 2.2.2 Shared Object Predicate

Object Authorization SHALL produce a typed logical `QueryPredicate<Q>` using the Query Contract supplied for the resource operation. The predicate SHALL remain expressed in API-visible logical paths until Query Filtering/resource-owned persistence translation.

A separate public Filter AST SHALL NOT be required.

### 2.2.3 Embedded Language Contract

Authorization SHALL compile policies in `PROGRAM` mode, supply an Authorization-owned Compilation Profile and scope-dependent Environment Schema, evaluate Request policies, partially evaluate Object policies, and enforce Boolean decision semantics at authorization runtime as defined by STMT-004.

### 2.2.4 Request Input Boundary

Request Authorization SHALL expose only supported `principal` and `request` values and SHALL NOT load business resources to satisfy policy references.

### 2.2.5 Spring/Web Integration

Spring Security adaptation SHALL remain in `web`. Authorization SHALL expose typed transport-neutral public inputs/results and an opaque `AuthorizationContext`. The same context SHALL be available to Spring MVC query resolution for subsequent Object Authorization.

## 2.3 Stakeholders and Users

The capability is consumed by policy authors, Spring Security/web adapters, Query Filtering, resource modules, and operators/reviewers of authorization changes.

## 2.4 Operational Scenarios

The following scenarios are supporting context:

1. Spring Security adapts an authenticated HTTP request to typed Authorization principal/request inputs.
2. Request Authorization resolves Statements, creates one authorization context, and returns the Request decision.
3. A collection operation uses the same context and `QuerySchema<Q>` to derive an Object `QueryPredicate<Q>`.
4. Query Filtering composes Object Authorization with optional `filterBy` before resource persistence execution.
5. The next authorization operation re-resolves database state and observes committed changes.

## 2.5 Out of Scope

Client `filterBy` syntax and persistence mapping semantics are owned by [Query Filtering](../004.%20Query%20Filtering/README.md). Additional authorization target shapes beyond `target.api` are outside this SRS.
