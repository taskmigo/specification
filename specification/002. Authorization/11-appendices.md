# 11. Appendices

The examples in this section are supporting material and do not add requirements.

## 11.1 Request Integration

A Spring Security adapter may transform the authenticated request into typed Authorization inputs and invoke:

```java
RequestAuthorizationResult result = authorization.authorize(
    principal,
    request
);
```

On grant, the returned opaque `AuthorizationContext` remains available within the same HTTP request for subsequent Object Authorization.

## 11.2 Object Authorization with Nested Object Schema

Given an Object Authorization Schema exposing:

```text
object.user.name
object.user.emails
object.account.status
```

an Object policy may contain:

```text
return object.account.status == "ACTIVE"
    && all(object.user.emails, email => len(email) > 10);
```

After known principal/request values are specialized, the residual Boolean semantics are returned as `ObjectAuthorizationPredicate<Q>`.

## 11.3 Persistence Binding

A resource-owned binder may map:

```text
object.user.name
```

through a persistence join and map:

```text
object.account.status
```

through another join or custom query expression.

The Object Authorization Predicate is applied before pagination.
