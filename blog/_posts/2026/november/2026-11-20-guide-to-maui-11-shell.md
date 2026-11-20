---
title: A Practical Guide to the New Shell in .NET MAUI 11
tag:
    - dotnet maui
    - programming
---

.NET MAUI 11 introduces some significant changes to Shell, from new navigation capabilities and built-in badges to a major overhaul of the underlying architecture. For developers already using Shell, these changes provide more flexibility without requiring a complete replacement of the navigation system.

Perhaps the most important change is the move towards handlers. Android now uses a handler-based Shell implementation by default, while iOS and Mac Catalyst have a new implementation that developers can opt into. This brings Shell closer to the rest of the .NET MAUI architecture and provides new opportunities to customise native navigation behaviour.

There are plenty of smaller improvements too. Route templates make navigation parameters easier to work with, badges no longer require custom renderers, and navigation toolbar customisation is becoming more consistent.

In this tutorial, we'll look at the new features, how to implement them, and where the new architecture gives us more control. The examples target **.NET MAUI 11**, with MAUI Controls **11.0.10** and CommunityToolkit.Mvvm **8.4.2**, and assume an existing Shell-based application. They use XAML and C#, with platform-specific code where necessary.

## Companion sample application

There's also a companion application, **[Shell Workshop](https://github.com/tonyedwardspz/maui-11-shell-demo)**, which demonstrates the features covered in this tutorial.

The application includes four bottom tabs, with exercises for badges, navigation, toolbar customisation and the new Shell handlers. Each exercise uses real MAUI APIs, rather than reproducing their behaviour in a separate test implementation.

Start on the **Guide** tab to explore the examples, or open **Bookings** to run the navigation checks.

The sample targets .NET SDK 11.0.100 and pins MAUI Controls to 11.0.10. To run it on Android, open a terminal in the repository root and use:

```bash
dotnet workload restore src/ShellDemo/ShellDemo.csproj

dotnet build src/ShellDemo/ShellDemo.csproj \
    -t:Run -f net11.0-android
```

You'll need an Android emulator running or a connected device.

The sample also targets iOS, Mac Catalyst and Windows, although those platforms have different validation coverage, which we'll discuss at the end.

The examples below explain the individual features. Where the companion application has a corresponding exercise, I've included the relevant source file so you can follow the implementation in more detail.

## 1. Adding badges to Shell tabs

One of the most useful additions to Shell in .NET MAUI 11 is built-in badge support.

Previously, displaying an unread notification count on a tab often required a custom renderer, native platform code, or a third-party control. Shell now provides three bindable properties directly on its navigation items.

| Property | Description |
|---|---|
| `BadgeText` | Text or count displayed on the badge |
| `BadgeColor` | Background colour |
| `BadgeTextColor` | Text colour |

These properties are available on `ShellContent`, `Tab`, and `FlyoutItem` through `BaseShellItem`.

For a simple example, let's add a notification badge to a tab.

```xml
<TabBar>
    <ShellContent
        Title="Home"
        Route="home"
        Icon="home.png"
        ContentTemplate="{DataTemplate views:HomePage}" />

    <ShellContent
        Title="Notifications"
        Route="notifications"
        Icon="notifications.png"
        BadgeText="5"
        BadgeColor="Red"
        BadgeTextColor="White"
        ContentTemplate="{DataTemplate views:NotificationsPage}" />
</TabBar>
```

The Notifications tab now has a badge containing the number 5. The native implementation is responsible for positioning and rendering the badge, so there's no need to provide a custom layout for each platform.

### Controlling badge visibility

The value of `BadgeText` determines whether the badge appears.

- A non-empty string displays the supplied text.
- An empty string displays a dot indicator.
- `null` hides the badge.

For example:

```csharp
notificationsTab.BadgeText = "12"; // Show a count
notificationsTab.BadgeText = "";   // Show a dot
notificationsTab.BadgeText = null; // Hide the badge
```

This distinction is useful when a notification doesn't have a meaningful count, or when the application only needs to indicate that something requires attention.

### Updating badges with MVVM

Hardcoded values demonstrate the feature, but most applications will receive notification counts from a service or view model.

The properties are bindable, so we can update them through the same mechanisms used elsewhere in MAUI.

For this example, we'll use `CommunityToolkit.Mvvm`.

```csharp
using CommunityToolkit.Mvvm.ComponentModel;

namespace ShellDemo.ViewModels;

public partial class AppShellViewModel : ObservableObject
{
    [ObservableProperty]
    [NotifyPropertyChangedFor(nameof(NotificationBadge))]
    private int unreadNotificationCount;

    public string? NotificationBadge =>
        UnreadNotificationCount > 0
            ? UnreadNotificationCount.ToString()
            : null;
}
```

The `NotificationBadge` property converts the notification count into a string, returning `null` when no unread notifications remain.

In `AppShell.xaml.cs`, assign the view model as the binding context:

```csharp
using ShellDemo.ViewModels;

namespace ShellDemo;

public partial class AppShell : Shell
{
    public AppShell(AppShellViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
```

We can then bind directly to it:

```xml
<ShellContent
    Title="Notifications"
    Icon="notifications.png"
    BadgeText="{Binding NotificationBadge}"
    ContentTemplate="{DataTemplate views:NotificationsPage}" />
```

When `UnreadNotificationCount` changes, the generated property notification also updates `NotificationBadge`. Shell receives that change and updates the native badge.

### Registering and sharing the view model

There is one important setup detail here.

Setting the binding context on an individual page doesn't automatically make that view model available to `AppShell`. The Shell hierarchy has its own binding context, which needs to be configured explicitly.

In `MauiProgram.cs`, register the shared view model and Shell with dependency injection:

```csharp
builder.Services.AddSingleton<AppShellViewModel>();
builder.Services.AddSingleton<AppShell>();
```

The sample also shares this state with its Inbox page.

For example, a page using the same application-level state can accept the view model through its constructor:

```csharp
public partial class NotificationsPage : ContentPage
{
    public NotificationsPage(AppShellViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
```

If you're using constructor injection for a page created by Shell, make sure the page is registered and resolved through dependency injection as appropriate.

