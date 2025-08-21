export type TWalletCommission = {
  name: string
  commission: number
}

export type TWalletInfos = {
  manager: string
  lastContactAt: string | null
}

export type TWallet = {
  startDate: string // or Date
  investedAmount: number
  currentAmount: number
  closeDate: string // or Date
  initialFee: number | null
  initialFeePaid: boolean
  riskProfile: string // Adjust based on your risk profiles
  monthCloseDate: string // or Date
  contract: boolean
  performanceFee: number
  joinedAsClient: Date | null
  user: {
    name: string
    email: string
    phone: string
  }
  benchmark: {
    name: string
  }
  currentValueBenchmark: number
  lastRebalance: Date | null
  nextBalance: Date | null // or Date
  exchange: {
    name: string
  }
  accountEmail: string
  exchangePassword: string
  emailPassword: string
}

export type TWalletAssetsInfo = {
  ownerName: string | null
  startDate: string | Date | null
  investedAmount: number | null
  currentAmount: number | null
  performanceFee: number | null
  lastRebalance: string | Date | null
  monthCloseDate: string | Date | null
  isClosed: boolean
}

export type HistoricEntry = {
  cuid: string
  historyType:
    | 'SELL_ASSET'
    | 'BUY_ASSET'
    | 'INCREASE_ALLOCATION'
    | 'DECREASE_ALLOCATION'
    | 'ADD_ASSET'
    | 'DELETE_ASSET'
    | 'WITHDRAWAL'
    | 'DEPOSIT'
    | 'START_WALLET'
    | 'CLOSE_WALLET'
  createAt: string
  data: {
    data: string
    client_name: string
    start_date: string
    start_date_formated: string
    close_date: string
    close_date_formated: string
    organization_fiat: string
    invested_amount_in_organization_fiat: number
    benchmark: string
    wallet_performance_fee: number
    company_commission: number
    total_commission: number
    dollar_value: string
    benchmark_price_start: number
    benchmark_price_end: number
    benchmark_performance: number
    benchmark_value: string
    close_wallet_value_in_organization_fiat: number
    total_wallet_profit_percent: number
    benchmark_exceeded_value: number
    assets: { name: string; allocation: number }[]
    before: number
    after: number
    icon: string
    asset: string
    quantity: number
    target_allocation: number
    withdrawal_value_in_organization_fiat: number
    deposit_amount_in_organization_fiat: number
  }
  user: {
    name: string
  }
}

export type RebalanceReturn = {
  action: string
  amount: string
  assetIcon: string
  assetName: string
  targetAllocation: string
}

export type AllTimePerformance = {
  allTimePerformance: {
    performance: number | string
    percentagePerformance: string
    startDateUsed?: string
    endDateUsed?: string
  }
}

export type KpiData = {
  walletPerformance: {
    performance: number | string
    percentagePerformance: string
    startDateUsed?: string
    endDateUsed?: string
  }
  bitcoinPerformance: {
    performance: number | string
    percentagePerformance: string
  }
  hash11Performance: {
    performance: number | string
    percentagePerformance: string
  }
  sp500Performance: {
    performance: number | string
    percentagePerformance: string
  }
}

export interface FrcStats {
  managerName: string
  managerUuid: string
  totalClients: number
  frc0Count: number
  frc1Count: number
  frcMoreThan1Count: number
  frc0Percent: number
  frc1Percent: number
  frcMoreThan1Percent: number
  period: string
}

export enum TradeType {
  BUY = 'BUY',
  SELL = 'SELL',
}
