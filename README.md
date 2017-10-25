# ZeeValinator
JavaScript class for validating input elements.

I need your clothes, your boots, your motorcycle and your HTML forms 😎

## Installation
Use Yarn/NPM to install ZeeValinator.

```cli
// Using Yarn
yarn add zee-valinator

// Or with NPM
npm install zee-valinator --save
```

## Usage

#### Include jQuery before including the ZeeValinator file

```html
<script src="path/to/jquery.min.js"></script>
<script src="node_modules/zee-valinator/dist/zee-valinator.min.js"></script>
```

#### Create a new ZeeValinator object

```js
var zeeValinator = new ZeeValinator();
```

#### Create some validation rules as objects, with 'element' and 'rules' properties

The 'element' property can be either a string (the 'name' attribute of the element you want to validate), or a jQuery object.

```js
var validationRules = [];

validationRules.push({
    element: $('select[name="connor_family_member"]'),
    rules: {
        // This is the 'required' rule, and the message in case the input value is empty
        // As you can see, HTML is supported
        required: 'Please select either <em>John</em> or <em>Sarah</em>'
    }
});
```

Multiple rules for the same element are possible. Some rules have an extra option, like the 'matchWith' rule below. In this example, the 'password' element needs to have the same value as the 'password_check' element.

```js
validationRules.push({
    element: 'password',
    rules: {
        required: 'Please fill in a password, like h4st4-l4-v1st4 or something',
        matchWith: 'password_check|Passwords do not match!'
    }
});
```

To make a rule conditional, or more advanced in any way, use a function. In the example below, clothes (including boots) are only needed when naked. If the rule applies, return the error message string, otherwise return nothing, or just anything that isn't a string.

*Please note:* ZeeValinator checks for a returned string, so ```''``` will still be treated as an error message, and it could then add the error class to the input element, and add an error message element.

```js
validationRules.push({
    element: 'clothes',
    rules: {
        required: function() {
            var hasClothes = $('input[name="has_clothes"]').prop('checked');

            if( ! hasClothes)
                return 'Please fill in which clothes you need';
        }
    }
});
```

It is also possible to do the same validation on multiple elements, using an element array. In this case, a valid color needs to be given in 3 input elements. Strings and jQuery objects can be mixed in the array.

```js
validationRules.push({
    element: ['clothes', $('input[name="boots"]'), 'motorcycle'],
    rules: {
        hexColor: 'Please set a valid color'
    }
});
```

#### Then run the validation rules!
The validate() method returns an array of objects, containing elements that have an error, and their error message.

ZeeValinator stops after the first error, per element. So if there are 3 rules for an element, and the second one fails, the third rule will not be checked, and it will move on to the next element, if there is one of course.

ZeeValinator sets the CSS class 'zee-valinator-error' on input elements that contain an error, and it creates a span element with the 'zee-valinator-error-message' CSS class for the error messages, right after the corresponding input element.

```js
// Pass validation rules to the validate() method
var result = zeeValinator.validate(validationRules);

/*
result:
[
    {
        $element: The element containing an error (jQuery object)
        message: The error message for the element
    }
]
*/

// Of course you can also provide an array directly
zeeValinator.validate([
    { /* Validation rule */ },
    { /* Validation rule */ }
]);

// Using only 1 rule object is also possible
zeeValinator.validate({ /* Validation rule */ });
```

## Available validations
This is the list of all validations that ZeeValinator has out of the box, please keep an eye on this list, because I'll be adding more (or maybe you will? see the 'Contributing' section):

