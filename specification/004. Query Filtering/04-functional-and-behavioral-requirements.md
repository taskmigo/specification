# 4. Functional and Behavioral Requirements

## 4.1 Logical Query Compilation

### QRY-001 — API-visible path compilation

`filterBy` SHALL bind `object.<path>` only to paths declared by the selected `QuerySchema<Q>`. Database columns, table names, JPA properties, and unregistered response paths SHALL have no implicit query meaning.

Verification: Map `object.name` to a differently named persistence attribute and reject persistence-oriented identifiers.
Traceability: SCHEMA-002 through SCHEMA-004; FILTER-002.

### QRY-002 — Nested and composed paths

Query Paths MAY contain multiple segments and SHALL preserve the API-visible nesting independent of persistence topology.

A logical path MAY map to one column, multiple columns, a computed expression, one or more joins, an array/JSON expression, or a custom repository implementation.

Verification: Query nested fields backed by a join and computed field and confirm the client expression is unchanged by persistence topology.
Traceability: SCHEMA-002; PERSIST-001.

### QRY-003 — Logical predicate composition

Object Authorization, client `filterBy`, and business predicates SHALL be composed before pagination. Query Predicate composition SHALL remain logical until the resource-owned persistence boundary.

Constant true/false predicates SHALL simplify according to boolean identities before persistence translation where doing so preserves semantics.

Verification: Compose authorization and client predicates and inspect database-before-pagination execution.
Traceability: PRED-001; PRED-002; QRY-005.

### QRY-004 — Collection predicates

Collection-valued Query Fields SHALL preserve element type metadata. Membership and collection quantifiers SHALL be accepted only when the Query Field/operator contract and selected persistence backend support their translation.

For a logical expression such as:

```text
all(object.user.emails, email => len(email) > 10)
```

persistence translation SHALL preserve Embedded Language quantifier semantics regardless of whether the physical collection uses a relationship table, SQL array, JSON, or another supported representation.

Verification: Translate membership and quantifiers over at least one supported physical collection representation and reject unsupported schema/backend combinations before unrestricted row loading.
Traceability: SCHEMA-003; [Embedded Language collection semantics](../003.%20Embedded%20Language/04-functional-and-behavioral-requirements.md#type-005--collection-quantifiers-and-length); PERSIST-002.

### QRY-005 — Persistence execution before pagination

Logical filtering SHALL execute in the persistence query before pagination. The query layer SHALL NOT load unrestricted rows and apply authorization or `filterBy` in JVM memory.

Verification: Inspect generated queries and pagination counts under authorization and client filtering.
Traceability: PERSIST-001; PERF-001.

## 4.2 Persistence Mapping

### PERSIST-002 — Trusted logical-to-persistence mapping

Only resource-owned trusted mappings SHALL convert Query Paths to persistence expressions. User-controlled path text SHALL NOT be passed directly to `Root.get`, joins, SQL identifiers, or equivalent persistence APIs.

Verification: Instrument path binding and confirm all persistence access originates from registered trusted mappings.
Traceability: SEC-001; PERSIST-001.

### PERSIST-003 — Quantifier equivalence

Persistence adapters SHALL preserve these logical meanings:

```text
all(collection, item => predicate)
  -> no item exists for which predicate is not true

any(collection, item => predicate)
  -> an item exists for which predicate is true

none(collection, item => predicate)
  -> no item exists for which predicate is true
```

Adapters SHALL preserve Embedded Language empty-list and null semantics and account for SQL three-valued logic where applicable.

Verification: Compare direct Embedded Language evaluation with persistence results for empty, matching, violating, and nullable element cases supported by the schema.
Traceability: QRY-004; [Embedded Language quantifier semantics](../003.%20Embedded%20Language/04-functional-and-behavioral-requirements.md#type-005--collection-quantifiers-and-length).
