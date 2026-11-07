---
title: Native badges for Shell tabs in .NET 11
tag:
    - dotnet maui
    - programming
---

Badges are a small but useful part of many mobile applications. Whether you're displaying unread messages, pending notifications, or simply indicating that something needs attention, they're a familiar way to communicate information without requiring the user to navigate away from their current page.

Until now, adding badges to Shell tabs in .NET MAUI typically meant writing platform-specific code or introducing a third-party solution. With .NET MAUI 11, the team introduced [native badge support for Shell tabs](https://learn.microsoft.com/en-us/dotnet/maui/fundamentals/shell/tabs?view=net-maui-11.0), making the process considerably simpler.

The feature is available across Android, iOS, Mac Catalyst, and Windows, with support for badge text, background colours, and text colours.

## Adding a badge to a Shell tab

Three new bindable properties have been added to `BaseShellItem`:

- `BadgeText` defines the text or number displayed.
- `BadgeColor` sets the background colour.
- `BadgeTextColor` sets the text colour.

To use them, add the properties to a `ShellContent` or `Tab` within your Shell definition.

```xml
<TabBar>
    <ShellContent
        Title="Home"
        Icon="home.png"
        ContentTemplate="{DataTemplate views:HomePage}" />

    <ShellContent
        Title="Notifications"
        Icon="notifications.png"
        BadgeText="5"
        BadgeColor="Red"
        BadgeTextColor="White"
        ContentTemplate="{DataTemplate views:NotificationsPage}" />
</TabBar>
```

That's all that's required! The Notifications tab now displays a native badge containing the number 5, using the appropriate platform implementation.

Because these are bindable properties, you can also connect them to your application's state. For example, if you're tracking unread notifications in a view model, you can bind the badge directly to a property:

```xml
<ShellContent
    Title="Notifications"
    Icon="notifications.png"
    BadgeText="{Binding UnreadBadgeText}"
    ContentTemplate="{DataTemplate views:NotificationsPage}" />
```

As long as your binding source raises property change notifications, updates to `UnreadBadgeText` are reflected in the badge without additional platform code.

## More than just numbers

One useful detail is how `BadgeText` handles different values. The team has implemented three distinct behaviours:

| Value | Behaviour |
|---|---|
| `"5"` | Displays a badge containing 5 |
| `""` | Displays a dot indicator |
| `null` | Hides the badge |

This makes it possible to use the same API for both notification counts and simple status indicators.

For example, you might want to display a dot when new content is available without exposing the number of items. Setting `BadgeText` to an empty string does exactly that.

You can also leave `BadgeColor` and `BadgeTextColor` unset to use the platform defaults, allowing the badge to follow the native appearance.

## How does it work?

The implementation is worth a closer look. In [PR #34659](https://github.com/dotnet/maui/pull/34659), Gerald Versluis introduced the new properties and connected them to the native badge implementations on each platform.

Rather than drawing a custom badge, the team uses the capabilities already provided by the operating system.

On Android, badges use Material's `BadgeDrawable`, obtained through `BottomNavigationView.GetOrCreateBadge()`. The implementation can display a numeric badge or call `ClearNumber()` to switch to a dot indicator.

On iOS and Mac Catalyst, the implementation uses `UITabBarItem.BadgeValue`, with additional APIs for configuring the badge colours.

Windows takes a slightly different approach, using the WinUI `InfoBadge` control within the navigation item template. Numeric values are displayed as counts, while non-numeric values are represented by a dot.

This is an important distinction if you're planning to display arbitrary text. Although the public API accepts a string, the visual result isn't identical across platforms.

It's also interesting that these properties live on `BaseShellItem`, rather than being implemented separately for each navigation element. This gives the different Shell navigation items a common API, while their respective platform implementations decide how the badges are displayed. The initial implementation focuses on bottom tabs, rather than flyout items or top tabs.

## Wrapping up

Native Shell badges are a welcome addition to .NET MAUI 11. They're straightforward to configure, support data binding, and remove the need to maintain platform-specific implementations for a common UI feature.

I particularly like the distinction between an empty string and `null`. It's a small API decision, but it makes switching between a notification count, a simple dot indicator, and no badge at all surprisingly easy.

You can explore the feature in the [Shell tab documentation](https://learn.microsoft.com/en-us/dotnet/maui/fundamentals/shell/tabs?view=net-maui-11.0), or take a look at the [original implementation on GitHub](https://github.com/dotnet/maui/pull/34659), which also includes unit tests, UI tests, and an interactive sample.

Credit to Gerald Versluis and the .NET MAUI team for bringing this into the framework 🙌