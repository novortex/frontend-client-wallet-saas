export interface CashFlowData {
  period: string
  deposits: number
  withdrawals: number
  netFlow: number
  transactions: number
}

export interface VolumeData {
  period: string
  assetName: string
  assetSymbol: string
  buyVolume: number
  sellVolume: number
  totalVolume: number
  buyVolumeValueUSD: number
  sellVolumeValueUSD: number
  totalVolumeValueUSD: number
  buyVolumeValueBRL: number
  sellVolumeValueBRL: number
  totalVolumeValueBRL: number
  transactions: number
  addVolume: number
  addVolumeValueUSD: number
  addVolumeValueBRL: number
}

export type PeriodType = 'daily' | 'weekly' | 'monthly' | 'quarterly'

export interface DateRange {
  startDate: Date
  endDate: Date
}

export interface CashFlowSummary {
  totalDeposits: number
  totalWithdrawals: number
  totalNetFlow: number
  totalTransactions: number
  averageNetFlow: number
}

export interface VolumeSummary {
  totalBuyVolume: number
  totalSellVolume: number
  totalVolume: number
  totalBuyVolumeValueUSD: number
  totalSellVolumeValueUSD: number
  totalVolumeValueUSD: number
  totalBuyVolumeValueBRL: number
  totalSellVolumeValueBRL: number
  totalVolumeValueBRL: number
  totalTransactions: number
  topAssets: Array<{
    name: string
    symbol: string
    volume: number
    volumeValueUSD: number
    volumeValueBRL: number
    percentage: number
  }>
}

export type Currency = 'BRL' | 'USD'