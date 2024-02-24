---
title: "How To Send an SMS from a J2ME Application"
date: "2011-03-11"
categories: 
  - "software"
---

I'm writing an application that sends SMSs.  
Instead of writing an SMS editor and contact picker, I decided to use the device's native SMS editor.  
  
So, How to send an SMS from a J2ME application?  
  
Use the MIDlet method : [platformRequest(String url)](http://download.oracle.com/javame/config/cldc/ref-impl/midp2.0/jsr118/javax/microedition/midlet/MIDlet.html#platformRequest(java.lang.String));  
This method accepts Http://www...'s and also the special link for sending an SMS:  
"sms:xxx?body=yyy"  
xxx=number  
yyy=text
