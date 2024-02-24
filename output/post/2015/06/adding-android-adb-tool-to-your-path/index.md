---
title: "Adding Android adb tool to your $PATH"
date: "2015-06-12"
---

Android Studio v1.2 installs the adb tool in this path:

```
~/Library/Android/sdk/platform-tools/adb
```

So it goes like this:

1. Run Terminal
2. run `adb version` and expect an error output
3. `touch ~/.bash_profile`
4. `open ~/.bash_profile`
5. add the above path before the 'closing' :$PATH
6. `source ~/.bash_profile`
7. run `adb version` and expect an output

Good luck!
