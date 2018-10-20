import Characters from './Characters';
import DefaultChecks from './DefaultChecks';

export default function()
{
    const self = this;

    /**
     * Dependencies
     * @type Object
     */
    self.characters = new Characters();
    self.defaultChecks = new DefaultChecks();

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
     * The error message element as a jQuery object, for convenience
     * Clone it before working with it, otherwise the same element will be reused
     * @type jQuery
     */
    self.$errorMessageElement = $('<' + self.errorMessageTag + '/>').addClass(self.errorMessageClass);

    /**
     * All the validation checks, in name:function pairs
     * @type Object
     */
    self.checks = {};

    /**
     * Custom error handler, that will overwrite the defaults
     * One for setting errors, the other for removing them
     * @type Function
     */
    self.customSetError = null;
    self.customRemoveError = null;

    /**
     * Set a custom CSS class for input fields that contain an error
     * @param String  cssClass
     */
    self.setInputErrorClass = cssClass => self.inputErrorClass = cssClass;

    /**
     * Set a custom HTML tag to use for adding error message elements
     * @param String  htmlTag
     */
    self.setErrorMessageTag = htmlTag => {
        self.errorMessageTag = htmlTag;

        // Also update the error message selector and element accordingly
        self.errorMessageSelector = self.errorMessageTag + '.' + self.errorMessageClass;
        self.$errorMessageElement = $('<' + self.errorMessageTag + '/>').addClass(self.errorMessageClass);
    };

    /**
     * Set a custom CSS class for the error message elements
     * @param String  cssClass
     */
    self.setErrorMessageClass = cssClass => {
        self.errorMessageClass = cssClass;

        // Also update the error message selector and element accordingly
        self.errorMessageSelector = self.errorMessageTag + '.' + self.errorMessageClass;
        self.$errorMessageElement = $('<' + self.errorMessageTag + '/>').addClass(self.errorMessageClass);
    };

    /**
     * Set a custom error handler, that will be used instead of setError()
     * @param Function  addCallback
     * @param Function  removeCallback
     */
    self.setCustomErrorHandlers = (addCallback, removeCallback) => {
        self.customSetError = addCallback;
        self.customRemoveError = removeCallback;
    };

    /**
     * Set a validation check (new or replace an existing one), that can be used by self.validate
     * @param String    name      The name of the check
     * @param Function  callback  The checking function, needs to return a boolean (true = passed, false = failed)
     *                              This function gets 2 arguments: value and option (option can be null)
     */
    self.newCheck = (name, callback) => {
        // An object with name:function pairs can be given,
        // which will be merged with the existing
        if($.type(name) == 'object') {
            self.checks = $.extend(true, self.checks, name);
        }

        // Otherwise use name and callback to add it
        else {
            self.checks[name] = callback;
        }
    };

    /**
     * Make sure the given value is/becomes a jQuery element
     * @param  String|jQuery  element
     * @return jQuery
     */
    self.ensureJquery = element => {
        if($.type(element) == 'string') {
            element = $('[name="' + element + '"]');
        }

        return element;
    };

    /**
     * Remove any errors that are below an input field
     * @param jQuery  $element
     */
    self.removeError = $element => {
        // Call the custom one, if it exists
        if(self.customRemoveError) {
            self.customRemoveError(self, $element);
        }

        // Otherwise do the default
        else {
            // Remove the error class from the input element
            $element.removeClass(self.inputErrorClass)
                // Then remove the error message element
                .next(self.errorMessageSelector)
                .remove();
        }
    };

    /**
     * Show an error message below an input field
     * @param jQuery  $element
     * @param String  message
     */
    self.setError = ($element, message) => {
        // Call the custom one, if it exists
        if(self.customSetError) {
            self.customSetError(self, $element, message);
        }

        // Otherwise do the default
        else {
            // Add an error message element, if it's not there yet
            if($element.next(self.errorMessageSelector).length < 1) {
                self.$errorMessageElement.clone().insertAfter($element);
            }

            // Add the error class to the input element
            $element.addClass(self.inputErrorClass)
                // Then set the error message in the error message element
                .next(self.errorMessageSelector)
                .html(message);

            // When the value of the element changes, remove the error
            $element
                // Only 1 binding, so remove it first (event namespace is to prevent turning off (all) other event handlers)
                .off('change.zeeValinator keyup.zeeValinator paste.zeeValinator')
                .on('change.zeeValinator keyup.zeeValinator paste.zeeValinator', function(event) {
                    self.removeError($element);
                });
        }
    };

    /**
     * Validate given input fields
     * @param  Array  definitions  Rule definitions as objects (will be converted to array, if an object is given)
     *                             element: input name or jQuery element
     *                             rules: validation rules with error message, can have an option, with pipe character
     *                             Example:
     *                             {
     *                                 element: $('input[name="password"]'),
     *                                 rules: {
     *                                     required: 'Please fill in a password',
     *                                     min: '8|Password needs to be least 8 characters long',
     *                                     matchWith: 'password_check|Passwords need to match'
     *                                 }
     *                             }
     *                             To make a value nullable, provide the rule nullable:true
     *                             The other validation rules will then only be applied if the value is not empty, example:
     *                             rules: {
     *                                 nullable: true,
     *                                 min: '5|The value needs to be at least 5 characters long'
     *                             }
     *                             To make a validation conditional, provide a function instead of a message
     *                             In this example, the field is only required if a particular select option is chosen
     *                             rules: {
     *                                 required: function() {
     *                                     if($('select[name="hobby"]').val() == 'other')
     *                                         return 'Please tell us what your hobby is';
     *                                 }
     *                             }
     * @return  Array  Collection of error elements as objects: {$element, message}
     */
    self.validate = definitions => {
        // Make sure the definitions are an array
        if($.type(definitions) != 'array') {
            definitions = [definitions];
        }

        // Keep track of the elements that have errors
        // Will contain objects: {$element, message}
        var errorElements = [];

        // Loop over the validation definitions
        $.each(definitions, function(definitionIndex, definition) {
            // The same definitions can apply to multiple elements, so make sure the element(s) are an array
            if($.type(definition.element) != 'array') {
                definition.element = [definition.element];
            }

            // Loop over the elements and check for errors
            $.each(definition.element, function(elementIndex, element) {
                // Make sure that the element is a jQuery element
                var $element = self.ensureJquery(element);

                // Continue if the element exists
                if($element.length > 0) {
                    // Only validate enabled elements
                    if($element.prop('disabled') === false) {
                        // Clear any current error message
                        self.removeError($element);

                        // Get the (trimmed) value, and update it inside the input field
                        var value = $.trim($element.val());
                        $element.val(value);

                        // See if the element is nullable
                        var nullable = definition.rules.nullable;
                        if($.type(nullable) == 'function') {
                            nullable = nullable($element);
                        }

                        // Only validate if the value is not nullable,
                        // or if the value is nullable, and the value is not empty
                        if( ! nullable  ||  (nullable  &&  value != '')) {
                            // Loop over the validation rules
                            $.each(definition.rules, function(ruleName, message) {
                                // Don't validate the 'nullable' rule
                                if(ruleName != 'nullable') {
                                    var option = null;

                                    // If the message is a function, it means it's conditional
                                    // First execute the function, to see if validation is needed
                                    if($.type(message) == 'function') {
                                        message = message($element);
                                    }

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
                                            return false;
                                        }
                                    }
                                }
                            });
                        }
                    }
                }
            });
        });

        return errorElements;
    };



    /**
     * Set some validation checks, to be used by self.validate
     */
    (self.setChecks = () => {
        self.newCheck(self.defaultChecks.get());
    })();
};
