---
title: "Dropbox : How to sync a non-dropbox folder with my dropbox folder"
date: "2013-06-06"
categories: 
  - "software"
---

I want to work on my local xampp files everywhere  
Dropbox is great for that  
  
[Lifehacker explains how to create a connection between a non-dropbox folder to your dropbox folder](http://lifehacker.com/5154698/sync-files-and-folders-outside-your-my-dropbox-folder)  
  
1\. open command prompt with admin permissions  
2\. run this command after changing the folder names:  
  
Mac/Linux:  
_ln -s /path/to/desired-folder path/to/dropbox-folder_  
Windows:  
_mklink /D "C:\\Users\\Nur\\Dropbox\\xampp\_pc" "C:\\Dev\\xampp\\htdocs"_  
that's  
mklink /D "(path to a new folder inside your dropbox)" "(path to the folder you want to sync - htdocs for me)"
