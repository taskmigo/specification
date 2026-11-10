# 6. Quality and Performance Requirements

Privacy, non-disclosure and transactional integrity are the principal quality attributes. Contract stability must be verified across versions.

## 6.1 Privacy and Access

### AUD-QUAL-001 — Minimize PII exposure

**Normative requirement.** Audit records SHALL retain field names and sensitive flags but SHALL NOT store sensitive changes' prior or new values. User tombstoning SHALL anonymize identifying historical log values.

### AUD-QUAL-002 — Restricted audit access

**Normative requirement.** Audit list SHALL fail closed when the current operation does not grant unrestricted User Object visibility.

## 6.2 Consistency

### AUD-QUAL-003 — Transaction consistency

**Normative requirement.** Audit mutation events SHALL share atomicity with the owning business transaction. PII scrub shall not be deferred as an untracked asynchronous side effect.

## 6.3 Stable API Clients

### API-QUAL-001 — Stable error contract

**Normative requirement.** Client query errors SHALL have dedicated machine-readable error codes and SHALL NOT be reported as successful empty collections or unbounded scans.

### API-QUAL-002 — Stable pagination

**Normative requirement.** List responses SHALL report consistent page metadata and total counts based on the same server-side filtered/authorized dataset.

No unsupported Audit retention SLA, throughput, or global entity audit guarantee is asserted.
