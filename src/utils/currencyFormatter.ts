export default function getCurrency(amount: number | bigint, currency = 'USD', locale = 'en-US') {
  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  })

  return currencyFormatter.format(amount)
}
