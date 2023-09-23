import { updateModel } from '../../utils/updateModel.js';

const init = (getDataFn) => {
  const { cost, minPrice, maxPrice } = getDataFn();
  const input = document.querySelector('#input-cost');

  // Setup Cleave plugin
  const inputCleave = new Cleave(input, {
    numeral: true,
    numeralThousandsGroupStyle: 'thousand',
    delimiter: ' ',
  });

  // Set default cost
  inputCleave.setRawValue(cost);

  // Input input event handler
  input.addEventListener('input', () => {
    const value = parseInt(inputCleave.getRawValue());

    // Update parent input class name
    input.closest('.field')
      .className = `field ${value >= minPrice && value <= maxPrice
      ? '' : value < minPrice || value > maxPrice ? 'field--error' : ''}`;

    // Update model
    updateModel(input, {
      cost: value,
      onUpdate: 'costInput',
    });
  });

  // Input change event handler
  input.addEventListener('change', () => {
    let value = isNaN(parseInt(inputCleave.getRawValue())) ? minPrice : parseInt(inputCleave.getRawValue());

    // Update parent input class name
    input.closest('.field').className = `field ${value > maxPrice || value < minPrice ? '' : ''}`;

    // Update input value
    inputCleave.setRawValue(value > maxPrice ? maxPrice : value < minPrice ? minPrice : value);

    // Update model
    updateModel(input, {
      cost: parseInt(inputCleave.getRawValue()),
      onUpdate: 'costInput',
    });
  });

  return inputCleave;
};

export default init;
