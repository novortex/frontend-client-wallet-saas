import { RevenueProjectionDashboardData } from '@/types/revenueProjectionDashboardData.type'

export const prepareRevenueGeneratingData = (
  data: RevenueProjectionDashboardData,
  totalWallets: number,
) => {
  const revenueGeneratingWallets = data.summary.profitableWallets
  const nonRevenueWallets = totalWallets - revenueGeneratingWallets

  return [
    {
      name: `Carteiras Gerando Receita (${(revenueGeneratingWallets / totalWallets * 100).toFixed(1)}%)`,
      value: revenueGeneratingWallets,
    },
    {
      name: `Carteiras Sem Receita (${(nonRevenueWallets / totalWallets * 100).toFixed(1)}%)`,
      value: nonRevenueWallets,
    },
  ]
}