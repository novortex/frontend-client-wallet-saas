import { RevenueProjectionDashboardData } from '@/types/revenueProjectionDashboardData.type'

export const prepareBenchmarkRevenueData = (
  data: RevenueProjectionDashboardData,
) => {
  return Object.entries(data.byBenchmark).map(([name, values]) => ({
    name,
    revenue: values.revenue,
  }))
}
