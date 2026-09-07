# 2. Overall Description

## 2.1 Product Perspective and Baseline

The following behavior was recorded from the `next` baseline described in the [references and baseline](01-introduction.md#14-references-and-baseline). It describes the authorization capability before the policy-contract update; it is context for the derived requirements, not the final contract.

| Area                           | Baseline behavior                                                                                                                                                                   |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Statement contract             | `effect`, `target.type`, `target.api.method`, `target.api.path`, `conditions: List<String>`                                                                                         |
| Persistence                    | `statements.target_type` plus `statement_conditions`                                                                                                                                |
| Statement API                  | Create accepts nullable `conditions`; missing conditions become an empty list                                                                                                       |
| Target matching                | Method is exact or `*`; path is a full-match Java regular expression; `Pattern.compile(...)` currently occurs during matching                                                       |
| Condition compiler             | Restricted SpEL is parsed into an implementation-owned expression tree                                                                                                              |
| Request Authorization          | Resolves effective Statements, compiles conditions during authorization, evaluates `principal` and `request`, DENY overrides ALLOW                                                  |
| Request input                  | `principal.id`, `principal.username`, `request.method`, `request.path`; no route/path-variable map                                                                                  |
| Object Authorization           | Resolves effective Statements again, compiles conditions again, specializes `principal.*` / `request.*`, retains `object.*`, and translates the residual expression to JPA Criteria |
| Object query mapping           | Registered per concrete method/path; only direct one-segment object fields are queryable                                                                                            |
| Effective Statement resolution | Loads all Groups and all Roles, builds hierarchy graphs in JVM, then fetches effective Statements                                                                                   |
| Bootstrap                      | Built-in Statements use `target.type` + `conditions`; empty conditions mean unconditional `true`                                                                                    |

The target authorization model SHALL exclude hot-path graph loading, duplicate Statement resolution within one operation, per-authorization policy compilation when an exact compiled artifact is available, and per-match regular-expression compilation.

## 2.2 Product Functions

The authorization system provides:

- Default-deny Request Authorization with DENY overriding ALLOW.
- Database-side Object Authorization before pagination.
- Direct and inherited User, Group, Role, and Statement semantics.
- Database resolution of effective Statements for every authorization operation.
- One immutable authorization snapshot shared across Request and Object Authorization.
- Statement policy evaluation and partial evaluation through the Embedded Language subsystem.
- Persistence-neutral Filter AST generation for Object policies.
- Bounded authorization-state resolution without complete in-memory hierarchy loading.
- Fail-closed handling for invalid policies and required-input failures.

### 2.2.1 Resolution and Operation Snapshot

The authorization system SHALL:

- Resolve relevant effective Statements from the database for every authorization operation.
- Preserve direct and inherited User/Group/Role/Statement semantics.
- Avoid loading the complete Group/Role graph during authorization.
- Use one immutable, request-scoped Authorization Snapshot for Request and Object Authorization.
- Discard the snapshot when the operation ends.
- Resolve effective authorization state only once within an operation.
- Reuse target matchers within an operation and permit derived compiled-artifact reuse across operations only when keyed by the exact Statement state loaded from the database.

### 2.2.2 Shared Object Filter

The authorization system SHALL:

- Represent Object Authorization with ALL, NONE, and the Filter AST operators required by the existing behavior.
- Use Filter Schema for direct one-segment object fields.
- Translate residual Language IR predicates into Filter AST and then into the persistence query predicate.
- Constant-fold before persistence translation.
- Compose authorization filtering with the business predicate before pagination.
- Avoid JVM row filtering.

### 2.2.3 Embedded Language Contract

The authorization system SHALL:

- Use `scope` instead of `target.type` and required `policy` instead of `conditions[]`.
- Compile Statement `policy` using the [Embedded Language feature](../003.%20Embedded%20Language/README.md).
- Treat the Statement `policy` string as an Embedded Language program without an export/function/module wrapper.
- Supply the scope-dependent typed Environment Schema required by the Embedded Language.
- Require Statement policies to have static result type `Bool` as an Authorization-owned consumer contract.
- Reject a Statement policy whose valid Embedded Language program result type is not `Bool`; the Embedded Language itself SHALL remain free of this authorization-specific result restriction.
- Keep database-loaded Statement state authoritative for every operation.
- Permit compiled Language IR reuse only as a derived optimization that cannot bypass database resolution.
- Evaluate Request policies using known `principal` and `request` values.
- Partially evaluate Object policies with known `principal` and `request` values while `object` remains symbolic.
- Validate that every residual Object predicate is lowerable to the selected Filter Schema/Filter AST before the policy becomes active for that mapping.
- Retain the default-deny, deny-overrides, constant short-circuit, and built-in authorization semantics.
- Exclude legacy SpEL, ECMAScript policy execution, JavaScript runtimes, and `statement_conditions` from the canonical authorization model.

### 2.2.4 Request Authorization Input Boundary

The authorization system SHALL:

- Provide `request.pathVariables` as authorization input.
- Make only `principal` and `request` available to `scope: request` policies.
- Reject Request policies that reference unavailable roots such as `object` or `resources`, or use call syntax, before activation.
- Perform Request Authorization without loading business resources or invoking resource adapters.

### 2.2.5 Integration and Consistency

The web, security, and Object Authorization boundaries SHALL share the same request-scoped authorization context. Every authorization operation SHALL observe committed authorization changes on the next operation without cache invalidation, TTL expiry, or distributed-cache coordination.

## 2.3 Stakeholders and Users

The authorization capability is consumed by policy authors, authorization-aware application components, Filter Schema owners, and operators or reviewers of authorization changes. It does not prescribe a user interface or operational persona.

## 2.4 Operational Context and Scenarios

The following scenarios are supporting context, not additional normative requirements:

1. A request operation resolves effective authorization state from the database, creates one immutable snapshot, matches the request target, and evaluates applicable Request Statements.
2. A Request Statement evaluates its `policy` Embedded Language program with the available `principal` and `request` inputs without loading business resources.
3. An Object Statement partially evaluates its `policy` Embedded Language program, lowers the residual predicate to Filter AST, and applies authorization before pagination.
4. A valid non-`Bool` Embedded Language program remains reusable by other Taskmigo features but is rejected when used as a Statement policy because Authorization requires `Bool`.
5. A committed authorization change is observed by the next operation while the current operation continues with its existing snapshot.

## 2.5 Out of Scope

The current authorization capability excludes client-facing `filterBy` syntax, nested or relationship Object filtering, and target kinds beyond `target.api`. These boundaries are detailed in the [Scope](01-introduction.md#12-scope) and [Appendix B](11-appendices.md#111-future-extensions-non-normative).
