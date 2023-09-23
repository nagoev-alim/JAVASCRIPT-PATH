import { updateModel } from '../../utils/updateModel.js';

const init = (getDataFn) => {
  const slider = document.querySelector('#slider-downpayment');

  // Setup noUiSlider plugin
  noUiSlider.create(slider, {
    start: getDataFn().paymentPercents * 100,
    connect: 'lower',
    tooltips: true,
    step: 1,
    range: {
      min: getDataFn().minPaymentPercents * 100,
      max: getDataFn().maxPaymentPercents * 100,
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
      paymentPercents: sliderValue,
      onUpdate: 'paymentSlider',
    });
  });

  return slider;
};

export default init;
