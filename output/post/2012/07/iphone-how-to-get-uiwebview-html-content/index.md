---
title: "iPhone : How to get UIWebView html content"
date: "2012-07-11"
categories: 
  - "software"
---

While debugging a UIWebView iPhone app, I wanted to know what is in the html content.

This is how to get the html the uiwebview is showing:

  

_NSString \*html = \[yourWebView stringByEvaluatingJavaScriptFromString:  
@"document.body.innerHTML"\];_  

Hope this helps you the next time you want to check the HTML inside a UIWebView
