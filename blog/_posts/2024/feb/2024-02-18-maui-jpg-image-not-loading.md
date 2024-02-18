---
title: MAUI - embedded .jpg image not loading
tag:
    - dotnet MAUI
    - programming
    - MIDI Birds
---

If you're trying to load a local image into a Image element by setting the source to the file name, like so:

```
<Image Source="robin.jpg" 
       VerticalOptions="Center" 
       HorizontalOptions="Center" 
       HeightRequest="500"
       MaximumWidthRequest="500"
       Aspect="AspectFill"/>

```

And you're getting an error like this:

```
Microsoft.Maui.FileImageSourceService: Warning: Unable to load image file 'robin.png'.

System.InvalidOperationException: Unable to load image file.
   at Microsoft.Maui.FileImageSourceService.GetImageAsync(IFileImageSource imageSource, Single scale, CancellationToken cancellationToken)
```

Take a look at your .csproj file and find the build action for the image in question.

```
<ItemGroup>
	<BundleResource Include="Resources\Images\robin.jpg" />
	<BundleResource Include="Resources\Images\wren.jpg" />
	<BundleResource Include="Resources\Images\blackbird.jpg" />
	<BundleResource Include="Resources\Images\blue_tit.jpg" />
</ItemGroup>
```

In this instance, the images are being brought into the project as a BundleResource. What they should be is a MauiImage. Update the build action like so:

```
<ItemGroup>
	<MauiImage Include="Resources\Images\robin.jpg" />
	<MauiImage Include="Resources\Images\wren.jpg" />
	<MauiImage Include="Resources\Images\blackbird.jpg" />
	<MauiImage Include="Resources\Images\blue-tit.jpg" />
</ItemGroup>
```

Clean your project, and perhaps even delete bin and obj, and then build again. You should find that the image loads as expected.

![Robin image loaded into Midi Birds application](/assets/images/2024/maui-midi-birds-screenshot.png "JPG loaded into a MAUI Desktop App"){:loading="lazy"}

If you're like me, you might discover the MauiImage build action requires filemanes to only contain lowercase, start and end with a letter character, and contain only alphanumeric characters or underscores to maintain compatability with Android.
