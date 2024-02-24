---
title: "[mac os x tutorial] How to FLATTEN a directory or folder using the Terminal command"
date: "2016-11-15"
---

If you have a folder with many subfolders that you want to FLATTEN, meaning, move all the sub or sub-sub-folders' content into the root folder.  
Open the Mac OS X Terminal and cd your way into the folder you want to be the root folder.  
for example:  
_cd ~/Desktop/my-folder_  
  
And then run this command, AFTER changing 2 places where it says \[DIRECTORY\] to your current directory path (if there are spaces in the path, wrap the whole path with "s):  
  
_find \[DIRECTORY\] -mindepth 2 -type f -exec mv -i '{}' \[DIRECTORY\] ';'_  
  
eg, it will look like this:  
_find_ _~/Desktop/my-folder_ _-mindepth 2 -type f -exec mv -i '{}'_ _~/Desktop/my-folder_ _';'_  
Hope this little script helps you flatten mac os x directories or indented sub folder hierarchy into a flat structure!
