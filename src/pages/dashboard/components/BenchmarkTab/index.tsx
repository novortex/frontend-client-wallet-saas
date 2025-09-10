import { AnalysisTable } from '../../shared/AnalysisTable'
import { BarChartCard } from '../../shared/BarChartCard'
import { RevenueProjection } from '../../constants'

interface BenchmarkTabProps {
  revenueProjection: RevenueProjection
}

export function BenchmarkTab({ revenueProjection }: BenchmarkTabProps) {
  const benchmarkData = Object.entries(revenueProjection?.byBenchmark || {}).map(
    ([benchmark, data]) => {
      const avgInvestmentData = revenueProjection?.averageInvestmentByBenchmark?.[benchmark]
      return {
        name: benchmark,
        count: data.count,
        aum: data.aum,
        invested: data.invested,
        revenue: data.revenue,
        averageInvestment: avgInvestmentData?.averageInvestment || 0,
      }
    }
  )

  return (
    <div>
      {/* Tabela de Análise por Benchmark */}
      <AnalysisTable
        title="Métricas por Benchmark"
        data={benchmarkData}
        columns={[
          { key: 'name', label: 'Benchmark', formatter: 'text' },
          { key: 'count', label: 'Carteiras', formatter: 'number' },
          { key: 'aum', label: 'AUM', formatter: 'currency' },
          { key: 'invested', label: 'Capital Investido', formatter: 'currency' },
          { key: 'revenue', label: 'Receita Total', formatter: 'currency' },
          { key: 'averageInvestment', label: 'Média de Investimento', formatter: 'currency' }
        ]}
      />

      {/* Primeira linha de gráficos - Receita e Média de Investimento */}
      <div className="mb-6 grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
        <BarChartCard
          title="Receita por benchmark"
          data={benchmarkData}
          dataKey="revenue"
          chartType="revenue"
        />

        <BarChartCard
          title="Média de investimento por benchmark"
          data={benchmarkData}
          dataKey="averageInvestment"
          chartType="investment"
        />
      </div>

      {/* Segunda linha de gráficos - AUM e Número de Carteiras */}
      <div className="mb-6 grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
        <BarChartCard
          title="Distribuição de AUM por benchmark"
          data={benchmarkData}
          dataKey="aum"
          chartType="aum"
          yAxisFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
        />

        <BarChartCard
          title="Número de carteiras por benchmark"
          data={benchmarkData}
          dataKey="count"
          chartType="count"
          tooltipFormatter={(v: number) => [v, 'Carteiras']}
        />
      </div>
    </div>
  )
}