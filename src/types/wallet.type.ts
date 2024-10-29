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
  startDate: string | Date | null
  investedAmount: number | null
  currentAmount: number | null
  performanceFee: number | null
  lastRebalance: string | Date | null
  monthCloseDate: string | Date | null
  isClosed: boolean
}
