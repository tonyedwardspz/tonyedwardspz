---
title: Shell route templates in .NET MAUI 11
tag:
    - dotnet maui
    - programming
omit: true
---

There's a nice improvement to Shell navigation in .NET MAUI 11 that should feel familiar to anyone who's worked with ASP.NET Core or Blazor.

Introduced in Preview 7, **Shell route templates** allow you to include parameters directly in navigation paths, rather than relying exclusively on query strings. It's a relatively small change to the public API, but it brings some useful flexibility to how we define and navigate between pages.

Let's take a look at how it works, what it supports, and what's happening behind the scenes.

## Getting started with route templates

If you've worked with Shell navigation before, you'll probably be familiar with registering a route and passing parameters through a query string.

For example, imagine we're building an app that displays holiday properties. We might register a route and navigate to a property using its ID:

```csharp
Routing.RegisterRoute(
    "property",
    typeof(PropertyDetailPage));

await Shell.Current.GoToAsync(
    "property?propertyId=549");
```

This works perfectly well, and there's nothing wrong with continuing to use it. However, .NET MAUI 11 allows us to define the property ID as part of the route itself:

```csharp
Routing.RegisterRoute(
    "property/{propertyId}",
    typeof(PropertyDetailPage));
```

We can then navigate using a path parameter:

```csharp
await Shell.Current.GoToAsync(
    "//routes/property/549");
```

In this example, `routes` represents an existing route in the Shell visual hierarchy. The `549` segment is captured and passed to `PropertyDetailPage` as a parameter named `propertyId`.

If you're familiar with ASP.NET Core endpoint routing, the syntax should look familiar. The parameter name is enclosed in curly braces, and the routing system extracts its value from the corresponding segment of the navigation URI.

### Receiving the parameter

One of the things I like about this implementation is that the team hasn't introduced another mechanism for receiving navigation parameters.

Both `[QueryProperty]` and `IQueryAttributable` continue to work, which means existing page implementations don't need to change.

For example, we can receive the property ID through `IQueryAttributable`:

```csharp
public partial class PropertyDetailPage :
    ContentPage, IQueryAttributable
{
    public void ApplyQueryAttributes(
        IDictionary<string, object> query)
    {
        if (query.TryGetValue("propertyId", out var value))
        {
            var propertyId = value?.ToString();

            // Load the property details.
        }
    }
}
```

Despite the interface being called `IQueryAttributable`, the value doesn't need to originate from a query string. Shell combines the captured path parameters with the existing navigation parameter mechanism before delivering them to the destination page.

This keeps the feature compatible with existing applications, while making route definitions more expressive.

## More than just required parameters

Route templates aren't limited to simple required parameters. The implementation supports several forms of parameter matching, including optional parameters, default values, constraints, catch-all parameters and mixed segments.

Here are a few examples:

```csharp
// Required parameter
Routing.RegisterRoute(
    "property/{id}",
    typeof(PropertyPage));

// Optional parameter
Routing.RegisterRoute(
    "search/{term?}",
    typeof(SearchPage));

// Integer constraint
Routing.RegisterRoute(
    "booking/{id:int}",
    typeof(BookingPage));

// Default value
Routing.RegisterRoute(
    "reviews/{rating=5}",
    typeof(ReviewsPage));

// Catch-all parameter
Routing.RegisterRoute(
    "files/{*path}",
    typeof(FilePage));
```

These provide quite a bit of flexibility. An optional parameter can match a route with or without its final segment, while a catch-all parameter can capture multiple segments into a single value.

Constraints are particularly useful when you have routes that accept specific types of identifiers. For example, `{id:int}` only matches a segment that represents a valid integer, while `{id:guid}` restricts matching to GUID values.

It's worth pointing out that **constraints validate the route without converting the parameter into that type**. An integer-constrained parameter is still delivered as a string, so your application remains responsible for parsing it.

## How does it work behind the scenes?

