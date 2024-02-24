---
title: "Android : Tutorial : How to get a callback from javascript in a native WebView"
date: "2012-12-05"
categories: 
  - "software"
---

A lot of apps are a webview inside a native android activity.

In iPhone, you have: 

```
stringByEvaluatingJavaScriptFromString
```

which returns you a string result by running javascript code in the webview.

Android has a solution to that, a little different mechanism:

// 1. calling it:

_myWebView.loadUrl("javascript:Android.someCallback(someJS());_

// 2. getting the result:

_public void someCallback(final String result) {_

_// do what you want with result_

_}_

note that the js function we're calling in the webview is someCallback

and the callback function name in the native layer is also someCallback

I hope this android tutorial on how to get a callback in the native layer of a hybrid app with a webview helps you!
