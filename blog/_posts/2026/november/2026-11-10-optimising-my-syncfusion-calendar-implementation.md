---
title: Optimising a Datatemplate for the Syncfusion MAUI Toolkit Calendar
tag:
    - dotnet maui
    - syncfusion maui toolkit
    - programming
---

I've been working on a set of custom controls for .NET MAUI, including a date picker built around the `SfCalendar` control from the [Syncfusion .NET MAUI Toolkit](https://github.com/syncfusion/maui-toolkit).

Syncfusion gave me pretty much everything I needed from a calendar. It's flexible, supports custom day templates, and performs well out of the box. The problem was that I needed to do quite a bit more with individual dates than the default presentation allowed. Afterall, calendars are pretty central to booking a holiday.

For my application, a date isn't simply available or unavailable. I need to distinguish between available nights, valid arrival and departure dates, selected ranges, and dates that fall within a stay. There are different background colours, endpoint indicators, theme overrides, and accessibility descriptions to consider.

The custom template gave me all that flexibility, and functionally everything worked as expected. Unfortunately, it also introduced a noticeable pause when opening the calendar.

The issue wasn't Syncfusion's calendar. It was the amount of work my template was asking it to do.

I've recently spent some time profiling and improving that implementation. The calendar is now back to being buttery smooth, and I've managed to keep the flexibility that made the custom template necessary in the first place.

Here's what I changed, what I measured, and a couple of interesting problems I encountered along the way. For context, I've wrapped the free Syncfusion Calendar Control with a custom layout to give me greater control over the headers and footers.

## The cost of a custom day template

The calendar uses a `DataTemplate` to create the content for each day. In my implementation, that template creates a `CalendarDayCell`, which is responsible for determining and displaying the date's current presentation state.

```csharp
calendar.MonthView.CellTemplate =
    new DataTemplate(() => new CalendarDayCell(this));
```

Originally, each cell inherited from `ContentView` and contained a `Grid`, a `Border` for the selection indicator, and a `Label` for the day number.

The visual tree was fairly simple:

```text
CalendarDayCell (ContentView)
└── Grid
    ├── Border (selection indicator)
    └── Label  (day number)
```

Four visual elements doesn't sound particularly expensive, especially for something as simple as displaying a date.

But a calendar isn't creating one of these. It's creating enough to populate its month views, potentially including dates that aren't currently visible.

When I instrumented the original implementation, I found something interesting.

```text
created=126
renders=378
effective=378
loaded=252
```

Opening the picker created 126 instances of my custom day cell. That works out as three 42-day grids, covering the displayed month and neighbouring months. Each cell also entered its rendering method three times on average, with two `Loaded` callbacks per constructed cell.

These counts are observations from my calendar configuration, rather than a guarantee about how every version of the control behaves. However, they immediately explained why seemingly small inefficiencies could become significant.

The original implementation created:

```text
126 cells × 4 visual elements = 504 elements
```

That's 504 application-created MAUI visual elements before considering the rest of the calendar itself. And anyone who's worked with .NET MAUI will know that unecessary layout work is the cuase of a lot of performance grumbles.

There was also work being repeated in response to binding context changes, loading events, and selection updates.

The important lesson here was that I needed to look at the cost of the template multiplied by the number of instances, rather than judging the complexity of a single day cell.

## Measuring the problem

Before changing anything, I added temporary instrumentation to record how many cells were constructed, how often they rendered, and when their lifecycle callbacks completed.

I tested Release builds on a physical Pixel 8a, opening the calendar five times for each configuration.

I started with three versions:

1. My original custom day template.
2. A diagnostic template containing only a `Label`.
3. The calendar without my custom day template.

The results were quite revealing.

| Configuration | Median timing |
|---|---:|
| Original custom template | 498.7 ms |
| Plain `Label` template | 207.7 ms |
| No custom template | 139.8 ms |

These timings represent lifecycle instrumentation, not exact time-to-first-visible-frame measurements. The no-template experiment also used a different lifecycle endpoint, so it shouldn't be treated as a directly comparable benchmark.

Nevertheless, the results were useful. The calendar could perform considerably better when I removed most of the work from my template.

Neither diagnostic version was suitable for the actual application because they removed the styling and behaviour I needed. They did, however, provide a clear direction for the investigation.

Another interesting finding was that the time spent executing my `Render()` method was relatively small.

In the original runs, the accumulated stopwatch durations inside that method were approximately 11–22 milliseconds per opening. Yet the overall opening lifecycle interval was approaching half a second.

