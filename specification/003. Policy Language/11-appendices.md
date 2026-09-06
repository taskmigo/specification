# 11. Appendices

## 11.1 Canonical Examples

The examples in this section are supporting material and do not add requirements beyond the normative sections.

### Request Predicate

```text
let readable = request.method == "GET";
let enabled = principal.enabled == true;

readable and enabled
```

### Object Predicate

```text
let owner = object.ownerId == principal.id;
let departmentAccess =
    object.departmentId in principal.departmentIds
    and object.classification != "SECRET";

principal.admin or owner or departmentAccess
```

### Conditional Predicate

```text
if principal.admin then
    true
else
    object.ownerId == principal.id
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
principal.admin
or (
    object.ownerId == principal.id
    and request.method == "GET"
)
```

SHALL specialize to a residual predicate equivalent to:

```text
object.ownerId == "u-123"
```

The exact internal Policy IR shape is implementation-private as long as the residual semantics and query-lowering contract are preserved.

## 11.3 Intrinsic Extension Guidance (non-normative)

Future intrinsics can provide runtime semantics and optional query lowering without changing the core evaluation model.

Examples include:

```text
startsWith(object.name, "task-")
lower(object.email) == lower(principal.email)
isNull(object.deletedAt)
```

A runtime-only intrinsic is suitable for direct Request evaluation but cannot remain in an Object Authorization residual predicate unless the selected consumer provides a semantics-preserving query-lowering implementation.

## 11.4 Source-Language Migration Note (non-normative)

A migration tool from the previous restricted ECMAScript policy source may compile legacy source into its existing semantic IR and print equivalent canonical TPL source. Source-to-source text rewriting is not required by this SRS.
