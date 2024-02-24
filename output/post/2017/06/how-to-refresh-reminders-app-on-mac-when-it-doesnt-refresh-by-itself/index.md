---
title: "How to Refresh Reminders.app on mac - when it doesn't refresh by itself"
date: "2017-06-18"
---

Sometimes you'll find yourself adding items to Reminders on your iPhone or iPad, and not see them on your mac's Reminders app.  
  
How to solve this issue?  
By refreshing the reminders app on your mac:  
  
Just quit Reminders.app on your mac, run Terminal.app and run this command:  

  

_defaults write com.apple.reminders RemindersDebugMenu -boolean true_

Open Reminders.app again and now when you click Command+R -> it will refresh :)

  

Hope it helps you with syncing your reminders list between your mac and your iPhone or iPad
