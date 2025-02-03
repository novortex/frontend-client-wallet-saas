import { SwitchTheme } from '@/components/custom/switch-theme'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import filterIcon from '../assets/image/filter-lines.png'
import HistoryThread from '@/components/custom/history-thread'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { HistoricEntry } from '@/types/wallet.type'
import { DateRange } from 'react-day-picker'
import { getWalletHistoric } from '@/services/historicService'

export type Filters = {
  eventTypes: string[]
  dateRange: DateRange | undefined
}

export function History() {
  const [historic, setHistoric] = useState<HistoricEntry[]>([])
  const { walletUuid } = useParams()

  useEffect(() => {
    async function fetchHistoric() {
      if (walletUuid) {
        try {
          const data = await getWalletHistoric(walletUuid)
          setHistoric(data)
        } catch (error) {
          console.error('Failed to fetch historic:', error)
        }
      } else {
        console.error('organizationUuid or walletUuid is undefined')
      }
    }

    fetchHistoric()
  }, [walletUuid])

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
              <BreadcrumbLink
                className="text-2xl text-white font-medium"
                href={`/wallet/${walletUuid}/assets`}
              >
                Client wallet
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-2xl text-white font-medium">
                Historic
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
        {historic
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
