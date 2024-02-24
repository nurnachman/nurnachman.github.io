---
title: "How to implement a WKInterfaceTable in WatchKit"
date: "2015-03-15"
---

WKInterfaceTable

1. new projcet
2. new watchkit target

  

1. in the storyboard drag a table
2. drag an outlet to the interface controller

  

1. in code - define a row controller class per defined row controller
2. at init, add rows to table
3. respond to row selections

  

1. select table obj from storyboard
2. open its attributes tab

  

Define a custom row controller class

1. new NSObject subclass
2. @import WatchKit;
3. add IBOutlets per UI obj in your row
4. in storyboard, set row controller class and connect the outlets
5. assign an identifier string to the row (remember it for later when creating a new row)

  

Configure row content in runtime

1. Determine number of rows
2. Determine type of row
3. Iterate through rows using rowConrtollerAtIndex:\[int\]
4. Config the row controller content

  

Respond to row selection

1. impement table:didSelectRowAtIndex:
