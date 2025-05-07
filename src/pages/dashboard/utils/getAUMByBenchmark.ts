import { RevenueProjectionDashboardData } from '@/types/revenueProjectionDashboardData.type'

export const getAUMByBenchmark = (data: RevenueProjectionDashboardData) => {
  return Object.entries(data.byBenchmark).map(([name, values]) => ({
    name,
    aum: values.aum,
  }))
}
