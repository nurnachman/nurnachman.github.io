---
title: "Android : How to attach an image file from a URL to a new email intent"
date: "2012-07-30"
categories: 
  - "software"
---

I wanted to attach a file from the web to an email.  
After a whole day of R&D, here's how:  
  
  

```
URL url = new URL(urlAddress);HttpURLConnection connection = (HttpURLConnection) url.openConnection();connection.setDoInput(true);connection.connect();InputStream input = connection.getInputStream();Bitmap immutableBpm = BitmapFactory.decodeStream(input);Bitmap mutableBitmap = immutableBpm.copy(Bitmap.Config.ARGB_8888, true);View view  = new View(this);view.draw(new Canvas(mutableBitmap));String path = Images.Media.insertImage(getContentResolver(), mutableBitmap, "Nur", null);Uri uri = Uri.parse(path);final Intent emailIntent = new Intent(android.content.Intent.ACTION_SEND);emailIntent.putExtra(Intent.EXTRA_STREAM, uri);emailIntent.setType("image/png");startActivity(Intent.createChooser(emailIntent, "Send mail..."));
```

  
  
Hope this snippet helps you with attaching an image from a URL to an email intent in Android! :)
