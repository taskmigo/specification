# 2. Overall Description

## 2.1 Product Perspective

```text
Spring Security/web
        ↓
RequestAuthorization
        ↓
AuthorizationContext
        ↓
ObjectAuthorization + ObjectAuthorizationSchema<Q>
        ↓
ObjectAuthorizationPredicate<Q>
        ↓
resource-owned authorization predicate binder
        ↓
database before pagination
```

The authorization capability SHALL keep HTTP adaptation, policy semantics, object queryability, and persistence translation behind explicit interfaces.

## 2.2 Product Functions

The authorization system provides:

- Request decisions using effective Request Statements.
- Database-side Object Authorization using opaque Object Authorization Predicates.
- Direct and inherited User, Group, Role, and Statement semantics.
- One operation-scoped immutable authorization state shared across Request and Object Authorization.
- `PROGRAM` policy compilation and Semantic AST evaluation/partial evaluation.
- Object Authorization Schema validation for API-visible nested/composed object paths and supported operators.
- Fail-closed behavior for authorization failures.

### 2.2.1 Resolution and Operation Context

The system SHALL resolve relevant effective Statements from the database once per authorization operation, create one immutable internal snapshot, expose only an opaque `AuthorizationContext` to integration consumers, and discard operation state when the operation ends.

### 2.2.2 Object Authorization Predicate

Object Authorization SHALL produce a typed `ObjectAuthorizationPredicate<Q>` using the Object Authorization Schema supplied for the resource operation.

The predicate SHALL preserve API-visible logical paths until the resource-owned authorization persistence boundary.

### 2.2.3 Language Contract

Authorization SHALL compile policies in `PROGRAM` mode, supply an Authorization-owned Compilation Profile and scope-dependent Environment Schema, evaluate Request policies, partially evaluate Object policies, and enforce Boolean authorization semantics at runtime as defined by STMT-004.

### 2.2.4 Request Input Boundary

Request Authorization SHALL expose only supported `principal` and `request` values and SHALL NOT load business resources to satisfy policy references.

### 2.2.5 Spring/Web Integration

Spring Security adaptation SHALL remain in `web`. Authorization SHALL expose typed transport-neutral inputs/results and an opaque `AuthorizationContext`. Spring MVC integration MAY expose that context as a controller argument for the current request.

## 2.3 Stakeholders and Users

The capability is consumed by policy authors, Spring Security/web adapters, resource-owning modules, persistence adapters, and operators or reviewers of authorization changes.

## 2.4 Operational Scenarios

The following scenarios are supporting context:

1. Spring Security adapts an authenticated HTTP request to typed Authorization principal/request inputs.
2. Request Authorization resolves Statements, creates one Authorization Context, and returns a Request decision.
3. A resource operation uses the same context and its Object Authorization Schema to derive an Object Authorization Predicate.
4. A resource-owned binder translates the Object Authorization Predicate to a persistence predicate before pagination.
5. The next authorization operation re-resolves database state and observes committed changes.

## 2.5 Out of Scope

Additional authorization target shapes beyond `target.api` are outside this SRS.
