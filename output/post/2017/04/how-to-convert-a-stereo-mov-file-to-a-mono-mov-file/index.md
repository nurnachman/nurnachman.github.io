---
title: "how to convert a stereo mov file to a mono mov file"
date: "2017-04-14"
---

so you recorded a whole bunch of video only to find out that you hear the microphone only on one side?

  

no problem

  

just open terminal and run this command:

  

ffmpeg -i inFile.mov -map 0:0 -vcodec copy -c:a pcm\_s24le -map 0:1 -filter:a:0 "pan=mono|c0=c0" outFile-mono.mov

  
  
of course change inFile and outFile-mono to the filenames of your choice  
  
hope this helps you convert stereo 1-side only into a mono track which fixes the problem easily
