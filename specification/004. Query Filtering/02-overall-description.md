# 2. Overall Description

## 2.1 Supported Surface

A client may provide a `filterBy` expression and repeated `sortBy` query parameters on list routes that declare those capabilities. The filter expression uses the restricted Taskmigo Language `EXPRESSION` profile, referencing `object.<logicalField>` with logical `&&`/`||`, comparisons, and `contains(object.field, "text")`.

## 2.2 Query Safety

Unlike a general embedded language, FilterBy accepts only approved field-to-literal comparisons, boolean combination, and string contains. It rejects arithmetic, `IN`, collection quantifiers, bare field references, field-to-field comparison, reversed literal operands, and unsupported operators.

## 2.3 Sorting

Clients order by repeating `sortBy`; ascending has no prefix, descending uses `-`. A leading `+`, duplicate field, unknown field, or nonsortable field is invalid. The JPA sort binder adds NULLS LAST for nullable fields, and resource list implementations use stable UUID ordering when no explicit sort is requested.

## 2.4 Runtime Schemas

Query Schemas are operation-specific, may include server-resolved custom fields, and carry identity based on field path/type/nullability/operator/sort/source metadata. Ticket uses globally compatible, Type-history, or exact pinned Ticket version fields. The same context SHALL be used for validation, compilation, Object Authorization and database binding.

## 2.5 Out of Scope

This API surface does not implement OData, arbitrary SQL fragments, `sortOrder` as a second parameter, `+field` as a sort prefix, free-form CASE expressions, user-supplied schema metadata, or a general-purpose collection `IN` expression.