```csharp
builder.Services.AddTransient<NotificationsPage>();
```

The important part is that the same `AppShellViewModel` instance is used by both Shell and the page. Registering it as a singleton provides a straightforward way to achieve that.

This keeps the notification state separate from the navigation UI, which is particularly useful when notification counts are also displayed elsewhere in the application.

Make sure changes to UI-bound state are dispatched to the main thread when they originate from background operations.

### Platform differences

MAUI uses the native badge implementation available on each platform.

| Platform | Implementation |
|---|---|
| Android | Material Design `BadgeDrawable` |
| iOS / Mac Catalyst | `UITabBarItem.BadgeValue` |
| Windows | WinUI `InfoBadge` |

There is one important difference on Windows. Numeric values can be displayed as counts, but non-numeric values are rendered as a dot. This means a badge containing `"New"` won't look the same across every platform.

It's also worth testing long values, such as notification counts above 99, rather than assuming every platform will render them identically.

**Try it in the sample:** Open **Inbox** and test count, zero, dot, hidden, text and long-count states. The relevant implementations are in `AppShell.xaml` and `ViewModels/AppShellViewModel.cs`.

The Android runtime tests verified the binding values for these states. The badges were also inspected as native UI, although the automated assertions don't establish pixel-level appearance across platforms.

