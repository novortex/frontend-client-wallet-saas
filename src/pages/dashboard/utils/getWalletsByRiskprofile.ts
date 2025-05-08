import { RevenueProjectionDashboardData } from '@/types/revenueProjectionDashboardData.type'

export const getWalletsByRiskProfile = (
  data: RevenueProjectionDashboardData,
) => {
  return Object.entries(data.byRiskProfile)
    .map(([profile, values]) => ({
      name: profile,
      count: values.count,
    }))
    .sort((a, b) => b.count - a.count)
}
