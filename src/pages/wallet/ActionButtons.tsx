import { Button } from '@/components/ui/button'
import { HandCoins, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { KpiData, TWalletAssetsInfo } from '@/types/wallet.type'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'
import { getWalletKpis } from '@/services/wallet/walleInfoService'
import { Loading } from '@/components/custom/loading'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CardDashboard } from '@/components/custom/card-dashboard'

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

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [isKpiModalOpen, setIsKpiModalOpen] = useState(false)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [kpis, setKpis] = useState<KpiData>({
    walletPerformance: 0,
    bitcoinBenchmark: 0,
    hash11Benchmark: 0,
    sp500Benchmark: 0,
  });

  if (loading) return <Loading />
  if (error) return <div>{error}</div>

  useEffect(() => {
    console.log('useEffect')
    console.log(walletUuid)

    if (!isKpiModalOpen || !walletUuid) return;

    const getKpis = async () => {
      setLoading(true);

      try {
        const kpiData = await getWalletKpis(walletUuid, startDate, endDate);
        setKpis(kpiData);
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getKpis();
  }, [isKpiModalOpen, walletUuid, startDate, endDate]);

  return (
    <div className="flex items-center justify-between mb-10">
      <Label className="text-2xl text-white">{infosWallet?.ownerName}</Label>
      <div className="flex gap-5">
        <Button
          className="bg-[#F2BE38] text-black hover:text-white hover:bg-yellow-600"
          onClick={() => setIsKpiModalOpen(true)}
        >
          <TrendingUp /> KPI's
        </Button>
        {/* 
        <Dialog open={isKpiModalOpen} onOpenChange={setIsKpiModalOpen}>
           <DialogContent className="w-[200%] bg-[#131313] text-[#fff]">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-white text-xl">Wallet KPI's</DialogTitle>
            </DialogHeader> */}

        {/* Date Inputs */}
        {/* <div className="flex justify-center md:flex-row gap-4 mb-6">
              <div className="flex flex-col">
                <label className="text-gray-300 font-medium mb-1">Start Date:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-2 border border-gray-600 rounded-md bg-[#333] text-white focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-300 font-medium mb-1">End Date:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-2 border border-gray-600 rounded-md bg-[#333] text-white focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div> */}

        {/* KPI Cards */}
        {/* {loading && <p className="text-gray-400 text-center">Loading...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}
            {!loading && !error && (
              <div className="flex justify-center gap-6">
                <CardDashboard title="Wallet Performance" data={String(kpis.walletPerformance)} />
                <CardDashboard title="Bitcoin Benchmark" data={String(kpis.bitcoinBenchmark)} />
                <CardDashboard title="Hash11 Benchmark" data={String(kpis.hash11Benchmark)} />
                <CardDashboard title="S&P 500 Benchmark" data={String(kpis.sp500Benchmark)} />
              </div>
            )}
          </DialogContent>
        </Dialog>
 */}


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
          className=" hover:bg-gray-400"
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
          className={`p-5 ${infosWallet?.isClosed ? 'bg-[#10A45C] hover:bg-green-700' : 'bg-[#EF4E3D] hover:bg-red-600'}`}
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
