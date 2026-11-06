---
title: A closer look at XAML Incremental Hot Reload in MAUI 11
tag:
    - dotnet maui
    - programming
omit: true
---

Hot Reload has been part of .NET MAUI for some time, allowing developers to make changes to XAML without rebuilding and redeploying their applications. It's a useful part of the development workflow, although larger changes can sometimes mean losing UI state or having to recreate a page.

With .NET MAUI 11, the team has introduced a new **XAML Incremental Hot Reload** engine that takes a different approach to updating the UI. Rather than relying on recreating elements or pages, it generates targeted updates that can be applied to existing controls.

Let's take a look at how it works.

## What's changed?

Introduced in .NET 11 Preview 7, the new engine uses a Roslyn source generator alongside .NET's `MetadataUpdateHandler` infrastructure. When you modify a XAML file, the generator compares the changes and produces C# code to update the affected elements.

This supports changes to properties, bindings, resource dictionaries and even structural changes such as adding, removing or reordering child elements.

More importantly, these updates can be applied to existing page instances without navigating away or recreating the page.

## A look at the source code

The implementation is particularly interesting. If we look at the team's [`UpdateComponentCodeWriter`](https://github.com/dotnet/maui/blob/net11.0/src/Controls/src/SourceGen/UpdateComponentCodeWriter.cs), we can see how the generator locates existing controls before applying property changes.

Here's a small extract:

```csharp
if (templateNodeIds?.Contains(nodeDiff.NodeId) == true)
    codeWriter.WriteLine(
        $"foreach (var {varName} in global::Microsoft.Maui.Controls.Xaml.XamlComponentRegistry.GetTemplateComponents(this, \"{nodeDiff.NodeId}\"))");
else
    codeWriter.WriteLine(
        $"if (global::Microsoft.Maui.Controls.Xaml.XamlComponentRegistry.TryGet(this, \"{nodeDiff.NodeId}\", out var {varName}))");
```

The code is part of the source generator, so it's generating C# rather than directly updating the UI.

What's interesting here is the use of `XamlComponentRegistry`. The registry tracks existing controls, allowing the generated update method to find the correct instance and apply changes to it. Notice the separate handling for template components, where multiple instances of the same XAML element might exist.

This is particularly relevant for controls such as `CollectionView`, where an item template can be displayed many times.

## What about CollectionView?

The team has continued improving the engine throughout the .NET 11 previews. In RC1, changes to properties within a direct `CollectionView.ItemTemplate` can update existing, realised cells without replacing the entire template.

That means changes such as adjusting a label's font size or colour can be applied while preserving the collection's scroll position, selection and focus.

It's a small detail, but one that can make a considerable difference when working on more complex pages. Nobody wants to scroll through a long collection again every time they make a minor XAML adjustment!

## Getting started

XAML Incremental Hot Reload is enabled by default for Debug builds targeting .NET MAUI 11, so there's nothing additional to configure for a typical project. It also works with `dotnet watch`, bringing the new update mechanism to command-line development workflows.

The engine is still a preview feature, and not every edit can be applied incrementally. Changes such as introducing new code-behind fields or modifying the root element type can still require a rebuild.

If you encounter problems, you can switch back to the existing Hot Reload engine by adding the following to your project file:

```xml
<PropertyGroup Condition="'$(Configuration)' == 'Debug'">
    <EnableMauiIncrementalHotReload>false</EnableMauiIncrementalHotReload>
</PropertyGroup>
```

## Final thoughts

This is one of those improvements that might not immediately stand out in the .NET 11 release notes, but could have a meaningful impact on everyday development.

The move towards source-generated, targeted updates is particularly interesting, especially as the team continues improving XAML source generation across MAUI.

I'm looking forward to seeing how it performs with larger, more complex applications.

### References and further reading

- [.NET MAUI 11: What's new](https://learn.microsoft.com/en-us/dotnet/maui/whats-new/dotnet-11)
- [XAML Hot Reload documentation](https://learn.microsoft.com/en-us/dotnet/maui/xaml/hot-reload)
- [Original implementation — PR #34338, Stéphane Delcroix](https://github.com/dotnet/maui/pull/34338)
- [UpdateComponentCodeWriter source code](https://github.com/dotnet/maui/blob/net11.0/src/Controls/src/SourceGen/UpdateComponentCodeWriter.cs)
- [CollectionView template updates — PR #37899](https://github.com/dotnet/maui/pull/37899)