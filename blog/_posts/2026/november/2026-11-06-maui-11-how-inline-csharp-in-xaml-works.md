---
title: How inline C# in XAML works behind the scenes in .NET MAUI
tag:
    - dotnet maui
    - programming
---

One of the more interesting additions to .NET MAUI 11 is the ability to write C# directly inside XAML files using the new `x:Code` directive.

I've previously written about [C# expressions in XAML](https://tonyedwardspz.co.uk/blog/c-sharp-expressions-in-xaml/), which allow us to replace simple converters, calculated properties and some event handlers with inline expressions. The new `x:Code` directive takes this a little further, allowing us to define methods, fields and properties without needing to move into a separate code-behind file.

It's an interesting addition to the XAML source generator, so let's have a look at how it works, where it might be useful, and how the team has implemented it.

## Getting started

First, we need to enable XAML source generation and preview features in our project file:

```xml
<PropertyGroup>
    <MauiXamlInflator>SourceGen</MauiXamlInflator>
    <EnablePreviewFeatures>true</EnablePreviewFeatures>
</PropertyGroup>
```

With that in place, we can use `x:Code` directly inside our XAML pages.

### Example 1: A simple counter

Let's start with a button that increments a counter whenever it's clicked.

```xml
<ContentPage
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    x:Class="MyApp.MainPage">

    <x:Code><![CDATA[
        private int _count;

        void OnCounterClicked(object sender, EventArgs e)
        {
            _count++;
            CounterLabel.Text = $"Clicked {_count} times";
        }
    ]]></x:Code>

    <VerticalStackLayout
        Padding="20"
        Spacing="12">

        <Label
            x:Name="CounterLabel"
            Text="Clicked 0 times" />

        <Button
            Text="Increment"
            Clicked="OnCounterClicked" />

    </VerticalStackLayout>
</ContentPage>
```

Nothing particularly complicated here. We're declaring a private field and an event handler directly inside our XAML, then referencing the handler from the button.

Previously, we'd have placed these members in `MainPage.xaml.cs`. With `x:Code`, everything needed for this simple interaction lives in the same file.

### Example 2: Handling CollectionView selection

For something a little more practical, let's use `x:Code` to handle an item being selected from a `CollectionView`.

```xml
<ContentPage
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    x:Class="MyApp.PropertiesPage">

    <x:Code><![CDATA[
        async void OnSelectionChanged(
            object sender,
            SelectionChangedEventArgs e)
        {
            if (e.CurrentSelection.FirstOrDefault()
                is not Property property)
                return;

            await Shell.Current.GoToAsync(
                $"property/{property.Id}");
        }
    ]]></x:Code>

    <CollectionView
        ItemsSource="{Binding Properties}"
        SelectionMode="Single"
        SelectionChanged="OnSelectionChanged">

        <CollectionView.ItemTemplate>
            <DataTemplate x:DataType="local:Property">
                <Label
                    Text="{Binding Name}"
                    Padding="12" />
            </DataTemplate>
        </CollectionView.ItemTemplate>

    </CollectionView>
</ContentPage>
```

*This example assumes a `Property` model, a `Properties` binding and a registered Shell route. The usual namespace declaration for `local` is also required.*

Here, the event handler belongs specifically to the page and performs a simple navigation action. Keeping it alongside the XAML makes it easier to see how the selection event is handled without switching between files.

For more complicated navigation or business logic, I'd still favour a ViewModel or separate C# implementation. The value here is having the option to keep small amounts of view-specific code close to where they're used.

## How does it work?

The implementation was introduced by Stéphane Delcroix in [PR #34715](https://github.com/dotnet/maui/pull/34715), which adds a third pipeline to the XAML source generator.

Previously, the generator handled code-behind declarations and `InitializeComponent` generation. The new implementation adds a step between those two operations:

```text
XAML
  |
  +-- CodeBehind generation
  |
  +-- x:Code generation
  |
  +-- InitializeComponent generation
```

This order is important. By generating the inline C# before `InitializeComponent`, the compiler can resolve methods referenced by XAML event handlers.

Looking at the source, two components are particularly relevant:

- `ComputeXCodeSource()` extracts the inline code from the parsed XAML.
- `XCodeCodeWriter` generates a separate C# partial class containing the extracted members.

The generator produces a file with a name following this pattern:

```text
MainPage.xaml.xcode.cs
```

For our counter example, the generated code is conceptually equivalent to:

```csharp
namespace MyApp
{
    partial class MainPage
    {
        private int _count;

        void OnCounterClicked(object sender, EventArgs e)
        {
            _count++;
            CounterLabel.Text = $"Clicked {_count} times";
        }
    }
}
```

*This is a simplified representation of the generated output, rather than a verbatim extract.*

Because the generated class is partial, its members are available alongside those in the usual code-behind file. We can even reference other methods and properties declared on the page.

There's another nice implementation detail here. The generator automatically moves `using` directives out of the inline block and places them at the top of the generated C# file, removing duplicates along the way.

That means the following is also valid:

```xml
<x:Code><![CDATA[
    using System.Diagnostics;

    private int _clickCount;

    void OnButtonClicked(object sender, EventArgs e)
    {
        _clickCount++;
        Debug.WriteLine($"Clicked {_clickCount} times");
    }
]]></x:Code>
```

The source generator takes care of arranging the code into a valid C# file, while the normal C# compiler remains responsible for checking the method bodies.

## What about the visual tree?

One detail I particularly like is that `x:Code` doesn't become part of the visual tree.

The implementation explicitly excludes these elements from the visitors responsible for generating controls, setting properties and registering names. The directive exists purely for code generation, so there's no additional runtime control or corresponding visual element.

There are a few restrictions. The directive must be a direct child of the root XAML element, and the root must declare `x:Class`.

The team has also introduced diagnostics for incorrect usage, including `MAUIX2015` when the directive isn't a direct child of the root and `MAUIX2016` when `x:Class` is missing.

## Should we use it?

I can see this being useful for small, view-specific event handlers and helper methods. Keeping a few lines of presentation logic alongside the XAML they belong to could make a page easier to understand, particularly when prototyping or building relatively simple views.

That doesn't mean we should start moving large amounts of code-behind into XAML. For anything more complicated, a separate C# file is probably still easier to read, maintain and test.

For me, the more interesting story is what's happening underneath. The team continues to expand what the XAML source generator can do, moving more work into the build process while giving developers additional ways to structure their applications.

It's worth experimenting with, particularly alongside the new C# expressions feature. Just remember that both are still preview features in .NET 11.

## References and further reading

- [My earlier guide to C# expressions in XAML](https://tonyedwardspz.co.uk/blog/c-sharp-expressions-in-xaml/)
- [Inline C# implementation — PR #34715, Stéphane Delcroix](https://github.com/dotnet/maui/pull/34715)
- [XCodeCodeWriter source code](https://github.com/dotnet/maui/blob/net11.0/src/Controls/src/SourceGen/XCodeCodeWriter.cs)
- [XAML compilation documentation](https://learn.microsoft.com/en-us/dotnet/maui/xaml/xamlc?view=net-maui-11.0)
- [What's new in .NET MAUI 11](https://learn.microsoft.com/en-us/dotnet/maui/whats-new/dotnet-11)