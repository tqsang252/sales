/**
 * Formats a numeric price into a currency string (USD).
 * Returns 'Price not listed' if price is null/undefined.
 */
export function formatCurrency(amount, currency = 'USD') {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return 'Price not listed'
  }

  const num = Number(amount)
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: num % 1 === 0 ? 0 : 2,
    }).format(num)
  } catch {
    return `$${num.toLocaleString('en-US')}`
  }
}
