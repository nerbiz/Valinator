export default function()
{
    const self = this;

    /**
     * Get the default checks
     * @return  Object
     */
    self.get = () => {
        return {
            alphanumeric: (value, option) => {
                // Value needs to be alphanumeric
                var result = value.match(/^[a-z\d]+$/gi);
                return (result !== null);
            },
            email: (value, option) => {
                // Value needs to be a valid email address
                var result = value.match(/^.+?@.+?\..+$/g);
                return (result !== null);
            },
            hexColor: (value, option) => {
                // Value needs to be a hexadecimal color, #xxx or #xxxxxx
                var result = value.match(/^#([a-f\d]{3}){1,2}$/gi);
                return (result !== null);
            },
            length: (value, option) => {
                // Value needs to have a fixed length
                return (value.length == parseInt(option, 10));
            },
            match: (value, option) => {
                // Value needs to match the option
                return (value == option);
            },
            matchWith: (value, option) => {
                // Value needs to match the value of another element
                return (value == $('[name="' + option + '"]').val());
            },
            maxLength: (value, option) => {
                // Value needs to have a maximum length
                return (value.length <= parseInt(option, 10));
            },
            maxNumber: (value, option) => {
                // Value needs to be a number, and lower than or equal to the option
                return ( ! isNaN(value - parseFloat(value))  &&  value <= parseFloat(option));
            },
            minLength: (value, option) => {
                // Value needs to have a minimum length
                return (value.length >= parseInt(option, 10));
            },
            minNumber: (value, option) => {
                // Value needs to be a number, and higher than or equal to the option
                return ( ! isNaN(value - parseFloat(value))  &&  value >= parseFloat(option));
            },
            personName: (value, option) => {
                // Value needs to be a valid name
                // Remove accents, before validating the alphabetical characters
                var nameNoAccents = self.characters.removeAccents(value);
                var result = nameNoAccents.match(/^[a-z0-9 \/,.-]+$/gi);
                return (result !== null);
            },
            numeric: (value, option) => {
                // Value needs to be a number
                // From: https://github.com/angular/angular/blob/4.3.x/packages/common/src/pipes/number_pipe.ts#L172
                return ( ! isNaN(value - parseFloat(value)));
            },
            phone: (value, option) => {
                // Value needs to be a valid phone number
                var result = value.match(/^[\d\(\) \+-]+$/g);
                return (result !== null);
            },
            required: (value, option) => {
                // Value can't be empty
                return (value != '');
            },
        };
    };
}
