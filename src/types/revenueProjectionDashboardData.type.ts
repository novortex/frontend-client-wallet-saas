export type RevenueProjectionDashboardData = {
  summary: {
    totalRevenue: number
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
}
