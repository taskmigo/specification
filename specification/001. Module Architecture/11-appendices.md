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

A direct Taskmigo project edge MAY be omitted when the consumer does not use the corresponding contract. Repository build conventions are intentionally outside this graph because they configure projects rather than expressing Taskmigo semantic dependencies.

## 11.2 Foundation Classification Examples

The following examples are supporting guidance for the [Architectural Boundary Test](02-overall-description.md#24-architectural-boundary-test):

| Candidate                                      | Classification        | Reason                                                                                                  |
| ---------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------- |
| Generic offset-pagination value                | Foundation candidate. | Its meaning is independent of a specific Taskmigo feature.                                              |
| JSpecify annotations                           | Build convention.     | They are cross-cutting compile-time metadata and do not represent Taskmigo semantic ownership.          |
| Error Prone or NullAway                        | Build convention.     | They analyze compilation and SHALL NOT create a Taskmigo project dependency or runtime dependency.      |
| Query Predicate                                | `query`.              | Its meaning is defined by Query Filtering semantics.                                                    |
| Authorization Snapshot                         | `authorization`.      | Its meaning is defined by Authorization semantics.                                                      |
| Language compiler                              | `language`.           | Its meaning is defined by the language capability.                                                      |
| User Query Schema                              | `identity`.           | It is resource-specific query metadata for an identity resource.                                       |
| Spring MVC `FilteredQuery` resolver            | `web`.                | It adapts Query Filtering to the web framework.                                                         |
| JPA binder for a User Query Predicate          | `identity`.           | It translates an identity-resource contract to identity persistence topology.                           |
| Runtime library used by one capability         | Owning module.        | Runtime behavior dependencies belong with the capability, resource, adapter, infrastructure, or app.   |

## 11.3 Future Module Classification

A future independent capability SHOULD first be modeled as its own capability module. A Taskmigo-owned abstraction MAY move toward `foundation` only when its semantics are demonstrably independent of every owning feature and it satisfies the normative Foundation constraints in [Section 7.1](07-constraints.md#71-foundation-constraints).

A third-party build/tooling library SHOULD be added to the convention layer when it becomes an intentional repository-wide build concern. A third-party runtime library SHOULD remain declared by the module whose owned behavior requires it.

## 11.4 Boundary Enforcement Examples

The following allocation is supporting guidance for applying the normative enforcement requirements:

| Boundary condition                                                                                          | Expected enforcement                                                                                                                                      |
| ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dependency between [Spring Modulith](https://docs.spring.io/spring-modulith/reference/) application modules | Spring Modulith module model, explicit allowed dependencies, and `verify()`.                                                                              |
| Access to an additional published package of another application module                                     | Spring Modulith named interface plus an allowed dependency targeting that interface.                                                                      |
| Forbidden access to another application module's internal package                                           | Spring Modulith `verify()`.                                                                                                                               |
| Distinct architectural packages sharing one physical module                                                 | Spring Modulith where representable, with [ArchUnit](https://www.archunit.org/getting-started) rules for the remaining intra-module package restrictions. |
| Dependency between separate Taskmigo physical modules                                                       | Build dependency graph, plus Spring Modulith verification when the packages participate in the same executable model.                                     |
| Repeated nullness/static-analysis/formatting configuration across projects                                  | Gradle convention plugin and fixed version catalog entries.                                                                                               |

## 11.5 Illustrative Convention Plugin Layout

The following layout is non-normative. Equivalent layouts are acceptable when they preserve the requirements in Sections 7, 8, and 12.

```text
server/
├── build-logic/
│   └── src/main/kotlin/
│       ├── taskmigo.java-base.gradle.kts
│       ├── taskmigo.java-library.gradle.kts
│       ├── taskmigo.spring-module.gradle.kts
│       ├── taskmigo.spring-application.gradle.kts
│       └── taskmigo.architecture-test.gradle.kts
├── gradle/
│   └── libs.versions.toml
└── modules/
    └── ...
```

A normal reusable module can then communicate primarily its semantic dependencies:

```kotlin
plugins {
    id("taskmigo.spring-module")
}

dependencies {
    api(project(":modules:foundation"))
    implementation(project(":modules:language"))
}
```

The example intentionally omits JSpecify, Error Prone, NullAway, Spotless, Checkstyle, and architecture-test tool declarations because those are supplied by the applicable conventions.
