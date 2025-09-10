export interface RevenueProjection {
  summary: {
    openWallets: number
    successfulWallets: number
    profitableWallets: number
    totalRevenue: number
    totalAUM: number
    totalInvestedCapital: number
    averageRevenue: number
    averageInvestmentGeneral: number
    averageGainPerWallet: number
    clientsUnder25k: number
    walletsLosingMoneyCount: number
    benchmarkOutperformedWalletCount: number
    profitabilityRate: number
    dataQualityRate: number
    missingPerformanceHistoryCount: number
    missingInformationAboutPerformanceOrWallet: number
  }
  byAsset: Record<string, any>
  byRiskProfile: Record<string, any>
  byBenchmark: Record<string, any>
  byExchange: Record<string, any>
  byClientSegment: Record<string, any>
  byManager: Record<string, any>
  averageInvestmentByRiskProfile: Record<string, any>
  averageInvestmentByBenchmark: Record<string, any>
  averageInvestmentByExchange: Record<string, any>
  averageInvestmentByClientSegment: Record<string, any>
  averageInvestmentByManager: Record<string, any>
}

export type TabType = 'overview' | 'risk' | 'benchmark' | 'exchange' | 'client' | 'manager' | 'cashflow'

export interface TabConfig {
  id: TabType
  label: string
  shortLabel: string
}

export const TAB_CONFIGS: TabConfig[] = [
  { id: 'overview', label: 'Visão Geral', shortLabel: 'Visão' },
  { id: 'risk', label: 'Análise por Perfil de Risco', shortLabel: 'Risco' },
  { id: 'benchmark', label: 'Análise por Benchmark', shortLabel: 'Benchmark' },
  { id: 'exchange', label: 'Análise por Corretoras', shortLabel: 'Corretoras' },
  { id: 'client', label: 'Análise por Clientes', shortLabel: 'Clientes' },
  { id: 'manager', label: 'Análise por Manager', shortLabel: 'Manager' },
  { id: 'cashflow', label: 'Cash Flow & Volume', shortLabel: 'Cash Flow' },
]