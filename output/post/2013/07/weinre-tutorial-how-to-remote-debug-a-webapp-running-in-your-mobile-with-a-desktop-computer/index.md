---
title: "Weinre tutorial - how to remote-debug a webapp running in your mobile with a desktop computer"
date: "2013-07-04"
categories: 
  - "software"
---

In many cases you want to debug a webapp running on a device  
This can be done with [Weinre](http://people.apache.org/~pmuellr/weinre/docs/latest/Home.html)  
Here is a tutorial to help you install and run Weinre:  
  
1\. Install:  
Run this in the terminal:  
sudo npm -g install weinre  
  
2\. Get your IP:  
run this in the terminal:  
ifconfig  
now detect your ipv4  
  
3\. Run weinre:  
run this in the temrinal:  
weinre --httpPort 4567 --boundHost 10.50.50.77  
(replace 4567 with whatever port you want)  
(replace 10.50.50.77 with the ip you got in step 2)  
  
4\. inject weinre code into the webpage:  
[http://10.50.50.77:4567/target/target-script-min.js](http://10.50.50.77:4567/target/target-script-min.js)  
(replace 4567 with whatever port you want)  
(replace 10.50.50.77 with the ip you got in step 2)  
  
5\. run the weinre console:  
open this url in chrome:  
http://10.50.50.77:4567  
(replace 4567 with whatever port you want)  
(replace 10.50.50.77 with the ip you got in step 2)  
  
6\. open the webpage in your mobile device (make sure your device and server are on the same wifi)  
you should see a client connected in the weinre console  
  
7\. quick check to test everything is working:  
in the 'console' tab in the weinre console, run this javascript:  
alert(1);  
if you see an alert dialog on your device - happy ending!  

  

Hope this tutorial helps you with remote-debugging webapps on your mobile
