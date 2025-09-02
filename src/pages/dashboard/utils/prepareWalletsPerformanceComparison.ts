import { RevenueProjectionDashboardData } from '@/types/revenueProjectionDashboardData.type'

export const preparePerformanceData = (
  data: RevenueProjectionDashboardData,
  totalWallets: number,
) => {
  const profitWallets = totalWallets - data.summary.walletsLosingMoneyCount
  const lossWallets = data.summary.walletsLosingMoneyCount
  
  return [
    {
      name: `Carteiras com Lucro (${(profitWallets / totalWallets * 100).toFixed(1)}%)`,
      value: profitWallets,
    },
    {
      name: `Carteiras com Prejuízo (${(lossWallets / totalWallets * 100).toFixed(1)}%)`,
      value: lossWallets,
    },
  ]
}
