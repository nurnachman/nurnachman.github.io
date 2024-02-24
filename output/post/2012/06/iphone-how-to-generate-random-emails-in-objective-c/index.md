---
title: "iPhone : How to generate random emails in Objective-C"
date: "2012-06-20"
categories: 
  - "software"
---

I'm building an app that manages email contacts. I wanted to have mock data. So I wrote this code to generate random strings and emails for me:

  

\- (NSString\*) getRandomEmail

{

    NSString \*answer = \[NSString stringWithFormat:@"%@@%@.com", \[self getRandomString\], \[self getRandomString\]\];

    return answer;

}

  

\- (NSString\*) getRandomString

{

    NSString \*letters = @"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    int len = \[self getRandomIntBetweenBottomInt:1 andTopInt:7\];

    NSMutableString \*randomString = \[NSMutableString stringWithCapacity: len\];

    for (int i=0; i < len; i++) {

        \[randomString appendFormat: @"%C", \[letters characterAtIndex: arc4random() % \[letters length\]\]\];

    }

    return randomString;

}

  

\- (int) getRandomIntBetweenBottomInt:(int)bottom andTopInt:(int)top

{

    int randomNumber = (arc4random() % top) + bottom;

    return randomNumber;

}

  

and this is the result:

  

[![](https://nurnachman.files.wordpress.com/2012/06/dd0ef-screenshot2012-06-20at9-55-03am.png?w=156)](https://nurnachman.files.wordpress.com/2012/06/dd0ef-screenshot2012-06-20at9-55-03am.png)
