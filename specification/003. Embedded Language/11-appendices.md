# 11. Appendices

## 11.1 Canonical Examples

The examples in this section are supporting material and do not add requirements beyond the normative sections. Each example assumes the shown root names are declared by the Environment Schema.

### Direct Program

```text
const enabled = record.enabled == true;
const aboveThreshold = record.score >= context.minimumScore;

return enabled && aboveThreshold;
```

### Conditional Program

```text
if (context.override) {
  return true;
}

return record.enabled == true;
```

### Non-Boolean Result Program

```text
if (context.override) {
  return "override";
}

return operation.mode;
```

## 11.2 Partial Evaluation Example

Given:

```text
context.override = false
context.minimumScore = 10
record = unknown
```

The program:

```text
return context.override || record.score >= context.minimumScore;
```

SHALL specialize to a residual Semantic AST expression equivalent to:

```text
record.score >= 10
```

The exact Semantic AST node shape is implementation-private as long as the specified language semantics are preserved.

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

A future language revision may define callable or utility functions only after specifying their syntax, static types, runtime behavior, and partial-evaluation behavior.

## 11.4 Source-Language Migration Note (non-normative)

A migration tool from a previous restricted ECMAScript source may compile legacy source into the Semantic AST and print equivalent canonical Embedded Language source. Source-to-source text rewriting is not required by this SRS.
