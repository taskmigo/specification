# 4. Functional and Behavioral Requirements

## 4.1 Logical Query Compilation

### QRY-001 — API-visible path compilation

`filterBy` SHALL bind `object.<path>` only to paths declared by the selected `QuerySchema<Q>`. Database columns, table names, JPA properties, and unregistered response paths SHALL have no implicit query meaning.

Verification: Map `object.name` to a differently named persistence attribute and reject persistence-oriented identifiers.
Traceability: SCHEMA-002 through SCHEMA-004; FILTER-002.

### QRY-002 — Nested and composed paths

Query Paths MAY contain multiple segments and SHALL preserve API-visible nesting independently of persistence topology.

A logical path MAY map to one column, multiple columns, a computed expression, one or more joins, an array/JSON expression, or a custom repository implementation.

Verification: Query nested and computed fields and confirm client source remains unchanged across persistence mappings.
Traceability: SCHEMA-002; PERSIST-001.

### QRY-003 — Logical predicate composition

`QueryPredicate<Q>` values MAY be composed only when their Query Contract and schema identities are compatible.

Constant true/false predicates SHALL simplify according to Boolean identities when simplification preserves semantics.

Verification: Compose compatible predicates, reject incompatible identities, and inspect constant simplification.
Traceability: PRED-001; PRED-002.

### QRY-004 — Collection predicates

Collection-valued Query Fields SHALL preserve element type metadata. Membership and bounded collection quantifiers SHALL be accepted only when the Query Field/operator contract and selected persistence adapter support their translation.

For:

```text
all(object.user.emails, email => len(email) > 10)
```

persistence translation SHALL preserve Language quantifier semantics regardless of the supported physical collection representation.

Verification: Translate membership and quantifiers over a supported collection mapping and reject unsupported schema/adapter combinations before unrestricted row loading.
Traceability: SCHEMA-003; [Language collection semantics](../003.%20Language/04-functional-and-behavioral-requirements.md#type-005--collection-quantifiers-and-length); PERSIST-003.

### QRY-005 — Persistence execution before pagination

A `filterBy` predicate SHALL execute in the persistence query before pagination. Query Filtering SHALL NOT load unrestricted rows and apply the client filter in JVM memory.

Verification: Inspect persistence queries and page totals under client filtering.
Traceability: PERSIST-001; PERF-001.

## 4.2 Persistence Mapping

### PERSIST-002 — Trusted logical-to-persistence mapping

Only resource-owned trusted mappings SHALL convert Query Paths to persistence expressions. User-controlled path text SHALL NOT be passed directly to `Root.get`, join selectors, SQL identifiers, or equivalent persistence APIs.

Verification: Instrument path binding and confirm persistence access originates only from registered mappings.
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

Adapters SHALL preserve Language empty-list and null semantics and account for persistence three-valued logic where applicable.

Verification: Compare direct Language results with persistence results for empty, matching, violating, and nullable cases supported by the Query Schema.
Traceability: QRY-004; [Language quantifier semantics](../003.%20Language/04-functional-and-behavioral-requirements.md#type-005--collection-quantifiers-and-length).
