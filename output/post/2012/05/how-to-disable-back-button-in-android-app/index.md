---
title: "How to disable BACK button in Android app"
date: "2012-05-01"
categories: 
  - "software"
---

  
To override the back button in an Android application,  
override the Activity method onBackPressed() to return  
  
_public class MyActivity extends Activity {_  
  
_@Override_  
_public void onBackPressed() {_  
_return;_  
_}_  
_}_  

  

EDIT: 

  
Chintan commented that this snippet is also a solution:  
  
_@Override  
public boolean onKeyDown(int keyCode,KeyEvent event) {  
 if ((keyCode == KeyEvent.KEYCODE\_BACK_

    _|| KeyEvent.KEYCODE\_HOME == keyCode_

    _|| KeyEvent.KEYCODE\_SEARCH == keyCode)){  
  return false;  
 }  
 return super.onKeyDown(keyCode, event);_
