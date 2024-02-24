---
title: "Android: How to create round corners in layouts"
date: "2012-11-19"
categories: 
  - "software"
---

I'm writing an app in which the corners of the layout should be rounded. So how do I make the corners round? It's very easy:  
  
1\. Create a new xml file in drawable with this content ("rounded\_corners.xml"):  

  
  

xml version\="1.0" encoding\="utf-8"?>

<layer-list xmlns:android\="http://schemas.android.com/apk/res/android" \>

  

    <item android:bottom\="3px"\>

        <shape android:shape\="rectangle" \>

            <solid android:color\="#fff" />

  

            <corners android:radius\="7dp" />

        </shape\>

    </item\>

  

</layer-list\>

  

2\. Set the background of the layout to the xml file we created in step 1

...

android:background\="@drawable/rounded\_corners"

...

  

  

That's it!

Hope it helps you create round corners in your Android app :)
