---
title: "How to fix : Gradle error: could not execute build using gradle distribution"
date: "2017-03-19"
---

if you're trying to build your project in eclipse or android studio and get this error:  

### [Gradle error: could not execute build using gradle distribution](http://stackoverflow.com/questions/18673636/gradle-error-could-not-execute-build-using-gradle-distribution)

Or something similar, then you should:  
1\. Close your IDE.  
2\. Open a terminal.  
3\. Run this: mv ~/.gradle/ ~/old.gradle(which is basically renaming the hidden folder .gradle in your home directory to old.gradle folder - to keep a backup)4\. Build your project in your IDE.5. Now a new .gradle hidden folder will be created and **you're ready to go!\\**  
hope this little tip helps you with solving the issue of getting  
**_Gradle error: could not execute build using gradle distribution_**
