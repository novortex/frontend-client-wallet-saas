import { CHART_COLORS } from '../constants'

interface GradientDef {
  id: string
  color: string
}

interface ChartGradientsProps {
  gradients: GradientDef[]
}

export function ChartGradients({ gradients }: ChartGradientsProps) {
  return (
    <defs>
      {gradients.map((gradient) => (
        <linearGradient
          key={gradient.id}
          id={gradient.id}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="5%"
            stopColor={gradient.color}
            stopOpacity={0.8}
          />
          <stop
            offset="95%"
            stopColor={gradient.color}
            stopOpacity={0.1}
          />
        </linearGradient>
      ))}
    </defs>
  )
}

// Gradientes pré-definidos comuns
export const COMMON_GRADIENTS = {
  revenue: { id: 'revenueBarGradient', color: CHART_COLORS.REVENUE },
  investment: { id: 'avgInvestmentBarGradient', color: CHART_COLORS.INVESTMENT },
  aum: { id: 'aumBarGradient', color: CHART_COLORS.AUM },
  count: { id: 'countBarGradient', color: CHART_COLORS.COUNT },
  special: { id: 'specialBarGradient', color: CHART_COLORS.SPECIAL },
}

export const ALL_GRADIENTS = Object.values(COMMON_GRADIENTS)