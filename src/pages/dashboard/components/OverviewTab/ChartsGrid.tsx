import { PieChartCard } from '../../shared'
import { CHART_COLORS } from '../../constants'

interface ChartsGridProps {
  performanceData: Array<{ name: string; value: number }>
  benchmarkComparisonData: Array<{ name: string; value: number }>
  revenueGeneratingData: Array<{ name: string; value: number }>
}

export function ChartsGrid({
  performanceData,
  benchmarkComparisonData,
  revenueGeneratingData,
}: ChartsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <PieChartCard
        title="Comparação Lucro x Prejuízo"
        data={performanceData}
        dataKey="value"
        colors={CHART_COLORS.PIE_PERFORMANCE}
        height={192}
        outerRadius={45}
        valueFormatter={(value) => `${value} carteiras`}
      />

      <PieChartCard
        title="Comparação com Benchmarks"
        data={benchmarkComparisonData}
        dataKey="value"
        colors={CHART_COLORS.PIE_BENCHMARK}
        height={192}
        outerRadius={45}
        valueFormatter={(value) => `${value} carteiras`}
      />

      <PieChartCard
        title="Carteiras Abertas vs Gerando Receita"
        data={revenueGeneratingData}
        dataKey="value"
        colors={CHART_COLORS.PIE_REVENUE}
        height={192}
        outerRadius={45}
        valueFormatter={(value) => `${value} carteiras`}
      />
    </div>
  )
}