---
title: "snippet: objc: validate an email address"
date: "2014-09-12"
---

\- (BOOL) validateEmailWithString:(NSString\*)email {

    NSString \*emailRegex = @"\[A-Z0-9a-z.\_%+-\]+@\[A-Za-z0-9.-\]+\\\\.\[A-Za-z\]{2,4}"; 

    NSPredicate \*emailTest = \[NSPredicate predicateWithFormat:@"SELF MATCHES %@", emailRegex\]; 

    return \[emailTest evaluateWithObject:email\];

  

}
