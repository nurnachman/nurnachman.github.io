---
title: "How to Get Screensize"
date: "2011-03-16"
categories: 
  - "software"
---

In many cases you wish your application to start in different places on the user's screen.  
The following line does just that:  

> _Dimension dim = [Toolkit](http://download.oracle.com/javase/1.4.2/docs/api/java/awt/Toolkit.html).getDefaultToolkit().getScreenSize();_

A nice use is putting a form in the middle of the screen:  

> _setLocation(dim.width / 2 - this.getWidth() / 2, _dim.height / 2 - this.getHeight() / 2_);_
