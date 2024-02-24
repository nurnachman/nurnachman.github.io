---
title: "Bump Version in Xcode with a datetime-stamp"
date: "2017-05-03"
---

In order to create an automatic custom build number that bumps on its own every time you archive a build, add a new build phase of type "run script" and put the following code in the box (remember to check "run only when installing" so it doesn't run every time you build but only when you archive)  
  
#  
\# Set the build number to the current timestamp in a "2016-09-19-11:53:09" format  
\# @author nur  
#  
  
appBuild=$(date +"%Y-%m-%d-%H:%M:%S")  
  

/usr/libexec/PlistBuddy -c "Set :CFBundleVersion $appBuild" "${TARGET\_BUILD\_DIR}/${INFOPLIST\_PATH}"

  
/usr/libexec/PlistBuddy -c "Set :CFBundleVersion $appBuild" "${BUILT\_PRODUCTS\_DIR}/${WRAPPER\_NAME}.dSYM/Contents/Info.plist"

  

hoep this helps you bump internal build numbers for your team using xcode automatically!
