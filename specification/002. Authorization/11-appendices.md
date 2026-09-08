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

On grant, the returned opaque `AuthorizationContext` is propagated within the same HTTP request for subsequent MVC/Object Authorization use.

## 11.2 Object Authorization with Nested Query Contract

Given a Query Contract exposing:

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

After known principal/request values are specialized, the residual Boolean semantics are returned as `QueryPredicate<Q>` and Query Filtering/resource adapters map the API-visible paths to persistence.

## 11.3 Combined Collection Query

The intended database-side composition is:

```text
business predicate
AND
Object Authorization QueryPredicate<Q>
AND
client filterBy QueryPredicate<Q>
```

before pagination.
