import { priceFormatter, priceFormatterDecimals } from '../utils/formatters.js';

/**
 * @function
 * @param data
 */
const updateResultsView = (data) => {
  document.querySelector('#total-percent').textContent = `${data.rate * 100}%`;
  document.querySelector('#total-month-payment').textContent = priceFormatterDecimals.format(data.monthPayment);
  document.querySelector('#total-overpayment').textContent = priceFormatterDecimals.format(data.overPayment);
  document.querySelector('#total-cost').textContent = priceFormatter.format(data.totalAmount);
};

export { updateResultsView };
