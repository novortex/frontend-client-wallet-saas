import { RevenueProjectionDashboardData } from '@/types/revenueProjectionDashboardData.type'

export const prepareBenchmarkData = (data: RevenueProjectionDashboardData) => {
  return Object.entries(data.byBenchmark).map(([name, values]) => ({
    name,
    count: values.count,
    invested: values.invested,
    aum: values.aum,
    revenue: values.revenue,
  }))
}
