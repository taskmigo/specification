# 7. Constraints

## 7.1 Spring Integration

### TECH-001 — Spring MVC and type resolution

Web integration SHALL use Spring MVC extension points such as `HandlerMethodArgumentResolver` and Spring `ResolvableType` for generic Query Contract resolution rather than custom string target registries in controller signatures.

Verification: Inspect controller contracts and argument resolution.
Traceability: SPRING-001.

### TECH-002 — Spring conversion and persistence composition

JPA-backed persistence adapters SHOULD use Spring `ConversionService` for host-value representation conversion and Spring Data `PredicateSpecification<E>` for pure predicate composition where those abstractions are sufficient.

Equivalent custom repository adapters MAY be used for composed query surfaces not naturally represented by one JPA root.

Verification: Inspect JPA-backed and custom projection adapters.
Traceability: PERSIST-001.

## 7.2 Isolation

### TECH-003 — No direct persistence access from source

Embedded Language source SHALL NOT receive JPA entities, Spring container objects, Criteria objects, repositories, or persistence mapping functions.

Verification: Inspect the Environment Schema and attempt forbidden references.
Traceability: SEC-001; [Embedded Language isolation](../003.%20Embedded%20Language/07-constraints.md#74-isolation-and-host-access).

## 7.3 Failure Behavior

### TECH-004 — Filter failure boundary

Client filter compilation/queryability failures SHALL remain client-input failures and SHALL NOT be converted into authorization allow/deny decisions. Object Authorization runtime failures SHALL retain the fail-closed behavior specified by Authorization.

Verification: Trigger both failure classes through the combined MVC path and inspect distinct outcomes.
Traceability: FILTER-003; [Authorization fail-closed behavior](../002.%20Authorization/07-constraints.md#74-fail-closed-behavior).
