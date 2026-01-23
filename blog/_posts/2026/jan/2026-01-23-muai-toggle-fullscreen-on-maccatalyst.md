---
title: .NET MAUI - Toggle fullscreen for MacCatalyst desktop app
tag:
    - dotnet maui
    - software development
---

.NET MAUI Mac Catalyst apps run on macOS, but use UIKit (iOS frameworks) rather than AppKit (native macOS frameworks). To toggle full screen, the same behavior as clicking the green "zoom" button in the window chrome, we need to bridge into AppKit's NSApplication and NSWindow using the Objective-C runtime.

```c#
#if MACCATALYST

    var nsAppClass = ObjCRuntime.Class.GetHandle("NSApplication");
    var nsApp = ObjCRuntime.Runtime.GetNSObject(nsAppClass);
    var sharedApp = nsApp?.PerformSelector(new ObjCRuntime.Selector("sharedApplication"));
    var keyWindow = sharedApp?.PerformSelector(new ObjCRuntime.Selector("keyWindow"));
    keyWindow?.PerformSelector(new ObjCRuntime.Selector("toggleFullScreen:"), keyWindow);

#endif
```

Here's how it works.

`var nsAppClass = ObjCRuntime.Class.GetHandle("NSApplication");`

Gets a handle (pointer) to the Objective-C class `NSApplication`. This is AppKit's application singleton class that manages the macOS app lifecycle. Since Mac Catalyst doesn't directly expose AppKit types to C#, we access it dynamically through the Objective-C runtime.

`var nsApp = ObjCRuntime.Runtime.GetNSObject(nsAppClass);`

Wraps the raw class handle in an `NSObject` that we can interact with from C#. This gives us a managed object representing the `NSApplication` class itself, which we get with the next line.

`var sharedApp = nsApp?.PerformSelector(new ObjCRuntime.Selector("sharedApplication"));`

This calls the sharedApplication class method on `NSApplication`, which returns the singleton instance of the running application. 

`var keyWindow = sharedApp?.PerformSelector(new ObjCRuntime.Selector("keyWindow"));`

This retrieves the `keyWindow property` from the shared application, i.e. the window that will receive any keypresses. This returns an `NSWindow` instance. Then. . . finally. . . 

`keyWindow?.PerformSelector(new ObjCRuntime.Selector("toggleFullScreen:"), keyWindow);`

Calls toggleFullScreen: on the `NSWindow`. This is the same method macOS invokes when you click the green full screen button. The method takes a sender parameter (we pass the window itself), and toggles between full screen and windowed mode. This mean you can call it again to revert the full screen.

And with that, you now have a fullscreen Mac app using .NET MAUI.

### What about Windows?

If you want to implement the same functionality within MAUI for Windows, I highly recommend this [blog post](https://blog.verslu.is/maui/full-screen-disable-minimize-maximize-for-net-maui-windows-apps/).