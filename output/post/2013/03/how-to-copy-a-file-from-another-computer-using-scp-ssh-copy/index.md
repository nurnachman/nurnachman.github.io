---
title: "How to copy a file from another computer using SCP (SSH copy)"
date: "2013-03-21"
categories: 
  - "software"
---

I needed a file from a friend's computer. I could log in using VNC, but as my friend suggested, I used SCP which is SSH copy.  
  
This is how to copy a file from a remote machine to your local machine using terminal:  
  
_scp username@host:/Users/path/to/remoteFile /Users/nur/Desktop/targetFolder_  
  
Input the correct user's password and you get a copy of the file to your target folder!  
  
Hopefully this tutorial will save you time copying files from a remote computer to your own computer.
