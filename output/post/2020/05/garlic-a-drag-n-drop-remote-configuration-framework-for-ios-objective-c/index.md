---
title: "Garlic - A drag-n-drop Remote Configuration Framework for iOS (objective-c)"
date: "2020-05-29"
---

Features:

- Easy 1-line integration
- ZERO libraries required (not even AFNetworking!)
- Remote feature flags
- Local settings fallback
- Custom remote settings
- Force updates
- No collisions with other frameworks

Setup:

In most cases, you want to load remote settings either in the lifecycle events in your AppDelegate or ViewController, or anywhere else you like:

1. #import “Garlic.h”
2. Init and setup Garlic with a remote settings plist URL and a completion block: \[\[Garlic sharedInstance\] setupWithRemoteConfigURL:@”{{your-remote-settings-plist-url-here.com}}” completionHandler:^(void){ // code to run when setup was done }

Force update:

Determine if the app should be updated, based on build numbers

if (\[\[Garlic sharedInstance\] shouldForceUpdateApp\]) { // ask user to update app }

Feature flags:

Check if a feature should be activated

if (\[\[Garlic sharedInstance\] shouldAllowFeature:@"{{your-feature-name-here}}"\]) { // show the button/menu that enables that feature}

Custom values:

Get remote values for your custom purposes

NSString \*tipOfTheDay = \[\[Garlic sharedInstance\] getSettingForKey:@"TipOfTheDay-2015-11-27"\]

Future features:

1. Force synchronous url request
2. Load settings from JSONs and XMLs, in addition to plists
3. POST remote settings: change remote settings in the server when shaking the device
4. Web-based remote settings editor
5. Push updates: engage a remote settings update using a push notification
6. Targeted Feature Flags: toggle features for specific user IDs, geolocations, device models..

Made with <3 by Nur Nachman - [nur.xyz](https://www.google.com/url?q=http://www.nurne.com/&sa=D&ust=1479300591307000&usg=AFQjCNGb3_OtKXliT5P8uanD2YcUD7tgRw)
