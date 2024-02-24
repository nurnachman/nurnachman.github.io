---
title: "Android : How to display a Toast in the middle of the screen"
date: "2012-10-21"
categories: 
  - "software"
---

I wanted to show a quick message to the user so I chose a Toast. I didn't want the Toast to be in the default bottom position, so I used this snippet:  
  

  
  

_Toast toast = Toast.makeText(getApplicationContext(), "message", Toast.LENGTH\_LONG);_

_toast.setGravity(Gravity.CENTER, 0, 0);_

_toast.show();_

  

I hope this little snippet can help you when you want to change the Android's Toast position :)
