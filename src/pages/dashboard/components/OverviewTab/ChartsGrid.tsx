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
        title="Lucro vs Prejuízo"
        data={performanceData}
        dataKey="value"
        colors={CHART_COLORS.PIE_PERFORMANCE}
        height={240}
        innerRadius={0}
        outerRadius={80}
        valueFormatter={(value) => `${value} carteiras`}
      />

      <PieChartCard
        title="Performance vs Benchmarks"
        data={benchmarkComparisonData}
        dataKey="value"
        colors={CHART_COLORS.PIE_BENCHMARK}
        height={240}
        innerRadius={0}
        outerRadius={80}
        valueFormatter={(value) => `${value} carteiras`}
      />

      <PieChartCard
        title="Carteiras Abertas vs Gerando Receita"
        data={revenueGeneratingData}
        dataKey="value"
        colors={CHART_COLORS.PIE_REVENUE}
        height={240}
        innerRadius={0}
        outerRadius={80}
        valueFormatter={(value) => `${value} carteiras`}
      />
    </div>
  )
}