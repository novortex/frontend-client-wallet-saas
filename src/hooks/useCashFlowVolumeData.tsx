import { useState, useEffect } from 'react'
import { 
  getCashFlowAnalysis, 
  getCryptoVolumeAnalysis 
} from '@/services/managementService'
import { 
  CashFlowData, 
  VolumeData, 
  PeriodType, 
  DateRange, 
  CashFlowSummary, 
  VolumeSummary 
} from '@/types/cashFlowVolume.type'

interface UseCashFlowVolumeDataReturn {
  cashFlowData: CashFlowData[]
  volumeData: VolumeData[]
  cashFlowSummary: CashFlowSummary
  volumeSummary: VolumeSummary
  loading: boolean
  error: string | null
  refresh: () => void
}

export const useCashFlowVolumeData = (
  period: PeriodType,
  dateRange?: DateRange,
  walletUuids?: string[]
): UseCashFlowVolumeDataReturn => {
  const [cashFlowData, setCashFlowData] = useState<CashFlowData[]>([])
  const [volumeData, setVolumeData] = useState<VolumeData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = {
        period,
        startDate: dateRange?.startDate?.toISOString(),
        endDate: dateRange?.endDate?.toISOString(),
        walletUuids,
      }

      const [cashFlow, volume] = await Promise.all([
        getCashFlowAnalysis(params),
        getCryptoVolumeAnalysis(params)
      ])

      setCashFlowData(cashFlow || [])
      setVolumeData(volume || [])
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Erro ao carregar dados de cash flow e volume'
      setError(errorMessage)
      console.error('Error loading cash flow & volume data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [period, dateRange?.startDate, dateRange?.endDate, walletUuids])

  // Calculate cash flow summary
  const cashFlowSummary: CashFlowSummary = {
    totalDeposits: cashFlowData.reduce((sum, item) => sum + item.deposits, 0),
    totalWithdrawals: cashFlowData.reduce((sum, item) => sum + item.withdrawals, 0),
    totalNetFlow: cashFlowData.reduce((sum, item) => sum + item.netFlow, 0),
    totalTransactions: cashFlowData.reduce((sum, item) => sum + item.transactions, 0),
    averageNetFlow: cashFlowData.length > 0 
      ? cashFlowData.reduce((sum, item) => sum + item.netFlow, 0) / cashFlowData.length 
      : 0,
  }

  // Calculate volume summary
  const assetVolumeMap = volumeData.reduce<Record<string, {
    name: string
    symbol: string
    totalVolume: number
    totalVolumeValueUSD: number
    totalVolumeValueBRL: number
    buyVolume: number
    sellVolume: number
    buyVolumeValueUSD: number
    sellVolumeValueUSD: number
    buyVolumeValueBRL: number
    sellVolumeValueBRL: number
  }>>((acc, item) => {
    if (!acc[item.assetName]) {
      acc[item.assetName] = {
        name: item.assetName,
        symbol: item.assetSymbol,
        totalVolume: 0,
        totalVolumeValueUSD: 0,
        totalVolumeValueBRL: 0,
        buyVolume: 0,
        sellVolume: 0,
        buyVolumeValueUSD: 0,
        sellVolumeValueUSD: 0,
        buyVolumeValueBRL: 0,
        sellVolumeValueBRL: 0,
      }
    }
    
    acc[item.assetName].totalVolume += item.totalVolume
    acc[item.assetName].totalVolumeValueUSD += item.totalVolumeValueUSD || 0
    acc[item.assetName].totalVolumeValueBRL += item.totalVolumeValueBRL || 0
    acc[item.assetName].buyVolume += item.buyVolume
    acc[item.assetName].sellVolume += item.sellVolume
    acc[item.assetName].buyVolumeValueUSD += item.buyVolumeValueUSD || 0
    acc[item.assetName].sellVolumeValueUSD += item.sellVolumeValueUSD || 0
    acc[item.assetName].buyVolumeValueBRL += item.buyVolumeValueBRL || 0
    acc[item.assetName].sellVolumeValueBRL += item.sellVolumeValueBRL || 0
    
    return acc
  }, {})

  const totalVolumeValueUSDsAssets = Object.values(assetVolumeMap)
    .reduce((sum, asset) => sum + asset.totalVolumeValueUSD, 0)
  const totalVolumeValueBRLAcrossAssets = Object.values(assetVolumeMap)
    .reduce((sum, asset) => sum + asset.totalVolumeValueBRL, 0)

  const topAssets = Object.values(assetVolumeMap)
    .sort((a, b) => b.totalVolumeValueBRL - a.totalVolumeValueBRL)
    .slice(0, 5)
    .map(asset => ({
      name: asset.name,
      symbol: asset.symbol,
      volume: asset.totalVolume,
      volumeValueUSD: asset.totalVolumeValueUSD,
      volumeValueBRL: asset.totalVolumeValueBRL,
      percentage: totalVolumeValueBRLAcrossAssets > 0 
        ? (asset.totalVolumeValueBRL / totalVolumeValueBRLAcrossAssets) * 100 
        : 0,
    }))

  const volumeSummary: VolumeSummary = {
    totalBuyVolume: volumeData.reduce((sum, item) => sum + item.buyVolume, 0),
    totalSellVolume: volumeData.reduce((sum, item) => sum + item.sellVolume, 0),
    totalVolume: volumeData.reduce((sum, item) => sum + item.totalVolume, 0),
    totalBuyVolumeValueUSD: volumeData.reduce((sum, item) => sum + (item.buyVolumeValueUSD || 0), 0),
    totalSellVolumeValueUSD: volumeData.reduce((sum, item) => sum + (item.sellVolumeValueUSD || 0), 0),
    totalVolumeValueUSD: volumeData.reduce((sum, item) => sum + (item.totalVolumeValueUSD || 0), 0),
    totalBuyVolumeValueBRL: volumeData.reduce((sum, item) => sum + (item.buyVolumeValueBRL || 0), 0),
    totalSellVolumeValueBRL: volumeData.reduce((sum, item) => sum + (item.sellVolumeValueBRL || 0), 0),
    totalVolumeValueBRL: volumeData.reduce((sum, item) => sum + (item.totalVolumeValueBRL || 0), 0),
    totalTransactions: volumeData.reduce((sum, item) => sum + item.transactions, 0),
    topAssets,
  }

  return {
    cashFlowData,
    volumeData,
    cashFlowSummary,
    volumeSummary,
    loading,
    error,
    refresh: loadData,
  }
}