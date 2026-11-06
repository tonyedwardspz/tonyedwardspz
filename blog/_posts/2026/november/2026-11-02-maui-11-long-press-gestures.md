---
title: Long Press Gestures Are Finally Built Into .NET MAUI 11
tag:
    - dotnet maui
    - programming
omit: true
---

Sometimes it's the smaller additions to .NET MAUI that make the biggest difference to everyday development. One such improvement in .NET 11 is the introduction of `LongPressGestureRecognizer`, bringing native support for press-and-hold interactions directly into the framework.

Until now, implementing a long press in MAUI generally meant reaching for something like the .NET MAUI Community Toolkit's `TouchBehavior`, or writing your own platform-specific implementation. With .NET 11, long press joins the existing family of gesture recognizers, alongside tap, swipe, pan and pinch.

## Getting started

The new recognizer works much like the existing `TapGestureRecognizer`. You attach it to a view through its `GestureRecognizers` collection and configure what happens when a long press is detected.

For example, suppose you have an image representing a property and want to display additional actions when the user presses and holds it.

```xml
<Image Source="property.jpg">
    <Image.GestureRecognizers>
        <LongPressGestureRecognizer
            MinimumPressDuration="750"
            AllowableMovement="10"
            Command="{Binding ShowActionsCommand}"
            CommandParameter="{Binding .}" />
    </Image.GestureRecognizers>
</Image>
```

Here, `MinimumPressDuration` specifies how long the user must hold their finger down, in milliseconds, while `AllowableMovement` determines how far their finger can move before the gesture is cancelled. The recognizer also supports `Command` and `CommandParameter`, making it straightforward to integrate with an MVVM application.

If you'd rather handle the interaction in code-behind, you can use the `LongPressed` event instead.

```csharp
private void OnLongPressed(
    object sender,
    LongPressedEventArgs e)
{
    var position = e.GetPosition((View)sender);

    // Handle the long press.
}
```

The `GetPosition` method is particularly useful when you need to know where the user pressed, perhaps to display a contextual menu near their finger.

## A look under the hood

Digging into the [MAUI source code](https://github.com/dotnet/maui/blob/net11.0/src/Controls/src/Core/LongPressGestureRecognizer.cs), there's an interesting detail in how the recognizer handles commands and events.

The following is a shortened extract from `LongPressGestureRecognizer.SendLongPressed`:

```csharp
var cmd = Command;

if (cmd != null && cmd.CanExecute(CommandParameter))
    cmd.Execute(CommandParameter);

LongPressed?.Invoke(
    sender,
    new LongPressedEventArgs(CommandParameter, getPosition));
```

Rather than requiring developers to choose between commands and events, the implementation supports both. When a successful long press completes, MAUI checks whether the bound command can execute, invokes it if permitted, and then raises the `LongPressed` event.

There's also a separate `LongPressing` event for monitoring gesture state changes, including `Started`, `Running`, `Completed` and `Canceled`. This provides opportunities for more interactive experiences, such as showing visual feedback while the user continues holding their finger down.

## A few platform differences

Although the API is cross-platform, the underlying implementations aren't identical. On iOS and Mac Catalyst, MAUI uses the native `UILongPressGestureRecognizer`, while Android uses its native `GestureDetector` and Windows uses a timer-based implementation.

One important difference is that **Android ignores `MinimumPressDuration`** and instead uses the system's default long-press timeout, typically around 400 milliseconds. Additionally, continuous gesture state updates are available on iOS and Mac Catalyst, while Android and Windows provide completion and cancellation updates.

These differences are worth considering if you're building an interaction that depends on precise timing or continuous feedback across platforms.

## Wrapping up

`LongPressGestureRecognizer` isn't a groundbreaking addition to .NET MAUI, but it's a welcome one. Bringing commonly used interactions into the framework means fewer dependencies, less platform-specific code and a more consistent development experience.

It's also encouraging to see improvements like this continuing alongside the larger architectural and performance changes coming in .NET 11.

If you're interested in exploring the implementation further, Gerald Versluis's [pull request #33432](https://github.com/dotnet/maui/pull/33432) is worth a look. You can also find usage examples and platform-specific guidance in the [official Microsoft documentation](https://learn.microsoft.com/en-us/dotnet/maui/fundamentals/gestures/long-press?view=net-maui-11.0).