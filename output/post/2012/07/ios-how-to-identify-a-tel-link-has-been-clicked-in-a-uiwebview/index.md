---
title: "iOS: How to identify a tel: link has been clicked in a UIWebView"
date: "2012-07-23"
categories: 
  - "software"
---

I wanted to ask the user whether they are SURE that they want to initiate a phone call to a tel: link clicked on inside a UIWebView.  
  
Here's how:  
1\. in the UIWebViewDelegate, implement this method:  
  

```
- (BOOL) webView:(UIWebView *)_webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType {  
```

  

2\. inside this function check this runtime condition:

```
if ([request.URL.scheme isEqualToString:@"tel"]) 
```

3\. respond to this "event" as you like (I created a yes/no dialog for making sure the user wants to call the number).
