# Taskmigo Modular SRS Authoring Guide

Use this reference with [SRS Writer](../SKILL.md) when drafting or reviewing a Taskmigo feature, documenting a public interface, or reconciling an existing implementation with the specification. The [ISO/IEC/IEEE 29148 outline](iso-iec-ieee-29148-outline.md) remains the general requirements-engineering reference.

## Outcome and boundaries

A successful module SRS SHALL allow an independent backend team, frontend team, integration consumer, and test team to agree on intended behavior **without inspecting the existing backend implementation to infer the API contract**.

- Preserve the repository's numbered feature directories and the canonical 11-section, README-first layout. Add a module or split a large section only when the ownership boundary or document size warrants it; do not reorganize the entire repository to follow a generic template.
- Organize by business capability and consumer-visible behavior, not controller, class, database table, sprint, or development ticket.
- Treat the module SRS as the authoritative written product contract for **approved** behavior. An implementation or generated OpenAPI document is evidence of implemented behavior, not automatic proof of product intent.
- Keep shared conventions (envelope, errors, pagination, authentication, filtering grammar) in their existing canonical specification and link to them. Keep each module's operation inventory, field allowlists, domain rules, and deviations in the owning module.
- Describe *what* the software SHALL do and what can be observed. Keep algorithms, framework selection, storage implementation, class names, and rollout tasks out of normative requirements unless they are explicit stakeholder-approved constraints.
- Do not fabricate endpoints, fields, types, defaults, authorization rules, limits, examples, or error codes. Mark missing contract details as unresolved with their evidence gap and resolution condition.

## Source-of-truth and reconciliation workflow

1. **Identify scope.** Read `AGENTS.md`, the relevant module `README.md`, and the linked sections. Find shared specifications and relevant external decisions before changing text.
2. **Inventory surfaces.** List the module's public HTTP operations, events, relevant roles and objects, domain states, and data projections. For a source-backed baseline, inspect current routes, DTO/schema definitions, validation, authorization, response handling, generated OpenAPI, and relevant tests **for every in-scope operation**. Record the inspected repository/ref or commit in source evidence, without treating that evidence as normative by itself.
3. **Classify findings.** Mark each candidate as **Approved requirement**, **Observed as-is behavior**, **Proposed to-be behavior**, **Conflict/drift**, or **Unresolved**. A source-code behavior, old issue, or existing passing test SHALL NOT be promoted silently to an approved requirement.
4. **Resolve contradictions.** Compare applicable user decisions, existing normative SRS, public contracts, implementation, and tests. Where they disagree, keep approved intent intact, expose the mismatch, and request/record a decision. If documentation is explicitly being baselined from code, label the baseline as *as-is* and identify the evidence version. Keep *to-be* changes separate until approved.
5. **Draft by ownership.** Place operations in section 3 of their owning module, behavior and rules in section 4, state/data semantics in section 5, measurable qualities in section 6, verification in section 9, and evidence/traceability/unresolved conflicts in section 10. Link instead of copying content across files.
6. **Review as an independent consumer.** Check that someone who cannot read the backend can produce compatible requests, interpret responses and failures, apply permissions, and derive meaningful acceptance tests. If the answer is no, the specification is incomplete.
7. **Verify and report.** Check links, IDs, section ownership, Markdown formatting, applicable lint checks, and actual contract drift. Report checks run and gaps separately; never claim checks passed unless executed.

## Requirements coverage for each capability

Capture the following where applicable; use **Not applicable** with a reason or an explicit **TBD/TBR** with owner/resolution condition where the contract is genuinely absent.

| Dimension           | Required questions                                                                                               |
| ------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Context             | Who uses it, why, and under what preconditions?                                                                  |
| Observable behavior | What trigger, sequence, business rules, and output must hold?                                                    |
| State and data      | Which states, transitions, invariants, side effects, persistence, and retention rules apply?                     |
| Authorization       | Which request-level and object-level permissions apply, including collection visibility and counts?              |
| Input boundaries    | Which fields, types, allowed values, null/omission semantics, defaults, ranges, and uniqueness rules apply?      |
| Failures            | What happens for malformed, invalid, forbidden, missing, conflicting, repeated, and concurrent operations?       |
| Collections         | Which filters/operators, sort fields/directions, precedence, pagination limits, and total-count semantics apply? |
| Integrations        | Which other modules, events, external services, and clients depend on this contract?                             |
| Quality             | Which measurable performance, capacity, security, consistency, privacy, and reliability guarantees apply?        |
| Verification        | How can the requirement be objectively accepted without knowledge of its implementation?                         |

