export type RevenueProjectionDashboardData = {
  summary: {
    openWallets: number
    successfulWallets: number
    profitableWallets: number
    totalRevenue: number
    averageRevenue: number
    totalInvestedCapital: number
    totalAUM: number
    missingPerformanceHistoryCount: number
    walletsLosingMoneyCount: number
    benchmarkOutperformedWalletCount: number
    missingInformationAboutPerformanceOrWallet: number
  }
  byBenchmark: {
    [benchmarkName: string]: {
      count: number
      invested: number
      aum: number
      revenue: number
    }
  }
  byRiskProfile: {
    [riskProfile: string]: {
      count: number
      invested: number
      aum: number
      revenue: number
    }
  }
  averageInvestmentByRiskProfile: {
    [riskProfile: string]: {
      averageInvestment: number
      walletCount: number
      totalInvested: number
    }
  }
  averageInvestmentByBenchmark: {
    [benchmarkName: string]: {
      averageInvestment: number
      walletCount: number
      totalInvested: number
    }
  }
}
