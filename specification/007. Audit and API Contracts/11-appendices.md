# 11. Appendices

## 11.1 Example API Envelope

```json
{
  "success": true,
  "statusCode": 200,
  "message": {"code": "resource.user.listed", "text": "Users listed"},
  "error": null,
  "meta": {
    "execution": {"startedAt": "2026-11-09T00:00:00Z", "duration": 12},
    "pagination": {
      "type": "offset",
      "offset": {"currentPage": 1, "pageSize": 20, "totalItems": 0, "totalPages": 0}
    }
  },
  "data": []
}
```

This is a format illustration, not a sampled runtime response or a timing guarantee.

## 11.2 Audit Privacy Representation

```json
{
  "field": "passwordHash",
  "before": null,
  "after": null,
  "sensitive": true
}
```

## 11.3 Audit and Authorization

Entity Audit records business field mutations. Request/Object Authorization computes access decisions, but current code does not persist a dedicated Authorization decision-event ledger.
