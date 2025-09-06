import { AnalysisTable } from '../../shared/AnalysisTable'
import { BarChartCard } from '../../shared/BarChartCard'
import { RevenueProjection } from '../../constants'

interface ManagerTabProps {
  revenueProjection: RevenueProjection
}

export function ManagerTab({ revenueProjection }: ManagerTabProps) {
  const managerData = Object.entries(revenueProjection?.byManager || {}).map(
    ([manager, data]) => {
      const avgInvestmentData = revenueProjection?.averageInvestmentByManager?.[manager]
      return {
        name: manager,
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
      {/* Tabela de Análise por Manager */}
      <AnalysisTable
        title="Métricas por Manager"
        data={managerData}
        columns={[
          { key: 'name', label: 'Manager', formatter: 'text' },
          { key: 'count', label: 'Carteiras', formatter: 'number' },
          { key: 'invested', label: 'Investimento Total', formatter: 'currency' },
          { key: 'aum', label: 'AUM Atual', formatter: 'currency' },
          { key: 'revenue', label: 'Receita', formatter: 'currency' },
          { key: 'averageInvestment', label: 'Investimento Médio', formatter: 'currency' }
        ]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Receita por Manager */}
        <BarChartCard
          title="Receita por Manager"
          data={managerData}
          dataKey="revenue"
          chartType="revenue"
          maxNameLength={10}
        />

        {/* Investimento Médio por Manager */}
        <BarChartCard
          title="Investimento Médio por Manager"
          data={managerData}
          dataKey="averageInvestment"
          chartType="investment"
          maxNameLength={10}
        />
      </div>
    </div>
  )
}