---
title: "simple elegant way to get user agent in iOS swift 3 using a webview and a tiny bit of javascript"
date: "2016-12-14"
---

**Here's a simple and elegant way to add a user-agent header to your headers dictionary in whatever networking framework you're using, if it doesn't provide the user-agent header out-of-the-box:**

**"User-Agent" : UIWebView().stringByEvaluatingJavaScript(from: "navigator.userAgent")!**

**we just init a webview, run a javascript that returns the user-agent from within the webview as a string, and use the value wherever you want (in the headers, eg)**

**have fun getting device user agent in swift!**
