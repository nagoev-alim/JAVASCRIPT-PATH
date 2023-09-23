import * as Model from './Model.js';

import { updateResultsView } from './view/updateResultsView.js';
import { updateMinPaymentPercents } from './view/utils.js';

import programs from './view/programsRadio/radio.js';
import costInput from './view/costInput/input.js';
import costSlider from './view/costInput/slider.js';
import paymentInput from './view/paymentInput/input.js';
import paymentSlider from './view/paymentInput/slider.js';
import timeInput from './view/timeInput/input.js';
import timeSlider from './view/timeInput/slider.js';
import { showNotification } from './view/showNotification.js';




// Load page
document.addEventListener('DOMContentLoaded', () => {

  // Init programs
  programs(Model.getData);

  // Init cost input
  const cleaveCost = costInput(Model.getData);
  const sliderCost = costSlider(Model.getData);

  // Init payment input
  const cleavePayment = paymentInput(Model.getData);
  const sliderPayment = paymentSlider(Model.getData);

  // Init time input
  const cleaveTime = timeInput(Model.getData);
  const sliderTime = timeSlider(Model.getData);

  Model.setData({});
  const resultData = Model.getResults();
  // Update results block
  updateResultsView(resultData);

  document.addEventListener('updateForm', ({ detail }) => {
    Model.setData(detail);
    const data = Model.getData();
    const resultData = Model.getResults();

    // Update form and sliders
    updateFormAndSliders(data);
    // Update results block
    updateResultsView(resultData);
  });

  function updateFormAndSliders({
                                  onUpdate,
                                  cost,
                                  minPaymentPercents,
                                  maxPaymentPercents,
                                  payment,
                                  paymentPercents,
                                  time,
                                }) {

    if (onUpdate === 'radioProgram') {
      updateMinPaymentPercents(minPaymentPercents);
      sliderPayment.noUiSlider.updateOptions({
        range: {
          min: minPaymentPercents * 100,
          max: maxPaymentPercents * 100,
        },
      });
    }

    if (onUpdate !== 'costInput') {
      cleaveCost.setRawValue(cost);
    }

    if (onUpdate !== 'costSlider') {
      sliderCost.noUiSlider.set(cost);
    }

    if (onUpdate !== 'paymentInput') {
      cleavePayment.setRawValue(payment);
    }

    if (onUpdate !== 'paymentSlider') {
      sliderPayment.noUiSlider.set(paymentPercents * 100);
    }


    if (onUpdate !== 'timeInput') {
      cleaveTime.setRawValue(time);
    }

    if (onUpdate !== 'timeSlider') {
      sliderTime.noUiSlider.set(time);
    }
  }

  // Order Form
  const openFormBtn = document.querySelector('#openFormBtn');
  const orderForm = document.querySelector('#orderForm');

  openFormBtn.addEventListener('click', () => {
    orderForm.classList.remove('hide');
    openFormBtn.classList.add('hide');
  });

  orderForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.target;
    const { name, email, phone } = Object.fromEntries(new FormData(form).entries());
    const btn = form.querySelector('#submitFormBtn');

    btn.disabled = true;
    btn.textContent = 'Заявка отправляется...';

    form.querySelectorAll('input').forEach(input => input.disabled = true);

    try {
      const data = Model.getData();
      const resultData = Model.getResults();

      // Check url
      let url = checkOnUrl(document.location.href);

      function checkOnUrl(url) {
        let urlArrayDot = url.split('.');

        if (urlArrayDot[urlArrayDot.length - 1] === 'html') {
          urlArrayDot.pop();
          let newUrl = urlArrayDot.join('.');
          let urlArraySlash = newUrl.split('/');
          urlArraySlash.pop();
          newUrl = urlArraySlash.join('/') + '/';
          return newUrl;
        }

        return url;
      }

      const response = await fetch(`${url}/mail.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          form: { name, email, phone },
          data,
          resultData,
        }),
      });

      const result = await response.text();

      btn.disabled = false;
      btn.textContent = 'Оформить заявку';
      form.querySelectorAll('input').forEach(input => input.disabled = false);
      form.reset();
      form.classList.add('hide');


      if (result === 'SUCCESS') {
        showNotification('success', 'Ваша заявка успешно отправлена');
      } else {
        showNotification('danger', 'Что-то пошло не так, попробуйте позже.');
      }

    } catch (e) {
      console.log(e);
    }
  });

});
