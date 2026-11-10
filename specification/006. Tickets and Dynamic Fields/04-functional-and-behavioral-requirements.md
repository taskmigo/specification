# 4. Functional and Behavioral Requirements

This chapter specifies the **observable Ticket, Ticket Type and Template behavior**. HTTP method/path and exact field contracts are in [section 3](03-external-interface-requirements.md), typed persistence data is in [section 5](05-data-and-information-requirements.md), and objective acceptance cases are in [section 9](09-verification-validation-and-acceptance.md).

## 4.1 Ticket Type Lifecycle

### TKT-FR-001 — Stable Type identity

**Creation:** A Ticket Type SHALL be created with a unique immutable `key`, initial status `ACTIVE` and one dedicated EAV schema definition.

**Permitted subsequent changes:** The Type's `name` and `status` (`ACTIVE` or `RETIRED`) MAY change through the defined update operation. Its UUID, key and schema-definition identity SHALL remain stable.

### TKT-FR-002 — Creation eligibility

**Preconditions:** Creating a Ticket SHALL require both an `ACTIVE` Type and that Type's current `PUBLISHED` template.

**Failure boundary:** A `RETIRED` Type, missing current published template or unsuitable template version SHALL prevent Ticket creation. An implementation SHALL NOT fall back to a draft or retired template.

### TKT-FR-003 — Draft creation

**Required behavior:** Creating a new Type template draft SHALL allocate the next positive version number. Where a current template exists, the draft SHALL copy its field definitions. Where none exists, the draft SHALL begin with no fields.

**Important distinction:** Copying a template into a new DRAFT does not mutate previously published versions or historical Ticket instances.

### TKT-FR-004 — Draft editing

**Required behavior:** Only a `DRAFT` template version SHALL accept complete field-set replacement. Each replacement entry SHALL be valid, and custom field keys SHALL not collide with reserved Ticket common-field names.

**Identity invariant:** A field identifier already published SHALL not be redefined with a different key or data type. An attempted invalid replacement SHALL fail without rewriting the published history.

### TKT-FR-005 — Publish and retire

**Publish:** A `DRAFT` MAY transition to `PUBLISHED`; publishing SHALL set that version as the current template. Other starting states SHALL be rejected.

**Retire:** A `PUBLISHED` version MAY transition to `RETIRED`; retiring a current version SHALL clear the Type's current-version pointer. Other starting states SHALL be rejected.

### TKT-FR-006 — Historical template integrity

**Required behavior:** The system SHALL retain published/retired template definitions for Tickets pinned to them. Replacing a draft, publishing a newer version or retiring a version SHALL NOT silently revalidate, migrate or rewrite existing Ticket field values.

## 4.2 Ticket Creation/Update

### TKT-FR-007 — Common fields and provenance

**Required behavior:** Ticket creation SHALL persist server-assigned UUID, Type ID, custom-field schema instance ID, title/status, creator UUID, timestamps and an initial optimistic-lock version.

**Immutability:** A PATCH SHALL not modify the creator, Type identity or historical schema association. `title` and `status` SHALL remain nonblank at creation.

### TKT-FR-008 — Version pinning

**Required behavior:** Each new Ticket SHALL store custom fields in an instance pinned to the Type's current `PUBLISHED` template version. Later Ticket read/update operations SHALL resolve the exact version of that stored instance rather than the Type's latest schema.

### TKT-FR-009 — Custom-field validation

**Required behavior:** Input custom fields SHALL conform to the pinned template's field keys, types, `required` flags and supported constraint definitions. Unknown field keys, incompatible data types and absent required values SHALL fail.

**Null semantics:** A PATCH value of `null` for an optional custom field SHALL remove that value. Clearing a required field SHALL be rejected; an omitted key SHALL retain its current value.

### TKT-FR-010 — Patch behavior

**Required behavior:** A Ticket PATCH SHALL change only supplied `title`, `status` and supplied `customFields` keys. Unspecified custom fields SHALL remain unchanged. A no-op PATCH with no changed common/custom values SHALL return the current Ticket projection without applying a mutation.

**Failure boundary:** A partial patch is not a complete replacement of the entire Ticket or its custom-field map.

### TKT-FR-011 — Type-safe field identity

**Required behavior:** During draft replacement, a missing `fieldId` MAY resolve to a prior identity only when key and type agree; otherwise a new UUID SHALL be created. An already published field ID SHALL never change its key/type mapping.

## 4.3 Query and Authorization

### TKT-FR-012 — Database-side authorization

**List:** The Ticket repository SHALL combine optional `ticketTypeId` scope, approved `filterBy` predicate, Object Authorization predicate and ordered sorting in the database **before pagination**. The authorized total count SHALL reflect only the resulting visible set.

**Read/update:** The resource owner SHALL find a target through its operation-specific authorized predicate; an unauthorized target SHALL not be returned or mutated.

### TKT-FR-013 — Runtime query field snapshots

**Global Ticket list:** Expose dynamic fields only when all eligible versions of a visible field key agree on schema definition, field identity and type.

**Type-scoped list:** Resolve approved fields against the Type's relevant published/retired template history.

**Single Ticket read/update:** Resolve Object Authorization field paths against the exact stored pinned template version.

**Safety rule:** Incompatible runtime contexts SHALL not be silently merged into a broader query schema.

### TKT-FR-014 — Queryable custom types

| Custom field type            | Allowed query operators  | Sortable |
| ---------------------------- | ------------------------ | -------- |
| `STRING`                     | EQ, NE, CONTAINS         | Yes      |
| `NUMBER`, `DATE`, `DATETIME` | EQ, NE, GT, GTE, LT, LTE | Yes      |
| `BOOLEAN`, `UUID`, `ENUM`    | EQ, NE                   | No       |

These capabilities SHALL be applied only when a corresponding runtime field is actually present in the resolved Query Schema. A custom-field response property alone does not make the field queryable.

### TKT-FR-015 — No unapproved fields

**Required behavior:** Only common fields registered in the operation Query Schema and unambiguous runtime custom fields SHALL be usable for filtering, sorting or Object Authorization. Unknown, ambiguous or incompatible fields SHALL cause validation/binding failure rather than unrestricted database execution.

**Related contracts:** [Query Filtering](../004.%20Query%20Filtering/README.md) defines syntax and errors; [Authorization](../002.%20Authorization/README.md) defines Request/Object policy decisions.
