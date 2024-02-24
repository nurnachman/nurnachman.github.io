---
title: "iOS: recursive view subviews logging"
date: "2018-12-26"
---

func logViewHierarchy(view) {     print(view)     for subview in view.subviews {         logViewHierarchy(subview)     } }
