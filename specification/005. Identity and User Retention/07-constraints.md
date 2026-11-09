# 7. Constraints

## 7.1 Lifecycle and Security

### ID-CON-001 — System User protection

The reserved System User SHALL NOT be deleted through managed User deletion.

### ID-CON-002 — Immutable retained state

RETAINED and TOMBSTONE SHALL NOT be treated as normal editable status values, nor as a public status-transition mechanism.

### ID-CON-003 — Audit transaction atomicity

User deletion, access cleanup, and associated audit append/privacy operations SHALL occur inside the owning mutation transaction. Audit append/privacy services SHALL require that existing transaction.

## 7.2 Data Minimization

### ID-CON-004 — Tombstone record retention

Tombstoning SHALL remove enumerated identifying profile and credential fields without deleting the stable User record. It SHALL NOT delete unrelated Ticket business data merely because it references the User UUID.

### ID-CON-005 — Policy-mediated User visibility

A User's status SHALL NOT by itself grant an operator unrestricted access to RETAINED user PII. Request and Object Authorization SHALL still govern list/delete/update endpoints.

## 7.3 Persistence

### ID-CON-006 — Schema ownership

Identity owns User, Group and membership model/persistence. Authorization owns its own Role/Statement state. Configuration is database-backed and shall not be replaced by an unpersisted per-worker setting.
