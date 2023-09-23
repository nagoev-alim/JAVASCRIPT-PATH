import { updateModel } from '../../utils/updateModel.js';

const init = (getDataFn) => {
  const { cost, minPrice, maxPrice } = getDataFn();
  const slider = document.querySelector('#slider-cost');

  // Setup noUiSlider plugin
  noUiSlider.create(slider, {
    start: cost,
    connect: 'lower',
    tooltips: true,
    step: 100000,
    range: {
      min: minPrice,
      '1%': [400000, 100000],
      '50%': [10000000, 500000],
      max: maxPrice,
    },
    format: wNumb({
      decimals: 0,
      thousand: ' ',
      suffix: '',
    }),
  });

  // Slider change event handler
  slider.noUiSlider.on('slide', () => {
    // Get current value
    let sliderValue = slider.noUiSlider.get();
    // Format value
    sliderValue = sliderValue.split('.')[0];
    sliderValue = parseInt(String(sliderValue).replace(/ /g, ''));
    // Update model
    updateModel(slider, {
      cost: sliderValue,
      onUpdate: 'costSlider',
    });
  });

  return slider;
};

export default init;
