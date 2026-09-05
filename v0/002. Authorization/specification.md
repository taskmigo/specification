# Software Requirements Specification (IEEE 830)
## JavaScript Authorization Policies and Shared Query Filtering

**Baseline branch:** `next`  
**Reviewed head:** `b7570226eb6f7258ed6a3e75a7f8dcab4ae93392`  
**Related:** #37, #54  
**Compatibility:** v0; breaking changes are allowed.

---

# 1. Scope

Replace the authorization condition model currently implemented on `next` with a required ECMAScript policy entry point while preserving these product semantics:

- Request Authorization is default-deny and DENY overrides ALLOW.
- Object Authorization is applied in the database query before pagination.
- User, Group, Role, and Statement inheritance/assignment semantics are preserved.
- Every authorization operation resolves its relevant effective Statements from the database; Statement state is not cached across requests.
- One authorization operation uses one immutable authorization snapshot from start to finish.
- Request policies may explicitly load named resources.
- Object policies compile to a persistence-neutral Filter AST that can also be reused by future query filtering.

Package/module ownership and public SDK boundaries are governed by #54 and are not redefined here.

The following are not part of the scheduled implementation in this SRS:

- an external `filterBy` grammar;
- nested/relationship Object filtering;
- additional authorization target kinds beyond `target.api`;
- updates to files under `docs/`; project documentation is updated separately after a major version.

Implementation work for this SRS SHALL NOT spend effort updating `docs/`. Code comments or implementation-local documentation required to keep the source understandable remain allowed where needed.

---

# 2. Baseline Verified on `next`

The source review uses `next` at `b7570226eb6f7258ed6a3e75a7f8dcab4ae93392`.

| Area | Current behavior |
| --- | --- |
| Statement contract | `effect`, `target.type`, `target.api.method`, `target.api.path`, `conditions: List<String>` |
| Persistence | `statements.target_type` plus `statement_conditions` |
| Statement API | Create accepts nullable `conditions`; missing conditions become an empty list |
| Target matching | Method is exact or `*`; path is a full-match Java regular expression; `Pattern.compile(...)` currently occurs during matching |
| Condition compiler | Restricted SpEL is parsed into Taskmigo's own expression tree |
| Request Authorization | Resolves effective Statements, compiles conditions during authorization, evaluates `principal` and `request`, DENY overrides ALLOW |
| Request input | `principal.id`, `principal.username`, `request.method`, `request.path`; no route/path-variable map |
| Object Authorization | Resolves effective Statements again, compiles conditions again, specializes `principal.*` / `request.*`, retains `object.*`, and translates the residual expression to JPA Criteria |
| Object query mapping | Registered per concrete method/path; only direct one-segment object fields are queryable |
| Effective Statement resolution | Loads all Groups and all Roles, builds hierarchy graphs in JVM, then fetches effective Statements |
| Bootstrap | Built-in Statements use `target.type` + `conditions`; empty conditions mean unconditional `true` |

The target design SHALL remove the hot-path graph loading, duplicate Statement resolution within one operation, per-authorization condition compilation, and per-match regular-expression compilation.

---

# 3. Requirements

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

`scope` controls how the policy is evaluated. `target.api` is the only target shape specified by this SRS.

### STMT-002 — Required policy

`policy` SHALL be a required, non-null, non-blank string.

The Statement SHALL be invalid when `policy` is missing, `null`, empty, or whitespace-only.

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

### STMT-006 — Target semantics

`target.api.method` SHALL preserve the current exact-method-or-`*` semantics.

`target.api.path` SHALL preserve the current full-match regular-expression semantics against the request path without the query string.

Method/path validation and regular-expression compilation SHALL occur before or when building the request-scoped executable representation. Authorization evaluation SHALL reuse the compiled matcher within the same operation.

A compiled target matcher MAY be reused across operations only as a derived artifact keyed by the exact Statement state loaded from the database for the current operation. Such reuse SHALL NOT eliminate the required database Statement lookup.

