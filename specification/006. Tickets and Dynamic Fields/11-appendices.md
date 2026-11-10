# 11. Appendices

## 11.1 Schema Version Lifecycle

```mermaid
stateDiagram-v2
    [*] --> DRAFT: Create draft
    DRAFT --> PUBLISHED: Publish
    PUBLISHED --> RETIRED: Retire
```

A new draft MAY be created from the current schema version. Historical Tickets remain pinned to their own version.

## 11.2 Ticket Storage

```mermaid
flowchart TB
    type[Ticket Type] --> definition[EAV schema definition]
    definition --> version[EAV schema version]
    version --> instance[EAV schema instance]
    ticket[Ticket] --> instance
    ticket --> type
```

## 11.3 Type and Field Example

```json
{
  "key": "bug",
  "name": "Bug"
}
```

```json
{
  "fields": [
    {
      "key": "severity",
      "label": "Severity",
      "dataType": "ENUM",
      "required": true,
      "constraints": { "options": ["LOW", "MEDIUM", "HIGH"] }
    }
  ]
}
```

Examples describe request shapes and do not imply pre-created Types.
