import { RevenueProjectionDashboardData } from '@/types/revenueProjectionDashboardData.type'

export const preparePerformanceData = (
  data: RevenueProjectionDashboardData,
  totalWallets: number,
) => {
  return [
    {
      name: 'Carteiras com Lucro',
      value: totalWallets - data.summary.walletsLosingMoneyCount,
    },
    {
      name: 'Carteiras com Prejuízo',
      value: data.summary.walletsLosingMoneyCount,
    },
  ]
}
