import { RevenueProjectionDashboardData } from '@/types/revenueProjectionDashboardData.type'

export const getWalletsByBenchmark = (data: RevenueProjectionDashboardData) => {
  return Object.entries(data.byBenchmark)
    .map(([benchmark, values]) => ({
      name: benchmark,
      count: values.count,
    }))
    .sort((a, b) => b.count - a.count)
}
