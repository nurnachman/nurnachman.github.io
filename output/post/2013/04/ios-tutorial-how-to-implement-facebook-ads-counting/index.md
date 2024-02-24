---
title: "iOS tutorial: How to implement facebook ads counting"
date: "2013-04-10"
categories: 
  - "software"
---

  
\* This tutorial guesses you already have the api key to the app ad  
  
1\. Download and link the FacebookSDK.framework to your project  
2\. In the project's build phase, add these frameworks: AdSupport, Social, Accounts  
3\. Change the above link dependency to "optional" (aka 'weak')  
4\. In your app delegate, import  
5\. And again in the app delegate, in the method 'applicationDidBecomeActive' add this api call to facebook: \[FBSettings publishInstall:@"YOUR\_API\_KEY"\];  
  
Good luck!