An independently verifiable rule SHALL have a stable ID, an explicit subject and condition, a normative outcome, and linked verification. Break up multi-behavior requirements when failure of one behavior would not imply failure of another. Avoid splitting trivial field descriptions into dozens of noisy standalone requirements: use one operation requirement plus a normative contract table when that is clearer.

## Module-owned HTTP API contract (section 3)

**A route list, prose such as “accepts filtering,” or a link to generated OpenAPI alone is insufficient.** Document every in-scope public operation, including operations that do not require a request body. For each operation, make the following discoverable in the module's section 3; use links for identical shared conventions rather than duplicating them.

| Contract area  | Information to specify                                                                                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Identity       | Stable operation/requirement ID, HTTP method and full path, intended consumer, purpose, and lifecycle/status if relevant                                                                    |
| Security       | Authentication, request authorization, object authorization, and visibility/non-disclosure behavior                                                                                         |
| Inputs         | Path, query, header, and body parameters with exact names, types, required/optional status, nullable/omitted semantics, defaults, enumerations, formats, validation, and limits             |
| Request model  | Field-level schema, nested objects/arrays, relation/identifier semantics, conditional fields, partial-update vs replacement behavior, and examples for nontrivial payloads                  |
| Success        | HTTP status, headers when contractually relevant, response body/envelope, exact exposed fields with types/nullability, nested projections, and empty-result behavior                        |
| Failure        | HTTP status **and** stable application error code, response structure, and behavior for each relevant validation, access, missing-resource, conflict, and retry/idempotency case            |
| Query features | Actual allowlisted filter fields/operators and sort fields, query syntax/precedence, default order, deterministic ordering rules, pagination boundaries, and visible-result count semantics |
| Side effects   | State changes, audits, emitted events, consistency/timing guarantees, and transaction/atomicity expectations if externally observable                                                       |
| Traceability   | Links to functional rules, domain states, shared contract, examples, and acceptance/contract tests                                                                                          |

### Field-level contracts

Use tables for fields, not a loose list of names. At minimum, distinguish:

- Exact wire name and data type/format (including ID representation, dates/times, enum values, nested collection shapes).
- Required vs optional on **request** and guaranteed vs conditional on **response**.
- Nullable vs omitted values; unknown field behavior, default values, conditional constraints, and PATCH semantics.
- Validation and errors, including server normalization/coercion when explicitly part of the contract.
- Field exposure differences for create, list, detail, update, retained/deleted, and privileged views.
- Dynamic fields: whether available fields are discoverable at runtime and which static contract metadata is incomplete by design.

Use a separate contract table per operation or a clearly linked canonical reusable request/response schema. A generic “Ticket object” field list SHALL NOT conceal differences between operations.

### Filtering, sorting, pagination, and authorization

- Link to the canonical [Query Filtering](../../../specification/004.%20Query%20Filtering/README.md) contract for shared grammar and semantics. Specify per-operation permitted fields, field types, operators, sort capability, defaults, and constraints.
- Preserve the existing generated OpenAPI extension names **`x-filter-by`** and **`x-sort-by`** where those conventions apply; do not change them to invented spellings. Verify extension values against the documented module allowlist and mark dynamically exposed capabilities explicitly.
- State whether authorization and object visibility affect collection items, totals, and aggregation. State the order of observable filtering/sorting/paging semantics where specified.
- Define stable order and tie-breaking rules **only** when agreed or evidenced as an explicitly approved baseline; do not invent implicit ID tiebreakers, cursor semantics, or hidden access rules.
- Link shared envelope and errors to [Audit and API Contracts](../../../specification/007.%20Audit%20and%20API%20Contracts/README.md), and document module-specific codes and status mappings in the owning module.

### Contract writing pattern

Use a compact, repeatable operation block; omit fields that are truly not applicable, not fields that are merely unknown:

