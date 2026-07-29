export function formatPrice(n) {
  const num = Number(n)
  return '$' + (Number.isInteger(num) ? num : num.toFixed(2))
}

export function getStockBadge(stock) {
  if (stock === 0) return { text: 'Sin stock', danger: true }
  if (stock <= 10) return { text: 'Últimas unidades', danger: true }
  return null
}