Being curious about how this had been implemented, I had a look through the .NET MAUI source code. The feature was introduced in [PR #35110](https://github.com/dotnet/maui/pull/35110), and there are a couple of interesting design decisions.

The first is how route templates are registered.

In `Routing.cs`, MAUI continues to maintain its existing dictionary of registered routes, but introduces a second dictionary for parsed route templates:

```csharp
static Dictionary<string, RouteFactory> s_routes =
    new(StringComparer.Ordinal);

static Dictionary<string, RouteTemplate> s_routeTemplates =
    new(StringComparer.Ordinal);
```

When a route is registered, MAUI checks whether it contains template syntax. If it does, the route is parsed and stored alongside its normal registration.

Here's an extract from the implementation, with comments removed for clarity:

```csharp
s_routes[route] = factory;

if (RouteTemplate.ContainsTemplateSyntax(route))
{
    var template = RouteTemplate.Parse(route, out var error);

    if (template == null)
        throw new ArgumentException(error, nameof(route));

    if (template.HasParameters)
        s_routeTemplates[route] = template;
}
```

This is a sensible approach because existing literal routes don't need to participate in template parsing. The new functionality is effectively opt-in, activated when a developer registers a route containing template parameters.

It also means the existing route registration API remains unchanged. There's no separate `RegisterRouteTemplate` method or new route factory to worry about.

### How does MAUI decide which route matches?

The second interesting detail is how MAUI handles situations where multiple routes could match the same navigation URI.

Imagine we've registered these two routes:

```csharp
Routing.RegisterRoute(
    "property/{id}",
    typeof(PropertyDetailPage));

Routing.RegisterRoute(
    "property/featured",
    typeof(FeaturedPropertiesPage));
```

What happens if we navigate to `//routes/property/featured`?

Technically, both routes could match. The first treats `featured` as the property ID, while the second matches the literal path.

MAUI resolves this by giving **literal routes precedence over route templates**, following the approach used by ASP.NET Core and Blazor.

Looking at `FindAndAddSegmentMatch` in `ShellUriHandler.cs`, we can see the relevant logic:

```csharp
for (int pass = 0; pass < 2; pass++)
{
    bool acceptingTemplates = pass == 1;

    foreach (var routeKey in routeKeys)
    {
        bool isTemplate = Routing.IsTemplateRoute(routeKey);

        if (isTemplate != acceptingTemplates)
            continue;

        // Continue matching the route...
    }
}
```

*Source: [ShellUriHandler.cs](https://github.com/dotnet/maui/blob/net11.0/src/Controls/src/Core/Shell/ShellUriHandler.cs). The snippet is extracted from the route-matching implementation.*

It's a straightforward two-pass approach. The first pass considers literal routes, while the second considers routes containing template parameters. This ensures that `property/featured` takes precedence over `property/{id}`, regardless of the order in which those routes were registered.

I particularly like this detail because it helps preserve the behaviour of existing applications. Introducing parameterised routing shouldn't mean that an existing literal route suddenly starts resolving to a different page.

There's another useful precedence rule worth knowing: **path parameters take precedence over query parameters with the same name**. For example, navigating to:

```text
//routes/property/549?propertyId=123
```

delivers `549` as the value of `propertyId`, rather than `123`.

## A few limitations to be aware of

There are some restrictions worth knowing before introducing route templates into an existing application.

Most importantly, **route templates currently require absolute navigation**. That means using a URI such as `//routes/property/549`, where the initial route belongs to the Shell visual hierarchy. Relative navigation to template routes isn't currently supported.

There are also rules around parameter placement. Optional parameters and default values must appear at the end of the route, as must catch-all parameters. Parameter names must be valid C# identifiers, and the same parameter name can't be used twice within a route.

These restrictions are documented, and invalid templates are rejected rather than silently accepted.

## Wrapping up

Shell route templates aren't going to fundamentally change how we build MAUI applications, but they're a welcome addition to the navigation API. They provide a more expressive way to define routes, particularly for applications that navigate between resources identified by an ID, slug or other structured value.

I also like how the feature has been integrated into the existing infrastructure. Route registration remains familiar, navigation parameters are delivered through the same mechanisms, and the matching implementation deliberately preserves the precedence of literal routes.

It's another example of .NET MAUI adopting familiar patterns from elsewhere in the .NET ecosystem, and I'm pleased to see it.

For more information, including the supported route syntax and restrictions, take a look at the documentation and implementation:

- [What's new in .NET MAUI 11](https://learn.microsoft.com/en-us/dotnet/maui/whats-new/dotnet-11)
- [Shell navigation and route templates](https://learn.microsoft.com/en-us/dotnet/maui/fundamentals/shell/navigation?view=net-maui-11.0)
- [GitHub PR #35110 — Shell route templates](https://github.com/dotnet/maui/pull/35110)
- [Routing.cs source code](https://github.com/dotnet/maui/blob/net11.0/src/Controls/src/Core/Routing.cs)
