function ZeeValinatorDefaultChecks() {
    var self = this;



    /**
     * Get the default checks
     * @return  Object
     */
    self.get = function() {
        return {
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
                return ( ! isNaN(value - parseFloat(value))  &&  value <= parseFloat(option));
            },
            minLength: function(value, option) {
                // Value needs to have a minimum length
                return (value.length >= parseInt(option, 10));
            },
            minNumber: function(value, option) {
                // Value needs to be a number, and higher than or equal to the option
                return ( ! isNaN(value - parseFloat(value))  &&  value >= parseFloat(option));
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
        };
    };
}
