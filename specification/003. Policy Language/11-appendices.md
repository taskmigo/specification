# 11. Appendices

## 11.1 Canonical Examples

The examples in this section are supporting material and do not add requirements beyond the normative sections.

### Named Default Function

```text
function canRead() {
  const readable = request.method == "GET";
  const enabled = principal.enabled == true;
  return readable && enabled;
}

export default function policy() {
  return canRead();
}
```

### Unnamed Default Function

```text
export default function() {
  if (principal.admin) {
    return true;
  }

  return principal.enabled;
}
```

### Block Arrow Default

```text
export default () => {
  const readable = request.method == "GET";
  return principal.enabled && readable;
};
```

### Concise Arrow Default

```text
export default () => principal.enabled && request.method == "GET";
```

### Object Predicate with Helper Functions

```text
function isOwner() {
  return object.ownerId == principal.id;
}

function hasDepartmentAccess() {
  return object.departmentId in principal.departmentIds
    && object.classification != "SECRET";
}

export default function() {
  return principal.admin || isOwner() || hasDepartmentAccess();
}
```

### Named Export

```text
export function isOwner() {
  return object.ownerId == principal.id;
}

export default () => isOwner();
```

The named export does not create a cross-policy import facility in this version.

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
function isOwner() {
  return object.ownerId == principal.id;
}

export default () =>
  principal.admin || (isOwner() && request.method == "GET");
```

SHALL specialize to a residual predicate equivalent to:

```text
object.ownerId == "u-123"
```

The exact internal Policy IR shape is implementation-private as long as the function-body semantics, residual semantics, and query-lowering contract are preserved.

## 11.3 Utility Functions (non-normative)

Utility functions are intentionally absent from the initial language contract.

The following undeclared calls are examples of syntax that SHALL NOT compile in this version:

```text
startsWith(object.name)
lower(object.email)
contains(principal.roles)
```

A future language revision may define utility functions only after specifying their static types, runtime behavior, partial-evaluation behavior, and query-lowering semantics.

## 11.4 Source-Language Migration Note (non-normative)

A migration tool from the previous restricted ECMAScript policy source may compile legacy source into its existing semantic IR and print equivalent canonical TPL source. Source-to-source text rewriting is not required by this SRS.
