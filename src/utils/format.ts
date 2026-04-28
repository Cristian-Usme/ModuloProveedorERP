export function formatCurrency(value: number, currency = 'USD') {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('es-CO').format(value)
}

export function formatPercentage(value: number) {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
}