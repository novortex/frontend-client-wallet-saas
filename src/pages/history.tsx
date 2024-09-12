import SwitchTheme from '@/components/custom/switch-theme'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import filterIcon from '../assets/image/filter-lines.png'
import HistoryThread from '@/components/custom/history-thread'
import { getWalletHistoric } from '@/service/request'
import { useUserStore } from '@/store/user'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

// Definir a interface para os dados de histórico
interface HistoricEntry {
  cuid: string
  historyType:
    | 'SELL_ASSET'
    | 'BUY_ASSET'
    | 'INCREASE_ALLOCATION'
    | 'DECREASE_ALLOCATION'
    | 'ADD_ASSET'
    | 'DELETE_ASSET'
    | 'WITHDRAWAL'
    | 'DEPOSIT'
    | 'START_WALLET'
    | 'CLOSE_WALLET'
  createAt: string
  data: {
    before: number
    after: number
    icon: string
    asset: string
    quantity: number
    target_allocation: number
    withdrawal_value_in_organization_fiat: number
    deposit_amount_in_organization_fiat: number
  }
  user: {
    name: string
  }
}

export default function History() {
  // Tipando o estado como um array de HistoricEntry
  const [historic, setHistoric] = useState<HistoricEntry[]>([])
  const [organizationUuid] = useUserStore((state) => [
    state.user.uuidOrganization,
  ])
  const { walletUuid } = useParams()

  useEffect(() => {
    async function fetchHistoric() {
      if (organizationUuid && walletUuid) {
        try {
          const data = await getWalletHistoric(organizationUuid, walletUuid)
          setHistoric(data)
        } catch (error) {
          console.error('Failed to fetch historic:', error)
        }
      } else {
        console.error('organizationUuid or walletUuid is undefined')
      }
    }

    fetchHistoric()
  }, [organizationUuid, walletUuid])

  return (
    <div className="p-10">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl text-white font-medium">Changes</h1>
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
            type="button"
            variant="outline"
            className="gap-2 hover:bg-gray-700"
          >
            <img src={filterIcon} alt="" />
            <p>Filters</p>
          </Button>
        </div>
      </div>
      <div>
        {historic.map((entry) => (
          <HistoryThread
            key={entry.cuid}
            user={entry.user.name}
            operationType={entry.historyType}
            asset={entry.data.asset}
            date={new Date(entry.createAt).toLocaleDateString()}
            hour={new Date(entry.createAt).toLocaleTimeString()}
            assetIcon={entry.data.icon}
            oldValue={entry.data.before}
            newValue={entry.data.after}
            addAssetQuantity={entry.data.quantity}
            addAssetAllocation={entry.data.target_allocation}
            depositValue={entry.data.deposit_amount_in_organization_fiat}
            withdrawalValue={entry.data.withdrawal_value_in_organization_fiat}
          />
        ))}
      </div>
    </div>
  )
}
