import { updateModel } from '../../utils/updateModel.js';

const init = (getDataFn) => {
  const { time, minYear, maxYear } = getDataFn();
  const slider = document.querySelector('#slider-term');

  // Setup noUiSlider plugin
  noUiSlider.create(slider, {
    start: time,
    connect: 'lower',
    tooltips: true,
    step: 1,
    range: {
      min: minYear,
      max: maxYear,
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
      time: sliderValue,
      onUpdate: 'timeSlider',
    });
  });

  return slider;
};

export default init;
