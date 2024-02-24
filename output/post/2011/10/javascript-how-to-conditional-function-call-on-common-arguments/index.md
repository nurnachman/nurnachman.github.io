---
title: "JavaScript: how-to conditional function call on common arguments"
date: "2011-10-28"
categories: 
  - "software"
---

While reading the source code of [ImageDiff - a JavaScript library for calculating diff between images](https://github.com/HumbleSoftware/js-imagediff),

I came across a technique for

## conditionally calling one function or another, on the same argument passed to whichever function

. 

  

Here's the snippet:  
`   (x ? alert : prompt) ('hi')`  
  
The value of `x` determines whether `alert('hi')` or `prompt('hi')` will be called. Both functions are passed with `('hi')`.

  

I hope you'll find this snippet useful when you need to

## conditionally decide what function to call, on the same arguments.
