---
title: MAUI - The application has not been built
tag:
    - dotnet MAUI
    - Programming
---

Picture the scene. You're building a MAUI MacCatalyst app, and getting a strange message when trying to run the application. "The application has not been built", which appears immediately after a successful build.

![.NET MAUI MacCatalyst Build Eror](/assets/images/2024/maui-application-built-1.png "MAUI Application has not been built"){:loading="lazy"}

A better error message in this instance could be:

> The application has not been built for the processor achitecture you are attempting to run it on. Update .csproj to fix.

In my case, I'm working on an M1 MacBook Pro, which uses the arm64 architecture. By default, a MAUI MacCatalyst application builds for the x64 architecture, as you'll realise once you poke the `.csproj` file.

![.NET MAUI MacCatalyst RuntimeIdentifier](/assets/images/2024/maui-application-built-2.png ".NET MAUI MacCatalyst RuntimeIdentifier"){:loading="lazy"}

To build for an arm64 architecture, you'll need to update the `RuntimeIdentifiers` to the correct architecture.

![.NET MAUI MacCatalyst RuntimeIdentifier for M1](/assets/images/2024/maui-application-built-3.png ".NET MAUI MacCatalyst RuntimeIdentifier for M1"){:loading="lazy"}

The application in question here is purely for my own use, meaning a release is of no concern. If releasing onto the App Store is something you need to do, you'll want to list both runtimes so that it's accepted by Apple.
