const priceFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});
// 10 000 000 Р

const priceFormatterDecimals = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 2,
});
// 10 000 000.45 Р

export { priceFormatter, priceFormatterDecimals };
