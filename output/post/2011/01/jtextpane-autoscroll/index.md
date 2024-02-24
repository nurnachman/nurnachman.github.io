---
title: "JTextPane autoscroll"
date: "2011-01-18"
categories: 
  - "software"
---

How to scroll to the end of an updating JTextPane

  

While working on a Chat client for school, I needed a way to scroll down to the end of the chat conversation JTextPane every time a message was sent.

  

I found the solution in [coderanch.com](http://www.coderanch.com/t/339862/GUI/java/make-JScrollPane-autoscroll-down-JTextArea)

  

  

_JTextPane output = new JTextPane();_

_output.setCaretPosition(output.getDocument().getLength());_

  

[javadoc](http://download.oracle.com/javase/1.5.0/docs/api/javax/swing/text/JTextComponent.html#setCaretPosition(int)) for setCaretPosition()
