---
title: "Raspberry Pi no audio how to fix no audio in rpi"
date: "2015-04-30"
---

I reinstallled my rpi and got no audio out  
The solution I found was:  
1\. install alsa utils by running the following command in the terminal:  

```
sudo apt-get install alsa-utils
```

2\. selecting the required audio out channel, where 0 is auto, 1 is phones and 2 is HDMI:  

```
sudo amixer -c 0 cset numid=3 {out-number}
```
