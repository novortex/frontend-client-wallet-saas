import { useEffect, useState } from 'react'
import { CardDashboard } from '@/components/custom/card-dashboard'
import {
  ClientActive,
  columns,
} from '@/components/custom/tables/wallet-client/columns'
import { DataTable } from '@/components/custom/tables/wallet-client/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import SwitchTheme from '@/components/custom/switch-theme'
import { useToast } from '@/components/ui/use-toast'
import {
  getAllAssetsWalletClient,
  TWalletAssetsInfo,
  updateCurrentAmount,
} from '@/service/request'
import { useNavigate, useParams } from 'react-router-dom'
import { useUserStore } from '@/store/user'
import { formatDate } from '@/utils'
import { useSignalStore } from '@/store/signalEffect'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { HandCoins } from 'lucide-react'
import OperationsModal from '@/components/custom/tables/wallet-client/operations'
// import CloseWalletModal from '@/components/custom/closing-wallet-modal'
import ConfirmCloseWalletModal from '@/components/custom/confirm-close-wallet-modal'

export default function Wallet() {
  const [data, setData] = useState<ClientActive[]>([])
  const [infosWallet, setInfosWallet] = useState<TWalletAssetsInfo>()
  const [isOperationModalOpen, setIsOperationModalOpen] = useState(false)
  const [isCloseWalletModalOpen, setIsCloseWalletOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uuidOrganization] = useUserStore((state) => [
    state.user.uuidOrganization,
  ])
  const [signal] = useSignalStore((state) => [state.signal])

  const { walletUuid } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const openOperationModal = () => {
    setIsOperationModalOpen(true)
  }

  const closeOperationModal = () => {
    setIsOperationModalOpen(false)
  }

  const openCloseWalletModal = () => {
    setIsCloseWalletOpen(true)
  }

  const closeCloseWalletModal = () => {
    setIsCloseWalletOpen(false)
  }

  useEffect(() => {
    async function getData(
      uuidOrganization: string,
      walletUuid: string,
      setData: React.Dispatch<React.SetStateAction<ClientActive[]>>,
      setInfosWallet: React.Dispatch<
        React.SetStateAction<TWalletAssetsInfo | undefined>
      >,
    ) {
      try {
        await updateCurrentAmount(uuidOrganization, walletUuid)

        const result = await getAllAssetsWalletClient(
          uuidOrganization,
          walletUuid,
        )

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
          investedAmount: item.investedAmount,
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

    getData(uuidOrganization, walletUuid, setData, setInfosWallet)
  }, [toast, uuidOrganization, walletUuid, signal])

  const closeModalState = !!infosWallet?.isClosed

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
                Client wallet
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <SwitchTheme />
      </div>

      <div className="flex items-center justify-between mb-10">
        <Input
          className="bg-[#171717] w-3/4 border-0 text-white focus:ring-0"
          type="text"
          placeholder="Search for ..."
        />
        <div className="flex gap-5">
          <Button
            className="bg-[#1877F2] w-[45%] hover:bg-blue-600 p-5 gap-2 ml-4"
            onClick={openOperationModal}
          >
            <HandCoins />
            Withdrawal / Deposit
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/wallet/${walletUuid}/history`)}
          >
            Historic
          </Button>
          <Button
            className={`p-5 ${infosWallet?.isClosed ? 'bg-[#10A45C]' : 'bg-[#EF4E3D]'}`}
            type="button"
            onClick={openCloseWalletModal}
          >
            {infosWallet?.isClosed ? 'Start Wallet' : 'Close Wallet'}
          </Button>
        </div>
      </div>
      {infosWallet && (
        <div className="flex gap-5 mb-10">
          <CardDashboard
            title="Start date"
            data={
              infosWallet.startDate !== null
                ? formatDate(infosWallet.startDate?.toString())
                : '-'
            }
          />
          <CardDashboard
            title="Invested Amount"
            data={
              infosWallet?.investedAmount !== undefined
                ? Number(infosWallet.investedAmount).toFixed(2)
                : '-'
            }
          />
          <CardDashboard
            title="Current Amount"
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
            title="Last rebalancing"
            data={
              infosWallet.lastRebalance !== null
                ? formatDate(infosWallet.lastRebalance?.toString())
                : '-'
            }
          />
          <CardDashboard
            title="Month closing date"
            data={
              infosWallet.monthCloseDate !== null
                ? formatDate(infosWallet.monthCloseDate?.toString())
                : '-'
            }
          />
        </div>
      )}

      <div className="mb-10">
        <DataTable
          columns={columns}
          data={data}
          walletUuid={walletUuid as string}
        />
      </div>

      <div className="bg-[#171717] rounded-t-lg p-5 flex items-center justify-between ">
        <h1 className="text-white">My triggers</h1>
        <Button className="bg-[#1877F2] w-1/12 hover:bg-blue-600 p-5">
          + New trigger
        </Button>
      </div>
      <div className="bg-[#131313] flex justify-between gap-5 p-7">
        <div className="bg-red-400 w-1/3 p-5">
          <h2>Alert when it happens X</h2>
        </div>
        <div className="bg-yellow-400 w-1/3 p-5">
          <h2>Alert when it happens Y</h2>
        </div>
        <div className="bg-green-400 w-1/3 p-5">
          <h2>Alert when it happens Z</h2>
        </div>
      </div>
      <OperationsModal
        isOpen={isOperationModalOpen}
        onClose={closeOperationModal}
      />
      <ConfirmCloseWalletModal
        isOpen={isCloseWalletModalOpen}
        onClose={closeCloseWalletModal}
        startWallet={closeModalState}
      />
    </div>
  )
}
