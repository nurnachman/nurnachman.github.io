---
title: "How to fix Custom Font alignment problem in iOS 6"
date: "2013-10-29"
categories: 
  - "software"
---

While implementing custom fonts in an iOS app I built, I had a difference between the iOS 7 appearance of the font and the iOS 6. In the iOS 6 version, the text appeared about 10 pixels higher than in iOS 7. 
  
Here's the best solution I found:  
  
1\. Download and Install Apple's Font Tools here: https://developer.apple.com/downloads/index.action?q=font (the download link is in the bottom)  
2\. Open the terminal and cd your way to where your font is  
3\. Run this command: ftxdumperfuser -t hhea -A d MY\_FONT\_NAME.ttf  
4\. Now you have an xml file with some of the font's properties, edit it in your text editor  
5\. Search for the "lineGap" property and add 200 to its value  
6\. Save the xml file  
7\. Run this command: ftxdumperfuser -t hhea -A f MY\_FONT\_NAME.ttf  
8\. Delete the xml file  
9\. Try the configured font on iOS 6 and see if it looks better.  
10\. If you need, you can go back to step 3 and add/subtract to the "lineGap" property. (I ended up adding 250 to my configuration)  
  
Good luck fixing your custom font on iOS 6!