* **alphanumeric**: Needs to contain only letters and numbers (case-insensitive).
* **email**: Needs to be a valid email address.
* **hexColor**: Needs to be a valid hexadecimal color (#xxx or #xxxxxx).
* **length**: Needs to be exactly # characters long.
    * length: '8|Value needs to be exactly 8 characters long'
* **match**: Needs to match an exact value.
    * match: 'test|Please type the word "test"'
* **matchWith**: Needs to match with the value of another input element.
    * matchWith: 'password_check|Please type the same password in both fields'
* **maxLength**: Needs to be at most # characters long.
    * length: '8|Value needs to be at most 8 characters long'
* **maxNumber**: Needs to be a number, and lower than or equal to #.
    * '8|Value cannot be higher than 8'
* **minLength**: Needs to be at least # characters long.
    * length: '8|Value needs to be at least 8 characters long'
* **minNumber**: Needs to be a number, and higher than or equal to #.
    * '8|Value cannot be lower than 8'
* **personName**: Needs to be a valid person name.
* **numeric**: Needs to be a number.
* **phone**: Needs to be a valid phone number.
* **required**: Needs to be filled in, selected or checked.

## Configuring
To change the CSS classes, and the HTML tag name for the error message element, use these methods:

```js
zeeValinator.setInputErrorClass('new-input-error-class');
zeeValinator.setErrorMessageTag('div');
zeeValinator.setErrorMessageClass('new-error-message-class');
```

ZeeValinator comes shipped with many validation options, but you can add your own, or overwrite the existing ones. The newCheck() method needs the name of the validation, and the function that does the validation, alternatively, it accepts an object with name:function pairs. The function takes a value and option and needs to return a boolean, true for passed, false for failed. The option parameter is optional, and only used for validations like 'minLength' or 'matchWith'.

```js
// Create new validation logic
zeeValinator.newCheck('isJohnConnor', function(value, option) {
    // See if the person filling in your form is John Connor
    return (value == 'John Connor');
});

// Then use it as usual
zeeValinator.validate({
    element: $('input[name="full_name"]'),
    rules: {
        isJohnConnor: 'Only Johnny Boy is allowed to fill in this form'
    }
});

// Overwrite existing logic
zeeValinator.newCheck('required', function(value, option) {
    // Apart from not being empty (required), the value has to be 'motorcycle'
    return (value == 'motorcycle');
});
```

The above can also be done with 1 call, using an object as the only argument

```js
zeeValinator.newCheck({
    isJohnConnor: function(value, option) {
        // See if the person filling in your form is John Connor
        return (value == 'John Connor');
    },
    required: function(value, option) {
        // Apart from not being empty (required), the value has to be 'motorcycle'
        return (value == 'motorcycle');
    }
});
```

The error handling can also be overwritten, with the setCustomErrorHandlers() method. The first argument is the 'set error' callback, the second argument is the 'remove error' callback. Either one of these can be null, if you wish to keep te default for it.

```js
zeeValinator.setCustomErrorHandlers(
    // The 'set error' callback gets the ZeeValinator object,
    // the element that contains an error (jQuery object) and the error message
    function(zee, $element, message) {
        // ...
    },
    // The 'remove error' callback gets the same, minus the error message
    function(zee, $element) {
        // ...
    }
);
```

To make writing custom error handlers a little easier, the properties below are accessible inside the callbacks. You could do something completely different of course, but here they are for reference:

```js
// Input elements with errors get this CSS class (default: 'zee-valinator-error')
zee.inputErrorClass

// The HTML tag of the error element (default: 'span')
zee.errorMessageTag

// The CSS class of the error element (default: 'zee-valinator-error-message')
zee.errorMessageClass

// The error message tag and CSS class concatenated (default: 'span.zee-valinator-error-message')
zee.errorMessageSelector

// The error message jQuery element, using the above
// When using this, please use zee.$errorMessageElement.clone(),
// Otherwise the same jQuery object will be reused
zee.$errorMessageElement
```

## Styling
Only 2 CSS selectors are needed in your styling.  
Of course this differs if you've set some other tag or CSS class (see the 'Configuring' section).

```css
/* Input elements that contain errors */
.zee-valinator-error {
    border-color: #F00;
}

/* Elements containing error messages */
span.zee-valinator-error-message {
    color: #F00;
    font-size: 90%;
}
```

## Contributing
The validation logic is extendable and overwritable (see the 'Configuring' section), so if you have some great validation logic, please don't hesitate to do a pull request.

## Dependencies
The only dependency is [jQuery](http://jquery.com/).

## License
This project uses the [Unlicense](http://unlicense.org/).
