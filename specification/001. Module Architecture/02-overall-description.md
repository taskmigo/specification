# 2. Overall Description

## 2.1 Architectural Context

Taskmigo is expected to gain additional capabilities over time. The module architecture therefore separates reusable semantic foundations from capability semantics, resource ownership, framework adaptation, executable application composition, and build-time engineering conventions.

The dependency model is intentionally asymmetric. Lower-level modules expose stable contracts upward; higher-level modules SHALL NOT force their feature semantics back into lower-level modules. Cross-cutting compiler, nullness, static-analysis, formatting, style, and architecture-test configuration belongs to build logic rather than being propagated through `foundation`.

Logical package boundaries are enforced primarily with [Spring Modulith](https://docs.spring.io/spring-modulith/reference/). [ArchUnit](https://www.archunit.org/getting-started) supplements that model for package boundaries that coexist within one physical build module or for architectural package rules that require additional static checks.

## 2.2 Module Categories

### 2.2.1 Foundation

`foundation` is the semantic dependency floor. It contains feature-neutral Taskmigo-owned primitives and contracts that are reusable across unrelated capabilities.

A third-party library being convenient, widely used, or required by build tooling is insufficient to make it a `foundation` concern. Capability-specific runtime libraries remain with the owning capability or adapter. Cross-cutting build-only libraries are supplied by the build convention layer.

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

### 2.2.5 Build Convention Layer

Repository-local Gradle build logic SHALL own reusable engineering configuration such as the Java toolchain, JSpecify availability, Error Prone and NullAway configuration, formatting, Checkstyle, and reusable architecture-test dependencies.

The build convention layer is not a Taskmigo application module and SHALL NOT be used to hide runtime or feature dependencies. Applying a build convention SHALL configure how a project is built; it SHALL NOT imply a semantic dependency on another Taskmigo project module.

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

The diagram is illustrative. Build-logic dependencies are intentionally absent because they configure the build and do not represent Taskmigo semantic dependency edges. The normative allowed and prohibited dependencies are defined in [Section 7](07-constraints.md) and [Section 8](08-requirements-allocation-and-dependencies.md).

## 2.4 Architectural Boundary Test

A Taskmigo-owned type is a candidate for `foundation` only when its meaning remains valid after removing any one feature capability such as Authorization, Query Filtering, Language, or Identity from the product.

A third-party dependency SHALL NOT be promoted into `foundation` merely to make it available transitively. If it is a cross-cutting build/tooling dependency, it belongs in build conventions. If it is required at compile or runtime by owned behavior, the owning module SHALL declare it directly with the narrowest correct dependency scope.

Feature-specific terminology, behavior, lifecycle, validation, compilation, policy semantics, query semantics, framework adaptation, persistence mappings, and build-tool distribution fail this boundary test and SHALL be owned outside `foundation`.

## 2.5 Boundary Enforcement Model

A physical build module and a Spring Modulith application module do not need to map one-to-one. Taskmigo SHALL use Spring Modulith for every logical application-module boundary that can be represented by its module model, allowed-dependency declarations, named interfaces, and verification rules.

When multiple architectural package boundaries reside inside one physical module, automated ArchUnit rules SHALL enforce the package access restrictions that remain inside that physical boundary. ArchUnit supplements rather than replaces Spring Modulith for boundaries Spring Modulith can represent.

Build convention plugins SHALL centralize repeated build configuration so module build files primarily communicate intentional project and runtime dependencies rather than repository-wide tooling boilerplate.