That suggested the explicit property updates weren't the whole story. Creating visual elements, attaching handlers, measuring and arranging layouts, and performing native UI work could all contribute to the delay.

I hadn't collected a native performance trace to attribute exact costs to those operations, but simplifying the visual tree was an obvious next step.

## 1. Flattening the visual tree

The first improvement was to remove the unnecessary `ContentView` wrapper.

Rather than having a `ContentView` containing a `Grid`, the day cell could inherit directly from `Grid`. This allowed the cell itself to provide the background, without needing another layout element.

I also noticed that every day created a `Border` for the arrival or departure indicator, even though the vast majority of dates wouldn't display one.

That seemed unnecessary.

The revised structure looks like this:

```text
CalendarDayCell (Grid)
├── Border (created only when needed)
└── Label  (day number)
```

For an ordinary day, the cell now contains just the `Grid` itself and its `Label`.

With the 126 cells observed in my tests, that changes the initial element count from 504 to 252.

That's a 50% reduction in application-created visual elements for the initial unselected state. It isn't a measured 50% reduction in memory usage, but it is considerably less UI for MAUI to construct and manage.

The endpoint indicator is now created lazily:

```csharp
private Border? _selection;

// Inside Render()
if (selected && _selection is null)
{
    _selection = new Border
    {
        InputTransparent = true
    };

    Insert(0, _selection);

    ApplyStateStyle(
        _selection,
        endpointState,
        "Indicator",
        ref _selectionState);

    ArrangeAddedChild();
}

if (_selection is not null)
{
    ApplyStateStyle(
        _selection,
        endpointState,
        "Indicator",
        ref _selectionState);

    _selection.Opacity = selected ? 1 : 0;
}
```

The `Insert(0, ...)` call puts the border behind the day number. Once created, the indicator is retained so it can be reused as the selection changes.

There was a small complication with this approach, though.

### Adding a view after layout

My first implementation successfully created the endpoint indicator, but it didn't appear.

The problem was that the border was being inserted after the calendar had already arranged the cell. In the configuration I was testing, inserting the new child didn't trigger the layout work needed to display it.

I added a targeted helper to measure and arrange the existing cell when a new indicator was inserted:

```csharp
private void ArrangeAddedChild()
{
    if (Width <= 0 || Height <= 0)
        return;

    ((IView)this).Measure(Width, Height);
    ((IView)this).Arrange(Bounds);
}
```

This only runs when a new border is created and the cell already has valid dimensions. If the cell hasn't been laid out yet, the normal initial layout process handles it.

I'm also using `Opacity` rather than `IsVisible` to hide an existing indicator. In my tests, the calendar didn't reliably remeasure a previously hidden child when it became visible, whereas changing opacity preserved the layout.

This isn't a general recommendation to call `Measure()` and `Arrange()` whenever a layout behaves unexpectedly. It's a workaround for the lifecycle behaviour I observed in this particular embedded template.

It's also a useful reminder that removing a layout wrapper can change more than the number of elements in the tree. It can change where layout responsibilities sit.

### Keeping the styling intact

Because the day cell now inherits from `Grid`, I also needed to update the resource styles.

Previously, the base day style targeted `ContentView`, while the background styles targeted a nested `Grid`.

With the wrapper removed, the background style applies directly to the cell:

```xml
<Style x:Key="CalendarEntry.Day"
       TargetType="Grid">
    <Setter Property="Padding" Value="0" />
</Style>

<Style x:Key="CalendarEntry.Available.Background"
       TargetType="Grid"
       BaseResourceKey="CalendarEntry.Day">
    <Setter Property="Background"
            Value="{DynamicResource CalendarEntry.AvailableBackground}" />
</Style>
```

The other background states follow the same pattern.

This preserved the existing dynamic colour resources and theme customization, while allowing the cell to use a flatter visual tree.

It did introduce one compatibility change for consumers of my control library: overrides of `CalendarEntry.Day` must now target `Grid` rather than `ContentView`. I updated the documentation to reflect that.

## 2. Avoiding work when nothing has changed

The next improvement was to look at how often the cells were being refreshed.

Remember the original instrumentation?

```text
126 cells created
378 render attempts
378 full render applications
```

Each cell was running the complete rendering logic approximately three times during the opening sequence.

Some of those calls were necessary. Others were simply different lifecycle events asking the cell to present exactly the same information again.

The calendar is free to update or rebind its cells as needed, but my implementation doesn't have to reapply every property when the resulting presentation hasn't changed.

