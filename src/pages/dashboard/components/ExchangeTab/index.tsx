import { AnalysisTable } from '../../shared/AnalysisTable'
import { BarChartCard } from '../../shared/BarChartCard'
import { RevenueProjection } from '../../constants'

interface ExchangeTabProps {
  revenueProjection: RevenueProjection
}

export function ExchangeTab({ revenueProjection }: ExchangeTabProps) {
  const exchangeData = Object.entries(revenueProjection?.byExchange || {}).map(
    ([name, values]) => ({
      name,
      count: values.count,
      aum: values.aum,
      invested: values.invested,
      revenue: values.revenue,
      averageInvestment: revenueProjection?.averageInvestmentByExchange?.[name]?.averageInvestment || 0,
    })
  )

  return (
    <div>
      {/* Tabela de Análise por Corretora */}
      <AnalysisTable
        title="Métricas por corretora"
        data={exchangeData}
        columns={[
          { key: 'name', label: 'Corretora', formatter: 'text' },
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
          title="Receita por corretora"
          data={exchangeData}
          dataKey="revenue"
          chartType="revenue"
        />

        <BarChartCard
          title="Média de investimento por corretora"
          data={exchangeData}
          dataKey="averageInvestment"
          chartType="investment"
        />
      </div>

      {/* Segunda linha de gráficos - AUM e Número de Carteiras */}
      <div className="mb-6 grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
        <BarChartCard
          title="Distribuição de AUM por corretora"
          data={exchangeData}
          dataKey="aum"
          chartType="aum"
          yAxisFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
        />

        <BarChartCard
          title="Número de carteiras por corretora"
          data={exchangeData}
          dataKey="count"
          chartType="count"
          tooltipFormatter={(v: number) => [v, 'Carteiras']}
        />
      </div>
    </div>
  )
}