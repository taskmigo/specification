# 2. Overall Description

## 2.1 Domain and actors

Authorized API callers have a principal and an applicable set of directly or indirectly granted Statements. Administrators configure policies, Roles and direct grants through the available v0 public operations. Web authenticates the principal and invokes Authorization; Identity supplies User/Group identity and association data.

## 2.2 Request lifecycle

1. Web authenticates the request and verifies the applicable User's ACTIVE status.
2. Authorization resolves the current effective Statements from persistence and creates an immutable, operation-scoped snapshot of approved inputs.
3. The Request phase selects matching method/path rules, compiles approved Request-policy sources and evaluates them. **No matching allow means deny; matching deny overrides allows.**
4. For operations requiring Object Authorization, the Object phase reuses the same snapshot, specializes known principal/request data, and composes schema-bound allow/deny predicates.
5. The resource owner translates approved predicates to trusted persistence fields and combines them with client filtering **before pagination or target mutation**.

Any invalid context, evaluation failure, unsupported expression or mismatched query schema SHALL fail closed.

## 2.3 Statement and Role model

A Statement has immutable identity, unique code, optional description, effect, scope, bounded API target and nonblank policy source. Roles may include child Roles; hierarchy must remain acyclic. Direct User and Role Statement grants are replaceable independently of inherited grants.

## 2.4 Policy-language boundary

| Policy scope | Source mode | Important limitation |
| --- | --- | --- |
| Request | `PROGRAM` | May use allowed local bindings and conditional flow, but no unrestricted language features |
| Object | `EXPRESSION` | Approved `object` paths remain symbolic until query-schema validation and database binding |

The [Language SRS](../003.%20Language/README.md) defines canonical grammar, but a compiler-recognized feature is **not** automatically valid in an Authorization policy. The [Query SRS](../004.%20Query%20Filtering/README.md) defines safe object field/operator binding.

## 2.5 Persistence and consistency

Statements, Roles, hierarchy, direct grants and effective subject relationships are persisted. Each authorization operation sees an immutable Statement snapshot. The current implementation resolves authoritative state for new operations; this baseline does not promise a shared compiled-artifact cache or persisted policy revision.

## 2.6 Scope exclusions

No Authorization decision-history ledger, public authorization log-list endpoint, generic Role delete/update/detail API, arbitrary SQL policy injection, or general-purpose script execution is specified as implemented. A future capability requires an approved contract and explicit verification.
