---
title: "Javascript: How to get string between ( and ) using Regular Expressions"
date: "2013-08-29"
categories: 
  - "software"
---

I wanted to get a string that was surrounded with round brackets "(" and ")"  
  
Here's how:  
  

```
var str = "hi (1111) bye";var re = /\((.*?)\)/;var matches = str.match(re); if (matches) {  var submatch = matches[1]; }
```

  
Then when you print submatch, you get 1111
