import { updateModel } from '../../utils/updateModel.js';

const init = (getDataFn) => {
  const inputs = document.querySelectorAll('[name="program"]');
  const labels = document.querySelectorAll('.form span');

  // Set values to inputs, labels
  inputs.forEach((input, idx) => {
    input.value = getDataFn().programs[input.id.split('-')[0]];
    labels[idx].textContent = `${getDataFn().programs[input.id.split('-')[0]] * 100}%`;

    input.addEventListener('change', ({ target }) => {
      updateModel(target, {
        onUpdate: 'radioProgram',
        selectedProgram: parseFloat(target.value),
        id: target.id,
      });
    });
  });

};

export default init;
