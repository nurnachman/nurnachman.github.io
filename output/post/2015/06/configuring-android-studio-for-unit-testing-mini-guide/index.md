---
title: "Configuring Android Studio for Unit Testing mini-guide"
date: "2015-06-12"
---

I compiled a mini guide for configuring your project to use unit tests in Android studio, utilizing the mature JUnit framework:

1. Create a folder in which you'll write all your unit tests (preferably _com.example.app.**tests**_)
2. Create a new test class (preferably _NameOfClassTested**Tests**, i.e BankAccountLoginActivity**Tests**_)

1. Extend _InstrumentationTestCase_
2. Write a failing unit test to make sure we succeeded configuring unit tests
3. Note that a unit test method name must start with the word “_**test**_” (preferably _**test**TestedMethodNameExpectedResult() i.e **test**BankAccountValidationFailedShouldLogout()_)

4. Configure your project for unit tests:

1. Open the 'Run...' menu and click 'edit configurations'
2. Click the + button
3. Select the Android Tests template
4. Input a name for your run configuration (preferably '_AppName Tests'_)
5. Select your app in the module combobox
6. Select the “All In Package” radio button (generally you'd want to select this option because it runs all unit tests in all your test classes)
7. Fill in the test package name from step 1 (i.e _com.example.app.tests_)
8. Select the device you wish to run your tests on
9. Apply and save the configuration

6. Run unit tests (and expect failure):

1. Select your newly created Tests configuration from the Run menu
2. Click Run and read the results in the output console

  

Good luck making your code more readable, maintainable and well-tested!
