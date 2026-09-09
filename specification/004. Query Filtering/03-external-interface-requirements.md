# 3. External Interface Requirements

## 3.1 Query Contract Interfaces

### SCHEMA-001 — Query Contract identity

Each query surface SHALL be identified by a Java Query Contract type `Q` independently of the persistence entity type.

A public response type MAY serve as `Q` when it is the stable query surface. A dedicated type MAY identify a versioned or composed query surface.

Verification: Define simple and composed Query Contracts and confirm no persistence entity type is required by the web-facing contract.
Traceability: [Logical Query Surface](02-overall-description.md#221-logical-query-surface).

### SCHEMA-002 — Query Schema

The public logical schema SHALL provide behavior equivalent to:

```java
public interface QuerySchema<Q> {
    Class<Q> queryType();
    Optional<QueryField> field(QueryPath path);
    Collection<QueryField> fields();
}
```

`QuerySchema<Q>` SHALL NOT expose persistence expressions or entity metadata.

Verification: Inspect Query Schemas and confirm they contain only logical query metadata.
Traceability: SCHEMA-001; DATA-001.

### SCHEMA-003 — Query Field

A Query Field SHALL provide behavior equivalent to:

```java
public interface QueryField {
    QueryPath path();
    ResolvableType type();
    boolean nullable();
    Set<QueryOperator> operators();
}
```

`ResolvableType` SHALL preserve collection element and nested Query Contract type information required for runtime schema resolution.

Verification: Register scalar, nested, `List<String>`, and `List<StructuredQueryType>` fields and inspect retained type metadata.
Traceability: DATA-001; FILTER-002.

### SCHEMA-004 — Explicit field allow-list

Only paths explicitly present in the Query Schema SHALL be queryable. Query fields SHALL NOT be derived automatically from persistence entities or from all response properties.

Verification: Attempt to query response-visible but non-queryable paths and persistence-only fields and confirm rejection.
Traceability: SEC-001.

## 3.2 Predicate Interfaces

### PRED-001 — Typed opaque Query Predicate

The public logical predicate SHALL provide behavior equivalent to:

```java
public interface QueryPredicate<Q> {
    boolean isAlwaysTrue();
    boolean isAlwaysFalse();
}
```

The public interface SHALL NOT expose Semantic AST, JPA Criteria, SQL, or child-node traversal.

Verification: Inspect the public interface and implementation visibility.
Traceability: DATA-002.

### PRED-002 — Typed predicate composition

Predicate composition SHALL provide behavior equivalent to:

```java
public interface QueryPredicates {
    <Q> QueryPredicate<Q> alwaysTrue();
    <Q> QueryPredicate<Q> alwaysFalse();
    <Q> QueryPredicate<Q> and(QueryPredicate<Q> left, QueryPredicate<Q> right);
    <Q> QueryPredicate<Q> or(QueryPredicate<Q> left, QueryPredicate<Q> right);
    <Q> QueryPredicate<Q> not(QueryPredicate<Q> predicate);
}
```

Composition SHALL preserve `Q` and SHALL reject incompatible Query Contract/schema identities.

Verification: Compose compatible predicates and reject incompatible predicate identities.
Traceability: QRY-003; DATA-002.

## 3.3 `filterBy` Interface

### FILTER-001 — HTTP input

Collection endpoints supporting Query Filtering SHALL accept an optional HTTP query parameter named `filterBy` containing one Language `EXPRESSION` source.

Missing or blank `filterBy` SHALL be equivalent to a constant-true Query Predicate.

Verification: Exercise absent, blank, and populated `filterBy` values.
Traceability: FILTER-002; SPRING-001.

### FILTER-002 — Compiler interface

The compiler SHALL provide behavior equivalent to:

```java
public interface FilterByCompiler {
    <Q> QueryPredicate<Q> compile(QuerySchema<Q> schema, String source);
}
```

Compilation SHALL use Language `EXPRESSION` mode, a Query Filtering Compilation Profile, and an Environment Schema exposing exactly one application root named `object` whose structured paths derive from `QuerySchema<Q>`.

The compiled source result type SHALL be `Bool`. A non-`Bool` source SHALL be invalid client filter input.

Verification: Compile valid Boolean filters and reject statements, unavailable roots, disabled features, unknown paths, and non-Boolean expressions.
Traceability: [Language source modes](../003.%20Language/03-external-interface-requirements.md#syntax-001--canonical-source-modes); QRY-001.

### FILTER-003 — Client error boundary

Invalid `filterBy` input SHALL produce HTTP `400 Bad Request`. Spring MVC integration SHALL represent the error through `ProblemDetail` or an equivalent Spring error response without persistence implementation names.

Verification: Trigger syntax, type, field, operator, and complexity errors and inspect the HTTP response.
Traceability: SEC-002; SPRING-001.

## 3.4 Spring MVC Interface

### SPRING-001 — Filtered query argument

Collection web handlers SHALL be able to declare the active client filter through a generic value equivalent to:

```java
public record FilteredQuery<Q>(QueryPredicate<Q> predicate) {}
```

A Spring MVC `HandlerMethodArgumentResolver` SHALL use `ResolvableType` on the controller method parameter to resolve `Q`, obtain `QuerySchema<Q>` from Spring-managed schema beans, compile optional `filterBy`, and supply `FilteredQuery<Q>`.

A string target selector such as `target = "customer"` SHALL NOT be required in the controller contract.

Verification: Resolve multiple generic Query Contract types and confirm the matching Query Schemas are selected without string target keys.
Traceability: SCHEMA-001; FILTER-001.

## 3.5 Persistence Interface

### PERSIST-001 — Resource-owned persistence binder

For JPA-backed query surfaces, a resource module MAY expose behavior equivalent to:

```java
public interface QueryPredicateBinder<Q, E> {
    Class<Q> queryType();
    Class<E> domainType();
    PredicateSpecification<E> bind(QueryPredicate<Q> predicate);
}
```

The binder SHALL own the trusted mapping from Query Paths/operators to JPA expressions and joins.

A resource MAY use a custom repository/query adapter when one JPA root is not an appropriate representation.

Verification: Bind simple, joined, computed, and custom-query projections without exposing entity types to controllers.
Traceability: QRY-002; QRY-005.
