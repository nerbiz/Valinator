import ZeeValinator from '../Core';
import validationRules from './validation-rules';

const zeeValinator = new ZeeValinator();
const $form = $('form');

$form.on('submit', event => {
    const messages = zeeValinator.validate(validationRules);

    // Don't submit the form if there are errors
    if (messages.length) {
        event.preventDefault();
    }
});
