import { useState } from 'react'
import { Loading } from '@/components/custom/loading'
import { useDashboardData } from '@/hooks/useDashboardData'
import { DashboardHeader } from './components/DashboardHeader'
import { TabNavigation } from './components/TabNavigation'
import { OverviewTab } from './components/OverviewTab'
import { RiskAnalysisTab } from './components/RiskAnalysisTab'
import { BenchmarkTab } from './components/BenchmarkTab'
import { ExchangeTab } from './components/ExchangeTab'
import { ClientTab } from './components/ClientTab'
import { ManagerTab } from './components/ManagerTab'
import { CashFlowVolumeTab } from './components/CashFlowVolumeTab'
import { TabType, RevenueProjection } from './constants/types'

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const {
    performanceSummary,
    assetAllocation,
    riskBreakdown,
    benchmarkAnalysis,
    exchangeBreakdown,
    clientSegmentAnalysis,
    managerBreakdown,
    isRefreshing,
    isAllDataLoaded,
    refresh
  } = useDashboardData()

  if (!isAllDataLoaded && !performanceSummary.data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (!performanceSummary.data) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center text-muted-foreground">
          Erro ao carregar dados do dashboard. Tente novamente.
        </div>
      </div>
    )
  }

  // Combine all data into the expected RevenueProjection format
  const revenueProjection: RevenueProjection = {
    summary: {
      ...performanceSummary.data,
      successfulWallets: performanceSummary.data.profitableWallets || 0,
      missingPerformanceHistoryCount: 0,
      missingInformationAboutPerformanceOrWallet: 0,
    },
    byAsset: assetAllocation.data?.assets || {},
    byRiskProfile: riskBreakdown.data?.byRiskProfile || {},
    averageInvestmentByRiskProfile: riskBreakdown.data?.averageInvestmentByRiskProfile || {},
    byBenchmark: benchmarkAnalysis.data?.byBenchmark || {},
    averageInvestmentByBenchmark: benchmarkAnalysis.data?.averageInvestmentByBenchmark || {},
    byExchange: exchangeBreakdown.data?.byExchange || {},
    averageInvestmentByExchange: exchangeBreakdown.data?.averageInvestmentByExchange || {},
    byClientSegment: clientSegmentAnalysis.data?.byClientSegment || {},
    averageInvestmentByClientSegment: clientSegmentAnalysis.data?.averageInvestmentByClientSegment || {},
    byManager: managerBreakdown.data?.byManager || {},
    averageInvestmentByManager: managerBreakdown.data?.averageInvestmentByManager || {},
  }

  // Prepare allocation array from asset data
  const allocationArray = Object.entries(revenueProjection.byAsset || {})
    .map(([name, data]: [string, any]) => {
      return {
        name,
        total: data?.value || 0,
        percentage: data?.percentage || 0,
        walletCount: data?.walletCount || 0,
      }
    })
    .filter(item => item.total > 0) // Remove entries with no data
    .sort((a, b) => b.total - a.total)


  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
  }

  return (
    <div className="container mx-auto p-4">
      <DashboardHeader
        isRefreshing={isRefreshing}
        isAllDataLoaded={isAllDataLoaded}
        dataQualityRate={performanceSummary.data.dataQualityRate}
        onRefresh={refresh}
      />

      <TabNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Conteúdo das abas */}
      {activeTab === 'overview' && (
        <OverviewTab
          revenueProjection={revenueProjection}
          allocationArray={allocationArray}
        />
      )}

      {activeTab === 'risk' && (
        <RiskAnalysisTab revenueProjection={revenueProjection} />
      )}

      {activeTab === 'benchmark' && (
        <BenchmarkTab revenueProjection={revenueProjection} />
      )}

      {activeTab === 'exchange' && (
        <ExchangeTab revenueProjection={revenueProjection} />
      )}

      {activeTab === 'client' && (
        <ClientTab revenueProjection={revenueProjection} />
      )}

      {activeTab === 'manager' && (
        <ManagerTab revenueProjection={revenueProjection} />
      )}

      {activeTab === 'cashflow' && (
        <CashFlowVolumeTab />
      )}
    </div>
  )
}

export default Dashboard