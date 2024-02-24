---
title: "How To implement an iOS Integration Tests using GHUnit"
date: "2012-02-17"
categories: 
  - "software"
---

I decided to use [GHUnit as a unit testing framework](http://gabriel.github.com/gh-unit/docs/appledoc_include/guide_testing.html), based on the [recommendation in this article that compares the available frameworks.](http://paulsolt.com/2010/11/iphone-unit-testing-explained-part-1/)  
  
Implementing an integration test for the iOS platform is easy using GHUnit. You simply implement an asynchronous unit test. I used the ASIHttp framework for asynchronous requests, so I used it's success-failure-callbacks mechanism. You can replace the success-failure mechanism with whichever provided by the framework you're using.  
  
Here's the boilerplate:  
  
_#import  
  
@interface MyIntegrationTests : GHAsyncTestCase  
  
@end  
  
  
@implementation MyIntegrationTests  
  
\- (void) testAsyncRequest  
  
{  
  
// prepare for async unit test:  
  
\[self prepare\];  
  
// send your request here  
  
// wait for success callback upto 10 seconds (or whatever you choose)  
  
\[self waitForStatus:kGHUnitWaitStatusSuccess timeout:10.0\];  
  
}  
  
\- (void)requestFinished:(ASIHTTPRequest \*)request  
  
{  
  
// notify a success  
  
\[self notify:kGHUnitWaitStatusSuccess forSelector:@selector(testAsyncRequest)\];  
  
}  
  
\- (void)requestFailed:(ASIHTTPRequest \*)request  
  
{  
  
// notify a failure  
  
\[self notify:kGHUnitWaitStatusFailure forSelector:@selector(testAsyncRequest)\];  
  
}  
  
@end_  
Hope this snippet helps you with implementing integration tests with your iOS client and server complex.
