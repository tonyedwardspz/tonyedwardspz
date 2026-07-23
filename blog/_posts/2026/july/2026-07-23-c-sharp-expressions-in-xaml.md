---
title: A quick guide to c# expressions in .net MAUI.
tag:
    - dotnet maui
    - programming
---

*This post is part of the [MAUI UI July](https://goforgoldman.com/posts/mauiuijuly-26/) community series of blog posts and videos, hosted by Matt Goldman. Take a look the other posts in this series!*

I’ve written more Boolean converters than I’d care to admit. Not complicated ones, either. They work, but a convertor is a lot of ceremony for something so small.

C# expressions are coming to .NET MAUI in .NET 11, and they’re designed to remove a bunch of this sort of boilerplate. They let you write small C# expressions directly inside XAML attributes, which means conditions, calculations, formatting and simple event handling can live closer to the controls that use them.

```xml
<VerticalStackLayout IsVisible="{!IsLoading}" />

<Button
    Text="Save"
    IsEnabled="{IsValid && !IsSaving}" />

<Label Text="{$'{FirstName} {LastName}'}" />
```

This is a fairly substantial change to the way we can work with XAML. It doesn’t mean view models, converters, commands or normal bindings are going away, and it certainly doesn’t mean every bit of application logic should now be squeezed into an XML attribute. What it does mean is that a lot of the tiny pieces of supporting code we write around XAML may no longer be necessary.

## What are C# expressions?

C# expressions let you use C# syntax inside XAML attributes. That includes property access, Boolean conditions, arithmetic, string interpolation, null-coalescing, ternary expressions, method calls and small event-handler lambdas.

The feature is being introduced as part of .NET MAUI in .NET 11 and is still experimental at the time of writing. Some of the syntax, behaviour and limitations may change before the final release, so this probably isn’t the moment to enthusiastically rewrite half a production application on a Friday afternoon.

The interesting part is that these expressions aren’t simply strings being interpreted at runtime. They’re understood by the .NET MAUI XAML source generator, which can inspect an expression, work out which types and properties it uses, and generate the required C# or binding code at build time. That means that they're SourceGen only, and not available if using XamlC or Runtime inflation.

That makes this more than shorter syntax. It gives the compiler a much better understanding of what the XAML is trying to do. It gives you less code to grep.

## Why is this happening?

XAML is very good at describing the structure of a user interface. It becomes less elegant when you need to add a small amount of presentation logic, particularly when that logic is too simple to deserve its own class or view-model property.

Suppose you have an activity indicator that should be visible while data is loading, and some page content that should be visible when it isn’t. A fairly typical approach looks like this:

```xml
<ContentPage.Resources>
    <toolkit:InvertedBoolConverter
        x:Key="InvertedBoolConverter" />
</ContentPage.Resources>

<ActivityIndicator
    IsRunning="{Binding IsLoading}"
    IsVisible="{Binding IsLoading}" />

<VerticalStackLayout
    IsVisible="{Binding IsLoading,
        Converter={StaticResource InvertedBoolConverter}}">

    <!-- Page content -->

</VerticalStackLayout>
```

There’s nothing especially wrong with this. Converters are useful, particularly when transformation logic is shared across several views. In this case, though, we’ve introduced a converter, registered it as a resource and referenced it from the binding simply to invert a Boolean.

With C# expressions, the same thing becomes:

```xml
<ActivityIndicator
    IsRunning="{IsLoading}"
    IsVisible="{IsLoading}" />

<VerticalStackLayout IsVisible="{!IsLoading}">

    <!-- Page content -->

</VerticalStackLayout>
```

The new version is shorter, but that isn’t the only benefit. The condition is right next to the element that uses it, and the intent is obvious without jumping around the project looking for a converter.

A tiny bit of logic stays tiny.

## Simple property bindings

The most basic example is binding to a property.

### Before

```xml
<Label Text="{Binding Username}" />

<Label Text="{Binding User.DisplayName}" />
```

### With C# expressions

```xml
<Label Text="{Username}" />

<Label Text="{User.DisplayName}" />
```

At first glance, this looks like shorthand for removing the word `Binding`, but the source generator is doing more than that. When the page has an `x:DataType`, the expression can be checked against the binding context at build time.

```xml
<ContentPage
    x:Class="MyApp.ProfilePage"
    x:DataType="viewModels:ProfileViewModel">

    <Label Text="{Username}" />

</ContentPage>
```

If `Username` doesn’t exist on `ProfileViewModel`, the tooling has enough information to complain about it. That’s rather more useful than discovering a typo after navigating to the page and wondering why the label is empty.

Writable properties can still be used with controls that support two-way binding:

```xml
<Entry Text="{Username}" />
```

This isn’t throwing away data binding. It’s giving the compiler a more direct and strongly typed way to describe it.

## Boolean expressions

Boolean expressions are probably where many developers will see the quickest win. Applications tend to collect converters and calculated properties for conditions such as “invert this value”, “check whether both values are true” or “show this control when a count is greater than zero”.

A view model might currently expose another property:

```csharp
public bool CanSave => IsValid && !IsSaving;
```

The XAML then binds to it:

```xml
<Button
    Text="Save"
    IsEnabled="{Binding CanSave}" />
```

This works, but the view model must also raise a property-change notification for `CanSave` whenever either `IsValid` or `IsSaving` changes. That is easy to forget and can produce the sort of bug where the state is correct but the button remains stubbornly disabled.

Another option is a `MultiBinding` and converter:

```xml
<Button Text="Save">
    <Button.IsEnabled>
        <MultiBinding Converter="{StaticResource CanSaveConverter}">
            <Binding Path="IsValid" />
            <Binding Path="IsSaving" />
        </MultiBinding>
    </Button.IsEnabled>
</Button>
```

That is a lot of XAML for a condition that is perfectly readable in one line.

### With C# expressions

```xml
<Button
    Text="Save"
    IsEnabled="{IsValid && !IsSaving}" />
```

Other conditions are equally direct:

```xml
<Label IsVisible="{ItemCount > 0}" />

<Button
    IsEnabled="{HasAcceptedTerms && IsFormValid}" />

<VerticalStackLayout
    IsVisible="{IsSignedIn || IsGuestAccessEnabled}" />
```

This is the sort of thing C# expressions are particularly good at. The logic is small, local to the view and understandable without extra context.

Word-based operators are also being explored to avoid some of the awkwardness caused by XML escaping:

```xml
<Button
    IsEnabled="{HasAcceptedTerms AND IsFormValid}" />
```

The available aliases include forms such as `AND`, `OR`, `LT`, `GT`, `LTE` and `GTE`. Whether you prefer those or the normal C# operators will probably come down to readability and how much XML complains about what you’re trying to type.

## Calculated values

Calculated properties are another common piece of view-model furniture. Suppose you have a price and quantity and want to show the total.

### Before

```csharp
public decimal Price { get; set; }

public int Quantity { get; set; }

public decimal Total => Price * Quantity;
```

```xml
<Label Text="{Binding Total}" />
```

Again, `Total` needs to raise a change notification whenever `Price` or `Quantity` changes. Without that notification, the calculation may be correct in the view model while the UI continues showing an old value.

With a C# expression, the calculation can be written directly in the XAML:

```xml
<Label Text="{Price * Quantity}" />
```

The source generator can inspect the expression and work out which values it depends on. Because `Price * Quantity` isn’t something that can be assigned back to the view model, the generated binding is one-way, which is exactly what you would expect.

This works well for small presentation calculations. It doesn’t mean your pricing rules, discount logic and tax calculations should now live in a forty-line XAML expression. If the calculation has business meaning, is reused elsewhere or needs proper testing, keep it in C# and give it a useful name.

## String interpolation

Formatting text in XAML has always been possible, but it isn’t always pleasant. You might use `StringFormat`, a calculated property or a `FormattedString` full of spans.

For example, displaying a full name might involve another property.

### Before

```csharp
public string FullName => $"{FirstName} {LastName}";
```

```xml
<Label Text="{Binding FullName}" />
```

### With C# expressions

```xml
<Label Text="{$'{FirstName} {LastName}'}" />
```

The single quotes are used because the XAML attribute itself is already wrapped in double quotes. You can use the same approach for other bits of display text:

```xml
<Label Text="{$'Hello, {FirstName}'}" />

<Label Text="{$'{Quantity} × {ProductName}'}" />

<Label Text="{$'Total: {Price:C2}'}" />
```

Dates can be formatted in the same way:

```xml
<Label
    Text="{$'Arriving {ArrivalDate:dddd, d MMMM}'}" />
```

This should be particularly useful when the formatted text exists for one specific view. If several pages need the same formatting, or the formatting is part of the application’s behaviour rather than its presentation, a named property or formatter is probably still the better home.

## Ternary expressions

Sometimes you need to choose between two values. A common way of doing this is to add another property to the view model.

### Before

```csharp
public string AccountTypeText =>
    IsPremium
        ? "Premium account"
        : "Standard account";
```

```xml
<Label Text="{Binding AccountTypeText}" />
```

### With C# expressions

```xml
<Label
    Text="{IsPremium ? 'Premium account' : 'Standard account'}" />
```

You can also combine a ternary with interpolation:

```xml
<Label
    Text="{ItemCount == 1 ? '1 item' : $'{ItemCount} items'}" />
```

This is useful up to a point. One small ternary expression is easy to understand, but three nested ternaries and a method call will quickly make the XAML harder to follow.

At that point, give the condition a name and move it back into C#.

## Null handling

Null fallback values are another good fit for expressions.

### Before

```csharp
public string DisplayName =>
    Name ?? "Unknown user";
```

```xml
<Label Text="{Binding DisplayName}" />
```

### With C# expressions

```xml
<Label Text="{Name ?? 'Unknown user'}" />
```

You can also use null-aware property access:

```xml
<Label
    Text="{User?.DisplayName ?? 'Guest'}" />
```

This is useful when the fallback is specific to a particular element. If the application has a defined rule for how user names should be displayed everywhere, put that rule somewhere reusable rather than copying the same expression across six pages.

## Method calls

Expressions can call methods:

```xml
<Label Text="{Name.ToUpperInvariant()}" />
```

They can also call helper methods:

```xml
<Label Text="{GetFormattedDate()}" />
```

Static methods are supported too:

```xml
<ProgressBar
    Progress="{Math.Min(Progress, 1)}" />
```

This comes with an important caveat: not every expression is automatically reactive. An expression generated as a binding can update when its dependencies raise property-change notifications, but a method called directly from the page may be evaluated once when the view is created.

If you write this:

```xml
<Label Text="{GetCurrentStatus()}" />
```

you shouldn’t assume it will rerun whenever some unrelated property changes. The expression needs a clear set of observable dependencies for the generated binding to know when it should update.

This is one of the areas worth testing carefully while the feature is still in preview.

## Inline event handlers

C# expressions can also be used to handle events. Imagine a button that increments a counter.

### Before

```xml
<Button
    Text="Add"
    Clicked="OnAddClicked" />
```

```csharp
private void OnAddClicked(object sender, EventArgs e)
{
    Count++;
}
```

### With C# expressions

```xml
<Button
    Text="Add"
    Clicked="{(sender, args) => Count++}" />
```

You can call a method in the same way:

```xml
<Button
    Text="Reset"
    Clicked="{(sender, args) => ResetForm()}" />
```

This is useful for genuinely tiny synchronous actions. It becomes less useful when the event handler contains validation, logging, navigation, cancellation, error handling and three service calls. At that point, give it a name and put it somewhere sensible.

Async lambdas aren’t currently supported, so asynchronous event handlers still need a normal method or command:

```xml
<Button
    Text="Save"
    Clicked="OnSaveClicked" />
```

```csharp
private async void OnSaveClicked(
    object sender,
    EventArgs e)
{
    await viewModel.SaveAsync();
}
```

That limitation may feel inconvenient, but it also stops the XAML from becoming a hiding place for sizeable chunks of asynchronous application logic. Probably not a bad thing.

## Existing XAML markup still works

C# expressions are being added alongside the XAML features that already exist. Normal bindings, static resources and `x:Static` all continue to work:

```xml
<Label Text="{Binding Name}" />

<Label Text="{StaticResource PageTitle}" />

<Label
    Text="{x:Static local:AppConstants.AppName}" />
```

The source generator needs to work out whether the contents of the braces are a markup extension or a C# expression. Where something is ambiguous, you can be explicit:

```xml
<!-- Explicit expression -->
<Label Text="{= SomeValue}" />

<!-- Resolve against the page -->
<Label Text="{this.Title}" />

<!-- Resolve against the binding context -->
<Label Text="{.Title}" />
```

The last two are useful when the page and its binding context contain properties with the same name. It’s one of those problems you may not have until you do, at which point you’ll be pleased the explicit syntax exists.

## What could this replace?

C# expressions may remove the need for quite a few small pieces of supporting code, including inverted Boolean converters, simple comparison converters, some multi-value converters, presentation-only calculated properties, basic formatting properties, straightforward triggers and tiny synchronous event handlers.

A `MultiBinding` such as this:

```xml
<Label>
    <Label.IsVisible>
        <MultiBinding
            Converter="{StaticResource AllTrueConverter}">

            <Binding Path="IsLoggedIn" />
            <Binding Path="HasSubscription" />

        </MultiBinding>
    </Label.IsVisible>
</Label>
```

can become:

```xml
<Label
    IsVisible="{IsLoggedIn && HasSubscription}" />
```

That is fewer lines, but the more useful change is that the condition is visible immediately. You don’t need to inspect a converter to discover whether `AllTrueConverter` really means all values must be true, whether null counts as false or whether it does something surprising because someone changed it four years ago.

## What shouldn’t go into an expression?

Just because C# can now be written inside XAML doesn’t mean every bit of application logic should move there. I’d avoid using expressions for business rules, network calls, database operations, complex state changes, reusable calculations, anything that needs focused unit testing or anything that requires a comment to explain what it does.

You could write something like this:

```xml
<Label
    IsVisible="{
        CurrentUser != null &&
        CurrentUser.Subscription != null &&
        CurrentUser.Subscription.ExpiresAt > DateTime.Now &&
        !CurrentUser.IsSuspended
    }" />
```

But a named property is much easier to understand:

```xml
<Label
    IsVisible="{CanAccessPremiumFeatures}" />
```

The second version tells me what the condition means. The first tells me how it is calculated and asks me to work out the meaning myself.

That is the line I’d use when deciding whether an expression belongs in XAML: use an expression when it makes the XAML more obvious, and use a named property or method when it makes the intention more obvious.

## A complete example

Here’s a small page using several of the new expression types together:

```xml
<ContentPage
    x:Class="ExpressionDemo.MainPage"
    x:DataType="viewModels:MainViewModel">

    <VerticalStackLayout
        Padding="24"
        Spacing="16">

        <Label
            FontSize="24"
            Text="{$'Welcome, {FirstName}'}" />

        <ActivityIndicator
            IsRunning="{IsLoading}"
            IsVisible="{IsLoading}" />

        <VerticalStackLayout
            IsVisible="{!IsLoading}"
            Spacing="12">

            <Label
                Text="{$'{Quantity} × {ProductName}'}" />

            <Label
                Text="{$'Total: {Price * Quantity:C2}'}" />

            <Button
                Text="Place order"
                IsEnabled="{
                    Quantity > 0 &&
                    HasAcceptedTerms &&
                    !IsSubmitting
                }" />

        </VerticalStackLayout>

    </VerticalStackLayout>

</ContentPage>
```

There are no converters here, no calculated `Total` property and no `CanPlaceOrder` property that needs change notifications whenever three other values change.

The important question isn’t whether this version contains fewer lines. It’s whether someone opening the page can understand what it does.

In this case, I think they probably can.

## When can I try it?

C# expressions are being developed for .NET MAUI in .NET 11. .NET 11 is scheduled for release in November 2026, but the feature can be tried using the .NET 11 preview SDK and the matching .NET MAUI workload.

It’s still experimental, so expect rough edges, incomplete tooling and behaviour that may shift between preview releases. I wouldn’t start converting a production application wholesale yet.

A better approach is to create a small test project or pick one isolated page containing a few obvious candidates: an inverted Boolean converter, a basic `MultiBinding`, a display-only calculated property, a formatted string or a one-line synchronous event handler.

Replace them one at a time and see what the resulting XAML feels like. Check whether it becomes easier to read, whether the expression updates when you expect it to, whether Hot Reload behaves and whether the compiler errors point you towards the problem when something goes wrong.

Those are the useful questions during a preview.

## Give it a try

C# expressions won’t replace MVVM, converters, commands, view models or code-behind, and they shouldn’t. What they offer is a way to remove some of the faff around small bits of presentation logic.

That could mean fewer converters, fewer properties that exist purely for one label and less hopping between files to understand a simple condition.

Try them in a small page and see which bits of boilerplate disappear. More importantly, notice which bits are still clearer with a proper name in the view model.

Then tell the .NET MAUI team what worked, what didn’t and where the tooling got confused. Preview features improve when people use them for real things rather than admiring them from a release note.

[Read the spec](https://github.com/dotnet/maui/blob/main/docs/specs/XamlCSharpExpressions.md)
