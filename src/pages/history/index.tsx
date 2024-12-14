import { SwitchTheme } from '@/components/custom/switch-theme'
import { Input } from '@/components/ui/input'
import HistoryThread from '@/components/custom/history-thread'
import { getWalletHistoric } from '@/services/walletService'
import { useUserStore } from '@/store/user'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { HistoricEntry } from '@/types/wallet.type'
import { FilterModal } from './FilterModal'
import { BreadCrumbHistoryLinks } from './breadCrumbHistoryLinks'
import { DateRange } from 'react-day-picker'

export type Filters = {
  eventTypes: string[]
  dateRange: DateRange | undefined
}

export function History() {
  const [historic, setHistoric] = useState<HistoricEntry[]>([])
  const [organizationUuid] = useUserStore((state) => [
    state.user.uuidOrganization,
  ])
  const { walletUuid } = useParams()
  const [filters, setFilters] = useState<Filters>({
    eventTypes: [],
    dateRange: { from: undefined, to: undefined },
  })

  const filteredHistoric = historic.filter((entry) => {
    const matchesEventType =
      filters.eventTypes.length === 0 ||
      filters.eventTypes.includes(entry.historyType)

    const matchesDateRange =
      (!filters.dateRange?.from ||
        new Date(entry.createAt) >= filters.dateRange.from) &&
      (!filters.dateRange?.to ||
        new Date(entry.createAt) <= filters.dateRange.to)

    return matchesEventType && matchesDateRange
  })

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
        <BreadCrumbHistoryLinks walletUuid={walletUuid} />
        <SwitchTheme />
      </div>
      <div className="flex items-center justify-between mb-10">
        <Input
          className="bg-[#171717] w-3/4 border-0 text-white focus:ring-0"
          type="text"
          placeholder="Search for ..."
        />
        <div className="flex gap-5">
          <FilterModal
            onApplyFilters={(newFilters: Filters) => setFilters(newFilters)}
            currentFilters={filters}
          />
        </div>
      </div>
      <div>
        {filteredHistoric
          .slice()
          .reverse()
          .map((entry) => (
            <HistoryThread
              key={entry.cuid}
              data={entry}
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
              initialValue={entry.data.invested_amount_in_organization_fiat}
              closeValue={entry.data.close_wallet_value_in_organization_fiat}
            />
          ))}
      </div>
    </div>
  )
}
