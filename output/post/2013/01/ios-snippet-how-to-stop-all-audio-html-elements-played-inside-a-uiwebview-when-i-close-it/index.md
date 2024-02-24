---
title: "iOS snippet : How to stop all audio html elements played inside a UIWebView when I close it?"
date: "2013-01-23"
categories: 
  - "software"
---

  

I wrote an app with a UIWebView that has audio html5 tags in it. While the audio element is played, closing the webview doesn't stop the audio playback.

  

So, how do we stop it?

  

When the webview is supposed to exit, run this code:

  

_NSURLRequest \*emptyRequest = \[NSURLRequest requestWithURL:\[NSURL URLWithString:@"about:blank"\]\];_

    _\[webView loadRequest:emptyRequest\];_

  

  

This code actually loads an empty request, thus killing all the current elements and objects in the current webview.

  

I hope this little snippet helps you when your html5 audio keeps playing even after you closed the webview.
