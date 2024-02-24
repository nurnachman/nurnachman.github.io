---
title: "Android : How to Scale a Bitmap"
date: "2013-05-23"
categories: 
  - "software"
---

How do you scale a Bitmap in Android?

  

use this method:

_public static Bitmap scaleBitmap(Bitmap photo, float scaleFactor){_

_System.out.println("before: "+ photo.getHeight() + " \* " + photo.getWidth());_

_int width = photo.getWidth();_

_int height = photo.getHeight();_

_float scaleWidth = ((float) photo.getWidth()) \* scaleFactor / width;_

_float scaleHeight = ((float) photo.getHeight()) \* scaleFactor / height;_

_// create a matrix for the manipulation_

_Matrix matrix = new Matrix();_

_// resize the bit map_

_matrix.postScale(scaleWidth, scaleHeight);_

_// recreate the new Bitmap_

_Bitmap scaledPhoto = Bitmap.createBitmap(photo, 0, 0, width, height,_

_matrix, false);_

_System.out.println("before: "+ scaledPhoto.getHeight() + " \* " + scaledPhoto.getWidth());_

_return scaledPhoto;_

_}_

I hope it helps you when you want to resize a Bitmap in Android
