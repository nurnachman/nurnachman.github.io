---
title: "iOS 10 Swift 3 How to limit input in a UITextField to Digits only (or any other set of characters) - Swift 3 Digits-only text field"
date: "2017-01-10"
---

If you want to create a UITextField that allows only inputting specific characters, simply set your viewcontroller as the text field's delegate and implement this delegate method:

  

_func textField(\_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {_

        if string.characters.count > 0, !"1234567890".contains(string) {  

            return false

        }

_// the rest of your logic goes here..._

  

_}_

  

notice that here I'm allowing only any of these chars: "1234567890"

but your can change the string to any character set you want, for example "abcdefgh"(...) etc

  

notice the negative logic here: if this string is NOT contained in the character set you provided - then return false; else - do the rest of your logic..

  
\[edit:\] also, notice the first if:  _string.characters.count > 0_ which does not prevent deleting characters from the textfield (without this if-condition, you'll prevent your user from backspacing)  
  

Also, it is best practice, of course, to choose the appropriate keyboard type in Interface Builder - based on what you want your user to input:

<table cellpadding="0" cellspacing="0" class="tr-caption-container" style="margin-left:auto;margin-right:auto;text-align:center;"><tbody><tr><td style="text-align:center;"><a href="https://nurnachman.files.wordpress.com/2017/01/adcb2-screen2bshot2b2017-01-102bat2b15-14-04.png" style="clear:left;margin-bottom:1em;margin-left:auto;margin-right:auto;"><img border="0" height="41" src="https://nurnachman.files.wordpress.com/2017/01/adcb2-screen2bshot2b2017-01-102bat2b15-14-04.png?w=261" width="400"></a></td></tr><tr><td class="tr-caption" style="text-align:center;">help your user</td></tr></tbody></table>
