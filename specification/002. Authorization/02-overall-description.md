# 2. Overall Description

## 2.1 Product Perspective

Taskmigo Authorization is a bounded context that owns policy rules and group/role-independent grant models. Identity owns Users and Groups and supplies effective subject expansion through published integration. Authorization does not depend on private Identity persistence.

## 2.2 Policy Flow

For a token-bearing API call, Web validates principal ACTIVE status and delegates to Request Authorization. The authorization service obtains effective Statements from the database, builds an immutable same-operation snapshot, compiles matching policy sources and evaluates Request scope with default-deny/deny-overrides semantics. The same context MAY be consumed by Object Authorization, which partially evaluates Object-scope policies and composes the remaining object predicates as `(OR allows) AND NOT (OR denies)`.

## 2.3 Supported Language Profiles

- **Request:** `PROGRAM` mode with local bindings, conditional control flow, list literals, logical, equality, ordering and contains features.
- **Object:** `EXPRESSION` mode with list literals, logical, equality, ordering and contains features. Object fields remain symbolic until trusted persistence binding.
- Both modes SHALL reject unsupported operators/features for their profile; generic Language support does not imply authorization support.

## 2.4 Storage and Visibility

The server persists Statements, Roles, Role hierarchy/closure, direct Role/Statement subject bindings and effective grants. There is no separate persisted Authorization decision-log table or public list API in the reviewed code.

## 2.5 Out of Scope

This specification does not assert authorization-decision history, generalized role-edit/delete HTTP endpoints, an external policy editor, cached bytecode reuse across operations, or support for arbitrary SQL expressions inside policies.
