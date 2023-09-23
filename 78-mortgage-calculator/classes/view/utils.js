const updateMinPaymentPercents = (value) => {
  document.querySelector('#percents-from').textContent = `${value * 100}%`;
};

export { updateMinPaymentPercents };
