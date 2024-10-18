---
title: Loading configuration data from json in a MAUI app
tag:
    - dotnet MAUI
---

It's no secret. 

Secrets shouldn't make it into your codebase, particularly if the code for your project is going to be hosted somewhere public. For secret secrets, you can use [appsettings.json](https://montemagno.com/dotnet-maui-appsettings-json-configuration/) as explored by James Montemagno or, if you want to be super secure, include them only in your [build process](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/set-secret-variables). 

But sometimes these approaches aren't quite right, or overkill for the situation.

In this post, I'll walk you through an alternative way to load a config file into your dotnet MAUI application. By omitting the config file itself from git, your secrets are kept only on your device. This is perfect for situations where you need to load up a licence key, are only building the app on your device, and want to get something up and running quickly. In this instance, it's the key for the [SyncFusion MAUI Controls library](https://www.syncfusion.com/maui-controls).

Firstly, add a `config.json` file into `/Resources/Raw/` to hold any configuration data needing within your MAUI application.

``` json
{
  "SyncFusionLicence": "a-licence-key"
}
```

Depending on how you add the file, the following will appear in your `.csproj` file.

```xaml
<ItemGroup>
  <None Remove="Resources\Raw\config.json" />
</ItemGroup>
<ItemGroup>
  <BundleResource Include="Resources\Raw\config.json" />
</ItemGroup>
```

Now we need to create a helper to load the configuration into our codebase, so that we can use the values.

Create a file called `ConfigHelpers.cs` in `/Helpers/`. The first thing to add is a class that represents our config data structure. This should be updated and kept in sync with your `config.json` file as your app expands.  The property names within the class should exactly match those in the `config.json` file.

```c#
namespace My_Project.Helpers;

public static class ConfigHelper
{
	// more code to be added
}

public class Config
{
    public string? SyncFusionLicence { get; set; }
}
```

Be sure to update the namespace to match your project.

Now we can write a function to load the configuration file. Still in `ConfigHelpers.cs`, add a static function within the class.

```c#
using System.Text.Json;

public static class ConfigHelper
{
    public static async Task<Config> LoadConfig(string filename)
    {
        using var stream = await FileSystem.OpenAppPackageFileAsync(filename);
        using var reader = new StreamReader(stream);

        var contents = reader.ReadToEnd();

        var config = JsonSerializer.Deserialize<Config>(contents);
        return config;
    }
}
```

Here we're loading the json file which matches the passed string, before parsing it as a Config object and returning it. This object now contains anything in our `config.json`. All that's left to do is to use it.

In the context of the SyncFusuion MAUI controls library, the following is within the `app.xaml.cs` class, but the same principle applies from anywhere in your app.

```c#
using My_Project.Helpers;

namespace My_Project;

public partial class App : Application
{
    private static Config? Config { get; set; }

    public App()
	{
        Config = ConfigHelper.LoadConfig("appsettings.json").Result;
        Syncfusion.Licensing.SyncfusionLicenseProvider.RegisterLicense(Config.SyncFusionLicence);

        // other code
	}
}
```

In this code, we have:

- Included the helper class created earlier
- Created a variable of type Config to hold our configuration data in
- Called our helper method to load the data
- Passed this into the `SyncFusionLicenceProvider` to register our licence

If you're using this to allow you to work with the SyncFusion Controls Library, be sure to include the licensing package in your `.csproj` file.

```xaml
<PackageReference Include="Syncfusion.Licensing" Version="27.1.53" />
```

There you have it. You've now loaded in some semi-secret configuration data into your app. If you're using the SyncFusion control library for dotnet MAUI, you're ready to begin build your user interface.

Happy coding.