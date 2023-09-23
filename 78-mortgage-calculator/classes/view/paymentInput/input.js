import { updateModel } from '../../utils/updateModel.js';


const init = (getDataFn) => {
  const input = document.querySelector('#input-downpayment');

  // Setup Cleave plugin
  const inputCleave = new Cleave(input, {
    numeral: true,
    numeralThousandsGroupStyle: 'thousand',
    delimiter: ' ',
  });

  // Set default payment
  inputCleave.setRawValue(getDataFn().payment);

  // Input input event handler
  input.addEventListener('input', () => {
    const value = parseInt(inputCleave.getRawValue());

    // Update parent input class name
    input.closest('.field')
      .className = `field ${value >= getDataFn().getMinPayment() && value <= getDataFn().getMaxPayment()
      ? '' : value < getDataFn().getMinPayment() || value > getDataFn().getMaxPayment() ? 'field--error' : ''}`;

    // Update model
    updateModel(input, {
      payment: value,
      onUpdate: 'paymentInput',
    });
  });

  // Input change event handler
  input.addEventListener('change', () => {
    const value = parseInt(inputCleave.getRawValue());

    // Update parent input class name
    input.closest('.field').className = `field ${value > getDataFn().getMaxPayment() || value < getDataFn().getMinPayment() ? '' : ''}`;

    // Update input value
    inputCleave.setRawValue(value > getDataFn().getMaxPayment() ? getDataFn().getMaxPayment() : value < getDataFn().getMinPayment() ? getDataFn().getMinPayment() : value);

    // Update model
    updateModel(input, {
      payment: parseInt(inputCleave.getRawValue()),
      onUpdate: 'paymentInput',
    });
  });

  return inputCleave;
};

export default init;
