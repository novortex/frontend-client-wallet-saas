import { AnalysisTable } from '../../shared/AnalysisTable'
import { BarChartCard } from '../../shared/BarChartCard'
import { RevenueProjection } from '../../constants'

interface ClientTabProps {
  revenueProjection: RevenueProjection
}

export function ClientTab({ revenueProjection }: ClientTabProps) {
  const clientSegmentData = Object.entries(revenueProjection?.byClientSegment || {})
    .map(([clientSegment, data]) => {
      const avgInvestmentData = revenueProjection?.averageInvestmentByClientSegment?.[clientSegment]
      return {
        name: clientSegment,
        count: data.count,
        aum: data.aum,
        invested: data.invested,
        revenue: data.revenue,
        averageInvestment: avgInvestmentData?.averageInvestment || 0,
      }
    })
    .sort((a, b) => b.revenue - a.revenue)

  return (
    <div>
      {/* Tabela de Análise por Segmento de Cliente */}
      <AnalysisTable
        title="Métricas por Faixa de Investimento"
        data={clientSegmentData}
        columns={[
          { key: 'name', label: 'Faixa de Investimento', formatter: 'text' },
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
          title="Receita por faixa de investimento"
          data={clientSegmentData}
          dataKey="revenue"
          chartType="revenue"
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          xAxisProps={{
            angle: -45,
            textAnchor: 'end',
            height: 80,
            tick: {
              fill: 'hsl(var(--muted-foreground))',
              fontSize: 10,
            }
          }}
        />

        <BarChartCard
          title="Média de investimento por faixa"
          data={clientSegmentData}
          dataKey="averageInvestment"
          chartType="investment"
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          xAxisProps={{
            angle: -45,
            textAnchor: 'end',
            height: 80,
            tick: {
              fill: 'hsl(var(--muted-foreground))',
              fontSize: 10,
            }
          }}
        />
      </div>

      {/* Segunda linha de gráficos - AUM e Número de Carteiras */}
      <div className="mb-6 grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
        <BarChartCard
          title="Distribuição de AUM por faixa de investimento"
          data={clientSegmentData}
          dataKey="aum"
          chartType="aum"
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          yAxisFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
          xAxisProps={{
            angle: -45,
            textAnchor: 'end',
            height: 80,
            tick: {
              fill: 'hsl(var(--muted-foreground))',
              fontSize: 10,
            }
          }}
        />

        <BarChartCard
          title="Número de carteiras por faixa de investimento"
          data={clientSegmentData}
          dataKey="count"
          chartType="count"
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          tooltipFormatter={(v: number) => [v, 'Carteiras']}
          xAxisProps={{
            angle: -45,
            textAnchor: 'end',
            height: 80,
            tick: {
              fill: 'hsl(var(--muted-foreground))',
              fontSize: 10,
            }
          }}
        />
      </div>
    </div>
  )
}