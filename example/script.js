const zee = new ZeeValinator();
const $form = $('form');

const validationRules = [
    {
        element: 'first_name',
        rules: {
            required: 'Please fill in your first name',
        },
    },
    {
        element: 'password',
        rules: {
            required: 'Please fill in a password',
            matchWith: 'password_check|The passwords do not match',
        },
    },
];

$form.on('submit', event => {
    const messages = zee.validate(validationRules);

    // Don't submit the form if there are errors
    if (messages.length) {
        event.preventDefault();
    }
});
