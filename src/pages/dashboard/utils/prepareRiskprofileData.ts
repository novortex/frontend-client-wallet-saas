import { RevenueProjectionDashboardData } from '@/types/revenueProjectionDashboardData.type'

export const prepareRiskProfileData = (
  data: RevenueProjectionDashboardData,
) => {
  return Object.entries(data.byRiskProfile).map(([name, values]) => ({
    name:
      name === 'STANDARD'
        ? 'Padrão'
        : name === 'LOW_RISK'
          ? 'Baixo Risco'
          : 'Alto Risco',
    count: values.count,
    invested: values.invested,
    aum: values.aum,
    revenue: values.revenue,
  }))
}
