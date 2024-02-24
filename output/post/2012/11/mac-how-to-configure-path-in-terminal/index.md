---
title: "Mac : How to configure $PATH in terminal"
date: "2012-11-13"
categories: 
  - "software"
---

Most developers use a terminal in Mac from time to time. Sometimes, the $PATH gets ruined. So this is how to change it permanently in terminal:  
  
1\. What is my current $PATH? type "_echo $PATH_"

  

2\. Adding "newpath" to your $PATH in the current terminal session (will be deleted when you close terminal):

"_export PATH=$PATH:/newpath_"  
  
3\. Setting the $PATH permanently:

3.1 (\*change "USER" with your mac username)

"_nano ~USER/.bash\_profile_"

3.2 add paths to the file separated with ":"

"PATH=$PATH:/newpath1:/newpath2:/new/path/3"

3.3 \[control\]+\[x\] to exit, \[y\] to save changes, \[enter\] to overwrite the file

  

Hope this helps you configuring your mac os x path with terminal and use all the command line tools you need handy

  

  

[![](https://nurnachman.files.wordpress.com/2012/11/d99c0-screenshot2012-11-13at3-20-07pm.png?w=300)](https://nurnachman.files.wordpress.com/2012/11/d99c0-screenshot2012-11-13at3-20-07pm.png)
