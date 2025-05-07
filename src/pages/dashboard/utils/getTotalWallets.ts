import { RevenueProjectionDashboardData } from '@/types/revenueProjectionDashboardData.type'

export const getTotalWallets = (data: RevenueProjectionDashboardData) => {
  return Object.values(data.byBenchmark).reduce(
    (acc, curr) => acc + curr.count,
    0,
  )
}
