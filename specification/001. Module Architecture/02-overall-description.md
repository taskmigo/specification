# 2. Overall Description

## 2.1 Architectural Context

Taskmigo is expected to gain additional capabilities over time. The module architecture therefore separates reusable technical foundations from capability semantics, resource ownership, framework adaptation, and executable application composition.

The dependency model is intentionally asymmetric. Lower-level modules expose stable contracts upward; higher-level modules SHALL NOT force their feature semantics back into lower-level modules. The `foundation` library MAY intentionally distribute project-wide third-party libraries to consumers, but this shared dependency role SHALL NOT make `foundation` the owner of feature semantics.

Logical package boundaries are enforced primarily with [Spring Modulith](https://docs.spring.io/spring-modulith/reference/). [ArchUnit](https://www.archunit.org/getting-started) supplements that model for package boundaries that coexist within one physical build module or for architectural package rules that require additional static checks.

## 2.2 Module Categories

### 2.2.1 Foundation

`foundation` is the dependency floor and shared technical library. It contains feature-neutral primitives and contracts that are reusable across unrelated capabilities and MAY declare or re-export third-party libraries that are intentionally established as common dependencies for multiple Taskmigo modules.

A third-party dependency being convenient or already present is insufficient to make it a foundation concern. Capability-specific libraries and adapters remain with the owning capability unless the architecture intentionally establishes them as project-wide dependencies.

### 2.2.2 Standalone Capability Modules

The following capabilities are independently meaningful and SHALL have module ownership separate from `foundation`:

- `language` owns Language syntax, compilation, typing, evaluation, partial evaluation, and language-level diagnostics.
- `query` owns Query Filtering contracts and client `filterBy` compilation.
- `authorization` owns authorization semantics, policy interpretation, authorization context, request decisions, and object authorization predicates.
- `identity` owns identity resources such as users, groups, and membership relationships.

Additional capabilities SHALL follow the same ownership model when introduced.

### 2.2.3 Infrastructure Modules

`database` owns shared persistence infrastructure that is not specific to one capability. Resource-specific persistence mappings SHALL remain with the resource-owning capability rather than moving into `database` merely because they use persistence technology.

### 2.2.4 Adapter and Application Modules

`web` owns HTTP, Spring MVC, and Spring Security adaptation for public web behavior. Executable applications such as `bootstrap` and `worker` compose capabilities and infrastructure without becoming owners of their underlying domain semantics.

## 2.3 Dependency Direction

The intended Taskmigo project dependency direction is:

```text
foundation
   ↑
language             database
   ↑                   ↑
query   authorization  │
   \       /           │
    \     /            │
     identity/resource-owning modules
                ↑
               web
                ↑
      bootstrap / worker / future apps
```

The diagram is illustrative. Third-party libraries intentionally re-exported by `foundation` are shared technical dependencies and do not change the Taskmigo project-module direction. The normative allowed and prohibited dependencies are defined in [Section 7](07-constraints.md) and [Section 8](08-requirements-allocation-and-dependencies.md).

## 2.4 Architectural Boundary Test

A Taskmigo-owned type is a candidate for `foundation` only when its meaning remains valid after removing any one feature capability such as Authorization, Query Filtering, Language, or Identity from the product.

A third-party library is a candidate for shared distribution through `foundation` only when it is intentionally part of the common technical baseline for multiple modules and does not introduce feature ownership into `foundation`.

Feature-specific terminology, behavior, lifecycle, validation, compilation, policy semantics, query semantics, framework adaptation, and persistence mappings fail this boundary test and SHALL be owned outside `foundation`.

## 2.5 Boundary Enforcement Model

A physical build module and a Spring Modulith application module do not need to map one-to-one. Taskmigo SHALL use Spring Modulith for every logical application-module boundary that can be represented by its module model, allowed-dependency declarations, named interfaces, and verification rules.

When multiple architectural package boundaries reside inside one physical module, automated ArchUnit rules SHALL enforce the package access restrictions that remain inside that physical boundary. ArchUnit supplements rather than replaces Spring Modulith for boundaries Spring Modulith can represent.
