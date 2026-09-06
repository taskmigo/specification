# 11. Appendices

## 11.1 Canonical Examples

The examples in this section are supporting material and do not add requirements beyond the normative sections. Each example assumes the shown root names are declared by the consumer-provided Environment Schema.

### Direct Predicate

```text
const enabled = record.enabled == true;
const aboveThreshold = record.score >= context.minimumScore;

return enabled && aboveThreshold;
```

### Conditional Predicate

```text
if (context.override) {
  return true;
}

return record.enabled == true;
```

### Nested Conditional Predicate

```text
if (context.override) {
  return true;
} else if (operation.mode == "READ") {
  return record.score >= context.minimumScore;
} else {
  return false;
}
```

## 11.2 Partial Evaluation Example

Given a consumer operation where:

```text
context.override = false
context.minimumScore = 10
record = unknown
```

The policy:

```text
return context.override || record.score >= context.minimumScore;
```

SHALL specialize to a residual predicate equivalent to:

```text
record.score >= 10
```

The exact internal Policy IR shape is implementation-private as long as the control-flow, residual semantics, and query-lowering contract are preserved.

## 11.3 Callable and Utility Functions (non-normative)

Callable syntax is intentionally absent from the initial language contract.

The following examples SHALL NOT compile in this version:

```text
function check() { return true; }
export default () => true;
startsWith(record.name, "prefix-")
lower(record.email)
contains(context.tags, "admin")
```

A future language revision may define callable or utility functions only after specifying their syntax, static types, runtime behavior, partial-evaluation behavior, query-lowering semantics, and reuse boundary.

## 11.4 Source-Language Migration Note (non-normative)

A migration tool from a previous restricted ECMAScript policy source may compile legacy source into its semantic IR and print equivalent canonical Policy Language source. Source-to-source text rewriting is not required by this SRS.
