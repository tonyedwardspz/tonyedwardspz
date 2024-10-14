---
title: MAUI - Fallback image for no network state
tag:
    - dotnet MAUI
---


The image control that comes with MAUI is bundled with plenty of goodness, with image caching by default being a big plus. With the code below, our image is cached for 90 days.

```xaml
<Image
	x:Name="MyImage"
	HorizontalOptions="FillAndExpand" 
	VerticalOptions="FillAndExpand"
	HeightRequest="200"
	Aspect="AspectFill">
	
	<Image.Source>
		<UriImageSource 
			Uri="{Binding ImageUri}"
			CachingEnabled="True"
			CacheValidity="90:00:00:00"
		/>
	</Image.Source>
</Image>
```

You can even add a fallback image, just incase there are issues loading up your desired picture. This is achieved with standard [bindings fallbacks](https://learn.microsoft.com/en-us/dotnet/maui/fundamentals/data-binding/binding-fallbacks?).

```xaml
<Image
	x:Name="MyImage"
	// other code
	>
	
	<Image.Source>
		<UriImageSource 
			Uri="{Binding ImageUri, FallbackValue='https://placecage.lucidinternets.com/200/300'}"
			CachingEnabled="True"
			CacheValidity="90:00:00:00"
		/>
	</Image.Source>
</Image>
```

Spot the problem.

What if the network fails? You won't be able to fallback to an alternative remote image in this instance, but using a local fallback will cause the app to crash when the app attempts to resolve the binding. You can fallback to a URI image for a URI image. Likewise, a local image can fallback to a local image.

Thankfully, we can hook into the Loaded property in the code behind to mix the two. This method fires once the app expects the image to has been loaded. According to [the docs](https://learn.microsoft.com/en-us/dotnet/api/microsoft.maui.controls.visualelement.isloaded?view=net-maui-8.0#microsoft-maui-controls-visualelement-isloaded), it indicates if an element is connected to the main object tree. . . aka visible to the user. 

In XAML:

```xaml
<Image
	x:Name="MyImage"
	Loaded="Image_Loaded"
	// other code 
	>
	
	<Image.Source>
		<UriImageSource 
			Uri="{Binding ImageUri}"
			// other code
		/>
	</Image.Source>
</Image>
```

In the code behind, create the matching function:

```c#
private async void Image_Loaded(object sender, EventArgs e)
{
	try
	{
		var res = await MyImage.Source.GetPlatformImageAsync(Handler.MauiContext);
		
		if (res == null)
		{
			BookingImage.Source = ImageSource.FromFile("fallback-cage.jpg");
		}
	}
	
	catch (Exception ex)
	{
		BookingImage.Source = ImageSource.FromFile("fallback-cage.jpg");
	}
}
```

With this in place, you'll now fallback to a local image when there's no image available over the network (for whatever reason), and there's no cached image available. If you want something more fancy and resiliant, you have a solid starting point to work from
