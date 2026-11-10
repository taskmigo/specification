# 11. Appendices

Examples clarify policy inputs and allow/deny composition; they do not extend the supported grammar or available HTTP routes.

## 11.1 Request and Object Flow

```mermaid
flowchart TB
    jwt[Authenticated active principal] --> subjects[Resolve effective subjects]
    subjects --> statements[Read direct and Role Statements]
    statements --> snapshot[Immutable operation snapshot]
    snapshot --> request[Evaluate Request PROGRAM rules]
    request --> permitted{Request allowed?}
    permitted -->|No| denied[403]
    permitted -->|Yes| object[Partially evaluate Object EXPRESSION rules]
    object --> binder[Validate schema and bind predicate]
    binder --> query[Database-side restricted query]
```

## 11.2 Policy Source Examples

Request policy source:

```text
return principal.username == "system";
```

Object policy source:

```text
object.status == "RETAINED"
```

Each example requires a matching Statement effect/scope/target and schema-allowed field; the first is not an implicit authentication bypass.

## 11.3 Matching

`/api/v0/users/.*` is a supported target pattern; the matcher evaluates a full path without the query string and applies the Statement's method or `*` wildcard.
