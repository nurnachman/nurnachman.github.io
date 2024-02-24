---
title: "Mac: How to flatten a directory structure"
date: "2013-09-19"
categories: 
  - "software"
---

I wanted to upload a lot of videos to my picasa cloud  
The problem: videos are in sub-sub-folders by date, and I don't want to open each sub-sub-folder and drag the video from there...  
The solution: a command that flattens the directory structure:  
  
_find '/path/to/source/folder' -iname '\*.\*' -exec cp \\{\\} '/path/to/destination/folder' \\;_
