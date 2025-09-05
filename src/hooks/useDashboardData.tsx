import { useState, useEffect } from 'react'
import { 
  getPerformanceSummary, 
  getAssetAllocation, 
  getRiskBreakdown, 
  getBenchmarkAnalysis,
  getExchangeBreakdown,
  getClientSegmentAnalysis,
  invalidateAnalyticsCache
} from '@/services/managementService'

interface PerformanceSummary {
  openWallets: number
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
}

interface RiskBreakdown {
  byRiskProfile: Record<string, any>
  averageInvestmentByRiskProfile: Record<string, any>
}

interface BenchmarkAnalysis {
  byBenchmark: Record<string, any>
  averageInvestmentByBenchmark: Record<string, any>
}

interface ExchangeBreakdown {
  byExchange: Record<string, any>
  averageInvestmentByExchange: Record<string, any>
}

interface ClientSegmentAnalysis {
  byClientSegment: Record<string, any>
  averageInvestmentByClientSegment: Record<string, any>
}

interface AssetAllocation {
  totalAUM: number
  assets: Record<string, any>
}

interface DashboardState {
  performanceSummary: {
    data: PerformanceSummary | null
    loading: boolean
    error: string | null
  }
  assetAllocation: {
    data: AssetAllocation | null
    loading: boolean
    error: string | null
  }
  riskBreakdown: {
    data: RiskBreakdown | null
    loading: boolean
    error: string | null
  }
  benchmarkAnalysis: {
    data: BenchmarkAnalysis | null
    loading: boolean
    error: string | null
  }
  exchangeBreakdown: {
    data: ExchangeBreakdown | null
    loading: boolean
    error: string | null
  }
  clientSegmentAnalysis: {
    data: ClientSegmentAnalysis | null
    loading: boolean
    error: string | null
  }
}

export const useDashboardData = () => {
  const [state, setState] = useState<DashboardState>({
    performanceSummary: { data: null, loading: true, error: null },
    assetAllocation: { data: null, loading: true, error: null },
    riskBreakdown: { data: null, loading: true, error: null },
    benchmarkAnalysis: { data: null, loading: true, error: null },
    exchangeBreakdown: { data: null, loading: true, error: null },
    clientSegmentAnalysis: { data: null, loading: true, error: null },
  })

  const [retryCount, setRetryCount] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Load performance summary first (critical data)
  useEffect(() => {
    const loadPerformanceSummary = async () => {
      try {
        setState(prev => ({
          ...prev,
          performanceSummary: { ...prev.performanceSummary, loading: true, error: null }
        }))
        
        const data = await getPerformanceSummary()
        
        setState(prev => ({
          ...prev,
          performanceSummary: { data, loading: false, error: null }
        }))
      } catch (error) {
        setState(prev => ({
          ...prev,
          performanceSummary: { 
            data: null, 
            loading: false, 
            error: error instanceof Error ? error.message : 'Erro ao carregar dados de performance'
          }
        }))
      }
    }

    loadPerformanceSummary()
  }, [retryCount])

  // Load other data in parallel after performance summary
  useEffect(() => {
    const loadSecondaryData = async () => {
      // Wait a bit to prioritize performance summary
      await new Promise(resolve => setTimeout(resolve, 100))

      const loadAssetAllocation = async () => {
        try {
          const data = await getAssetAllocation()
          setState(prev => ({
            ...prev,
            assetAllocation: { data, loading: false, error: null }
          }))
        } catch (error) {
          setState(prev => ({
            ...prev,
            assetAllocation: { 
              data: null, 
              loading: false, 
              error: error instanceof Error ? error.message : 'Erro ao carregar alocação de ativos'
            }
          }))
        }
      }

      const loadRiskBreakdown = async () => {
        try {
          const data = await getRiskBreakdown()
          setState(prev => ({
            ...prev,
            riskBreakdown: { data, loading: false, error: null }
          }))
        } catch (error) {
          setState(prev => ({
            ...prev,
            riskBreakdown: { 
              data: null, 
              loading: false, 
              error: error instanceof Error ? error.message : 'Erro ao carregar análise de risco'
            }
          }))
        }
      }

      const loadBenchmarkAnalysis = async () => {
        try {
          const data = await getBenchmarkAnalysis()
          setState(prev => ({
            ...prev,
            benchmarkAnalysis: { data, loading: false, error: null }
          }))
        } catch (error) {
          setState(prev => ({
            ...prev,
            benchmarkAnalysis: { 
              data: null, 
              loading: false, 
              error: error instanceof Error ? error.message : 'Erro ao carregar análise de benchmark'
            }
          }))
        }
      }

      const loadExchangeBreakdown = async () => {
        try {
          const data = await getExchangeBreakdown()
          setState(prev => ({
            ...prev,
            exchangeBreakdown: { data, loading: false, error: null }
          }))
        } catch (error) {
          setState(prev => ({
            ...prev,
            exchangeBreakdown: { 
              data: null, 
              loading: false, 
              error: error instanceof Error ? error.message : 'Erro ao carregar análise de corretoras'
            }
          }))
        }
      }

      const loadClientSegmentAnalysis = async () => {
        try {
          const data = await getClientSegmentAnalysis()
          setState(prev => ({
            ...prev,
            clientSegmentAnalysis: { data, loading: false, error: null }
          }))
        } catch (error) {
          setState(prev => ({
            ...prev,
            clientSegmentAnalysis: { 
              data: null, 
              loading: false, 
              error: error instanceof Error ? error.message : 'Erro ao carregar análise por segmento de cliente'
            }
          }))
        }
      }

      // Load all secondary data in parallel
      Promise.all([
        loadAssetAllocation(),
        loadRiskBreakdown(),
        loadBenchmarkAnalysis(),
        loadExchangeBreakdown(),
        loadClientSegmentAnalysis()
      ])
    }

    loadSecondaryData()
  }, [retryCount])

  const retry = () => {
    setRetryCount(prev => prev + 1)
  }

  const refresh = async () => {
    setIsRefreshing(true)
    try {
      // Invalidar cache no backend antes de recarregar dados
      await invalidateAnalyticsCache()
      await new Promise(resolve => setTimeout(resolve, 300)) // Aguardar invalidação
      setRetryCount(prev => prev + 1)
    } catch (error) {
      console.error('Erro ao invalidar cache:', error)
      // Mesmo com erro na invalidação, tentar recarregar dados
      setRetryCount(prev => prev + 1)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Computed states for better UX
  const isMainDataLoaded = !state.performanceSummary.loading && state.performanceSummary.data !== null
  const isAllDataLoaded = Object.values(state).every(s => !s.loading)
  const hasAnyError = Object.values(state).some(s => s.error !== null)
  const hasMainError = state.performanceSummary.error !== null

  return {
    ...state,
    isMainDataLoaded,
    isAllDataLoaded,
    hasAnyError,
    hasMainError,
    isRefreshing,
    retry,
    refresh,
  }
}