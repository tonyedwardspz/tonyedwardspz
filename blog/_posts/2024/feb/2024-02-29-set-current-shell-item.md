---
title: Set current shell item from anywhere in a MAUI app
tag:
    - dotnet MAUI
stackoverflow: https://stackoverflow.com/questions/78076733/set-or-highlight-a-specific-shell-tabbar-item-after-navigation
---

In the development of mobile applications, ensuring a seamless user experience is key. A common feature in many apps is the use of notifications. When a user interacts with one of these notifications, they expect to be directed to the relevant part of the app and for the navigation to reflect their current context. 

In a recent project, I implemented a feature where clicking a notification opens the app and displays the message related to the notification. The app was set up to navigate back to a main view (in this case, `AllNotificationsPage`, part of the Shell), when the back button was pressed after reading the message. This was achieved with the following code snippet in `MainActivity.cs`:

```csharp
Shell.Current.GoToAsync($"/{nameof(AllNotificationsPage)}/{nameof(NotificationPage)}", true,
     new Dictionary<string, object>
     {
         ["Notification"] = notification
     });
```

Nothing fancy here. But this didn't highlight the current TabBar item in the shell. It only took a few additons to get working. 

First, it was necessary to assign names to the tab bar and the specific tab item within the `AppShell.xaml` file, like so:

```xml
<TabBar x:Name="shellTabBar">
    <ShellContent x:Name="details" 
    // More properties
    />
    <ShellContent x:Name="allNotifications" 
    // More properties
    />
</TabBar>
```

With these names set, I then created a method within `AppShell.xaml.cs` to switch the currently selected tab. This method, `SwitchToTab`, is invoked on the main thread to ensure a buttery smooth UI:

```csharp
public void SwitchToTab()
{
    MainThread.BeginInvokeOnMainThread(() =>
    {
        shellTabBar.CurrentItem = allNotifications;
    });
}
```

Finally, this method can be called from anywhere within the application. In this case, its called from `MainActivity.cs` just before executing the navigation command.

```csharp
((AppShell)App.Current.MainPage).SwitchToTab();
```

This approach ensures that the user is not only navigated to the correct view within the app but also visually oriented within the app's navigation structure, enhancing the overall user experience.
