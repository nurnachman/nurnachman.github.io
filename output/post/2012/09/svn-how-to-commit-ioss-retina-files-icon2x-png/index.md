---
title: "SVN : How to commit iOS's retina files icon@2x.png"
date: "2012-09-06"
categories: 
  - "software"
---

I tried committing changes made to the iOS file icon@2x.png (which is the retina version of icon.png)

SVN didn't cooperate.

  

This doesn't work:

_svn commit icon@2x.png -m "icon changed"_

  

This is how to do it right:

_svn commit icon@2x.png**@** -m "icon changed"_

  

Notice the added "@" in the end of the file name.

  

I hope this solves the problem in iPhone and iOS of how to commit the icon@2x.png file in SVN.

  

Good luck! :)
