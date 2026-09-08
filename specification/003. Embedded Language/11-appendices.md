# 11. Appendices

The examples in this section are supporting material and do not add requirements.

## 11.1 Source Examples

### Program

```text
const enabled = record.enabled == true;

if (context.override) {
  return true;
}

return enabled && record.score >= context.minimumScore;
```

### Expression

```text
record.enabled == true && record.score >= context.minimumScore
```

### Collection Quantifier

```text
all(record.emails, email => len(email) > 10)
```

### Structured Collection Element

```text
any(record.orders, order => order.product.name == "Book")
```

## 11.2 Partial Evaluation Example

Given known `context.minimumScore = 10`, known `context.override = false`, and symbolic `record`, this expression:

```text
context.override || record.score >= context.minimumScore
```

specializes to a residual expression equivalent to:

```text
record.score >= 10
```

A quantified expression may similarly specialize captured known values while preserving its symbolic collection source.

## 11.3 Excluded Callable Forms

These forms are not part of the language:

```text
function check() { return true; }
const check = value => value > 0;
check(record.score)
record.check()
```

The restricted lambda accepted inside `all`, `any`, or `none` does not make these forms valid.
