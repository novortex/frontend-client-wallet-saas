import { SwitchTheme } from '@/components/custom/switch-theme'
import { CardDashboard } from '@/components/custom/card-dashboard'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { useSignalStore } from '@/store/signalEffect'
import { formatDate } from '@/utils'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { TWalletAssetsInfo } from '@/types/wallet.type'
import { WalletGraph } from './graph-wallet'
import {
  getGraphData,
  updateCurrentAmount,
} from '@/services/wallet/walleInfoService'
import { getAllAssetsWalletClient } from '@/services/wallet/walletAssetService'
import { ClientActive } from '@/components/custom/wallet/columns'
import { Loading } from '@/components/custom/loading'
import { formatRealCurrency } from '@/utils/formatRealCurrency'

interface graphDataEntry {
  cuid: string
  amountPercentage: number
  cryptoMoney: number
  benchmarkMoney: number
  walletUuid: string
  createAt: string
}

export function Graphs() {
  const [, setData] = useState<ClientActive[]>([])
  const [infosWallet, setInfosWallet] = useState<TWalletAssetsInfo>()
  const [revenue, setRevenue] = useState<number | string>('')
  const [loading, setLoading] = useState(true)
  const [graphData, setGraphData] = useState<graphDataEntry[]>([])
  const { walletUuid } = useParams()
  const { toast } = useToast()
  const [signal] = useSignalStore((state) => [state.signal])

  useEffect(() => {
    async function getData(
      walletUuid: string,
      setData: React.Dispatch<React.SetStateAction<ClientActive[]>>,
      setInfosWallet: React.Dispatch<
        React.SetStateAction<TWalletAssetsInfo | undefined>
      >,
    ) {
      try {
        await updateCurrentAmount(walletUuid)

        const result = await getAllAssetsWalletClient(walletUuid)

        if (!result) {
          return toast({
            className: 'bg-destructive border-0 text-destructive-foreground',
            title: 'Failed get assets organization :(',
            description: 'Demo Vault !!',
          })
        }

        setInfosWallet(result.wallet)
        setRevenue(result.revenue)

        const dataTable: ClientActive[] = result.assets.map((item) => ({
          id: item.uuid,
          asset: {
            urlImage: item.icon,
            name: item.name,
          },
          currentAmount: item.currentAmount,
          assetQuantity: item.quantityAsset,
          price: item.price,
          allocation: item.currentAllocation,
          idealAllocation: item.idealAllocation,
          idealAmount: item.idealAmountInMoney,
          buyOrSell: item.buyOrSell,
          averagePrice: item.averagePrice,
          profitLossPercentage: item.profitLossPercentage,
        }))

        setData(dataTable)
        setLoading(false)
      } catch (error) {
        toast({
          className: 'bg-destructive border-0 text-destructive-foreground',
          title: 'Failed get assets organization :(',
          description: 'Demo Vault !!',
        })
      }
    }

    if (!walletUuid) {
      toast({
        className: 'bg-destructive border-0 text-destructive-foreground',
        title: 'Failed get assets organization :(',
        description: 'Demo Vault !!',
      })

      return
    }

    getData(walletUuid, setData, setInfosWallet)
  }, [toast, walletUuid, signal])

  useEffect(() => {
    async function fetchGraphData() {
      if (walletUuid) {
        try {
          const data = await getGraphData(walletUuid)

          // Ordenar os dados por data (createAt) de forma decrescente (mais recente primeiro)
          const sortedData = data.sort(
            (a: graphDataEntry, b: graphDataEntry) =>
              new Date(b.createAt).getTime() - new Date(a.createAt).getTime(),
          )

          setGraphData(sortedData)
        } catch (error) {
          console.error('Failed to fetch historic:', error)
        }
      } else {
        console.error('organizationUuid or walletUuid is undefined')
      }
    }
    fetchGraphData()
  }, [walletUuid])

  console.log(graphData)

  if (loading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                href="/wallets"
              >
                Wallets
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                href={`/clients/${walletUuid}/infos`}
              >
                Information clients
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium text-foreground">
                Wallet Performance
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <SwitchTheme />
      </div>
      
      {/* Header com título */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Performance Analysis</h1>
        <p className="text-sm text-muted-foreground mt-1">Track wallet performance and compare with benchmark</p>
      </div>
      
      {/* Grid de métricas */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardDashboard
          title="Entry date"
          data={
            infosWallet?.startDate !== null
              ? formatDate(infosWallet?.startDate?.toString() ?? '-')
              : '-'
          }
        />
        <CardDashboard
          title="Closing date"
          data={
            infosWallet?.monthCloseDate !== null
              ? formatDate(infosWallet?.monthCloseDate?.toString() ?? '-')
              : '-'
          }
        />
        <CardDashboard
          title="Initial value"
          data={
            infosWallet?.investedAmount !== undefined
              ? Number(infosWallet.investedAmount).toFixed(2)
              : '-'
          }
        />
        <CardDashboard
          title="Current value"
          data={
            infosWallet?.currentAmount !== undefined
              ? Number(infosWallet.currentAmount).toFixed(2)
              : '-'
          }
        />
        <CardDashboard
          title="Performance fee"
          data={
            infosWallet?.performanceFee !== undefined
              ? Number(infosWallet.performanceFee).toFixed(2)
              : '-'
          }
        />
        <CardDashboard
          title="Last rebalance"
          data={
            infosWallet?.lastRebalance
              ? formatDate(infosWallet.lastRebalance.toString())
              : '-'
          }
        />
        <CardDashboard
          title="Current value in benchmark"
          data={
            graphData[0]?.benchmarkMoney !== undefined
              ? Number(graphData[0].benchmarkMoney).toFixed(2)
              : '-'
          }
        />
        <CardDashboard
          title="Revenue coming from wallet today"
          data={
            typeof revenue === 'number' ? formatRealCurrency(revenue) : revenue
          }
        />
      </div>
      
      {/* Gráfico */}
      <div className="w-full">
        <WalletGraph />
      </div>
      </div>
    </div>
  )
}
export default Graphs