**References:** [Shell tabs](https://learn.microsoft.com/en-us/dotnet/maui/fundamentals/shell/tabs?view=net-maui-11.0) · [Shell badge implementation](https://github.com/dotnet/maui/pull/34659)

![Badges in MAUI Shell](assets/images/2026/android-shared-badges.png) 

## 2. Adding badges to toolbar items

Badges aren't limited to tabs. .NET MAUI 11 also introduces the same properties on `ToolbarItem`, making it possible to display unread counts and status indicators in the navigation toolbar.

For example, let's add a notification button to the top-right corner of a page.

```xml
<ContentPage.ToolbarItems>
    <ToolbarItem
        Text="Notifications"
        IconImageSource="notifications.png"
        Order="Primary"
        BadgeText="{Binding NotificationBadge}"
        BadgeColor="Red"
        BadgeTextColor="White"
        Command="{Binding OpenNotificationsCommand}" />
</ContentPage.ToolbarItems>
```

This displays a toolbar action with an associated badge. As with tab badges, the value can change dynamically through binding.

The `NotificationBadge` property can be shared with the Shell tab example, provided both elements have access to the same application state.

For this example to work, the page's binding context must expose `NotificationBadge` and `OpenNotificationsCommand`. If the page uses a separate view model, that view model can consume the shared notification state rather than duplicating it.

This makes it possible to provide a consistent unread notification count throughout an application without having to maintain separate native badge implementations.

**Try it in the sample:** Open **Inbox** and change the notification count. Observe the tab and toolbar badge together.

The implementation is in `Views/NotificationsPage.xaml`.

**Reference:** [ToolbarItem](https://learn.microsoft.com/en-us/dotnet/maui/user-interface/toolbaritem?view=net-maui-11.0)

## 3. Working with the toolbar overflow menu

Another useful part of Shell navigation is the overflow menu, commonly displayed as three dots in the top-right corner of the navigation bar.

The overflow menu isn't new to .NET MAUI 11, but it's worth including because the behaviour of secondary toolbar items has improved across recent releases.

A toolbar item can be either `Primary` or `Secondary`.

Primary items appear directly in the navigation bar. Secondary items are collected into an overflow menu, keeping less frequently used actions available without occupying permanent space.

```xml
<ContentPage.ToolbarItems>
    <ToolbarItem
        Text="Search"
        IconImageSource="search.png"
        Order="Primary"
        Command="{Binding SearchCommand}" />

    <ToolbarItem
        Text="Settings"
        Order="Secondary"
        Priority="0"
        Command="{Binding SettingsCommand}" />

    <ToolbarItem
        Text="Feedback"
        Order="Secondary"
        Priority="1"
        Command="{Binding FeedbackCommand}" />

    <ToolbarItem
        Text="About"
        Order="Secondary"
        Priority="2"
        Command="{Binding AboutCommand}" />
</ContentPage.ToolbarItems>
```

The Search action appears in the navigation toolbar, while Settings, Feedback, and About appear in the overflow menu.

The `Priority` property controls their order. Lower values appear first.

### What changed on iOS?

Earlier MAUI implementations displayed secondary toolbar actions differently across platforms. On iOS, these actions previously appeared in a toolbar at the bottom of the screen.

In .NET MAUI 10, Shell gained support for displaying secondary actions in a native pull-down menu, accessed from the navigation bar. This brings it much closer to the experience already available on Android and Windows.

.NET MAUI 11 continues that behaviour. Separately, the new handler-based `NavigationPage` implementation on Apple platforms also places secondary items in the navigation bar overflow menu.

For consistency, keep secondary toolbar item labels short and avoid relying on icons inside the menu. The official documentation warns that secondary-item icons are not rendered consistently across platforms.

This is an example of functionality that isn't entirely new in .NET 11, but is now considerably easier to use consistently.

**Try it in the sample:** Open **Native lab** and inspect the overflow menu. On the tested Pixel 8a, the native menu displayed Settings, Feedback and About in the expected order.

The implementation is in `Views/NativeLabPage.cs`.

![Toolbar Overflow in MAUI 11 Shell](assets/images/2026/android-toolbar-overflow.png) 

**References:** [Primary and secondary toolbar items](https://learn.microsoft.com/en-us/dotnet/maui/user-interface/toolbaritem?view=net-maui-11.0) · [iOS secondary toolbar support](https://github.com/dotnet/maui/pull/30480)

## 4. Using route templates for Shell navigation

Shell has supported URI-based navigation for a long time. However, passing data between pages has generally meant using query parameters or passing dictionaries of navigation values.

.NET MAUI 11 introduces **route templates**, allowing parameters to be included directly in the route.

This approach will be familiar to developers working with ASP.NET Core or Blazor.

Previously, we might have navigated to a booking details page using:

```csharp
await Shell.Current.GoToAsync(
    "bookingdetails?bookingId=12345");
```

With route templates, we can define the parameter as part of the route itself.

```csharp
Routing.RegisterRoute(
    "booking/{bookingId}",
    typeof(BookingDetailsPage));
```

Navigation can then use:

```csharp
await Shell.Current.GoToAsync(
    "//bookings/booking/12345");
```

In this example, `bookings` must be a route that exists in the Shell visual hierarchy. The registered template `booking/{bookingId}` then matches the remaining path.

The captured value, `12345`, is passed to `BookingDetailsPage` as the parameter `bookingId`.

### Registering routes

Let's start with a simple Shell hierarchy.

```xml
<TabBar>
    <ShellContent
        Title="Bookings"
        Route="bookings"
        Icon="bookings.png"
        ContentTemplate="{DataTemplate views:BookingsPage}" />

    <ShellContent
        Title="Settings"
        Route="settings"
        Icon="settings.png"
        ContentTemplate="{DataTemplate views:SettingsPage}" />
</TabBar>
```

In `AppShell.xaml.cs`, register the detail route:

```csharp
namespace ShellDemo;

public partial class AppShell : Shell
{
    public AppShell(AppShellViewModel viewModel)
    {
        InitializeComponent();

        BindingContext = viewModel;

        Routing.RegisterRoute(
            "booking/{bookingId}",
            typeof(BookingDetailsPage));
    }
}
```

Notice that we've retained the constructor injection introduced in section 1.

The examples are intended to work together, so there's no need to create a second `AppShell` constructor. Add subsequent route registrations to the existing injected constructor.

The following navigation call uses the `bookings` Shell route as its starting point:

```csharp
string bookingId = "12345";

await Shell.Current.GoToAsync(
    $"//bookings/booking/{Uri.EscapeDataString(bookingId)}");
```

The route template matches the URI and captures the supplied booking identifier.

### Receiving route parameters

Route parameters use the same delivery mechanisms already supported by Shell. We can receive them using `[QueryProperty]` or `IQueryAttributable`.

For a modern application using MVVM, I prefer `IQueryAttributable`. It works well with trimming and NativeAOT, whereas `[QueryProperty]` isn't trim-safe.

For example:

```csharp
using CommunityToolkit.Mvvm.ComponentModel;

namespace ShellDemo.ViewModels;

public partial class BookingDetailsViewModel :
    ObservableObject, IQueryAttributable
{
    [ObservableProperty]
    private string? bookingId;

    public void ApplyQueryAttributes(
        IDictionary<string, object> query)
    {
        if (query.TryGetValue("bookingId", out var value))
        {
            BookingId = value?.ToString();
        }
    }
}
```

The destination page can use this view model as its binding context. MAUI will invoke `ApplyQueryAttributes` when the navigation parameters are delivered.

A production implementation would typically use the booking identifier to load the associated data from a service, rather than perform that work directly in the page.

### Route constraints

Route templates support more than simple string parameters.

We can specify constraints that determine which values a route will accept.

```csharp
Routing.RegisterRoute(
    "integer/{bookingId:int}",
    typeof(BookingDetailsPage));

Routing.RegisterRoute(
    "customer/{customerId:guid}",
    typeof(CustomerDetailsPage));
```

In the first example, `bookingId` must match a 32-bit integer. In the second, `customerId` must be a valid GUID.

The supported constraints are:

| Constraint | Accepted value |
|---|---|
| `int` | 32-bit integer |
| `long` | 64-bit integer |
| `double` | Floating-point number |
| `bool` | Boolean |
| `guid` | GUID |
| `alpha` | Alphabetic text |

An important detail is that constraints validate the route, but **they don't convert the captured value into the specified type**. Parameters are still delivered as strings, so the application must parse them if a strongly typed value is required.

For example:

```csharp
if (query.TryGetValue("bookingId", out var value) &&
    int.TryParse(value?.ToString(), out var id))
{
    // Use the validated integer identifier.
}
```

There is another consideration when registering constrained routes.

If you register both `booking/{bookingId}` and `booking/{bookingId:int}`, the unconstrained route can still match a value that fails the integer constraint. The constraint doesn't automatically make every matching route reject invalid values.

For that reason, the companion sample uses a distinct `integer/` prefix for the constrained demonstration.

This makes it possible to test invalid-integer rejection without the unconstrained booking route accepting the same URI.

### Optional and default values

Parameters can be optional or have default values.

```csharp
Routing.RegisterRoute(
    "search/{category?}",
    typeof(SearchPage));

Routing.RegisterRoute(
    "results/{page=1}",
    typeof(ResultsPage));
```

Both of these URI forms are valid when `home` is a route in the Shell hierarchy:

```text
//home/search
//home/search/coastal
```

For the results route, omitting the page segment supplies the default value `"1"`.

The companion application specifically tests this behaviour using the actual Shell route parser. With MAUI Controls 11.0.10, the default-absent navigation delivered `page = "1"` without requiring an application-level fallback.

Optional and defaulted parameters must appear at the end of a registered route template. The same restriction applies to catch-all parameters.

### Catch-all parameters

Catch-all parameters allow a single value to capture multiple path segments.

```csharp
Routing.RegisterRoute(
    "files/{*path}",
    typeof(FileDetailsPage));
```

Navigating to:

```text
//home/files/documents/2026/report.pdf
```

Delivers `documents/2026/report.pdf` as the `path` parameter.

This can be useful for hierarchical content, although it doesn't remove the need to validate the supplied path before using it to access resources.

### Mixed route segments

Route parameters can also be embedded within literal text.

```csharp
Routing.RegisterRoute(
    "booking-{bookingId}-summary",
    typeof(BookingSummaryPage));
```

This matches a route such as:

```text
//bookings/booking-12345-summary
```

The captured `bookingId` is `12345`.

The current parser supports one parameter per mixed segment.

### Route template limitations

There are a few restrictions worth understanding before replacing existing navigation code.

Most importantly, route templates currently support **absolute navigation only**.

```csharp
await Shell.Current.GoToAsync(
    "//bookings/booking/12345");
```

The following doesn't work with a route template:

```csharp
await Shell.Current.GoToAsync(
    "booking/12345");
```

The second example throws an `ArgumentException`.

Absolute navigation must begin at a route defined within the Shell visual hierarchy, rather than directly at a globally registered detail route. This is an important difference from traditional relative navigation to registered detail pages.

Literal routes also take precedence over parameterised routes. If `booking/summary` and `booking/{bookingId}` are both registered, navigating to `booking/summary` selects the literal route.

Route templates are an additive feature. Existing route registrations and query-string navigation remain supported, so there's no requirement to migrate everything immediately.

**Try it in the sample:** Open **Bookings** and select individual route scenarios, or choose **Run all route checks**.

The application tests required values, escaped spaces, all six constraints, invalid values, optional and default parameters, catch-all routes, mixed segments, literal precedence and traditional navigation.

The relevant implementation is in `AppShell.xaml.cs`, `Services/RouteScenarios.cs` and `ViewModels/BookingDetailsViewModel.cs`.

**References:** [Shell navigation](https://learn.microsoft.com/en-us/dotnet/maui/fundamentals/shell/navigation?view=net-maui-11.0) · [Official route-template sample](https://learn.microsoft.com/en-us/samples/dotnet/maui-samples/navigation-shell-route-templates/) · [Route template implementation](https://github.com/dotnet/maui/pull/35110)

## 5. Understanding the new Shell handler architecture

The most substantial architectural change in .NET MAUI 11 is the introduction of a new handler-based implementation of Shell.

MAUI has used handlers for most of its controls for several releases, replacing the renderer architecture inherited from Xamarin.Forms. Shell, however, continued to rely heavily on compatibility renderers.

This created an inconsistency. Customising a typical MAUI control could involve extending a handler, while customising Shell often meant going back to the older renderer model.

.NET MAUI 11 begins to address this.

### Android now uses handlers by default

On Android, Shell uses its new handler-based implementation without requiring an additional feature switch.

The implementation centres around three classes:

| Handler | Responsibility |
|---|---|
| `ShellHandler` | Root Shell, flyout and appearance infrastructure |
| `ShellItemHandler` | Tab and section selection |
| `ShellSectionHandler` | Navigation stack and page transitions |

These handlers reuse navigation infrastructure found elsewhere in MAUI rather than maintaining an entirely separate renderer implementation.

An important benefit is that developers now have more direct access to native customisation points through handler subclasses.

### iOS and Mac Catalyst are opt-in

On Apple platforms, the new Shell handlers are available, but the compatibility `ShellRenderer` remains the default in .NET MAUI 11.

To enable the new implementation, add the following property to your project file:

```xml
<PropertyGroup>
    <UseiOSShellHandler>true</UseiOSShellHandler>
</PropertyGroup>
```

This enables the handler hierarchy for Shell, Shell items, sections and content on iOS and Mac Catalyst.

The handlers include:

- `ShellHandler`
- `ShellItemHandler`
- `ShellSectionHandler`
- `ShellContentHandler`

There is no need to register these individually when using the project property.

For an existing application, I'd recommend testing the new implementation separately before enabling it for all users. Navigation is central to the application experience, and custom renderer code may need to be updated to work with the new architecture.

### Verifying the active handler

When working with custom handlers, it's useful to confirm which implementation is actually being used.

The companion sample includes an exercise that reports the active root handler type.

On the tested Android device, this confirmed:

```text
ShellDemo.Platforms.Android.CustomShellHandler
```

This is particularly helpful when troubleshooting customisations. Without checking the active handler, it can be difficult to distinguish a handler registration problem from a native appearance change that isn't behaving as expected.

**Try it in the sample:** Open **Native lab** and inspect the active root handler. The relevant configuration is in `MauiProgram.cs` and `ShellDemo.csproj`.

**Reference:** [Custom Shell handlers](https://learn.microsoft.com/en-us/dotnet/maui/fundamentals/shell/custom-handlers?view=net-maui-11.0)

## 6. Customising Shell with handlers

The new architecture opens up several extension points that previously required custom renderers.

The `ShellHandler` class provides factory methods that can be overridden to customise how native Shell components are created.

On Android, these include methods for creating toolbar appearance trackers, tab layout trackers, bottom navigation appearance trackers and flyout content.

On Apple platforms, the new handler provides similar extension points for navigation bars, tab bars, page appearance and transitions.

Let's look at a practical example.

### Customising the Android navigation toolbar

Suppose we want to add something to the native Android navigation toolbar that isn't available through the standard Shell appearance properties.

A subtitle is a useful example. It allows us to demonstrate that the custom appearance tracker is running, without relying on a colour change that Shell may subsequently override.

First, create a subclass of `ShellHandler`:

```csharp
using Microsoft.Maui.Controls.Handlers;
using Microsoft.Maui.Controls.Platform.Compatibility;

namespace ShellDemo.Platforms.Android;

public class CustomShellHandler : ShellHandler
{
    protected override IShellToolbarAppearanceTracker
        CreateToolbarAppearanceTracker()
    {
        return new CustomToolbarAppearanceTracker(this);
    }
}
```

Next, create the toolbar appearance tracker:

```csharp
using Microsoft.Maui.Controls.Platform.Compatibility;
using Toolbar = AndroidX.AppCompat.Widget.Toolbar;

namespace ShellDemo.Platforms.Android;

public class CustomToolbarAppearanceTracker
    : ShellToolbarAppearanceTracker
{
    public CustomToolbarAppearanceTracker(
        IShellContext context) : base(context)
    {
    }

    public override void SetAppearance(
        Toolbar toolbar,
        IShellToolbarTracker toolbarTracker,
        ShellAppearance appearance)
    {
        base.SetAppearance(
            toolbar, toolbarTracker, appearance);

        toolbar.SetSubtitle("Custom native tracker");

        toolbar.SetSubtitleTextColor(
            global::Android.Graphics.Color.Red);
    }
}
```

There are two details worth paying attention to in this implementation.

First, the Shell appearance tracker interfaces and base class are in `Microsoft.Maui.Controls.Platform.Compatibility`, not `Microsoft.Maui.Controls.Platform`.

Second, the `Toolbar` type needs to be explicitly aliased to `AndroidX.AppCompat.Widget.Toolbar`. Otherwise, MAUI's implicit usings can introduce an ambiguity with `Microsoft.Maui.Controls.Toolbar`.

Both issues produce compiler errors if the incorrect imports are used.

The actual MAUI 11.0.10 tracker implementation is a useful reference when extending this class:

[ShellToolbarAppearanceTracker.cs — MAUI 11.0.10](https://github.com/dotnet/maui/blob/11.0.10/src/Controls/src/Core/Compatibility/Handlers/Shell/Android/ShellToolbarAppearanceTracker.cs)

Finally, register the custom handler in `MauiProgram.cs`:

```csharp
builder.ConfigureMauiHandlers(handlers =>
{
#if ANDROID
    handlers.AddHandler<
        Shell,
        ShellDemo.Platforms.Android.CustomShellHandler>();
#endif
});
```

The custom handler is now used in place of the default Android Shell handler. The standard implementation remains responsible for most behaviour, while our appearance tracker applies the additional native changes.

The call to `base.SetAppearance` preserves the standard appearance processing before applying the additional native changes.

### Why not just change the title colour?

The original example for this section used `toolbar.SetTitleTextColor` to change the native toolbar title to red.

That call compiles, and the custom handler was confirmed to be active during testing. However, it didn't reliably produce the expected result.

On both the Android API 35 emulator and the Pixel 8a running Android 17/API 37, the toolbar title remained white when Shell was configured with:

```xml
Shell.TitleColor="White"
```

A later toolbar appearance update may have reapplied the configured Shell colour, although the exact ordering wasn't traced.

For standard toolbar colours, use the public Shell properties instead:

```xml
<ContentPage
    Shell.BackgroundColor="#102A43"
    Shell.TitleColor="Red"
    Shell.ForegroundColor="White">
</ContentPage>
```

These properties express the intended appearance through the framework rather than competing with its native appearance updates.

The companion application retains the original native title-colour call for comparison, but also adds the subtitle **Custom native tracker**, which was visibly confirmed on the tested Android device.

That makes the subtitle a better example of why an appearance tracker might be useful.

### Customising the Apple tab bar

The same principle applies to iOS and Mac Catalyst, although the native APIs and extension points are different.

For example, the new Apple `ShellHandler` allows us to override `CreateTabBarAppearanceTracker`.

The following code illustrates how to add a border to the native tab bar:

```csharp
#if IOS || MACCATALYST
using Microsoft.Maui.Controls;
using Microsoft.Maui.Controls.Handlers;
using Microsoft.Maui.Controls.Platform.Compatibility;
using UIKit;

namespace ShellDemo.Handlers.Apple;

public class CustomShellHandler : ShellHandler
{
    protected override IShellTabBarAppearanceTracker
        CreateTabBarAppearanceTracker()
    {
        return new CustomTabBarAppearanceTracker();
    }
}

public class CustomTabBarAppearanceTracker
    : ShellTabBarAppearanceTracker
{
    public override void SetAppearance(
        UITabBarController controller,
        ShellAppearance appearance)
    {
        base.SetAppearance(controller, appearance);

        controller.TabBar.Layer.BorderColor =
            UIColor.Red.CGColor;

        controller.TabBar.Layer.BorderWidth = 1;
    }
}
#endif
```

Register the handler in `MauiProgram.cs` for the Apple targets, with the registration enabled only when the new Apple Shell handler implementation is in use.

There is also a project organisation detail here.

A physical `Platforms/Apple` folder isn't automatically treated as shared platform source by the MAUI single-project conventions. If the same code should compile for both iOS and Mac Catalyst, place it in a normally included folder, such as `Handlers/Apple`, and guard it with:

```csharp
#if IOS || MACCATALYST
```

Alternatively, explicitly include the files through MSBuild.

The companion application uses `Handlers/Apple` for this reason.

Although the handler APIs are broadly similar, the underlying native components aren't identical. We should treat platform-specific customisations independently rather than assume the same implementation can be shared across Android and Apple platforms.

The Apple C# API references were successfully compiled as part of the sample validation, but the Apple application wasn't run. The tab-bar border should therefore be treated as an example to verify on the target devices, rather than a runtime-validated visual result.

**Try it in the sample:** Open **Native lab** to compare the Android native subtitle and title-colour behaviour. The Apple implementation provides a tab-bar border example for testing on a compatible Apple development environment.

The relevant files are `Platforms/Android/CustomShellHandler.cs` and `Handlers/Apple/CustomShellHandler.cs`.

**Reference:** [Custom Shell handlers](https://learn.microsoft.com/en-us/dotnet/maui/fundamentals/shell/custom-handlers?view=net-maui-11.0)

## 7. Customising tab selection and reselect behaviour

A common mobile navigation pattern is to return to the root page when the user selects the tab they're already viewing.

For example, imagine an application with a Bookings tab. The user opens a booking, navigates through several detail pages, and then selects the Bookings tab again.

Rather than remaining on the current detail page, we want to return to the booking list.

Shell already maintains navigation stacks for its sections, but the new Android `ShellItemHandler` provides an `OnTabReselected` extension point that makes it easier to customise this behaviour.

### How the new handler helps

On Android, `ShellItemHandler` exposes these relevant methods:

| Method | Purpose |
|---|---|
| `OnTabReselected` | Handle selection of the currently active tab |
| `OnSectionChanged` | Respond to a change of active section |
| `CreateMoreBottomSheet` | Customise the additional-tabs bottom sheet |

The `OnTabReselected` method is particularly useful because it provides a native reselect callback without requiring the older `ShellItemRenderer`.

For a reselect-to-root implementation, the intended behaviour is to call `PopToRootAsync` on the active section's navigation stack.

```csharp
await section.Navigation.PopToRootAsync();
```

Using the selected section's navigation stack is important. Shell can maintain separate stacks for different sections, and a custom reselect implementation should operate on the section the user has selected.

### Handling repeated selections

A native reselect callback can occur while navigation is already in progress. If the implementation starts multiple asynchronous navigation operations, the application may encounter overlapping requests or unexpected navigation behaviour.

The companion application addresses this with a complete Android handler override that:

- Uses the selected section's `Navigation` stack.
- Guards against repeated reselect callbacks while navigation is running.
- Handles exceptions at the asynchronous native event boundary.
- Allows the custom behaviour to be disabled, returning control to MAUI's default implementation.

These details are worth including in a production implementation, rather than simply placing an unguarded asynchronous navigation call inside a native event callback.

### Alternative: navigating to a known root route

If an application has explicit routes for its tab roots, it can also reset navigation through an absolute Shell route.

```csharp
await Shell.Current.GoToAsync("//bookings");
```

This approach is useful when the desired destination is known. However, it shouldn't be treated as a direct substitute for `PopToRootAsync` in every navigation structure, particularly where multiple Shell sections maintain independent stacks.

The new handler gives us a better place to implement the reselect behaviour, but we should still keep the navigation policy itself separate from platform-specific UI code.

**Try it in the sample:** Open **Bookings**, select a booking and push another detail page. Then reselect the Bookings tab.

On the tested Pixel 8a, the visible page returned from `ParameterPage` to the Bookings root.

The working Android implementation, including its concurrency guard and exception handling, is in `Platforms/Android/CustomShellHandler.cs`.

**Reference:** [Migrating custom renderers](https://learn.microsoft.com/en-us/dotnet/maui/migration/custom-renderers?view=net-maui-11.0)

## 8. Customising the navigation toolbar and back button

The navigation toolbar is another area where Shell customisation has historically involved platform-specific code.

.NET MAUI already provides several properties for controlling the appearance and behaviour of navigation elements. Those properties remain supported in .NET MAUI 11 and should be preferred for ordinary customisation.

For example, Shell supports toolbar background and title colours through attached properties:

```xml
<ContentPage
    Shell.BackgroundColor="#102A43"
    Shell.TitleColor="White"
    Shell.ForegroundColor="White">
</ContentPage>
```

For changes that aren't supported by these public properties, the new handler architecture provides the more advanced extension points demonstrated earlier.

### Customising the back button

The `BackButtonBehavior` class allows developers to customise the back button displayed by Shell.

For example:

```xml
<Shell.BackButtonBehavior>
    <BackButtonBehavior
        IconOverride="back.png"
        TextOverride="Back to bookings"
        Command="{Binding BackCommand}"
        AccessibilityLabel="Return to bookings" />
</Shell.BackButtonBehavior>
```

The `IconOverride`, `TextOverride` and `Command` properties aren't new in .NET MAUI 11, but they're worth discussing alongside the new handler architecture.

What is new is `AccessibilityLabel`.

This property allows us to specify the label exposed to accessibility services such as VoiceOver and TalkBack, rather than relying on the default label.

That matters when an application uses custom back button icons or has navigation actions that aren't obvious from the visual presentation alone.

### Implementing the back command

The command should implement the required navigation behaviour.

Using CommunityToolkit.Mvvm, we can define it in a view model:

```csharp
using CommunityToolkit.Mvvm.Input;

public partial class BookingDetailsViewModel
{
    [RelayCommand]
    private async Task BackAsync()
    {
        await Shell.Current.GoToAsync("..");
    }
}
```

CommunityToolkit generates the command name from the method. It removes the `Async` suffix and appends `Command`.

In this example, the generated property is:

```csharp
BackCommand
```

That matches the XAML binding:

```xml
Command="{Binding BackCommand}"
```

If we'd named the method `GoBackAsync`, the generated command would instead be `GoBackCommand`, and the XAML would need to reference that name.

This is easy to overlook when combining code examples, because the code-behind or view-model method may compile even when the XAML binding points to a non-existent command.

An important consideration is that overriding the back button command changes the action associated with that toolbar control. It doesn't automatically intercept every possible back-navigation mechanism on every platform.

Android system back navigation, gestures and programmatic navigation should be considered separately if the application needs to prevent navigation or confirm unsaved changes.

### Accessibility validation

The companion application includes a custom back button on the booking details page.

On the tested Pixel 8a, the native accessibility hierarchy exposed the label:

```text
Return to bookings
```

The custom toolbar command was also exercised on-device and successfully returned from an animated booking-detail push to Native lab.

This confirms that the native accessibility node carried the supplied label in the tested configuration. It doesn't establish how TalkBack announces the control, because spoken TalkBack output wasn't assessed.

**Try it in the sample:** Open the booking details exercise and inspect the customised back button. The implementation is in `Views/BookingDetailsPage.cs`.

**References:** [Shell navigation](https://learn.microsoft.com/en-us/dotnet/maui/fundamentals/shell/navigation?view=net-maui-11.0) · [RelayCommand generator](https://learn.microsoft.com/en-us/dotnet/communitytoolkit/mvvm/generators/relaycommand)

## 9. Customising navigation transitions

The handler architecture also provides additional opportunities to customise navigation animations.

On Android, `ShellSectionHandler` exposes `OnCreateNavigationAnimation`, allowing developers to influence the animation used when pages are pushed and popped.

On iOS and Mac Catalyst, the new `ShellHandler` exposes `CreateShellItemTransition`, which can be used to customise transitions between Shell items.

These are native handler extension points rather than a new cross-platform Shell animation API.

For ordinary navigation, Shell already allows developers to enable or disable navigation animations using the `animate` argument to `GoToAsync`.

```csharp
await Shell.Current.GoToAsync(
    "bookingdetails",
    animate: false);
```

The example above uses a traditional registered route, rather than a route template. It disables the standard navigation animation when the page is displayed.

### Implementing native transitions

For more advanced requirements, a custom `ShellSectionHandler` can override Android's navigation animation creation and return an appropriate native animation.

This gives the application more control than simply enabling or disabling the standard transition, but it's also more closely tied to the Android navigation implementation.

The companion application includes an optional Android fade override. It allows the developer to enable a custom transition and compare it with MAUI's standard animation behaviour.

The validation report confirms that the native fade override was reached during back navigation, reporting:

```text
popping=True, entering=True
```

That confirms the override was invoked for the tested transition. It isn't a claim that every navigation gesture or animation sequence has been visually validated.

### What about Apple platforms?

The new Apple Shell handler exposes `CreateShellItemTransition`, providing a potential extension point for custom item transitions.

However, the companion sample deliberately retains the native Apple transitions rather than introducing an untested custom implementation.

The API is worth knowing about, but a complete Apple transition implementation would need separate development and runtime validation.

For most applications, I'd recommend retaining the native transitions unless the design requires something more specific. Native navigation transitions are closely tied to platform navigation controllers, and custom animations can interfere with gesture-driven navigation if they aren't implemented carefully.

**Try it in the sample:** Open **Native lab** and compare animated and instant navigation. On Android, enable the optional fade override to exercise the custom transition path.

The relevant implementation is in `Views/NativeLabPage.cs` and `Platforms/Android/CustomShellHandler.cs`.

**Reference:** [Shell custom handlers](https://learn.microsoft.com/en-us/dotnet/maui/fundamentals/shell/custom-handlers?view=net-maui-11.0)

## 10. Migrating existing Shell customisations

If you're upgrading an existing application from .NET MAUI 10, the new Shell features are generally additive. Existing Shell XAML, routes and navigation patterns can continue to work without adopting route templates or badges.

The architectural changes deserve more attention, particularly if your application contains custom renderers.

### Android renderer migration

Android Shell now uses handlers by default, so custom renderer implementations should be reviewed.

The following table shows the main migration equivalents.

| Previous renderer | New handler |
|---|---|
| `ShellRenderer` | `ShellHandler` |
| `ShellItemRenderer` | `ShellItemHandler` |
| `ShellSectionRenderer` | `ShellSectionHandler` |
| `ShellItemRenderer.OnTabReselected` | `ShellItemHandler.OnTabReselected` |

This isn't necessarily a direct class rename. Handler implementations work differently from renderers, so code that interacts with native views or lifecycle methods may need more substantial changes.

### Temporarily using the legacy Android renderer

MAUI 11 still provides a compatibility Shell renderer that can be registered explicitly when required.

```csharp
builder.ConfigureMauiHandlers(handlers =>
{
#if ANDROID
    handlers.AddHandler<
        Shell,
        Microsoft.Maui.Controls.Handlers.Compatibility.ShellRenderer>();
#endif
});
```

This provides a migration path while existing renderer customisations are being updated.

It should be considered a temporary compatibility mechanism rather than the recommended architecture for new work.

When switching to the legacy renderer, make sure any registration for your custom handler is disabled. Otherwise, multiple registrations for Shell can make the active implementation dependent on registration order.

The companion application provides a build switch for this comparison:

```bash
dotnet clean src/ShellDemo/ShellDemo.csproj \
    -f net11.0-android

dotnet build src/ShellDemo/ShellDemo.csproj \
    -f net11.0-android \
    -p:ShellDemoLegacyAndroid=true
```

The sample's conditional registration logic removes the custom Android handler when this switch is enabled.

The Android legacy-renderer configuration passed the C# Compile target during validation. That is useful migration evidence, but it isn't the same as a full runtime validation of the legacy implementation.

### Testing Apple handlers

Because the new Shell handler on iOS and Mac Catalyst is opt-in, migration can be approached incrementally.

Start by enabling `UseiOSShellHandler` in a development build, then verify the areas most likely to be affected by custom navigation behaviour.

I'd pay particular attention to tab switching and navigation stacks, toolbar actions and overflow menus, flyout presentation, custom appearance trackers, and page lifecycle behaviour.

If you disable the new Apple handler by setting:

```xml
<UseiOSShellHandler>false</UseiOSShellHandler>
```

you also need to remove custom Shell handler registrations that depend on it.

The companion application conditions these registrations on the same build setting, rather than leaving incompatible handler registrations active.

You can compare the configuration using:

```bash
dotnet clean src/ShellDemo/ShellDemo.csproj \
    -f net11.0-maccatalyst

dotnet build src/ShellDemo/ShellDemo.csproj \
    -f net11.0-maccatalyst \
    -p:UseiOSShellHandler=false
```

A compatible Xcode installation is still required for a full Apple build.

### Distinguishing Shell from NavigationPage

There are also changes to `NavigationPage` and `TabbedPage` on Apple platforms in .NET MAUI 11. Both now use handlers by default, independently of the opt-in Shell handler implementation.

For `NavigationPage`, the timing of `Appearing` has changed to occur before the page is pushed, aligning it with other platforms. Applications that need to know when navigation has completed should consider `NavigatedTo` instead.

Secondary toolbar items also appear in the navigation bar overflow menu under the new Apple `NavigationPage` handler.

These changes matter when an application uses multiple navigation approaches, but they shouldn't be confused with changes specific to Shell.

**Try it in the sample:** Compare the handler and compatibility-renderer build configurations. The conditional registrations are in `MauiProgram.cs`, with the project switches in `ShellDemo.csproj`.

**References:** [Migrating custom renderers](https://learn.microsoft.com/en-us/dotnet/maui/migration/custom-renderers?view=net-maui-11.0) · [What's new in .NET MAUI 11](https://learn.microsoft.com/en-us/dotnet/maui/whats-new/dotnet-11?view=net-maui-11.0)

## 11. Other improvements worth knowing about

Although the focus of this tutorial is Shell, there are a couple of related .NET MAUI 11 features worth mentioning.

### Badges for TabbedPage

Applications that use `TabbedPage` instead of Shell can also take advantage of new badge support.

The properties are exposed as attached properties on `TabbedPage`.

```xml
<ContentPage
    Title="Inbox"
    TabbedPage.BadgeText="3"
    TabbedPage.BadgeColor="Red"
    TabbedPage.BadgeTextColor="White" />
```

This provides similar functionality to Shell badges without requiring the application to migrate its navigation structure.

The companion application includes a standalone `TabbedPage` demonstration. It temporarily switches the window root away from Shell, allows the badge states to be exercised, and then restores the original Shell.

On the Pixel 8a, the test confirmed the initial badge value of 3 and exercised the dot and hidden controls.

### Defining Shell in C#

The new .NET MAUI 11 C# UI template provides an alternative to XAML-based application layouts.

Developers can use:

```bash
dotnet new maui --ui csharp
```

This generates an application with its UI defined in C#, including the Shell hierarchy.

It's primarily an authoring choice rather than a new Shell navigation capability, but it may be useful for developers who prefer defining their interface programmatically.

**Try it in the sample:** Open **Guide** or **Native lab** to launch the `TabbedPage` demonstration and explore the C# UI template information.

The relevant files are `Views/NativeLabPage.cs` and `Views/GuidePage.cs`.

**Reference:** [What's new in .NET MAUI 11](https://learn.microsoft.com/en-us/dotnet/maui/whats-new/dotnet-11?view=net-maui-11.0)

## Validation and compatibility

The companion sample has been built and exercised against a specific set of framework and platform versions.

The validation environment used:

| Component | Version |
|---|---|
| .NET SDK | 11.0.100 |
| MAUI Controls | 11.0.10 |
| CommunityToolkit.Mvvm | 8.4.2 |
| Physical test device | Google Pixel 8a |
| Android version | Android 17 / API 37 |
| Additional Android environment | API 35 emulator |

The Android Debug application build completed successfully with zero warnings and zero errors.

On the Pixel 8a, **26 out of 26 automated assertions passed** using the final standalone Debug APK.

These included seven badge-binding checks and nineteen Shell navigation checks. The navigation tests exercised actual MAUI route parsing and parameter delivery, including constrained parameters, optional and default values, catch-all routes, precedence rules and invalid navigation scenarios.

The same automated assertions also passed on the Android API 35 emulator before the native toolbar subtitle was added.

Additional on-device checks confirmed the overflow menu order, custom back-button accessibility label, tab reselect navigation, `TabbedPage` badge controls, active Shell handler and native toolbar subtitle.

There are some important limits to that validation.

The badge assertions verify bound property values rather than pixel-perfect rendering. The back button's accessibility label was present in the native accessibility hierarchy, but spoken TalkBack output wasn't assessed. The native transition override was invoked, but not every transition or gesture combination was visually tested.

### Apple and Windows validation

The following Apple configurations passed their C# Compile targets with zero warnings and zero errors:

- iOS simulator with the new Shell handlers.
- Mac Catalyst with the new Shell handlers.
- Mac Catalyst using the compatibility renderer.

These checks used `-t:Compile -p:ValidateXcodeVersion=false` to validate C# compilation and referenced APIs only.

A complete Mac Catalyst build couldn't be completed because the installed Xcode version was 26.2, while the installed .NET Apple workload required Xcode 27.2.

Consequently, these compile results shouldn't be interpreted as successful full Apple builds or runtime verification. The Apple handlers, native appearance customisations and navigation behaviour still require testing on compatible Apple development tooling and devices.

Windows builds, NativeAOT publishing and Apple application runtime behaviour also remain unvalidated.

The results establish that the tested examples work within the stated Android environment. They don't establish identical behaviour across every supported platform or future servicing release.

For further validation, the companion repository includes `docs/manual-checks.md`, `docs/tutorial-validation.md` and the Android assertion reports.

## Conclusion

.NET MAUI 11 provides a meaningful update to Shell, with improvements that benefit both new applications and existing projects.

The addition of badges removes a common reason for writing platform-specific navigation code. Route templates make URI navigation more expressive and provide an approach familiar to developers working with ASP.NET Core.

The most significant change, however, is the new handler architecture. Android now uses handlers by default, while iOS and Mac Catalyst have an opt-in implementation that provides similar opportunities for customisation.

This makes it possible to extend more of Shell's native behaviour without relying on the older renderer architecture. There are new extension points for tab selection, toolbar appearance and navigation transitions, although these remain platform-specific rather than entirely cross-platform APIs.

The [companion application](https://github.com/tonyedwardspz/maui-11-shell-demo) also demonstrates why testing these changes on real devices matters. Some APIs work exactly as expected, while others, such as native toolbar title colours, can interact with Shell's own appearance processing in ways that aren't immediately obvious from the API alone.

For applications already using Shell, there's no requirement to adopt every change immediately. The new capabilities can be introduced incrementally, with handler migration receiving particular attention where an application already relies on custom renderer code.

Shell isn't being replaced in .NET MAUI 11. It's being modernised, and the result is a navigation system that developers can extend more easily while retaining the native experience that Shell was designed to provide.

---

## Additional references and MAUI source

The following resources provide further information about the changes discussed in this tutorial.

- [What's new in .NET MAUI 11](https://learn.microsoft.com/en-us/dotnet/maui/whats-new/dotnet-11?view=net-maui-11.0)
- [Shell custom handlers](https://learn.microsoft.com/en-us/dotnet/maui/fundamentals/shell/custom-handlers?view=net-maui-11.0)
- [Shell navigation](https://learn.microsoft.com/en-us/dotnet/maui/fundamentals/shell/navigation?view=net-maui-11.0)
- [Shell tabs and badges](https://learn.microsoft.com/en-us/dotnet/maui/fundamentals/shell/tabs?view=net-maui-11.0)
- [Toolbar items and overflow menus](https://learn.microsoft.com/en-us/dotnet/maui/user-interface/toolbaritem?view=net-maui-11.0)
- [Android Shell handler implementation](https://github.com/dotnet/maui/pull/34758)
- [Apple Shell handler implementation](https://github.com/dotnet/maui/pull/37034)
- [Route templates implementation](https://github.com/dotnet/maui/pull/35110)
- [Shell badge implementation](https://github.com/dotnet/maui/pull/34659)
- [Toolbar badge implementation](https://github.com/dotnet/maui/pull/34669)
- [Android ShellToolbarAppearanceTracker source, MAUI 11.0.10](https://github.com/dotnet/maui/blob/11.0.10/src/Controls/src/Core/Compatibility/Handlers/Shell/Android/ShellToolbarAppearanceTracker.cs)
