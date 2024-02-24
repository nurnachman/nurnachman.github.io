---
title: "iPhone Tutorial: How to check iOS version in runtime (getting ready for iOS6)"
date: "2012-09-03"
categories: 
  - "software"
---

I want to check if the iPhone the app is running on is running on iOS6 or a version below it.  
  

### 1\. Put this where all your constants and defines go:

  

  
  

#define IS\_IOS5\_OR\_BELOW (\[\[\[\[UIDevice currentDevice\].systemVersion componentsSeparatedByString:@"."\] objectAtIndex:0\] intValue\] < 6)

  
  
  
  

### 2\. Use this way:

  

  
  

if(IS\_IOS5\_OR\_BELOW){

    // iOS 4-5 code

} else {

     // iOS 6 code

}

  
  
  
Hope this snippet can help you differentiating between version of iOS, mostly when iOS 6 is coming and you want to be ready for it :)