~~~markdown
### <MODULE>-API-001 — <Operation name>

**Operation:** <METHOD> <PATH>
**Consumer:** <Actor or client>
**Security:** <Authentication, request authorization, object authorization>

**Inputs**

| Location | Name | Type/format | Required | Default / validation / semantics |
| --- | --- | --- | --- | --- |
| Query | <name> | <type> | <yes/no> | <specific constraint> |

**Request body:** <Schema/table or Not applicable>

**Success response:** <HTTP status, envelope link, field-level model, headers>

**Failure contract:** <HTTP status + application code + condition>

**Rules and side effects:** <Links to normative IDs in sections 4/5>

**Verification:** <Links to scenarios or contract checks in section 9>
~~~

This is a **template**, not evidence that any endpoint, parameter, status, or error code exists. Do not substitute placeholders for known facts, and do not copy the template into every operation when a concise equivalent is equally unambiguous.

### SRS versus OpenAPI

- **SRS:** Source of approved behavior, permissions, field meaning, invariants, state transitions, boundary conditions, and acceptance criteria. It SHALL contain or link to sufficiently precise module-owned HTTP contract details.
- **OpenAPI:** Machine-readable wire contract for applicable HTTP operations. It captures paths, verbs, security declarations, parameter/body/response schemas, examples, status codes, and supported extensions. Use it alongside SRS; do not assume it conveys all business semantics.
- **Generated OpenAPI:** Evidence of implementation output to be checked against the **approved SRS contract**, not an authority that may overwrite the SRS automatically.
- Do **not** require one monolithic OpenAPI file or one handwritten OpenAPI file per module. Preserve the repository's existing published/generated artifact conventions and place human-readable operation details in the relevant module SRS. If authored OpenAPI is explicitly adopted, link to the relevant component/operation as the canonical wire-schema definition rather than maintaining competing copies.
- For each in-scope operation, compare existence/method/path, request fields and constraints, responses and error schemas, security, and `x-filter-by`/`x-sort-by` metadata with generated OpenAPI where available. Track mismatches and omissions explicitly in section 10. An observed match is not evidence that untested semantics are correct.

## Acceptance and traceability (sections 9 and 10)

Every normative capability SHALL have objective verification. Write a **small, high-signal scenario set** rather than generating redundant combinations.

- Include happy path, representative invalid/edge boundary, authorization (request and object), response projection, and relevant state transition or failure behavior.
- For filter/sort/pagination, check interactions such as authorization-restricted counts, filter/sort precedence, supported/unsupported fields and operators, repeated sorts, and page boundaries when applicable.
- Where concurrency, consistency, audit, deletion/retention, or privacy requirements exist, cover those invariants and failure recovery.
- BDD/Gherkin is welcome as evidence, but assertions must be deterministic and refer to exact contract behavior; examples alone are not normative unless incorporated into a normative rule.
- Maintain links from requirement ID to its interface rule (if relevant), acceptance scenario/test evidence, and unresolved item. Link back from verification to the requirement. External test files are evidence only, not a substitute for specification.
- If performance or scale matters, record a quantifiable target, workload, environment/measurement condition, and objective acceptance method. Mark unagreed values as TBD rather than writing “fast,” “efficient,” or claiming an invented SLA.

## Final reviewer gate

Before declaring a module ready for independent implementation, answer **yes** or surface a concrete gap for each question:

1. Is its owner, scope, audience, and canonical README entry point explicit?
2. Can an independent consumer reconstruct **every in-scope operation's** request, response, security, errors, and field semantics without reading application source?
3. Are business rules, states, invariants, negative cases, side effects, and applicable quality requirements observable and noncontradictory?
4. Are shared contracts linked once, without redundant copies or ambiguous ownership?
5. Are the SRS and generated OpenAPI reconciled (or mismatches explicitly tracked)?
6. Are requirement IDs stable and linked to high-value, objectively testable acceptance criteria?
7. Are unknowns, code-vs-spec drift, and unapproved assumptions visible rather than silently converted to requirements?
8. Were applicable Markdown/format/link checks **actually run**, with unrun checks disclosed?

Do not label the SRS “complete” when substantive gaps remain; indicate the covered scope and the specific blockers.
