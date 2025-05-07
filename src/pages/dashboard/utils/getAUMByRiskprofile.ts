import { RevenueProjectionDashboardData } from '@/types/revenueProjectionDashboardData.type'

export const getAUMByRiskProfile = (data: RevenueProjectionDashboardData) => {
  return Object.entries(data.byRiskProfile).map(([name, values]) => ({
    name,
    aum: values.aum,
  }))
}
