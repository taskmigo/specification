# 2. Overall Description

## 2.1 Product Perspective

```text
HTTP filterBy
    ↓
QuerySchema<Q>
    ↓
Embedded Language EXPRESSION compilation
    ↓
QueryPredicate<Q>
    ↓
resource-owned persistence mapping
    ↓
database query
    ↓
pagination
```

## 2.2 Product Functions

The capability provides:

- Query Contract types identifying logical query surfaces.
- Structured API-visible Query Paths and typed Query Fields.
- Query Schema discovery through Spring.
- `filterBy` compilation to an opaque typed Query Predicate.
- Same-contract Query Predicate composition.
- Resource-owned persistence binding.
- Spring MVC argument resolution for filtered collection queries.

### 2.2.1 Logical Query Surface

A Query Schema SHALL describe only explicitly queryable API-visible paths and their logical types/operators.

For an API response:

```json
{
  "user": {
    "name": "Phong Chu",
    "age": 18
  }
}
```

a Query Schema MAY expose:

```text
user.name
user.age
```

without exposing the persistence paths used to produce those values.

### 2.2.2 Persistence Boundary

A resource-owning module SHALL translate Query Predicates through trusted mappings. Client source and controllers SHALL NOT select persistence fields directly.

## 2.3 Stakeholders and Users

The capability is consumed by API clients, `web`, resource-owning modules, and persistence adapters.

## 2.4 Operational Scenarios

The following scenarios are supporting context:

1. A client filters a collection by an API-visible scalar path.
2. A nested API path maps through a persistence join.
3. A computed API field maps to a persistence expression.
4. A collection quantifier maps to a supported relational, array, or JSON representation.

## 2.5 Out of Scope

Sorting, aggregation, grouping, arbitrary projection selection, raw SQL fragments, and unrestricted database expressions are outside this SRS.
