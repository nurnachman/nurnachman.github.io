---
title: "How to install an iPhone system log for mac outputting to the console"
date: "2014-12-17"
---

1\. download and save to {your-path}:  
https://github.com/benvium/libimobiledevice-macosx/zipball/master  
2\. edit bash profile:  
nano ~/.bash\_profile  
3\. add this in the end:  
PATH=${PATH}:/{your-path}/  
export DYLD\_LIBRARY\_PATH=/{your-path}/:$DYLD\_LIBRARY\_PATH  
4\. in terminal, run:  
source ~/.bash\_profile  
5\. use: idevicesyslog
