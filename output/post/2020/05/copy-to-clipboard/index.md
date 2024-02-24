---
title: "Copy to clipboard"
date: "2020-05-29"
categories: 
  - "software"
---

While working on the [Baking Blogger's special characters panel](http://www.nurne.com/2010/11/blog-post_27.html), I needed a way to copy the selected character to the clipboard. I used the [following technique](http://www.javapractices.com/topic/TopicAction.do?Id=82):

  

_import java.awt.Toolkit;_

_import java.awt.datatransfer.\*;_

_TextTransfer clipBoard = new TextTransfer();_

_Clipboard clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();_

_clipboard.setContents(stringSelection, this);_

_clipBoard.setClipboardContents(button4.getText());_

_class TextTransfer implements ClipboardOwner {_

_@Override_

_public void lostOwnership(Clipboard clipboard, Transferable contents) {_

_}_

_public void setClipboardContents(String aString) {_

_StringSelection stringSelection = new StringSelection(aString);_

_Clipboard clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();_

_clipboard.setContents(stringSelection, this);_

_}_

_}_

Start with writing a class that implements the ClipboardOwner interface. This enforces you to implement the method setClipaordContents(String string){}
