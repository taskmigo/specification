# 7. Constraints

## 7.1 Spring Integration

### TECH-001 — Spring MVC and type resolution

Web integration SHALL use Spring MVC extension points such as `HandlerMethodArgumentResolver` and Spring `ResolvableType` for generic Query Contract resolution rather than string target registries in controller signatures.

Verification: Inspect controller contracts and argument resolution.
Traceability: SPRING-001.

### TECH-002 — Spring conversion and persistence composition

JPA-backed persistence adapters SHOULD use Spring `ConversionService` for host-value conversion and Spring Data `PredicateSpecification<E>` for pure predicate composition where those abstractions are sufficient.

Equivalent custom repository adapters MAY be used for query surfaces not naturally represented by one JPA root.

Verification: Inspect JPA-backed and custom query adapters.
Traceability: PERSIST-001.

## 7.2 Isolation

### TECH-003 — No direct persistence access from source

Embedded Language source SHALL NOT receive JPA entities, Spring container objects, Criteria objects, repositories, or persistence mapping functions.

Verification: Inspect the Environment Schema and attempt forbidden references.
Traceability: SEC-001; [Embedded Language isolation](../003.%20Embedded%20Language/07-constraints.md#74-isolation-and-host-access).

## 7.3 Failure Behavior

### TECH-004 — Filter failure boundary

Syntax, profile, binding, type, complexity, Query Schema, and persistence-mapping failures originating from `filterBy` SHALL remain client query-input failures.

Such failures SHALL NOT fall back to unrestricted row retrieval.

Verification: Trigger each failure class and confirm HTTP `400` where the failure is caused by client input and no unrestricted fallback query is executed.
Traceability: FILTER-003; QRY-005.
