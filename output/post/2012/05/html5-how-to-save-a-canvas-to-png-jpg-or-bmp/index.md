---
title: "HTML5: How to save a canvas to PNG, JPG or BMP"
date: "2012-05-03"
categories: 
  - "software"
---

I want to save the contents of a canvas element to a file.  
[I came across this wonderful library for saving html5 canvas elements to image file](http://www.nihilogic.dk/labs/canvas2image/)  
  
You import 2 JS libraries, get the canvas from the DOM, and call this function:  
_Canvas2Image.saveAsPNG(canvas);_   
The user will get a save dialog.
