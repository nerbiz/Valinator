export default [
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
