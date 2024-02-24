---
title: "Cat Food and Information Hiding"
date: "2011-07-01"
categories: 
  - "software"
---

Today I went to buy Mizi some cat food. I didn't want to carry the boxes all the way home, and I knew the pet shop had a delivery service.  
  
I asked the shopkeeper _"Do you still deliver now?"_  
  
My question brought to my mind an Object-Oriented Design principle. [Information Hiding.](http://en.wikipedia.org/wiki/Information_hiding)  
  
I trusted the shopKeeper's API, queried it for a definite answer and acted accordingly.  
  
His Java method would look like this:  
`public boolean isDeliveringNow(){}`  
  
And my logic would be:  
`if(shopKeeper.isDeliveringNow()){   shop();   }   else{   comeBackTomorrow();   }`  
  
I could have asked him _"What time do you stop delivering?"_ and implement my own logic to respond to his answer.  
  
Or even worse, I could have asked the guy _"What are the shop's delivery hours?"_ and get an array of dates and times that I would have to process.  
  
The concept of Information Hiding basically says that we should design our software so that others can interact with it without knowing all the tiny details inside our machine's logic. If we updated our logic, their interface with our API would stay unchanged.  
  
In the context of specificity of questions, I think that you should start from the most specific question. If you're not understood or the answer seems wrong, start drilling down to the lower levels of the information.  
  
Take into consideration that it would make you implement a lot of logic and look like a suspicious person.  
  
And another thought. When you ask someone "Why didn't you do XYZ?", what do you mean? Do you want her to do XYZ, or do you want an excuse why she didn't do XYZ? This question returns an excuse. We don't want an excuse, we want action. Find a better way of leading to action, like just saying "Please do XYZ."  
  

[![](https://nurnachman.files.wordpress.com/2011/07/8a286-blackbox.jpg?w=300)](https://nurnachman.files.wordpress.com/2011/07/8a286-blackbox.jpg)
