# 2. Overall Description

## 2.1 Architectural Context

Taskmigo is expected to gain additional capabilities over time. The module architecture therefore separates reusable technical foundations from capability semantics, resource ownership, framework adaptation, and executable application composition.

The dependency model is intentionally asymmetric. Lower-level modules expose stable contracts upward; higher-level modules SHALL NOT force their feature semantics or framework dependencies back into lower-level modules.

## 2.2 Module Categories

### 2.2.1 Foundation

`foundation` is the dependency floor. It contains framework-neutral primitives and contracts that are reusable across unrelated capabilities and remain meaningful without any specific Taskmigo feature.

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

The intended dependency direction is:

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

The diagram is illustrative. The normative allowed and prohibited dependencies are defined in [Section 7](07-constraints.md) and [Section 8](08-requirements-allocation-and-dependencies.md).

## 2.4 Architectural Boundary Test

A type is a candidate for `foundation` only when its meaning remains valid after removing any one feature capability such as Authorization, Query Filtering, Language, or Identity from the product.

Feature-specific terminology, behavior, lifecycle, validation, compilation, policy semantics, query semantics, framework adaptation, and persistence mappings fail this boundary test and SHALL be owned outside `foundation`.

## 2.5 Out of Scope

This specification does not require every Java package to map one-to-one to a Gradle module. It does not require a particular dependency-injection framework or persistence framework. It governs module ownership and dependency direction regardless of the implementation technology selected by an owning module.
