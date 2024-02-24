---
title: "Android: R.java not generated"
date: "2012-11-08"
categories: 
  - "software"
---

I started a new Android project, and it didn't generate the R.java file.  
The solution:  
1\. Remove all imports of R.java in your source  
2\. Begin writing a line of code that uses the R.java: _"R.id.............."_ and now the R.java file should be generated.  
  
Hope this helps you when your Android R.java file does not get generated automatically.