### STMT-007 — Persistence and API migration

The canonical Statement model SHALL store and expose:

```text
effect
scope
target.api.method
target.api.path
policy
```

`target_type`, `conditions[]`, and `statement_conditions` SHALL be removed from the final model. No compatibility execution path for legacy conditions is required.

---

## 3.2 ECMAScript Policy Compilation

### POLICY-001 — Compilation model

Taskmigo SHALL parse supported ECMAScript module syntax with a maintained parser and compile it into Taskmigo-owned Policy IR.

Authorization execution SHALL evaluate Policy IR; it SHALL NOT invoke a general-purpose JavaScript runtime or evaluate policy source directly.

### POLICY-002 — Supported decision-function subset

The scheduled implementation SHALL support:

```text
function / arrow-function body
const declarations
return
if / else
string, number, boolean, null literals
undefined
property access
=== !== < <= > >=
&& || !
numeric binary + - * / %
numeric unary + -
parenthesized expressions
```

`null` and `undefined` MAY appear as values in supported expressions and intermediate computation. They do not satisfy the decision-function result contract when they become the concrete authorization result.

`%` MAY be used by Request policies. An Object policy using an operation that cannot be translated by the Object query layer SHALL be rejected for Object Authorization.

Additional function calls, string helpers, collection membership operations, loops, mutation, and dynamic language features are outside the scheduled subset unless separately specified.

### POLICY-003 — Static validation

Before a Statement becomes active, compilation SHALL validate what can be determined structurally without requiring whole-function return-type proof:

- the required `export default` entry point;
- supported syntax and operations;
- supported roots and fields where their schema is known;
- scope-specific restrictions;
- compiler complexity limits.

Static validation MAY reject a trivially invalid construct when its invalidity is certain, but authorization correctness SHALL NOT depend on compile-time proof that every execution path returns a boolean.

The concrete decision result type SHALL be checked during authorization as defined by STMT-004.

### POLICY-004 — DB-authoritative Statement state and compiled-artifact reuse

Every authorization operation SHALL obtain the current relevant effective Statement state from the database before policy evaluation.

Taskmigo SHALL NOT use an in-memory or distributed cache of Statement records, effective Statement sets, Statement ids, or authorization snapshots to bypass that database lookup.

Policy IR MAY be reused across operations only as a derived compiled artifact after the current Statement has been loaded from the database. Any such reuse SHALL be keyed by an immutable fingerprint of the exact policy/Statement state loaded for the current operation, such as a content hash or equivalent revision-safe identity.

A compiled-artifact cache:

- SHALL NOT determine which Statements are effective;
- SHALL NOT suppress the per-operation database lookup;
- SHALL NOT make authorization correctness depend on cache invalidation, TTL, or cross-node synchronization;
- SHALL be treated as an optimization only.

If a safe compiled artifact cannot be matched to the exact database-loaded Statement state, Taskmigo SHALL compile from that loaded policy source.

### POLICY-005 — Constant folding

Constant policy results and constant subexpressions SHALL be folded when semantics are unchanged.

At minimum:

```js
export default () => true;
```

and:

```js
export default () => false;
```

SHALL be represented as constant policy results.

---

## 3.3 Authorization Inputs and Operation Snapshot

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

### INPUT-002 — Object root

For `scope: request`, `object` contains named resources resolved through the request-resource contract in §3.5.

For `scope: object`, `object.*` remains symbolic during partial evaluation and is validated through the selected Filter Schema.

### SNAPSHOT-001 — One snapshot per operation

Taskmigo SHALL establish exactly one immutable Authorization Snapshot for each request/authorization operation after resolving the relevant effective Statement state from the database.

The snapshot SHALL represent the effective authorization state required by that operation without prescribing a `List<Statement>` representation.

Request Authorization, request-resource authorization, and Object Authorization in the same operation SHALL consume that same snapshot and SHALL NOT independently resolve effective authorization state again.

The snapshot is request/operation-scoped materialization, not a cross-request cache.

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

### SNAPSHOT-003 — Coherent creation

Snapshot creation SHALL not mix incompatible authorization states when hierarchy, assignments, or Statements change concurrently.

The implementation SHALL not keep a database transaction open for the full HTTP request solely to preserve snapshot semantics.

### SNAPSHOT-004 — No cross-request snapshot reuse

An Authorization Snapshot SHALL be discarded when its operation ends and SHALL NOT be reused as authorization input for a later request/operation.

---

## 3.4 Request Authorization

### REQ-001 — Decision semantics

For `scope: request`:

```text
DENY if any target-matching DENY Statement evaluates true
ELSE ALLOW if any target-matching ALLOW Statement evaluates true
ELSE DENY
```

Policy evaluation SHALL verify that each concrete decision result is boolean before applying the Statement effect.

A non-boolean policy result SHALL raise an authorization exception and fail closed.

Failures in policy evaluation or required authorization input resolution SHALL fail closed.

### REQ-002 — Constant short-circuit

A target-matching DENY Statement whose compiled policy is constant `TRUE` SHALL immediately produce the final DENY result.

After the final result is known, authorization SHALL NOT evaluate remaining policies or resolve resources that cannot change that result.

A constant-`TRUE` ALLOW SHALL NOT bypass applicable DENY Statements.

The required database Statement resolution for the operation occurs before these in-operation evaluation short-circuits; short-circuiting SHALL NOT be implemented by skipping the per-operation DB source-of-truth lookup.

---

## 3.5 Request Resources

### RES-001 — Scope restriction

The named export `resources` SHALL be valid only for `scope: request`.

A `scope: object` policy declaring `resources` SHALL be rejected before activation.

