---
title: "Android how-to: Multiple ListViews in one LinearLayout"
date: "2011-06-10"
categories: 
  - "software"
---

In an app I'm working on, I wanted to put two ListViews in one LinearLayout.  
How do you show multiple ListViews in a single Activity in an Android app?  
How do you create a UI similar to the Anrdoid Market app UI?  
  
Step 1. Designing a custom layout in a layout .xml file:  
Declare a LinearLayout.  
Declare android:weightSum="1.0". This sets the total weight from which each View on the screen can take part (see in a minute).  
Everywhere you want a ListView, add the element.  
I nested mine inside a vertical LinearLayout, because I added more Views to it. This LinearLayout takes a .4 part of the weight on the screen (Divide how you want).  
(Note: I hid most properties to keep it short)  
  
  
  
  
   
   
   
  
  
  
Step 2. Designing a layout for each item in the ListView:  
You probably want a TextView. I didn't try it, but I guess you can put images here also.  
  
  
Step 3. Filling the List with items in the code:  
create a new class that extends Activity. Note that we are not extending ListActivity which provides a good framework for a single ListView.  
public class MultipleListViews extends Activity  
In the onCreate method, setContentView to your custom layout.  
  
`@Override`  
 `protected void onCreate(Bundle savedInstanceState) {`  
  `super.onCreate(savedInstanceState);`  
  `setContentView(R.layout.custom_layout);`  
`}`  
  
Next, get the ListView object using findViewById.  
  
`ListView lv = (ListView)findViewById(R.id.list_view1);`  
  
Now comes the part we fill-in the items into the list with an array of String, using the ArrayAdapter generic to String  
  
`lv.setAdapter(new ArrayAdapter(this, R.layout.list_item,strings[]));`  
  
  
Repeat step 3 for each ListView you want to populate with items on the Activity.  
  
And that's it! you have a single Android Activity with multiple ListViews!  
  
I hope this how-to helps you create complex custom layouts and advanced apps on Android by showing multiple ListViews in a single Activity.
