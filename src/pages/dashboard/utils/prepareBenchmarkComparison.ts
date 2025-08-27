import { RevenueProjectionDashboardData } from '@/types/revenueProjectionDashboardData.type'

export const prepareBenchmarkComparisonData = (
  data: RevenueProjectionDashboardData,
  totalWallets: number,
) => {
  return [
    {
      name: 'Superaram o Benchmark',
      value: totalWallets - data.summary.benchmarkOutperformedWalletCount,
    },
    {
      name: 'Não Superaram o Benchmark',
      value: data.summary.benchmarkOutperformedWalletCount,
    },
  ]
}
