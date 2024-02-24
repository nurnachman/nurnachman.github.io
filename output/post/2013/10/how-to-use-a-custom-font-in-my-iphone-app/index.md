---
title: "How to use a custom font in my iPhone app"
date: "2013-10-28"
categories: 
  - "software"
---

I received some custom fonts from the designer to use in an iPhone app I'm developing.  
Stackoverflow gave some ideas, and the best method I found is this:  
  
1\. Convert font file to TTF using this online tool: [http://www.freefontconverter.com/](http://www.freefontconverter.com/)  
2\. Add the TTF files to your project  
3\. Make some configurations to your info.plist file:  
3.1 Edit info.plist as source code (right click on file -> open as -> source code)  
3.2 Add this:  
  
`    UIAppFonts      font1.ttf   font2.ttf   ...etc...          `  
3.3 Your info.plist should have this now:  
  

[![](https://nurnachman.files.wordpress.com/2013/10/6ce7b-fonts.png?w=300)](https://nurnachman.files.wordpress.com/2013/10/6ce7b-fonts.png)

  
4\. Use the new fonts just like the system fonts:  
`    [UIFont fontWithName:@"font1" size:16.0];    `  
(Notice no ".ttf" in the font name)  
  
Good luck using your own fonts in your iphone app!
