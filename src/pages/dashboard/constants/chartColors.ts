// Tipos semânticos de dados para padronização de cores
export type ChartDataType = 'revenue' | 'investment' | 'aum' | 'count' | 'special'

// Cores base por tipo de dados
export const CHART_COLORS = {
  REVENUE: '#10b981', // Verde - para gráficos de receita
  INVESTMENT: '#3b82f6', // Azul - para gráficos de média de investimento
  AUM: '#f97316', // Laranja - para gráficos de AUM
  COUNT: '#8b5cf6', // Roxo - para gráficos de contagem
  SPECIAL: '#ec4899', // Rosa - para casos especiais
  // Cores para pie charts (overview) - usando cores do software (invertidas)
  PIE_PERFORMANCE: ['hsl(var(--success))', 'hsl(var(--destructive))'], // Verde, Vermelho do software
  PIE_BENCHMARK: ['hsl(var(--success))', 'hsl(var(--destructive))'], // Verde, Vermelho do software
  PIE_REVENUE: ['hsl(var(--success))', 'hsl(var(--destructive))'], // Verde, Vermelho do software
}

// Configuração completa por tipo de dados
export const CHART_CONFIG = {
  revenue: {
    color: CHART_COLORS.REVENUE,
    baseGradientId: 'revenueGradient',
    label: 'Receita',
  },
  investment: {
    color: CHART_COLORS.INVESTMENT,
    baseGradientId: 'investmentGradient',
    label: 'Investimento Médio',
  },
  aum: {
    color: CHART_COLORS.AUM,
    baseGradientId: 'aumGradient',
    label: 'AUM',
  },
  count: {
    color: CHART_COLORS.COUNT,
    baseGradientId: 'countGradient',
    label: 'Quantidade',
  },
  special: {
    color: CHART_COLORS.SPECIAL,
    baseGradientId: 'specialGradient',
    label: 'Especial',
  },
} as const

// Função para gerar ID único de gradiente
let gradientCounter = 0
export const generateUniqueGradientId = (type: ChartDataType): string => {
  gradientCounter++
  return `${CHART_CONFIG[type].baseGradientId}_${gradientCounter}_${Date.now()}`
}

// Função para obter configuração por tipo
export const getChartConfig = (type: ChartDataType) => CHART_CONFIG[type]

export const TOOLTIP_STYLES = {
  contentStyle: {
    backgroundColor: 'hsl(var(--popover))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '8px',
    color: 'hsl(var(--popover-foreground))',
    boxShadow: 'hsl(var(--shadow)) 0px 4px 6px -1px, hsl(var(--shadow)) 0px 2px 4px -1px',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '500',
    minWidth: '120px',
  },
  labelStyle: { 
    color: 'hsl(var(--foreground))',
    fontWeight: '600',
    marginBottom: '4px',
    fontSize: '13px',
  }
}

// Estilos específicos para PieChart tooltips na Overview
export const PIE_TOOLTIP_STYLES = {
  contentStyle: {
    backgroundColor: 'hsl(var(--popover))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '8px',
    color: 'hsl(var(--popover-foreground))',
    boxShadow: 'hsl(var(--shadow)) 0px 4px 12px -4px, hsl(var(--shadow)) 0px 2px 6px -2px',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '500',
    minWidth: '140px',
    maxWidth: '200px',
  },
  labelStyle: { 
    color: 'hsl(var(--foreground))',
    fontWeight: '600',
    marginBottom: '6px',
    fontSize: '14px',
    display: 'block',
  },
  valueStyle: {
    color: 'hsl(var(--muted-foreground))',
    fontSize: '13px',
    fontWeight: '500',
  }
}

export const AXIS_STYLES = {
  tick: { 
    fontSize: 12, 
    fill: 'hsl(var(--foreground))' 
  },
  axisLine: { 
    stroke: 'hsl(var(--border))' 
  }
}