The default export remains mandatory regardless of scope.

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
  return object.project.ownerId === principal.id &&
         object.user.projectId === object.project.id;
};
```

`resources` SHALL return a statically analyzable object whose values are `resource(type, key)` descriptors.

`resource(type, key)` is a compiler intrinsic. It SHALL describe a lookup and SHALL NOT perform persistence access itself.

### RES-003 — Resource adapters

Resource types SHALL be resolved through registered adapters.

Resolution SHALL:

- deduplicate identical `(type, key)` lookups;
- batch compatible lookups where supported;
- avoid N+1 behavior;
- expose immutable policy input values rather than repositories or JPA entities.

Unknown resource types or required resource-resolution failures SHALL fail closed.

---

## 3.6 Object Authorization and Shared Filter AST

### OBJ-001 — Partial evaluation

For `scope: object`, Taskmigo SHALL evaluate known `principal` and `request` values while retaining `object.*` as symbolic values.

The residual authorization predicate SHALL be represented as Filter AST.

A fully evaluated Object policy result SHALL be boolean. A partially evaluated result SHALL represent a boolean residual predicate. Any other result SHALL raise an authorization exception and fail closed.

### OBJ-002 — Initial Filter Schema scope

Filter Schema SHALL map policy-visible object fields to persisted fields/types for a registered Object Authorization mapping and SHALL own type validation/coercion at that persistence boundary.

The scheduled implementation SHALL preserve the capability currently present on `next`: direct one-segment object fields. Nested paths, joins, and relationship predicates are deferred.

### OBJ-003 — Filter AST

The scheduled Filter AST SHALL support the operations required to preserve the current Object Authorization semantics:

```text
ALL NONE
AND OR NOT
EQ NE GT GE LT LE
numeric ADD SUBTRACT MULTIPLY DIVIDE NEGATE
```

Filter AST is independent of ECMAScript syntax and persistence APIs.

### OBJ-004 — Database execution

Filter AST SHALL compile to the resource query predicate used by the existing persistence layer.

Authorization filtering SHALL execute before pagination. The implementation SHALL NOT load unrestricted business rows and filter them in JVM memory.

An Object policy that cannot be represented by the selected Filter Schema / Filter AST SHALL not be active for that Object Authorization mapping.

### OBJ-005 — Composition

Object visibility SHALL use:

```text
ANY(ALLOW filters) AND NOT ANY(DENY filters)
```

Constant composition SHALL be simplified before JPA translation.

At minimum:

```text
TRUE object policy  -> ALL
FALSE object policy -> NONE
ALL OR X             -> ALL
NONE OR X            -> X
ALL AND X             -> X
NONE AND X           -> NONE
NOT ALL              -> NONE
NOT NONE              -> ALL
```

A target-matching DENY Statement with constant `TRUE` SHALL reduce the final authorization filter to `NONE` without translating remaining ACL predicates.

When the final authorization filter is `NONE`, the query layer SHOULD avoid a database query when the caller can produce the correct empty result without it.

---

## 3.7 Effective Authorization Resolution

### PERF-001 — DB-first resolution

Runtime authorization SHALL NOT load all Groups or all Roles and SHALL NOT build the authorization hierarchy graph in JVM memory.

Direct and inherited User/Group/Role/Statement semantics present on `next` SHALL be preserved.

### PERF-002 — Bounded query behavior

Authorization-state resolution SHALL:

- use a bounded number of database round trips;
- avoid N+1 behavior;
- avoid loading unrelated authorization graph nodes;
- deduplicate effective authorization state;
- avoid repeating the same effective-state resolution for Request and Object Authorization in one operation.

Unrelated growth in the authorization graph SHALL NOT increase the number of database round trips for one authorization operation.

### PERF-003 — Stress case

Verification SHALL include a principal with approximately 500 effective Statements targeting the same API, including a case where no early constant result can terminate evaluation.

The test SHALL verify bounded database round trips and SHALL exercise target matching plus policy evaluation/partial evaluation, not only repository lookup.

### PERF-004 — Database source of truth on every operation

Every request/authorization operation SHALL perform database resolution of the relevant effective Statements required for that operation.

The implementation SHALL NOT maintain or consult a cross-request in-memory or distributed cache containing:

```text
Statement records
Statement policy source as authoritative state
effective Statement ids/sets
principal -> Statement resolution results
Authorization Snapshots
```

A request-scoped snapshot or request-scoped materialization of the Statements just read from the database is allowed and SHALL be discarded with the operation.

### PERF-005 — No distributed-cache correctness dependency

Authorization correctness SHALL depend on the database state read for the current operation, not on cache invalidation.

After a Statement, assignment, Role, or Group authorization change is committed, the next operation SHALL observe that change through its database resolution without requiring:

```text
cache eviction
cache TTL expiry
pub/sub invalidation
cross-instance cache synchronization
```

---

# 4. Technical and Security Constraints

### TECH-001 — Null Object Pattern

Internal authorization abstractions SHOULD use the Null Object Pattern where it removes sentinel/null branching while preserving the normal interface.

Examples include constant compiled policies and Filter AST identity/zero objects such as `ALL` and `NONE`.

This SHALL NOT alter the external Statement contract: `policy` is always required and valid.

### TECH-002 — Design patterns

The implementation SHOULD apply established design patterns when they materially reduce coupling, branching, duplication, or persistence/runtime leakage. Patterns SHALL be used to simplify the design, not to create abstractions solely to satisfy a pattern checklist.

Preferred applications include:

| Concern | Preferred pattern |
| --- | --- |
| Constant/identity authorization behavior | Null Object |
| Request evaluation vs Object partial evaluation | Strategy |
| Policy IR and Filter AST boolean trees | Composite |
| Request-resource loading and persistence-specific translation boundaries | Adapter |
| Database authorization predicates | Specification |
| Resource adapters / Filter Schemas selected by registered type or target | Registry |

Equivalent patterns or simpler designs are acceptable where they better fit the code. The implementation SHOULD make the architectural intent clear in the source when a non-obvious pattern is introduced. This requirement does not require changes under `docs/`.

### TECH-003 — Untrusted policy source

Policy source is untrusted compiler input.

The supported policy environment SHALL NOT expose repositories, Spring/ApplicationContext objects, JPA entities, filesystem/network/process access, reflection, or arbitrary host APIs.

Source size, AST depth/node count, and other compiler complexity SHALL be bounded.

### TECH-004 — Fail closed

Policy parse/validation errors SHALL prevent activation.

Runtime authorization failures, including non-boolean policy results, SHALL not grant access.

---

# 5. Implementation Phases

Each phase is a complete production capability. Deferred capabilities are not listed as phases.

## Phase 1 — DB-first Resolution and Request-scoped Authorization Snapshot

- replace the current full Group/Role graph loading on the authorization hot path;
- preserve direct and inherited authorization semantics;
- query the database for the relevant effective Statements on every authorization operation;
- prohibit cross-request Statement/effective-set/Snapshot caching;
- introduce one request-scoped Authorization Snapshot used by both Request and Object Authorization;
- discard the snapshot at operation end;
- remove duplicate effective-state resolution within one operation;
- make target matchers reusable within the operation and allow cross-operation compiled-artifact reuse only when keyed by the exact DB-loaded Statement state;
- add query-count tests, graph-growth tests, snapshot-consistency tests, no-cache-freshness tests, and the 500-effective-Statement resolution stress case.

**Done:** every operation obtains current authorization state from the DB, runtime authorization does not materialize the complete Group/Role graph, no cross-request Statement cache is required, and one operation uses one coherent request-scoped snapshot.

## Phase 2 — Shared Filter AST for Existing Object Authorization

- introduce `ALL` / `NONE` and the Filter AST operators required by the current Object Authorization behavior;
- introduce Filter Schema for the current direct-field Object mappings;
- translate the current residual authorization expression into Filter AST;
- compile Filter AST to the existing JPA Specification/Criteria path;
- apply Composite/Null Object/Specification patterns where they simplify the implementation;
- constant-fold before persistence translation;
- keep authorization before pagination;
- migrate all current Object Authorization consumers to this path.

**Done:** current Object Authorization behavior runs through Filter AST -> database predicate with no JVM row-filter fallback.

## Phase 3 — JavaScript Policy Migration

- replace `target.type` with `scope`;
- replace `conditions[]` with required `policy`;
- update Statement API, persistence, schema, bootstrap reconciliation, and built-in Statements;
- add the ECMAScript parser, Policy IR, structural/static validation, complexity limits, and constant folding;
- enforce the boolean decision-result contract during Request/Object Authorization and raise an authorization exception for non-boolean results;
- ensure DB-loaded Statement state remains authoritative on every operation;
- allow compiled Policy IR reuse only as a derived fingerprint-keyed optimization that cannot bypass DB resolution;
- migrate Request Authorization to Policy IR evaluation;
- migrate Object Authorization to Policy IR partial evaluation -> Filter AST;
- use Strategy/Composite/Null Object patterns where they reduce runtime branching and coupling;
- remove the legacy SpEL compiler/evaluator and `statement_conditions`;
- verify default-deny, deny-overrides, runtime non-boolean failure, constant short-circuit, built-in authorization behavior, and the full 500-Statement authorization stress case.

**Done:** every active Statement uses the canonical JavaScript policy contract; each operation reads authoritative Statement state from DB; non-boolean policy results fail closed at authorization runtime; no runtime path executes legacy conditions.

## Phase 4 — Request Resource Authorization

- add `request.pathVariables` to the authorization request input;
- support optional `resources` named export only for `scope: request`;
- reject `resources` for `scope: object`;
- implement `resource(type, key)` descriptors and the resource-adapter registry;
- use Adapter/Registry patterns for resource resolution boundaries where appropriate;
- support multiple named resources;
- deduplicate and batch compatible resolution;
- expose resolved immutable values under `object`;
- reuse resolved resources only within the same authorization operation;
- add failure, scope-validation, batching, deduplication, and query-count tests.

**Done:** Request policies can authorize against explicitly declared persisted resources without repository access from policy code and without N+1 behavior.

## Phase 5 — Integration, Cleanup, and Acceptance

- ensure web/security and Object Authorization integration reuse the same request-scoped authorization context and do not reintroduce independent resolution;
- verify that no cross-request Statement/effective-authorization cache is introduced in any application layer;
- verify a committed authorization change is observed by the next request without cache invalidation or TTL expiry;
- review authorization boundaries for appropriate design-pattern use and remove accidental pattern-driven over-abstraction;
- migrate remaining built-in/bootstrap/test fixtures to the final policy contract;
- remove stale condition/SpEL implementation artifacts;
- run integration/stress coverage for Request Authorization, Object Authorization, runtime policy-result validation, snapshot consistency, DB freshness, resource resolution, and 500 matching effective Statements.

Phase 5 SHALL NOT update files under `docs/`.

**Done:** repository code, bootstrap data, and tests describe and verify the final architecture in this SRS; every new operation observes authorization state through DB resolution and does not depend on distributed cache coherence. Updating `docs/` is not part of the Definition of Done.

---

# 6. Deferred Extensions

## `filterBy`

A future client-facing `filterBy` feature SHALL compile into the same Filter AST used by Object Authorization.

Its external syntax is not specified by this SRS.

When introduced, list-query composition SHALL be:

```text
business predicate
AND client filter predicate
AND authorization predicate
```

before pagination.

## Relationships and Additional Operators

Nested object paths, joins/subqueries, relationship predicates, and additional Filter AST operators require a separate complete specification before implementation.

---

# 7. Acceptance Matrix

| Capability | Required verification |
| --- | --- |
| Statement contract | Missing/null/blank policy rejected; valid `export default` required; compile-time proof of all return types is not required |
| Policy result | `true`/`false` accepted; `null`, `undefined`, string, number, object, or fall-through as the concrete decision result raises an authorization exception and fails closed |
| DB source of truth | Every operation resolves relevant effective Statements from DB; no cross-request Statement/effective-set/Snapshot cache is consulted |
| Freshness | A committed authorization change is visible to the next operation without cache eviction, TTL expiry, or inter-node cache synchronization |
| Compiled artifacts | Reuse, if implemented, is keyed to the exact DB-loaded Statement state and cannot bypass the DB lookup |
| Target | Method wildcard/exact semantics preserved; path regex is full-match; matcher is reused within one operation |
| Snapshot | Request/Object in one operation use the same request-scoped state; snapshot is discarded afterward; an authorization change affects the next operation, not the current one |
| Request | Default deny; DENY overrides; non-boolean result fails closed; constant-TRUE DENY short-circuits after DB resolution |
| Resources | `resources` accepted only for Request scope; named lookups deduplicated/batched; no N+1 |
| Object | Policy IR partial evaluation produces a boolean Filter AST predicate; invalid/non-boolean result fails closed; DB predicate is applied before pagination; no JVM row filtering |
| Constants | `ALL` / `NONE` algebra and final `NONE` short-circuit are covered |
| Resolution | No full Group/Role graph load; bounded DB round trips; unrelated graph growth does not add round trips |
| Design patterns | Appropriate patterns are used where they simplify boundaries/behavior; no unnecessary pattern-only abstraction is introduced |
| Documentation scope | No `docs/` update is required for this SRS implementation |
| Stress | ~500 effective matching Statements exercises DB resolution + target match + policy evaluation/partial evaluation with bounded DB round trips |