import { Button } from '@/components/ui/button'
import { HandCoins, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { KpiData, TWalletAssetsInfo } from '@/types/wallet.type'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { getWalletKpis } from '@/services/wallet/walleInfoService'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import KpiCard from '@/components/custom/card-kpi'

interface ActionButtonsProps {
  walletUuid: string | undefined
  openOperationModal: () => void
  openCloseWalletModal: () => void
  openOrCloseModalRebalanced: () => void
  infosWallet: TWalletAssetsInfo | undefined
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  walletUuid,
  openOperationModal,
  openCloseWalletModal,
  openOrCloseModalRebalanced,
  infosWallet,
}) => {
  const navigate = useNavigate()

  const [isKpiModalOpen, setIsKpiModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState<'sixmonths' | 'month' | 'week' | null>(null)
  const [kpis, setKpis] = useState<KpiData>({
    walletPerformance: 0,
    bitcoinBenchmark: 0,
    hash11Benchmark: 0,
    sp500Benchmark: 0,
  })

  const fetchKpis = async (period: 'sixmonths' | 'month' | 'week') => {
    if (!walletUuid) return

    setLoading(true)
    setError('')
    setSelectedPeriod(period)
    try {
      const kpiData = await getWalletKpis(walletUuid, period)
      console.log(kpiData)
      setKpis(kpiData)
    } catch (err) {
      setError('Error fetching data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-between mb-10">
      <Label className="text-2xl text-white">{infosWallet?.ownerName}</Label>
      <div className="flex gap-5">
        {/* KPI Button to Open Modal */}
        <Button
          className="bg-[#F2BE38] text-black hover:text-white hover:bg-yellow-600"
          onClick={() => setIsKpiModalOpen(true)}
        >
          <TrendingUp /> KPI's
        </Button>

        {/* KPI Modal */}
        <Dialog open={isKpiModalOpen} onOpenChange={setIsKpiModalOpen}>
          <DialogContent className="w-full max-w-3xl bg-[#131313] text-[#fff] p-6 rounded-lg">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-white text-xl">Wallet KPI's</DialogTitle>
            </DialogHeader>

            {/* Period Selection Buttons */}
            <div className="flex justify-center gap-4 mb-6">
              <Button
                className={`p-2 rounded-md ${selectedPeriod === 'sixmonths' ? 'text-black bg-yellow-500' : 'bg-gray-700'
                  } hover:bg-yellow-600`}
                onClick={() => fetchKpis('sixmonths')}
              >
                Last 6 Months
              </Button>
              <Button
                className={`p-2 rounded-md ${selectedPeriod === 'month' ? 'text-black bg-yellow-500' : 'bg-gray-700'
                  } hover:bg-yellow-600`}
                onClick={() => fetchKpis('month')}
              >
                Last Month
              </Button>
              <Button
                className={`p-2 rounded-md ${selectedPeriod === 'week' ? 'text-black bg-yellow-500' : 'bg-gray-700'
                  } hover:bg-yellow-600`}
                onClick={() => fetchKpis('week')}
              >
                Last Week
              </Button>
            </div>

            {/* KPI Cards */}
            {loading && <p className="text-gray-400 text-center">Loading...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}
            {!loading && !error && selectedPeriod && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-2 w-full">
                <KpiCard title="Wallet Performance" value={kpis.walletPerformance} />
                <KpiCard title="Bitcoin Performance" value={kpis.bitcoinBenchmark} />
                <KpiCard title="Hash11 Performance" value={kpis.hash11Benchmark} />
                <KpiCard title="S&P500 Performance" value={kpis.sp500Benchmark} />
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Other Wallet Actions */}
        <Button
          className="bg-[#F2BE38] text-black hover:text-white hover:bg-yellow-600"
          onClick={openOperationModal}
        >
          <HandCoins /> Withdrawal / Deposit
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(`/wallet/${walletUuid}/history`)}
          className="hover:bg-gray-400"
        >
          Historic
        </Button>
        <Button
          type="button"
          className="bg-[#F2BE38] text-black hover:text-white hover:bg-yellow-600"
          onClick={openOrCloseModalRebalanced}
        >
          Rebalanced
        </Button>
        <Button
          className={`p-5 ${infosWallet?.isClosed ? 'bg-[#10A45C] hover:bg-green-700' : 'bg-[#EF4E3D] hover:bg-red-600'
            }`}
          type="button"
          onClick={openCloseWalletModal}
        >
          {infosWallet?.isClosed ? 'Start Wallet' : 'Close Wallet'}
        </Button>
      </div>
    </div>
  )
}

export { ActionButtons }
