import { MetricCard } from './MetricCard'
import { RevenueProjection } from '../../constants'
import { formatRealCurrency } from '@/utils/formatRealCurrency'
import { formatDolarCurrency } from '@/utils/formatDolarCurrency'

interface KPICardsProps {
  data: RevenueProjection['summary']
}

export function KPICards({ data }: KPICardsProps) {
  const kpiConfig = [
    {
      title: 'Número de carteiras abertas',
      value: data?.openWallets || '-',
    },
    {
      title: 'Carteiras Lucrativas',
      value: data?.profitableWallets || '-',
    },
    {
      title: 'Carteiras Perdendo Dinheiro',
      value: data?.walletsLosingMoneyCount || 0,
    },
    {
      title: 'Carteiras que Superaram Benchmark',
      value: data?.benchmarkOutperformedWalletCount || 0,
    },
    {
      title: 'AUM Total',
      value: data?.totalAUM || 0,
      formatter: formatRealCurrency,
    },
    {
      title: 'Capital Total Investido',
      value: data?.totalInvestedCapital || 0,
      formatter: formatRealCurrency,
    },
    {
      title: 'Receita Total',
      value: data?.totalRevenue || 0,
      formatter: formatDolarCurrency,
    },
    {
      title: 'Receita Média',
      value: data?.averageRevenue || 0,
      formatter: formatDolarCurrency,
    },
    {
      title: 'Investimento Médio Geral',
      value: data?.averageInvestmentGeneral || 0,
      formatter: formatRealCurrency,
    },
    {
      title: 'Ganho Médio por Carteira',
      value: data?.averageGainPerWallet || 0,
      formatter: formatRealCurrency,
    },
    {
      title: 'Clientes com Menos de R$ 25k',
      value: data?.clientsUnder25k || 0,
    },
  ]

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {kpiConfig.map((kpi, index) => (
        <MetricCard
          key={index}
          title={kpi.title}
          value={kpi.value}
          formatter={kpi.formatter}
        />
      ))}
    </div>
  )
}