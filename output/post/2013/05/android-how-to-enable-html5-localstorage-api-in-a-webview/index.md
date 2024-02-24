---
title: "Android : How to enable HTML5 LocalStorage API in a WebView"
date: "2013-05-29"
categories: 
  - "software"
---

_webView.getSettings().setJavaScriptEnabled(true); // enable javascript_

_// enable local storage_

_webView.getSettings().setDatabaseEnabled(true);_

_webView.getSettings().setDatabasePath("/data/data/" + getPackageName() + "/databases");_

  

_webView.getSettings().setDomStorageEnabled(true);_
