import { updateModel } from '../../utils/updateModel.js';

const init = (getDataFn) => {
  const { time, minYear, maxYear } = getDataFn();
  const input = document.querySelector('#input-term');

  // Setup Cleave plugin
  const inputCleave = new Cleave(input, {
    numeral: true,
    numeralThousandsGroupStyle: 'thousand',
    delimiter: ' ',
  });

  // Set default cost
  inputCleave.setRawValue(time);

  // Input input event handler
  input.addEventListener('input', () => {
    const value = parseInt(inputCleave.getRawValue());

    // Update parent input class name
    input.closest('.field')
      .className = `field ${value >= minYear && value <= maxYear
      ? '' : value < minYear || value > maxYear ? 'field--error' : ''}`;

    // Update model
    updateModel(input, {
      time: value,
      onUpdate: 'timeInput',
    });
  });

  // Input change event handler
  input.addEventListener('change', () => {
    let value = isNaN(parseInt(inputCleave.getRawValue())) ? minYear : parseInt(inputCleave.getRawValue());

    // Update parent input class name
    input.closest('.field').className = `field ${value > maxYear || value < minYear ? '' : ''}`;

    // Update input value
    inputCleave.setRawValue(value > maxYear ? maxYear : value < minYear ? minYear : value);

    // Update model
    updateModel(input, {
      time: parseInt(inputCleave.getRawValue()),
      onUpdate: 'timeInput',
    });
  });

  return inputCleave;
};

export default init;
