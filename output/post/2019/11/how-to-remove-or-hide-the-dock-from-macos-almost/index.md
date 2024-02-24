---
title: "How to Remove or Hide the Dock from MacOS (almost)"
date: "2019-11-03"
---

If you want to get rid of the list of icons in Mac OS X called the "Dock", there's a way!

You won't rid it _completely,_ but it will be very much _unnoticeable._ The idea is to hide the mac os dock by: auto-hide in the system preferences and make it as small as possible. Making the Dock uncanny small is achieved using the following terminal command:

```
defaults write com.apple.dock tilesize -int 1; killall Dock
```
