let data = {
  selectedProgram: 0.1,
  //
  cost: 12000000,
  minPrice: 375000,
  maxPrice: 100000000,
  //
  minPaymentPercents: 0.15,
  maxPaymentPercents: 0.9,
  //
  paymentPercents: 0.5,
  payment: 6000000,
  getMinPayment: function() {
    return this.cost * this.minPaymentPercents;
  },
  getMaxPayment: function() {
    return this.cost * this.maxPaymentPercents;
  },
  //
  minYear: 1,
  maxYear: 30,
  time: 10,
  //
  programs: {
    base: 0.1,
    it: 0.047,
    gov: 0.067,
    zero: 0.12,
  },
};

let resultData = {
  rate: data.selectedProgram,
};

/**
 * @function  getData - Return updated data
 * @returns {{selectedProgram: number, programs: {zero: number, it: number, base: number, gov: number}}}
 */
const getData = () => ({ ...data });

/**
 * @function setData - Set new data
 * @param newData
 * @returns {*&{selectedProgram: number, programs: {zero: number, it: number, base: number, gov: number}}}
 */
const setData = (newData) => {
  // Update payment percent
  if (newData.onUpdate === 'radioProgram') {
    data.minPaymentPercents = newData.id === 'zero-value' ? 0 : 0.15;
  }

  // Update cost from cost input events
  if (newData.onUpdate === 'costInput' || newData.onUpdate === 'costSlider') {

    newData.cost = newData.cost < data.minPrice ? data.minPrice : newData.cost;
    newData.cost = newData.cost > data.maxPrice ? data.maxPrice : newData.cost;

    data.payment = data.payment > data.getMaxPayment() ? data.getMaxPayment() : data.payment;
    data.payment = data.payment < data.getMinPayment() ? data.getMinPayment() : data.payment;

    data.paymentPercents = (data.payment * 100) / newData.cost / 100;
  }

  if (newData.onUpdate === 'paymentInput') {
    newData.paymentPercents = (newData.payment * 100) / data.cost / 100;

    newData.paymentPercents = newData.paymentPercents > data.maxPaymentPercents ? data.maxPaymentPercents : newData.paymentPercents;
    newData.payment = data.cost * data.maxPaymentPercents;

    newData.paymentPercents = newData.paymentPercents < data.minPaymentPercents ? data.minPaymentPercents : newData.paymentPercents;
    newData.payment = data.cost * data.minPaymentPercents;
  }

  // Update payment percents
  if (newData.onUpdate === 'paymentSlider') {
    newData.paymentPercents = newData.paymentPercents / 100;
    data.payment = data.cost * newData.paymentPercents;
  }

  // Update time values
  if (newData.onUpdate === 'timeInput') {
    newData.time = newData.time > data.maxYear ? data.maxYear : newData.time;
    newData.time = newData.time < data.minYear ? data.minYear : newData.time;
  }

  // Update data
  data = { ...data, ...newData };

  // Рассчет ипотеки
  const months = data.time * 12;
  const totalAmount = data.cost - data.payment;
  const monthRate = data.selectedProgram / 12;
  const generalRate = (1 + monthRate) ** months;
  const monthPayment = (totalAmount * monthRate * generalRate) / (generalRate - 1);
  const overPayment = monthPayment * months - totalAmount;

  // Update resultData
  resultData = {
    rate: data.selectedProgram,
    totalAmount,
    monthPayment,
    overPayment,
  };
};

/**
 * @function getResults
 * @returns {{rate: number}}
 */
const getResults = () => ({ ...resultData });

export { getData, setData, getResults };
