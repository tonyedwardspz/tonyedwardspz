---
title: Testing your MAUI code on real devices comes to .NET 11
tag:
    - dotnet maui
    - programming
omit: true
---

Testing .NET MAUI applications has always presented a few challenges, particularly when the code you're testing depends on platform-specific functionality. Traditional unit tests are great for testing business logic, but what happens when you need to test something that interacts directly with Android or iOS?

With .NET 11, the team has introduced **native device test projects**, bringing the familiar `dotnet test` workflow to Android, iOS, macOS, Mac Catalyst and tvOS.

This is a useful addition for MAUI developers, allowing tests to run inside a native application process on a physical device or emulator, rather than relying entirely on mocks or desktop-based tests.

Let's take a closer look.

## Getting started

.NET 11 RC1 introduces five new project templates, each configured to use MSTest and Microsoft.Testing.Platform.

| Template | Platform |
|---|---|
| `androidtest` | Android |
| `iostest` | iOS |
| `tvostest` | tvOS |
| `macostest` | macOS |
| `maccatalysttest` | Mac Catalyst |

Creating an Android test project is straightforward. With the .NET 11 SDK and Android workload installed, run:

```bash
dotnet new androidtest -n MyAndroidTests
cd MyAndroidTests
dotnet test
```

With an Android emulator running or a compatible physical device connected, the tooling builds and installs the test application before executing the tests on the device.

You can write tests using the familiar MSTest attributes, just as you would in a conventional .NET test project.

For example, let's check whether Android's connectivity service is available:

```csharp
using Android.App;
using Android.Content;
using Android.Net;
using Microsoft.VisualStudio.TestTools.UnitTesting;

[TestClass]
public class ConnectivityTests
{
    [TestMethod]
    public void ConnectivityService_IsAvailable()
    {
        var context = Application.Context;

        var connectivity = context.GetSystemService(
            Context.ConnectivityService);

        Assert.IsInstanceOfType<ConnectivityManager>(
            connectivity);
    }
}
```

Unlike a conventional unit test running on your development machine, this test executes inside an Android application process and interacts directly with the platform's APIs.

It's a simple example, but the same approach can be used to test platform integrations that are difficult to exercise in an ordinary .NET test project.

## A look behind the scenes

One of the interesting parts of this feature is how the team has integrated device testing into the existing .NET tooling.

If we look at [dotnet/android PR #11130](https://github.com/dotnet/android/pull/11130), we can see the introduction of `AndroidTestAdapter`, which connects Android's instrumentation system with Microsoft.Testing.Platform.

Android already provides a mechanism for executing tests through its instrumentation framework. For example, the following command executes instrumentation on a connected device:

```bash
adb shell am instrument -w <package>/<runner>
```

The new adapter builds on this existing functionality. When you run `dotnet test`, the tooling launches Android instrumentation, retrieves the generated TRX results file and reports the results through Microsoft.Testing.Platform.

This means developers can use the same `dotnet test` command they're already familiar with, without needing to manually manage the Android instrumentation process.

The implementation also integrates with the .NET SDK's device discovery capabilities. If multiple devices are available, you can select a particular device using the `--device` option, or list available devices with `--list-devices`.

## Where does this fit with MAUI testing?

It's worth distinguishing native device tests from UI automation.

Tools such as Appium and the MAUI testing ecosystem remain important for testing complete user journeys, including navigation, button interactions and validating what's displayed on screen.

Native device test projects solve a different problem. They allow developers to run tests against platform functionality inside a real Android or Apple application process, without requiring a complete UI automation framework.

For MAUI applications that use native APIs, this opens up some useful possibilities. Platform-specific services, permissions, device capabilities and native integrations are all potential candidates, provided the tests account for the device configuration and permissions they require.

It also means there's a clearer path towards including these tests in automated build pipelines, although your build environment will still need access to suitable devices or emulators.

## Final thoughts

This is another of those .NET 11 improvements that could easily be overlooked among the more visible MAUI features.

Bringing native device testing into `dotnet test` removes some of the additional tooling and configuration previously required to execute tests on mobile platforms. More importantly, it makes testing platform-specific functionality feel like a natural extension of the existing .NET development workflow.

I'm particularly interested in how this could help test native integrations in larger MAUI applications, where relying entirely on mocks doesn't always give you confidence that the platform implementation behaves as expected.

### References and further reading

- [.NET MAUI 11: What's new](https://learn.microsoft.com/en-us/dotnet/maui/whats-new/dotnet-11)
- [Unit testing in .NET MAUI](https://learn.microsoft.com/en-us/dotnet/maui/deployment/unit-testing?view=net-maui-11.0)
- [Native Android test project template — PR #10862](https://github.com/dotnet/android/pull/10862)
- [Android Microsoft.Testing.Platform adapter — PR #11130](https://github.com/dotnet/android/pull/11130)
- [.NET SDK testing improvements](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-11/sdk)