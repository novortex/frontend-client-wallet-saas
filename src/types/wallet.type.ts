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
  ownerName: string
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
    client_name: string
    start_date: string
    start_date_formated: string
    close_date: string
    close_date_formated: string
    invested_amount_in_organization_fiat: number
    benchmark: string
    company_comission: number
    total_commision: number
    dollar_value: string
    benchmark_price_start: {
      cuid: string
      amount: number
      createAt: string
      benchmarkCuid: string
    }
    benchmark_price_end: {
      cuid: string
      amount: number
      createAt: string
      benchmarkCuid: string
    }
    benchmark_value: string
    close_wallet_value_in_organization_fiat: number
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
