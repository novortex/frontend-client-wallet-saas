import { SwitchTheme } from '@/components/custom/switch-theme'
import { Input } from '@/components/ui/input'
import { CardDashboard } from '@/components/custom/card-dashboard'
import {
  getAllAssetsWalletClient,
  updateCurrentAmount,
} from '@/services/walletService'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ClientActive } from '@/components/custom/tables/wallet-client/columns'
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
import { getGraphData } from '@/services/request'
import { WalletGraph } from './graph-wallet'

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
            className: 'bg-red-500 border-0 text-white',
            title: 'Failed get assets organization :(',
            description: 'Demo Vault !!',
          })
        }

        setInfosWallet(result.wallet)

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
        }))

        setData(dataTable)
        setLoading(false)
      } catch (error) {
        toast({
          className: 'bg-red-500 border-0 text-white',
          title: 'Failed get assets organization :(',
          description: 'Demo Vault !!',
        })
      }
    }

    if (!walletUuid) {
      toast({
        className: 'bg-red-500 border-0 text-white',
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
    return <div>Loading...</div>
  }

  return (
    <div className="p-10">
      <div className="mb-10 flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="text-2xl text-white font-medium"
                href="/wallets"
              >
                Wallets
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                className="text-2xl text-white font-medium"
                href={`/clients/${walletUuid}/infos`}
              >
                Information clients
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-2xl text-white font-medium">
                Wallet Graphic
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <SwitchTheme />
      </div>
      <div className="flex items-center justify-between mb-10">
        <Input
          className="bg-[#171717] w-full border-0 text-white focus:ring-0"
          type="text"
          placeholder="Search for ..."
        />
      </div>
      <div className="w-full h-1/3 mb-5 flex flex-row justify-between">
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
      </div>
      <div className="w-full h-1/3 mb-10 flex flex-row justify-between">
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
        <CardDashboard title="Current value ideal portfolio" data="-" />
      </div>
      <div className="w-full h-1/3">
        <WalletGraph />
      </div>
    </div>
  )
}
