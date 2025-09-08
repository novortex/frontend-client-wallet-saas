import { RevenueProjectionDashboardData } from '@/types/revenueProjectionDashboardData.type'

export const prepareBenchmarkComparisonData = (
  data: RevenueProjectionDashboardData,
  totalWallets: number,
) => {
  const outperformedWallets = totalWallets - data.summary.benchmarkOutperformedWalletCount
  const underperformedWallets = data.summary.benchmarkOutperformedWalletCount
  
  return [
    {
      name: `Superaram o Benchmark (${(outperformedWallets / totalWallets * 100).toFixed(1)}%)`,
      value: outperformedWallets,
    },
    {
      name: `Não Superaram o Benchmark (${(underperformedWallets / totalWallets * 100).toFixed(1)}%)`,
      value: underperformedWallets,
    },
  ]
}
