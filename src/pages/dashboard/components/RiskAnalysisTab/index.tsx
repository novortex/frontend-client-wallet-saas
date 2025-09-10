import { AnalysisTable } from '../../shared/AnalysisTable'
import { BarChartCard } from '../../shared/BarChartCard'
import { RevenueProjection } from '../../constants'

interface RiskAnalysisTabProps {
  revenueProjection: RevenueProjection
}

export function RiskAnalysisTab({ revenueProjection }: RiskAnalysisTabProps) {
  const riskProfileData = Object.entries(revenueProjection?.byRiskProfile || {}).map(
    ([name, values]) => {
      const avgInvestmentData = revenueProjection?.averageInvestmentByRiskProfile?.[name]
      return {
        name,
        count: values.count,
        aum: values.aum,
        invested: values.invested,
        revenue: values.revenue,
        averageInvestment: avgInvestmentData?.averageInvestment || 0,
      }
    }
  )

  return (
    <div>
      {/* Tabela de Análise por Perfil de Risco */}
      <AnalysisTable
        title="Métricas por perfil de risco"
        data={riskProfileData}
        columns={[
          { key: 'name', label: 'Perfil de Risco', formatter: 'text' },
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
          title="Receita por perfil de risco"
          data={riskProfileData}
          dataKey="revenue"
          chartType="revenue"
        />

        <BarChartCard
          title="Média de investimento por perfil de risco"
          data={riskProfileData}
          dataKey="averageInvestment"
          chartType="investment"
        />
      </div>

      {/* Segunda linha de gráficos - AUM e Número de Carteiras */}
      <div className="mb-6 grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
        <BarChartCard
          title="Distribuição de AUM por perfil de risco"
          data={riskProfileData}
          dataKey="aum"
          chartType="aum"
          yAxisFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
        />

        <BarChartCard
          title="Número de carteiras por perfil de risco"
          data={riskProfileData}
          dataKey="count"
          chartType="count"
          tooltipFormatter={(v: number) => [v, 'Carteiras']}
        />
      </div>
    </div>
  )
}