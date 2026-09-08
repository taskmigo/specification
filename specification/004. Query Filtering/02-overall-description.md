# 2. Overall Description

## 2.1 Product Perspective

Query Filtering is the logical boundary between user-authored API-field predicates and resource-owned persistence translation.

```text
API-visible Query Schema
        ↓
filterBy EXPRESSION source ──┐
                             ├─> QueryPredicate<Q>
Object Authorization ────────┘
        ↓
logical predicate composition
        ↓
resource-owned persistence mapping
        ↓
Spring Data/custom repository query
        ↓
pagination
```

## 2.2 Product Functions

The capability provides:

- Query-contract types that identify logical query surfaces.
- Structured API-visible Query Paths and typed Query Fields.
- Query Schema discovery through Spring.
- `filterBy` compilation to a typed opaque Query Predicate.
- Typed predicate composition.
- Resource-owned persistence binding.
- Spring MVC argument resolution for authorized filtered collection queries.

### 2.2.1 Logical Query Surface

A Query Schema SHALL describe what users may query. It SHALL NOT describe the physical storage topology.

For an API response such as:

```json
{
  "user": {
    "name": "Phong Chu",
    "age": 18
  }
}
```

the logical paths MAY include:

```text
user.name
user.age
```

regardless of the number of entities, joins, columns, or computed expressions used to produce the response.

### 2.2.2 Predicate Producers

`filterBy` and Object Authorization are independent predicate producers. Both SHALL produce `QueryPredicate<Q>` values over the same Query Contract before persistence translation.

### 2.2.3 Persistence Boundary

A resource-owning module SHALL translate logical predicates using trusted mappings. Controllers and user source SHALL NOT select persistence fields directly.

## 2.3 Stakeholders and Users

The capability is consumed by API clients, `web`, Authorization, resource-owning modules, and persistence adapters.

## 2.4 Operational Scenarios

The following scenarios are supporting context:

1. A client filters a collection by API-visible scalar fields.
2. A nested API path maps to one or more persistence joins.
3. Object Authorization produces a logical predicate and `filterBy` adds a client predicate.
4. A collection quantifier maps to relational, array, or JSON collection persistence semantics.

## 2.5 Out of Scope

Sorting, aggregation, grouping, arbitrary projection selection, raw SQL fragments, and unrestricted database expressions are outside this SRS.
