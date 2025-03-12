/* eslint-disable react/no-unescaped-entities */
import { Button } from '@/components/ui/button'
import { HandCoins, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  AllTimePerformance,
  KpiData,
  TWalletAssetsInfo,
} from '@/types/wallet.type'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { getWalletKpis } from '@/services/wallet/walleInfoService'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
  const [selectedPeriod, setSelectedPeriod] = useState<
    'all' | 'sixmonths' | 'month' | 'week' | null
  >(null)
  const [showAllTimeOnly, setShowAllTimeOnly] = useState(false)
  const [allTimePerformance, setAllTimePerformance] =
    useState<AllTimePerformance | null>(null)
  const [kpis, setKpis] = useState<KpiData>({
    walletPerformance: { performance: '', percentagePerformance: '' },
    bitcoinPerformance: { performance: '', percentagePerformance: '' },
    hash11Performance: { performance: '', percentagePerformance: '' },
    sp500Performance: { performance: '', percentagePerformance: '' },
  })

  const fetchKpis = async (period: 'all' | 'sixmonths' | 'month' | 'week') => {
    if (!walletUuid || !period) return

    setLoading(true)
    setError('')
    setSelectedPeriod(period)

    try {
      if (period === 'all') {
        if (allTimePerformance) {
          setShowAllTimeOnly(true)
          return
        }

        const kpiData = await getWalletKpis(walletUuid, 'all')
        setAllTimePerformance(kpiData as AllTimePerformance)
        setShowAllTimeOnly(true)
      } else {
        const kpiData = await getWalletKpis(walletUuid, period)
        setKpis(kpiData as KpiData)
        setShowAllTimeOnly(false)
      }
    } catch (err) {
      setError('Error fetching data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-10 flex items-center justify-between">
      <Label className="text-2xl dark:text-white">
        {infosWallet?.ownerName}
      </Label>
      <div className="flex gap-5">
        <Button
          className="bg-[#F2BE38] text-black hover:bg-yellow-600 hover:text-white"
          onClick={() => setIsKpiModalOpen(true)}
        >
          <TrendingUp /> KPI's
        </Button>

        <Dialog open={isKpiModalOpen} onOpenChange={setIsKpiModalOpen}>
          <DialogContent className="w-full max-w-3xl rounded-lg p-6 dark:bg-[#131313] dark:text-[#fff]">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl dark:text-white">
                Wallet KPI's
              </DialogTitle>
            </DialogHeader>

            <div className="mb-6 flex justify-center gap-4">
              <Button
                className={`rounded-md p-2 ${selectedPeriod === 'all' ? 'bg-yellow-500 text-black' : 'bg-gray-700'} hover:bg-yellow-600`}
                onClick={() => {
                  fetchKpis('all')
                  setShowAllTimeOnly(true)
                }}
              >
                All Time Wallet
              </Button>
              <Button
                className={`rounded-md p-2 ${
                  selectedPeriod === 'sixmonths'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-700'
                } hover:bg-yellow-600`}
                onClick={() => {
                  fetchKpis('sixmonths')
                  setShowAllTimeOnly(false)
                }}
              >
                Last 6 Months
              </Button>
              <Button
                className={`rounded-md p-2 ${
                  selectedPeriod === 'month'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-700'
                } hover:bg-yellow-600`}
                onClick={() => {
                  fetchKpis('month')
                  setShowAllTimeOnly(false)
                }}
              >
                Last Month
              </Button>
              <Button
                className={`rounded-md p-2 ${
                  selectedPeriod === 'week'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-700'
                } hover:bg-yellow-600`}
                onClick={() => {
                  fetchKpis('week')
                  setShowAllTimeOnly(false)
                }}
              >
                Last Week
              </Button>
            </div>

            {/* KPI Cards */}
            {!loading && !error && (
              <div
                className={`flex w-full items-center ${showAllTimeOnly ? 'justify-center' : 'flex-wrap justify-center gap-6'}`}
              >
                {showAllTimeOnly && allTimePerformance ? (
                  <KpiCard
                    title="All Time Wallet"
                    performance={
                      allTimePerformance.allTimePerformance.performance
                    }
                    percentagePerformance={
                      allTimePerformance.allTimePerformance
                        .percentagePerformance
                    }
                    startDateUsed={
                      allTimePerformance.allTimePerformance.startDateUsed
                    }
                    endDateUsed={
                      allTimePerformance.allTimePerformance.endDateUsed
                    }
                  />
                ) : (
                  <>
                    <KpiCard
                      title="Wallet"
                      performance={kpis.walletPerformance.performance}
                      percentagePerformance={
                        kpis.walletPerformance.percentagePerformance
                      }
                      startDateUsed={kpis.walletPerformance.startDateUsed}
                      endDateUsed={kpis.walletPerformance.endDateUsed}
                    />
                    <KpiCard
                      title="Bitcoin"
                      performance={kpis.bitcoinPerformance.performance}
                      percentagePerformance={
                        kpis.bitcoinPerformance.percentagePerformance
                      }
                      startDateUsed={kpis.walletPerformance.startDateUsed}
                      endDateUsed={kpis.walletPerformance.endDateUsed}
                    />
                    <KpiCard
                      title="Hash11"
                      performance={kpis.hash11Performance.performance}
                      percentagePerformance={
                        kpis.hash11Performance.percentagePerformance
                      }
                      startDateUsed={kpis.walletPerformance.startDateUsed}
                      endDateUsed={kpis.walletPerformance.endDateUsed}
                    />
                    <KpiCard
                      title="S&P500"
                      performance={kpis.sp500Performance.performance}
                      percentagePerformance={
                        kpis.sp500Performance.percentagePerformance
                      }
                      startDateUsed={kpis.walletPerformance.startDateUsed}
                      endDateUsed={kpis.walletPerformance.endDateUsed}
                    />
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Other Wallet Actions */}
        <Button
          className="bg-[#F2BE38] text-black hover:bg-yellow-600 hover:text-white"
          onClick={openOperationModal}
        >
          <HandCoins /> Withdrawal / Deposit
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(`/wallet/${walletUuid}/history`)}
          className="hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          Historic
        </Button>
        <Button
          type="button"
          className="bg-[#F2BE38] text-black hover:bg-yellow-600 hover:text-white"
          onClick={openOrCloseModalRebalanced}
        >
          Rebalanced
        </Button>
        <Button
          className={`p-5 text-white ${
            infosWallet?.isClosed
              ? 'bg-[#10A45C] hover:bg-green-700'
              : 'bg-[#EF4E3D] hover:bg-red-700'
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
