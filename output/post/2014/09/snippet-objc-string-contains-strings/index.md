---
title: "snippet: objc: string contains strings[]"
date: "2014-09-12"
---

objective-c snippet that checks if your input string contains any of the string in the array  
  
if (\[ @\[@"first" , @"second", @"third"\] indexOfObject:inputString\] != NSNotFound) {  
// contains  
}
