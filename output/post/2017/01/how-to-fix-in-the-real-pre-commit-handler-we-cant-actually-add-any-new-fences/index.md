---
title: "How to fix this message in iOS 10 development: [App] if we're in the real pre-commit handler we can't actually add any new fences due to CA restriction"
date: "2017-01-09"
---

This message started popping up in my console a lot, here's how to fix it:  
  
1\. click the run-scheme you're debugging  
2\. click "Edit Scheme..."  
3\. in the "Run (debug)" tab - pick "Arguments"  
4\. click + in the "Environment Variables" to add an argument  
5\. enter "OS\_ACTIVITY\_MODE" as the name  
6\. enter "disabled" as the value  
7\. click close, clean project and run again!  
  
this is how to solve this message on xcode in ios 10  
  
\[App\] if we're in the real pre-commit handler we can't actually add any new fences due to CA restriction  
  
let me know if it was helpful in the buttons below!
