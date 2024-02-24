---
title: "Android: How to solve &quot;Warning: Activity not started, its current task has been brought to the front&quot;"
date: "2012-05-02"
categories: 
  - "software"
---

Problem: The Android console says "_ActivityManager: Warning: Activity not started, its current task has been brought to the front"_

  

Reason: the simulator is trying to tell you that the app you are currently running and the one you want to start are the same.

  

Solution:

1\. Enable auto-build in Eclipse:

[![](https://nurnachman.files.wordpress.com/2012/05/6da6a-autobuild.png?w=300)](https://nurnachman.files.wordpress.com/2012/05/6da6a-autobuild.png)

  

2\. Type whitespaces somewhere and save

3\. Run
