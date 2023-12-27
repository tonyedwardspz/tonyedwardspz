---
title: Maui MacCatalyst app - Access folders and sub folders on desktop
tag:
    - dotnet
    - Maui
---

For the .NET Maui application I'm currently building, I need to cycle through folders and list out the contents on windows and Mac. Windows was straight forward to get working, however Mac needed a little more work.

By default, Maui apps are created with Apples App Sandbox implemented. This is a requirement of publishing your app on the App Store, and part of the reason why Apple devices are generally considered more secure. 

App sandboxing mean that trying to access a folder on the desktop like so:

```
try
	{
            string[] folders = Directory.GetDirectories(@"/Users/tony/Desktop/podcasts/", "*", SearchOption.AllDirectories);
            Debug.WriteLine(folders);
            Debug.WriteLine(String.Join(", ", folders));
       } catch (Exception e)
	{
		Debug.WriteLine(e.Message);
	}
```

Gives an error along the lines of `Access to the path '/Users/tony/Desktop/podcasts' is denied.`

As a personal project, I'm happy to give access to the file system, meaning I can turn sandboxing  off.

Opening up entitlements.plist will show you something similar to this:

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
    <!-- See https://aka.ms/maui-publish-app-store#add-entitlements for more information about adding entitlements.-->
    <dict>
        <!-- App Sandbox must be enabled to distribute a MacCatalyst app through the Mac App Store. -->
        <key>com.apple.security.app-sandbox</key>
        <true/>
        <!-- When App Sandbox is enabled, this value is required to open outgoing network connections. -->
        <key>com.apple.security.network.client</key>
        <true/>
    </dict>
</plist>
```

Comment out both of the keys to disable App Sandbox.

If you're looking to publish on the App Store, check out the [iOS/MacCatalyst](https://learn.microsoft.com/en-us/dotnet/maui/platform-integration/storage/file-picker?view=net-maui-8.0&source=recommendations&tabs=macios) particulars in the docs. App sandboxing exists for good reason.