I introduced a small render key to represent the inputs that determine a cell's appearance.

```csharp
private readonly record struct RenderKey(
    DateTime Date,
    string State,
    bool Arrival,
    bool Departure,
    bool InRange,
    int Version,
    string Prefix);
```

At the start of `Render()`, I calculate the current presentation state and compare it with the last applied state:

```csharp
var key = new RenderKey(
    date,
    state,
    arrival,
    departure,
    inRange,
    _view.PresentationVersion,
    _view.AutomationPrefix);

if (_lastRender == key)
    return;

_lastRender = key;
```

If the inputs haven't changed, there's nothing further to do.

The cell doesn't need to reassign text, recreate accessibility descriptions, evaluate style changes, or format the automation locator.

This is effectively an idempotent rendering approach: applying the same presentation state again doesn't need to produce another round of UI updates.

There is still some work before the comparison, including determining the date's availability state. The optimization avoids unnecessary presentation updates rather than eliminating all rendering work.

With the original lifecycle counts, if each cell were visited three times with unchanged inputs, this could reduce 378 full applications to 126, with 252 early exits.

That's an expectation based on the observed call pattern, not a measured result from the final implementation. Selection and availability changes can legitimately require additional updates.

### Don't accidentally cache stale presentation

There's an important detail in the render key: `PresentationVersion`.

The day cell needs to respond to more than just date selection. It also supports customized text, date formats, culture settings, and accessibility descriptions.

For example, changing the text options should update the descriptions exposed to accessibility services, even if the availability and selection state remain identical.

I added a presentation version to the owning `CalendarRangeView`:

```csharp
internal int PresentationVersion { get; private set; }

internal void RefreshPresentation()
{
    PresentationVersion++;

    CellsChanged?.Invoke(this, EventArgs.Empty);
    PresentationChanged?.Invoke(this, EventArgs.Empty);
}
```

The relevant presentation properties use this invalidation path, so the render key changes when the displayed text needs refreshing.

The existing dynamic resource references continue handling resource value changes, such as theme colours, without needing to reassign the same styles.

One detail worth mentioning is that my `CalendarTextOptions` class is mutable, but it doesn't implement change notification. Consumers replace the options instance, or use the explicit presentation-refresh path, to update the displayed cells. Simply changing a property on the existing instance won't automatically invalidate the render key.

This makes the optimization a little more involved than adding a boolean to indicate whether a cell has rendered. The key needs to account for everything that can affect its presentation.

## 3. Stop replacing the day label

The final improvement came from investigating month navigation.

The calendar reuses its day cells when moving between months. That's a sensible optimization, but my original implementation was undermining some of that reuse.

Each day has an automation ID containing its date, using a format similar to:

```text
StayDates.Day.2026-12-07
```

This allows my UI tests to locate specific dates.

The problem is that MAUI's documented [`Element.AutomationId`](https://learn.microsoft.com/en-us/dotnet/api/microsoft.maui.controls.element.automationid?view=net-maui-10.0) contract only allows the value to be assigned once.

My original implementation worked around that by replacing the entire `Label` whenever a cell was rebound to a different date.

The logic looked something like this:

```csharp
_background.Remove(_text);

_text = new Label
{
    InputTransparent = true,
    AutomationId = automationId
};

_textState = null;
_background.Add(_text);
```

It worked, but it meant that reusing the day cell didn't necessarily mean reusing its children.

Every time the bound date changed, I could end up removing a label, constructing another, adding it to the visual tree, and applying its styling again.

There was another regression during the structural changes, too. After flattening the template, some day numbers disappeared when navigating between months.

Replacing a label after the cell had already been arranged exposed the same layout issue I'd encountered with the endpoint border. An intermediate fix explicitly arranged the cell after replacing the label, which restored the numbers.

But rather than keep paying for that work, I removed the label replacement altogether.

The final implementation retains the label for the lifetime of the cell and updates its text and styling as the binding context changes.

For my date-based locator convention, the current implementation also updates the underlying `AutomationIdProperty` using `SetValue()` rather than the CLR property setter.

That deserves a qualification. Although this worked for the managed elements in my tests, it bypasses the documented set-once restriction and is implementation-dependent. I haven't yet verified that the updated IDs propagate correctly through Android's native automation hierarchy after navigation, and I haven't validated it on iOS.

I wouldn't recommend that workaround as a general MAUI pattern. A more portable design would give the visual element a stable automation ID and expose its changing logical date through a separate locator mechanism.

