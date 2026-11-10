# 7. Constraints

Template immutability, common-field reservations, resource-owned authorization and lack of a workflow engine are hard constraints.

## 7.1 Scope and Ownership

### TKT-CON-001 — Internal EAV contract

**Normative requirement.** `:modules:internal:eav` SHALL remain an internal reusable implementation capability. Public Ticket APIs SHALL expose Ticket Type and Template models rather than generic EAV persistence entities.

### TKT-CON-002 — Type invariants

**Normative requirement.** Type key and owning EAV definition SHALL be immutable after Type creation. A RETIRED Type SHALL NOT accept new Tickets.

### TKT-CON-003 — Template invariants

**Normative requirement.** Only DRAFT may be edited or published, and only PUBLISHED may be retired. A published field ID SHALL NOT be reassigned to a different key/type.

### TKT-CON-004 — Common field reservation

**Normative requirement.** A custom template SHALL NOT redefine Ticket common field keys: `id`, `ticketTypeId`, `schemaInstanceId`, `title`, `status`, `createdBy`, `createdAt`, `updatedAt`, or `version`.

## 7.2 Security and Query

### TKT-CON-005 — Resource-scoped authorization

**Normative requirement.** The Ticket module SHALL execute authorized persistence queries using provider-owned Authorization predicates, not by loading all rows and filtering them in memory.

### TKT-CON-006 — No implied workflow

**Normative requirement.** A Ticket's arbitrary nonblank `status` SHALL NOT be described as enforcing a workflow, configured transition graph, or permission-based status-transition rule. Those features require independent specification and code.

## 7.3 Historical Data

### TKT-CON-007 — No automatic migration

**Normative requirement.** Template changes SHALL NOT automatically revalidate/migrate existing Ticket instances against a newly published schema.
