---
title: DevExpress MAUI Date Picker setup and use
tag:
    - dotnet MAUI
    - Programming
---

A date picker can be found in most apps, and MAUI apps are no different. If you've ever tried to build your own from scratch, you'll know that they're tricky to get right. Thankfully, MAUI has a really capable date picker in the form of the Date Edit control from DevExpress.

The DevExpress Date Edit control is straightforward to set up and include in your app. Even better. . . it's free! 

It comes as part of their [MAUI UI Component Library](https://www.devexpress.com/maui/), a suite of high-performance UI controls for Android and iOS mobile development. The library includes a Data Grid, Chart, Scheduler, Form Entries, CollectionView, and Tabs components. Each control comes with solid documentation, and the functionality and polish to add some pizazz to your app. 

The [docs are the best place](https://docs.devexpress.com/MAUI/403249/get-started/get-started) to start exploring the library. Once you've had a glance over them, we can get started on the setup.

## Setup DevExpress MAUI components

Sign up for an account via the [MAUI controls page](https://www.devexpress.com/maui/).

Find your dev express Nuget url by following the instructions sent via email and after sign up. It'll look something like this:

`https://nuget.devexpress.com/gbXrOVXVtm93Vhdsfs8dfasd8fasdo8jqXyYbbpMrzWdj97sJsOW1/api/v3/index.json`

Open your terminal, and add this URL to your nuget config to allow the installation of packages from DevExpress with the add command.

`dotnet nuget add source "https://nuget.devexpress.com/gbXrOVXVtm93Vhdsfs8dfasd8fasdo8jqXyYbbpMrzWdj97sJsOW1/api/v3/index.json" --name "DevExpress"`

Nuget will now search the DevExpress feed when you look for packages, meaning you can add the required packages to your app as you would with any other. Here I'm pulling in the `DevExpress.MAUI.Editors` package.

![Install DevExpress MAUI Components via nuget](/assets/images/2024/install-controls-via-nuget-in-rider-ide.jpg.jpg "Install MAUI Date Picker via nuget in Rider IDE"){:loading="lazy"}

## Use the DevExpress MAUI Date Picker control

Add the library to your app within `MauiProgram.cs`, and add them to your builder.

```c#
using DevExpress.Maui;  

namespace SearchSpike;

public static class MauiProgram
{
	public static MauiApp CreateMauiApp()
	{
		var builder = MauiApp.CreateBuilder();
		
		builder
		
		.UseMauiApp<App>()
		.UseDevExpress()
		.UseDevExpressEditors()
		.UseDevExpressCollectionView()
		.UseDevExpressControls()
		
		// Other code

		return builder.Build();
	}
}
```

Note that I'm adding more than just the Editors, under which the DateEdit control lives. Your additions might be different. . . so follow the instructions from DevExpress. Once you have, you're ready to use the DevExpress MAUI components in your app 🎉

Let's say you wanted to use a date picker in your UI. You'll need to:

- Add the package to the XAML namespace declarations
- Add the component to the view
- Add the relevant `using` statement to the code behind / view model file to allow interaction from code.

In your XAML header, add a reference to the DevExpress namespace.

```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
	xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
	
	xmlns:dx="http://schemas.devexpress.com/maui" // Add this one
	
	xmlns:local="clr-namespace:SearchSpike"
	xmlns:searchSpike="clr-namespace:SearchSpike"
	x:DataType="searchSpike:MainPage"
	x:Class="SearchSpike.MainPage">
```

You can now add a Date Edit (date picker to you and I) to the body of your XAML layout.

```xml
<dx:DateEdit
	x:Name="StartDate"
	LabelText="From"
	TextHorizontalAlignment="End"
	ErrorText="Birth date is required"
	HelpText="*Required"
	IsDateIconVisible="False"
	ClearIconVisibility="Auto"
	DisplayFormat="d"
	PlaceholderText="Start Date" />
```

We can now interact with this component from the code behind file, or bind to a view model if using the MVVM pattern.

```c#
using DevExpress.Maui.Editors; // Add this

namespace SearchSpike;

public partial class MainPage
{
    
    public MainPage()
    {
        InitializeComponent();
        BindingContext = this;
    }
    
    protected override void OnAppearing()
    {
        base.OnAppearing();
        
        StartDate.PickerDisableDate += OnPickerDisableDate;
    }

    private void OnPickerDisableDate(object? sender, DisableDateEventArgs e)
    {
        e.IsDisabled = e.Date < DateTime.Today;
    }
}
```

In this code, we're including the package with a using statement before setting a delegate for the PickerDisableDate callback. This is the event raised to decide if a specific date is has selection disabled, and is run when the control is being added to the page.  In this instance, we're disabling any date prior to today so that it cannot be selected.

If using the code behind files, you can access the selected date by referencing the control via it's `x:Name`.

```c#
private async void OnSearchClicked(object sender, EventArgs e)
{
	var startDate = StartDate.Date ?? DateTime.Now;
	var endDate = EndDate.Date ?? DateTime.Now.AddDays(1);
	var nights = (endDate - startDate).Days;
	
	Console.WriteLine("Button clicked with Start Date: " + startDate);
	Console.WriteLine("Button clicked with EndDate: " + endDate);
	Console.WriteLine( nights + " nights);
}
```

Or bind the control to properties in your code behind file / view model. In your XAML file, setup binding for a `DateTime` property;

```xml
<dx:DateEdit
	x:Name="StartDate"
	LabelText="From"

	Date="{Binding StartDate, Mode=TwoWay}"
	
	// other code 
	/>
```

And setup the corresponding property in your code.

```c#
using DevExpress.Maui.Editors;

namespace SearchSpike;

public partial class MainPage
{

	publice DateTime StartDate { get; set;} // Add this
    
    public MainPage()
    {
        InitializeComponent();
        BindingContext = this;
        
        StartDate = DateTime.Today; // And then this
    }
}
```

With this, on load the currently selected date time will default to today. When the user selects a different date, the properties will update the reflect changes.

There you have it. You have a suite of DevExpress MAUI controls available to us in your app, and the date picker set up and in use, with two different ways to get the selected date. You're now ready to add a Date Picker to your .NET MAUI cross platform application, and setup to explore the DevExpress MAUI UI components.