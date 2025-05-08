// Formatar números para exibição
export const formatRealCurrency = (value: number) => {
  if (value >= 1000000000) {
    return `R$ ${(value / 1000000000).toFixed(2)}B`
  } else if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(2)}M`
  } else if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(2)}K`
  } else {
    return `R$ ${value.toFixed(2)}`
  }
}
