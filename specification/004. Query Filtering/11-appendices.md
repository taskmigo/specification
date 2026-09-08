# 11. Appendices

The examples in this section are supporting material and do not add requirements.

## 11.1 Scalar Mapping

API response:

```json
{
  "name": "Phong Chu"
}
```

Client filter:

```text
object.name == "Phong Chu"
```

A resource mapping may translate `name` to `CustomerEntity_.customerName`, producing SQL equivalent to:

```sql
WHERE customer_name = ?
```

## 11.2 Nested and Composed Projection

API response:

```json
{
  "user": {
    "name": "Phong Chu",
    "age": 18
  },
  "account": {
    "status": "ACTIVE"
  }
}
```

Client filter:

```text
object.user.age >= 18 && object.account.status == "ACTIVE"
```

The resource adapter may translate the paths through different joins without changing the client expression.

## 11.3 Collection Quantifier

```text
all(object.user.emails, email => len(email) > 10)
```

A relationship-backed mapping may lower this to a `NOT EXISTS` query over violating elements. An array/JSON-backed mapping may use supported collection traversal while preserving the same logical result.
