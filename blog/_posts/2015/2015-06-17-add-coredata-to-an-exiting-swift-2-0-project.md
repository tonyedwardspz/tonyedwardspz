---
title: Adding Core Data to an existing Swift 2.0 project
tag:
  - App Development
  - Tutorial
---
Core Data is a really handy library for introducing persistence to a Xcode project. When spinning up a new project to play around with Swift 2.0,&nbsp;I was surprised to find that you cannot include this from the start. Looking at the other app templates included in Xcode 7, it seems that&nbsp;only the Master-Detail Application and Single View Application have the option to include Core Data.

Core data is&nbsp;an abstraction layer that sits on top of a database which by default is SQLite. It&#8217;s a great framework for managing an objects life cycle through data persistence.

There are three steps to adding Core Data&nbsp;to an existing project. This guide is for Swift 2.0 and Xcode 7(beta).

## Step 1 &#8211;&nbsp;Import core data

Open the `AppDelegate.swift` file and add an import for the Core Data libraries near the top.

<pre data-language="javascript"><code>import CoreData</code></pre>

## Step 2 &#8211;&nbsp;Add&nbsp;a data model to the project

To use a data base we need to have a &#8216;xcdatamodeld&#8217; file in the project. You can generate one by going to File > New > New File

In the next window select the `Core Data` option for your target platform followed by `DataModel`.

[resp_image id=&#8217;261&#8242;]

## Step 3 &#8211; Add delegate methods

Next we need to add some methods to the AppDelegate.swift file. These functions are the delegate methods that will manage the database on our behalf. Add the following code to the bottom of the `AppDelegate` class. Be sure that they are still within the class.

NOTE: You will need to change the DATAMODELNAME and PROJECTNAME with the appropriate details for your project.

<pre data-language="javascript"><code>    // MARK: - Core Data stack

    lazy var applicationDocumentsDirectory: NSURL = {
        // The directory the application uses to store the Core Data store file. This code uses a directory named "uk.co.plymouthsoftware.core_data" in the application's documents Application Support directory.
        let urls = NSFileManager.defaultManager().URLsForDirectory(.DocumentDirectory, inDomains: .UserDomainMask)
        return urls[urls.count-1]
    }()

    lazy var managedObjectModel: NSManagedObjectModel = {
        // The managed object model for the application. This property is not optional. It is a fatal error for the application not to be able to find and load its model.
        let modelURL = NSBundle.mainBundle().URLForResource("DATAMODELNAME", withExtension: "momd")!
        return NSManagedObjectModel(contentsOfURL: modelURL)!
    }()

    lazy var persistentStoreCoordinator: NSPersistentStoreCoordinator = {
        // The persistent store coordinator for the application. This implementation creates and return a coordinator, having added the store for the application to it. This property is optional since there are legitimate error conditions that could cause the creation of the store to fail.
        // Create the coordinator and store
        let coordinator = NSPersistentStoreCoordinator(managedObjectModel: self.managedObjectModel)
        let url = self.applicationDocumentsDirectory.URLByAppendingPathComponent("PROJECTNAME.sqlite")
        var failureReason = "There was an error creating or loading the application's saved data."
        do {
            try coordinator.addPersistentStoreWithType(NSSQLiteStoreType, configuration: nil, URL: url, options: nil)
        } catch {
            // Report any error we got.
            var dict = [String: AnyObject]()
            dict[NSLocalizedDescriptionKey] = "Failed to initialize the application's saved data"
            dict[NSLocalizedFailureReasonErrorKey] = failureReason

            dict[NSUnderlyingErrorKey] = error as NSError
            let wrappedError = NSError(domain: "YOUR_ERROR_DOMAIN", code: 9999, userInfo: dict)
            // Replace this with code to handle the error appropriately.
            // abort() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
            NSLog("Unresolved error \(wrappedError), \(wrappedError.userInfo)")
            abort()
        }

        return coordinator
    }()

    lazy var managedObjectContext: NSManagedObjectContext = {
        // Returns the managed object context for the application (which is already bound to the persistent store coordinator for the application.) This property is optional since there are legitimate error conditions that could cause the creation of the context to fail.
        let coordinator = self.persistentStoreCoordinator
        var managedObjectContext = NSManagedObjectContext(concurrencyType: .MainQueueConcurrencyType)
        managedObjectContext.persistentStoreCoordinator = coordinator
        return managedObjectContext
    }()

    // MARK: - Core Data Saving support

    func saveContext () {
        if managedObjectContext.hasChanges {
            do {
                try managedObjectContext.save()
            } catch {
                // Replace this implementation with code to handle the error appropriately.
                // abort() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
                let nserror = error as NSError
                NSLog("Unresolved error \(nserror), \(nserror.userInfo)")
                abort()
            }
        }
    }</code></pre>

You also need to add the following method call to the&nbsp;`applicationWillTerminate` function. This will make sure that the database is properly handled when the application quits.

<pre data-language="javascript"><code>self.saveContext()</code></pre>

There you have it. Your project is ready to use core data. If it&#8217;s your first time using Core Data I&#8217;d highly recommend the tutorial at&nbsp;[raywenderlich.com](http://www.raywenderlich.com/85578/first-core-data-app-using-swift).

Inspired by a post at www.craig24.com.