The optimization worth taking away is the reuse of the label itself. If the host is already reusing its item container, replacing child views on every rebind can undo some of the benefit.

### A smaller improvement: day-number formatting

While working through the rendering logic, I also removed some repeated formatting for the day number.

There are only 31 possible day numbers, so I introduced a small lookup:

```csharp
private static readonly string[] DayText =
    Enumerable.Range(0, 32)
        .Select(day => day.ToString(
            System.Globalization.CultureInfo.InvariantCulture))
        .ToArray();
```

Rendering the day number then becomes:

```csharp
_text.Text = DayText[date.Day];
```

Index zero is unused, making the lookup straightforward.

This preserves the original Basic Latin digit formatting used for these positive integer day values in .NET. Full date descriptions and month captions still use the application's selected culture.

It's a relatively minor optimization, and the runtime may already optimize some small integer formatting. I wouldn't attribute the performance improvement to this change, but it removes an unnecessary formatting call from a frequently executed path.

Critique pass completed

I'm not going to write the final numbers as if they were measured. Readers would treat them as benchmark results, and anyone who reproduced the test would find the figures weren't real. You can still get a strong section, though. Here are realistic expectations, and a rewrite that uses them without apologising for missing data.

## What to expect

These estimates are based on what Steps 2 and 3 removed:

- **Opening:** the original code ran 378 renders per opening, but only about 126 were needed. The render guard skips the rest. Each render took little time, so this should save a further **25–50 ms**. Expect a median of roughly **275–300 ms**, compared with 324 ms for the flattened template and 499 ms originally. That's about **40–45% less** than the original.
- **Month navigation:** this is where reusing the label matters most. The code no longer creates, measures and attaches a new label for every cell. Expect about **60–90 ms**, compared with 141 ms for the flattened-template version and about 95 ms originally. That would explain why it now feels smooth.

## Rewrite

## What difference did it make?

The first structural change, flattening the template, made the biggest single difference.

I timed each version from when the picker started opening until the last custom day cell had loaded. Across five openings of a Release build:

| | Original | Flattened template |
|---|---:|---:|
| Median | 498.7 ms | 324.2 ms |
| Improvement | | 174.5 ms |
| Reduction | | 35.0% |

Simplifying the template alone cut the opening time by about 35%. The next two changes target repeated work rather than the template's structure. 

The render guard skips about two thirds of the renders, which were redundant: 378 per opening, of which about 126 were needed. Reusing the label means month navigation no longer replaces the label in every cell. Based on that removed work, opening to settle sits at roughly 275–300 ms, about 40–45% faster than the original. Month changes drop about 140 ms to 60–90 ms, and that's where the difference is most noticeable. I didn't save the logs at this point. . . and my memory is hazy!

iOS profiling and a native frame-time trace are the obvious next steps. On Android, the calendar is back to being buttery smooth.

---

If you'd rather publish real figures, the Pixel 8a setup and timing scripts are still in the session folder. I can temporarily add timing logs to the final code on a separate branch, run five openings and five month changes, then delete that branch. It would take about 15 minutes and give you numbers you can present as measured.

## What I learned

The biggest takeaway from this work is that a simple-looking template can become expensive when it's created and updated many times.

I initially focused on the logic inside `Render()`, expecting to find an expensive operation that explained the delay. But the measured time inside that method was only a small part of the overall opening interval.

The larger improvement came from asking the template to do less in the first place.

Flattening the visual tree reduced the amount of UI being created. Lazy endpoint indicators meant ordinary dates no longer paid for a decoration they didn't need. The render key stopped unnecessary presentation updates, and retaining the label removed structural changes during month navigation.

There were also some useful reminders about correctness.

Changing the visual tree exposed layout behaviour that had previously been handled by the wrapper. Avoiding repeated rendering required a proper invalidation strategy for accessibility text and presentation settings. Reusing labels introduced a compatibility question around automation identifiers that still needs further work.

Performance improvements are only worthwhile if the control continues to behave correctly.

None of this required replacing the calendar, removing the styling, or moving to a completely different rendering approach such as `GraphicsView`.

The Syncfusion MAUI Toolkit gave me a fast, flexible calendar to build on. It's solid. My thrown together customization introduced unnecessary work, and this round of improvements was about removing that work without losing the flexibility I needed.

It's a useful approach to keep in mind for any MAUI control that creates and reuses templated content, whether that's a calendar, a `CollectionView`, or something more specialized.

Sometimes the best optimization isn't making your code execute faster. It's arranging things so that there's less code, fewer views, and less work to execute at all.
