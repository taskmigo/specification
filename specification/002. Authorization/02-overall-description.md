# 2. Overall Description

## 2.1 Product Perspective and baseline

The following behavior was recorded from the `next` baseline described in the [references and baseline](01-introduction.md#14-references-and-baseline). It describes the authorization capability before the policy-contract update; it is context for the derived requirements, not the final contract.

| Area                           | Baseline behavior                                                                                                                                                                   |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Statement contract             | `effect`, `target.type`, `target.api.method`, `target.api.path`, `conditions: List<String>`                                                                                         |
| Persistence                    | `statements.target_type` plus `statement_conditions`                                                                                                                                |
| Statement API                  | Create accepts nullable `conditions`; missing conditions become an empty list                                                                                                       |
| Target matching                | Method is exact or `*`; path is a full-match Java regular expression; `Pattern.compile(...)` currently occurs during matching                                                       |
| Condition compiler             | Restricted SpEL is parsed into Taskmigo's own expression tree                                                                                                                       |
| Request Authorization          | Resolves effective Statements, compiles conditions during authorization, evaluates `principal` and `request`, DENY overrides ALLOW                                                  |
| Request input                  | `principal.id`, `principal.username`, `request.method`, `request.path`; no route/path-variable map                                                                                  |
| Object Authorization           | Resolves effective Statements again, compiles conditions again, specializes `principal.*` / `request.*`, retains `object.*`, and translates the residual expression to JPA Criteria |
| Object query mapping           | Registered per concrete method/path; only direct one-segment object fields are queryable                                                                                            |
| Effective Statement resolution | Loads all Groups and all Roles, builds hierarchy graphs in JVM, then fetches effective Statements                                                                                   |
| Bootstrap                      | Built-in Statements use `target.type` + `conditions`; empty conditions mean unconditional `true`                                                                                    |

The target authorization model SHALL exclude hot-path graph loading, duplicate Statement resolution within one operation, per-authorization condition compilation, and per-match regular-expression compilation.

## 2.2 Product Functions

The authorization system provides:

- default-deny Request Authorization with DENY overriding ALLOW;
- database-side Object Authorization before pagination;
- direct and inherited User, Group, Role, and Statement semantics;
- database resolution of effective Statements for every authorization operation;
- one immutable authorization snapshot shared across Request and Object Authorization;
- persistence-neutral Filter AST generation for Object policies;
- bounded authorization-state resolution without complete in-memory hierarchy loading;
- fail-closed handling for invalid policies, non-boolean results, and required-input failures.

### 2.2.1 Resolution and Operation Snapshot

The authorization system SHALL:

- resolve relevant effective Statements from the database for every authorization operation;
- preserve direct and inherited User/Group/Role/Statement semantics;
- avoid loading the complete Group/Role graph during authorization;
- use one immutable, request-scoped Authorization Snapshot for Request and Object Authorization;
- discard the snapshot when the operation ends;
- resolve effective authorization state only once within an operation;
- reuse target matchers within an operation and permit derived compiled-artifact reuse across operations only when keyed by the exact Statement state loaded from the database.

### 2.2.2 Shared Object Filter

The authorization system SHALL:

- represent Object Authorization with ALL, NONE, and the Filter AST operators required by the existing behavior;
- use Filter Schema for direct one-segment object fields;
- translate residual policy predicates into Filter AST and then into the persistence query predicate;
- constant-fold before persistence translation;
- compose authorization filtering with the business predicate before pagination;
- avoid JVM row filtering.

### 2.2.3 ECMAScript Policy Contract

The authorization system SHALL:

- use scope instead of target.type and required policy instead of conditions[];
- validate and compile the supported ECMAScript policy syntax into Policy IR;
- enforce complexity limits and the boolean decision-result contract;
- treat non-boolean results as authorization failures and fail closed;
- keep database-loaded Statement state authoritative for every operation;
- permit compiled Policy IR reuse only as a derived optimization that cannot bypass database resolution;
- evaluate Request policies using only `principal` and `request`, and partially evaluate Object policies through Policy IR;
- retain the default-deny, deny-overrides, constant short-circuit, and built-in authorization semantics;
- exclude the legacy SpEL compiler/evaluator and statement_conditions from the authorization model.

### 2.2.4 Request Authorization Input Boundary

The authorization system SHALL:

- provide request.pathVariables as authorization input;
- make only `principal` and `request` available to `scope: request` policies;
- reject policies that declare `resources` or use `resource(...)`, and reject Request policies that declare or reference `object`, before activation;
- perform Request Authorization without loading business resources or invoking resource adapters.

### 2.2.5 Integration and Consistency

The web, security, and Object Authorization boundaries SHALL share the same request-scoped authorization context. Every authorization operation SHALL observe committed authorization changes on the next operation without cache invalidation, TTL expiry, or distributed-cache coordination.

## 2.3 Stakeholders and Users

The authorization capability is consumed by policy authors, authorization-aware application components, Filter Schema owners, and operators or reviewers of authorization changes. It does not prescribe a user interface or operational persona.

## 2.4 Operational Context and Scenarios

The following scenarios are supporting context, not additional normative requirements:

1. A request operation resolves effective authorization state from the database, creates one immutable snapshot, matches the request target, and evaluates applicable Request Statements.
2. A Request policy evaluates the available `principal` and `request` inputs without loading business resources.
3. An Object policy partially evaluates known inputs, translates the residual Filter AST to the resource query, and applies authorization before pagination.
4. A committed authorization change is observed by the next operation while the current operation continues with its existing snapshot.

## 2.5 Out of Scope

The current authorization capability excludes client-facing `filterBy` syntax, nested or relationship Object filtering, and target kinds beyond `target.api`. These boundaries are detailed in the [Scope](01-introduction.md#12-scope) and [Appendix B](11-appendices.md#111-future-extensions-non-normative).
