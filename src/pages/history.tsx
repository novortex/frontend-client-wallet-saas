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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { Loading } from '@/components/custom/loading'

export type Filters = {
  eventTypes: HistoricEntry['historyType'][]
  dateRange: DateRange | undefined
}

const historyTypes: HistoricEntry['historyType'][] = [
  'SELL_ASSET',
  'BUY_ASSET',
  'INCREASE_ALLOCATION',
  'DECREASE_ALLOCATION',
  'ADD_ASSET',
  'DELETE_ASSET',
  'WITHDRAWAL',
  'DEPOSIT',
  'START_WALLET',
  'CLOSE_WALLET',
]

export function History() {
  const [historic, setHistoric] = useState<HistoricEntry[]>([])
  const [filteredHistoric, setFilteredHistoric] = useState<HistoricEntry[]>([])
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>({ eventTypes: [], dateRange: undefined })
  const [isLoading, setIsLoading] = useState(true)
  const { walletUuid } = useParams()

  useEffect(() => {
    async function fetchHistoric() {
      if (walletUuid) {
        try {
          const data = await getWalletHistoric(walletUuid)
          setHistoric(data)
          setFilteredHistoric(data)
        } catch (error) {
          console.error('Failed to fetch historic:', error)
        } finally {
          setIsLoading(false)
        }
      } else {
        console.error('organizationUuid or walletUuid is undefined')
        setIsLoading(false)
      }
    }
    fetchHistoric()
  }, [walletUuid])

  useEffect(() => {
    let filteredData = [...historic]

    if (filters.eventTypes.length > 0) {
      filteredData = filteredData.filter((entry) =>
        filters.eventTypes.includes(entry.historyType)
      )
    }

    if (filters.dateRange) {
      const { from, to } = filters.dateRange
      const fromDate = from ? new Date(from.setHours(0, 0, 0, 0)) : null
      const toDate = to ? new Date(to.setHours(23, 59, 59, 999)) : null

      filteredData = filteredData.filter((entry) => {
        const entryDate = new Date(entry.createAt)
        return (!fromDate || entryDate >= fromDate) && (!toDate || entryDate <= toDate)
      })
    }

    setFilteredHistoric(filteredData)
  }, [filters, historic])

  if (isLoading) {
    return (
        <Loading />
    )
  }

  return (
    <div className="p-10 bg-white dark:bg-transparent">
      <div className="mb-10 flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-2xl text-black dark:text-white font-medium" href="/wallets">
                Wallets
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="text-2xl text-black dark:text-white font-medium" href={`/clients/${walletUuid}/infos`}>
                Information clients
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="text-2xl text-black dark:text-white font-medium" href={`/wallet/${walletUuid}/assets`}>
                Client wallet
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-2xl text-black dark:text-white font-medium">Historic</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <SwitchTheme />
      </div>
      <div className="flex items-center justify-between mb-10">
        <Input
          className="bg-lightComponent dark:bg-[#171717] w-3/4 border dark:border-0 dark:text-white focus:ring-0"
          type="text"
          placeholder="Search for ..."
        />
        <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" className="gap-2 bg-lightComponent hover:bg-gray-200">
              <img src={filterIcon} alt="" />
              <p className="dark:text-black">Filters</p>
            </Button>
          </DialogTrigger>
          <DialogContent className="dark:bg-[#131313] h-[90vh] overflow-y-auto">
            <DialogHeader className="dark:text-[#fff]">
              <DialogTitle className="text-2xl text-center">Filter Historic</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              {historyTypes.map((type) => (
                <label key={type} className="text-black dark:text-white flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.eventTypes.includes(type)}
                    onChange={() =>
                      setFilters((prev) => ({
                        ...prev,
                        eventTypes: prev.eventTypes.includes(type)
                          ? prev.eventTypes.filter((e) => e !== type)
                          : [...prev.eventTypes, type],
                      }))
                    }
                  />
                  {type.replace('_', ' ')}
                </label>
              ))}
            </div>
            <div className="flex flex-col justify-end">
              <p className="text-black dark:text-white">Select Date Range:</p>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[50%] bg-lightComponent dark:bg-[#131313] dark:border-[#323232] dark:text-[#959CB6] justify-between">
                  {filters.dateRange?.from?.toLocaleDateString() || 'Start'} - {filters.dateRange?.to?.toLocaleDateString() || 'End'}
                  <CalendarIcon className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={filters.dateRange}
                  onSelect={(range) => setFilters((prev) => ({ ...prev, dateRange: range }))}
                  className="dark:bg-[#131313] text-black dark:text-white rounded-md"
                  classNames={{
                    day_today: 'bg-transparent text-black dark:text-white hover:bg-white hover:text-black rounded-md',
                    day_selected: 'bg-white text-black hover:bg-white rounded-md',
                  }}
                />
              </PopoverContent>
            </Popover>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFilters({ eventTypes: [], dateRange: undefined })}>
                Clear
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        {filteredHistoric.slice().reverse().map((entry) => (
          <HistoryThread
            key={entry.cuid}
            fiat_currency={entry.data.organization_fiat}
            effective_date={entry.data.data}
            data={entry}
            user={entry.user.name}
            operationType={entry.historyType}
            asset={entry.data.asset}
            date={new Date(entry.createAt).toLocaleDateString()}
            hour={new Date(entry.createAt).toLocaleTimeString()}
            assetIcon={entry.data.icon}
            oldValue={Number(entry.data.before) || undefined}
            newValue={Number(entry.data.after) || undefined}
            addAssetQuantity={Number(entry.data.quantity) || undefined}
            addAssetAllocation={Number(entry.data.target_allocation) || undefined}
            depositValue={Number(entry.data.deposit_amount_in_organization_fiat) || undefined}
            withdrawalValue={Number(entry.data.withdrawal_value_in_organization_fiat) || undefined}
            initialValue={Number(entry.data.invested_amount_in_organization_fiat) || undefined}
            closeValue={Number(entry.data.close_wallet_value_in_organization_fiat) || undefined}
          />
        ))}
      </div>
    </div>
  )
}
