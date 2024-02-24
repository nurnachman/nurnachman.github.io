---
title: "how to limit UITextField number of characters"
date: "2016-11-27"
---

When you wan t to limit the number of characters that a user can input to a uitextfield, you can use this uitextfielddelegate method:

  

  

import UIKit

  

class ViewController: UIViewController, UITextFieldDelegate { // make sure you inherit uitextfielddelegate

  

    @IBOutlet weak var textField: UITextField! // your textfield

    let limit = 10

  

    override func viewDidLoad() {

        super.viewDidLoad()

        textField.delegate = self // set myself as the delegate

    }

  

// this method "listens" to changes in the textfield, and you can return true or false as appropriate

    func textField(textField: UITextField, shouldChangeCharactersInRange range: NSRange, replacementString string: String) -> Bool {

        guard let text = textField.text else { return true }

        let newLength = text.characters.count + string.characters.count - range.length

        return newLength <= limit

    }

}
