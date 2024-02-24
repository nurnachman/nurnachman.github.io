---
title: "iPhone: How to get the AppDelegate from any view"
date: "2012-05-20"
categories: 
  - "software"
---

You want to call something in your app delegate.

  

1\. #import the app delegate

2\. add this #define macro:

  

#define AppDelegate (YourAppDelegate \*)\[\[UIApplication sharedApplication\] delegate\]

  

3\. use: \[AppDelegate blaBla\];
