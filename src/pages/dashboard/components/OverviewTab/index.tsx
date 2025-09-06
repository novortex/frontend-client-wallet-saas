import { KPICards } from '../KPICards'
import { AssetAllocationTable } from './AssetAllocationTable'
import { ChartsGrid } from './ChartsGrid'
import { RevenueProjection } from '../../constants'
import { preparePerformanceData } from '../../utils/prepareWalletsPerformanceComparison'
import { prepareBenchmarkComparisonData } from '../../utils/prepareBenchmarkComparison'
import { prepareRevenueGeneratingData } from '../../utils/prepareRevenueGeneratingData'
import { gerarCores } from '../../utils/generateBarchartColors'

interface OverviewTabProps {
  revenueProjection: RevenueProjection
  allocationArray: Array<{
    name: string
    total: number
    percentage: number
    walletCount: number
  }>
}

export function OverviewTab({ revenueProjection, allocationArray }: OverviewTabProps) {
  const performanceData = preparePerformanceData(revenueProjection, revenueProjection.summary.openWallets)
  const benchmarkComparisonData = prepareBenchmarkComparisonData(revenueProjection, revenueProjection.summary.openWallets)
  const revenueGeneratingData = prepareRevenueGeneratingData(revenueProjection, revenueProjection.summary.openWallets)
  const colors = gerarCores(allocationArray.length)

  return (
    <div>
      {/* KPIs */}
      <KPICards data={revenueProjection.summary} />

      {/* Asset Allocation Table */}
      <AssetAllocationTable data={allocationArray} colors={colors} />

      {/* Charts Grid */}
      <ChartsGrid
        performanceData={performanceData}
        benchmarkComparisonData={benchmarkComparisonData}
        revenueGeneratingData={revenueGeneratingData}
      />
    </div>
  )
}