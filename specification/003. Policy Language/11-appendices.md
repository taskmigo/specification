# 11. Appendices

## 11.1 Canonical Examples

The examples in this section are supporting material and do not add requirements beyond the normative sections.

### Request Predicate

```text
const readable = request.method == "GET";
const enabled = principal.enabled == true;

return readable && enabled;
```

### Object Predicate

```text
const owner = object.ownerId == principal.id;
const departmentAccess =
  object.departmentId in principal.departmentIds
  && object.classification != "SECRET";

return principal.admin || owner || departmentAccess;
```

### Conditional Predicate

```text
if (principal.admin) {
  return true;
}

return object.ownerId == principal.id;
```

### Nested Conditional Predicate

```text
if (principal.admin) {
  return true;
} else if (request.method == "GET") {
  return object.ownerId == principal.id;
} else {
  return false;
}
```

## 11.2 Partial Evaluation Example

Given:

```text
principal.admin = false
principal.id = "u-123"
request.method = "GET"
object = unknown
```

The policy:

```text
return principal.admin
  || (object.ownerId == principal.id && request.method == "GET");
```

SHALL specialize to a residual predicate equivalent to:

```text
object.ownerId == "u-123"
```

The exact internal Policy IR shape is implementation-private as long as the control-flow, residual semantics, and query-lowering contract are preserved.

## 11.3 Callable and Utility Functions (non-normative)

Callable syntax is intentionally absent from the initial language contract.

The following examples SHALL NOT compile in this version:

```text
function isOwner() { return true; }
export default () => true;
startsWith(object.name, "task-")
lower(object.email)
contains(principal.roles, "admin")
```

A future language revision may define callable or utility functions only after specifying their syntax, static types, runtime behavior, partial-evaluation behavior, query-lowering semantics, and reuse boundary.

## 11.4 Source-Language Migration Note (non-normative)

A migration tool from the previous restricted ECMAScript policy source may compile legacy source into its existing semantic IR and print equivalent canonical TPL policy-body source. Source-to-source text rewriting is not required by this SRS.
