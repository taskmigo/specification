# 11. Appendices

## 11.1 Reference Dependency Model

The following model is non-normative and illustrates the requirements in [Section 7](07-constraints.md) and [Section 8](08-requirements-allocation-and-dependencies.md):

```text
foundation
   ↑
   ├────────────── language
   │                    ↑
   │              ┌─────┴─────┐
   │              │           │
   │            query   authorization
   │              │           │
   └──── database ┴─────┬─────┘
                        ↑
                     identity
                        ↑
                       web
                        ↑
              bootstrap / worker
```

A direct edge MAY be omitted when the consumer does not use the corresponding contract.

## 11.2 Foundation Classification Examples

The following examples are supporting guidance for the [Architectural Boundary Test](02-overall-description.md#24-architectural-boundary-test):

| Candidate                             | Classification        | Reason                                                                        |
| ------------------------------------- | --------------------- | ----------------------------------------------------------------------------- |
| Generic offset-pagination value       | Foundation candidate. | Its meaning is independent of a specific Taskmigo feature.                    |
| Query Predicate                       | `query`.              | Its meaning is defined by Query Filtering semantics.                          |
| Authorization Snapshot                | `authorization`.      | Its meaning is defined by Authorization semantics.                            |
| Language compiler                     | `language`.           | Its meaning is defined by the language capability.                            |
| User Query Schema                     | `identity`.           | It is resource-specific query metadata for an identity resource.              |
| Spring MVC `FilteredQuery` resolver   | `web`.                | It adapts Query Filtering to the web framework.                               |
| JPA binder for a User Query Predicate | `identity`.           | It translates an identity-resource contract to identity persistence topology. |

## 11.3 Future Module Classification

A future independent capability SHOULD first be modeled as its own capability module. A shared abstraction MAY move toward `foundation` only when its semantics are demonstrably independent of every owning feature and it satisfies the normative Foundation constraints in [Section 7.1](07-constraints.md#71-foundation-constraints).
