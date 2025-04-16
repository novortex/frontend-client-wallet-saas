// utils/formatters.ts

// Função para formatar data de forma legível
export const formatDate = (dateString: string | null) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}
