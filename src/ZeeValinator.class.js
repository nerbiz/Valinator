function ZeeValinator() {
    var self = this;

    /**
     * Class dependency
     * @type ZeeValinatorCharacters
     */
    self.characters = new ZeeValinatorCharacters();

    /**
     * The CSS class to add to an input element that contains an error
     * @type String
     */
    self.inputErrorClass = 'zee-valinator-error';

    /**
     * The HTML tag to use for the error message element
     * @type String
     */
    self.errorMessageTag = 'span';

    /**
     * The CSS class of the error message element that will be added to an input element
     * @type String
     */
    self.errorMessageClass = 'zee-valinator-error-message';

    /**
     * The CSS selector for the error message element
     * @type String
     */
    self.errorMessageSelector = self.errorMessageTag + '.' + self.errorMessageClass;

    /**
     * All the validation checks, in name:function pairs
     * @type Object
     */
    self.checks = {};



    /**
     * Set a custom CSS class for input fields that contain an error
     * @param String  cssClass
     */
    self.setInputErrorClass = function(cssClass) {
        self.inputErrorClass = cssClass;
    };



    /**
     * Set a custom HTML tag to use for adding error message elements
     * @param String  htmlTag
     */
    self.setErrorMessageTag = function(htmlTag) {
        self.errorMessageTag = htmlTag;

        // Also update the error message selector accordingly
        self.errorMessageSelector = self.errorMessageTag + '.' + self.errorMessageClass;
    };



    /**
     * Set a custom CSS class for the error message elements
     * @param String  cssClass
     */
    self.setErrorMessageClass = function(cssClass) {
        self.errorMessageClass = cssClass;

        // Also update the error message selector accordingly
        self.errorMessageSelector = self.errorMessageTag + '.' + self.errorMessageClass;
    };



    /**
     * Set a validation check (new or replace an existing one), that can be used by self.validate
     * @param String    name      The name of the check
     * @param Function  callback  The checking function, needs to return a boolean (true = passed, false = failed)
     *                              This function gets 2 arguments: value and option (option can be null)
     */
    self.newCheck = function(name, callback) {
        // An object with name:function pairs can be given,
        // which will be merged with the existing
        if($.type(name) == 'object')
            self.checks = $.extend(true, self.checks, name);

        // Otherwise use name and callback to add it
        else
            self.checks[name] = callback;
    };



    /**
     * Make sure the given value is/becomes a jQuery element
     * @param  String|jQuery  element
     * @return jQuery
     */
    self.ensureJquery = function(element) {
        if($.type(element) == 'string')
            element = $('[name="' + element + '"]');

        return element;
    };



    /**
     * Remove any errors that are below an input field
     * @param jQuery  $element
     */
    self.removeError = function($element) {
        // Remove the error class from the input element
        $element.removeClass(self.inputErrorClass)
            // Then remove the error message element
            .next(self.errorMessageSelector)
            .remove();
    };



    /**
     * Show an error message below an input field
     * @param jQuery  $element
     * @param String  message
     */
    self.setError = function($element, message) {
        // Add an error message element, if it's not there yet
        if($element.next(self.errorMessageSelector).length < 1) {
            $('<' + self.errorMessageTag + '/>')
                .addClass(self.errorMessageClass)
                .insertAfter($element);
        }

        // Add the error class to the input element
        $element.addClass(self.inputErrorClass)
            // Then set the error message in the error message element
            .next(self.errorMessageSelector)
            .text(message);

        // When the value of the element changes, remove the error
        $element
            // Only 1 binding, so remove it first (event namespace is to prevent turning off (all) other event handlers)
            .off('change.validation keyup.validation paste.validation')
            .on('change.validation keyup.validation paste.validation', function(event) {
                self.removeError($element);
            });
    };



    /**
     * Validate given input fields
     * @param  Array  rules  Rules as objects (will be converted to array, if an object is given)
     *                         element: input name or jQuery element
     *                         rules: validation rules with error message, can have an option, with pipe character
     *                         Example:
     *                         {
     *                             element: $('input[name="password"]'),
     *                             rules: {
     *                                 required: 'Please fill in a password',
     *                                 min: '8|Password needs to be least 8 characters long',
     *                                 matchWith: 'password_check|Passwords need to match'
     *                             }
     *                         }
     *                         To make a value nullable, provide the rule nullable:true
     *                         The other validation rules will then only be applied if the value is not empty, example:
     *                         rules: {
     *                             nullable: true,
     *                             min: '5|The value needs to be at least 5 characters long'
     *                         }
     *                         To make a validation conditional, provide a function instead of a message
     *                         In this example, the field is only required if a particular select option is chosen
     *                         rules: {
     *                             required: function() {
     *                                 if($('select[name="hobby"]').val() == 'other')
     *                                     return 'Please tell us what your hobby is';
     *                             }
     *                         }
     * @return  Array  Collection of error elements as objects: {$element, message}
     */
    self.validate = function(rules) {
        // Make sure the rules are an array
        if($.type(rules) != 'array')
            rules = [rules];

        // Keep track of the elements that have errors
        // Will contain objects: {$element, message}
        var errorElements = [];

        // Loop over the validation rules
        for(var i=-1;  ++i<rules.length;) {
            var rule = rules[i];

            // The same rules can apply to multiple elements, so make sure the element(s) are an array
            if($.type(rule.element) != 'array')
                rule.element = [rule.element];

            // Loop over the elements and check for errors
            for(var j=-1;  ++j<rule.element.length;) {
                // Make sure that the element is a jQuery element
                var $element = self.ensureJquery(rule.element[j]);

                // Continue if the element exists
                if($element.length > 0) {
                    // Clear any current error message
                    self.removeError($element);

                    // Get the (trimmed) value, and update it inside the input field
                    var value = $.trim($element.val());
                    $element.val(value);

                    // Only validate if the value is not nullable,
                    // or if the value is nullable, and the value is not empty
                    if( ! rule.rules.nullable  ||  (rule.rules.nullable  &&  value != '')) {
                        // Loop over the validation rules
                        for(var ruleName in rule.rules) {
                            // Don't validate the 'nullable' rule
                            if(ruleName != 'nullable') {
                                var message = rule.rules[ruleName];
                                var option = null;

                                // If the message is a function, it means it's conditional
                                // First execute the function, to see if validation is needed
                                if($.type(message) == 'function')
                                    message = message();

                                // Only validate, if there is a valid message (which includes a possible option)
                                if($.type(message) == 'string') {
                                    // Split the message to option + message by pipe character
                                    // If it has a pipe character, the part before it is the option
                                    var messageParts = message.split('|', 2);
                                    if(messageParts.length == 2) {
                                        option = messageParts[0];
                                        message = messageParts[1];
                                    }

                                    // Check the value for errors (if the check exists)
                                    if(self.checks[ruleName]  &&  ! self.checks[ruleName](value, option)) {
                                        // Set an error on the element, and keep a reference
                                        self.setError($element, message);
                                        errorElements.push({
                                            $element: $element,
                                            message: message
                                        });
                                        // In case of error, don't do another validation on the same element
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return errorElements;
    };



    /**
     * Set some validation checks, to be used by self.validate
     */
    (self.setChecks = function() {
        self.newCheck({
            alphanumeric: function(value, option) {
                // Value needs to be alphanumeric
                var result = value.match(/^[a-z\d]+$/gi);
                return (result !== null);
            },
            email: function(value, option) {
                // Value needs to be a valid email address
                var result = value.match(/^.+?@.+?\..+$/g);
                return (result !== null);
            },
            hexColor: function(value, option) {
                // Value needs to be a hexadecimal color, #xxx or #xxxxxx
                var result = value.match(/^#([a-f\d]{3}){1,2}$/gi);
                return (result !== null);
            },
            length: function(value, option) {
                // Value needs to have a fixed length
                return (value.length == parseInt(option, 10));
            },
            match: function(value, option) {
                // Value needs to match the option
                return (value == option);
            },
            matchWith: function(value, option) {
                // Value needs to match the value of another element
                return (value == $('[name="' + option + '"]').val());
            },
            maxLength: function(value, option) {
                // Value needs to have a maximum length
                return (value.length <= parseInt(option, 10));
            },
            maxNumber: function(value, option) {
                // Value needs to be a number, and lower than or equal to the option
                return ( ! isNaN(value - parseFloat(value))  &&  value <= option);
            },
            minLength: function(value, option) {
                // Value needs to have a minimum length
                return (value.length >= parseInt(option, 10));
            },
            minNumber: function(value, option) {
                // Value needs to be a number, and higher than or equal to the option
                return ( ! isNaN(value - parseFloat(value))  &&  value >= option);
            },
            personName: function(value, option) {
                // Value needs to be a valid name
                // Remove accents, before validating the alphabetical characters
                var nameNoAccents = self.characters.removeAccents(value);
                var result = nameNoAccents.match(/^[a-z0-9 \/,.-]+$/gi);
                return (result !== null);
            },
            numeric: function(value, option) {
                // Value needs to be a number
                // From: https://github.com/angular/angular/blob/4.3.x/packages/common/src/pipes/number_pipe.ts#L172
                return ( ! isNaN(value - parseFloat(value)));
            },
            phone: function(value, option) {
                // Value needs to be a valid phone number
                var result = value.match(/^[\d\(\) \+-]+$/g);
                return (result !== null);
            },
            required: function(value, option) {
                // Value can't be empty
                return (value != '');
            }
        });
    })();
}
