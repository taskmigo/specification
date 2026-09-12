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

A direct Taskmigo project edge MAY be omitted when the consumer does not use the corresponding contract. Common third-party libraries MAY additionally flow from `foundation` to its consumers under [ARCH-CON-003](07-constraints.md#arch-con-003--shared-foundation-dependencies).

## 11.2 Foundation Classification Examples

The following examples are supporting guidance for the [Architectural Boundary Test](02-overall-description.md#24-architectural-boundary-test):

| Candidate                                      | Classification        | Reason                                                                                         |
| ---------------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------- |
| Generic offset-pagination value                | Foundation candidate. | Its meaning is independent of a specific Taskmigo feature.                                     |
| Common third-party utility used across modules | Foundation candidate. | It may be re-exported when intentionally established as part of the shared technical baseline. |
| Query Predicate                                | `query`.              | Its meaning is defined by Query Filtering semantics.                                           |
| Authorization Snapshot                         | `authorization`.      | Its meaning is defined by Authorization semantics.                                             |
| Language compiler                              | `language`.           | Its meaning is defined by the language capability.                                             |
| User Query Schema                              | `identity`.           | It is resource-specific query metadata for an identity resource.                               |
| Spring MVC `FilteredQuery` resolver            | `web`.                | It adapts Query Filtering to the web framework.                                                |
| JPA binder for a User Query Predicate          | `identity`.           | It translates an identity-resource contract to identity persistence topology.                  |

## 11.3 Future Module Classification

A future independent capability SHOULD first be modeled as its own capability module. A Taskmigo-owned abstraction MAY move toward `foundation` only when its semantics are demonstrably independent of every owning feature and it satisfies the normative Foundation constraints in [Section 7.1](07-constraints.md#71-foundation-constraints).

A third-party library MAY be promoted into `foundation` when it becomes an intentional project-wide technical dependency and satisfies [ARCH-CON-003](07-constraints.md#arch-con-003--shared-foundation-dependencies).

## 11.4 Boundary Enforcement Examples

The following allocation is supporting guidance for applying the normative enforcement requirements:

| Boundary condition                                                                                          | Expected enforcement                                                                                                                                      |
| ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dependency between [Spring Modulith](https://docs.spring.io/spring-modulith/reference/) application modules | Spring Modulith module model, explicit allowed dependencies, and `verify()`.                                                                              |
| Access to an additional published package of another application module                                     | Spring Modulith named interface plus an allowed dependency targeting that interface.                                                                      |
| Forbidden access to another application module's internal package                                           | Spring Modulith `verify()`.                                                                                                                               |
| Distinct architectural packages sharing one physical module                                                 | Spring Modulith where representable, with [ArchUnit](https://www.archunit.org/getting-started) rules for the remaining intra-module package restrictions. |
| Dependency between separate Taskmigo physical modules                                                       | Build dependency graph, plus Spring Modulith verification when the packages participate in the same executable model.                                     |
