import { SwitchTheme } from '@/components/custom/switch-theme'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import HistoryTimeline from '@/components/custom/history-timeline'
import { useParams } from 'react-router-dom'
import { useEffect, useState, useMemo } from 'react'
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
import { getAllAssetsOrg } from '@/services/managementService'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { CalendarIcon, SlidersHorizontal, Search, X, ShoppingCart, ArrowUpDown, Package, TrendingUp, Wallet, BadgeCent } from 'lucide-react'
import { Loading } from '@/components/custom/loading'

export type Filters = {
  eventTypes: HistoricEntry['historyType'][]
  dateRange: DateRange | undefined
  selectedAssets: string[]
}

const historyTypeGroups = {
  transactions: {
    label: 'Transações',
    icon: ShoppingCart,
    types: [
      { value: 'BUY_ASSET' as const, label: 'Compras' },
      { value: 'SELL_ASSET' as const, label: 'Vendas' },
    ]
  },
  allocations: {
    label: 'Alocações',
    icon: ArrowUpDown,
    types: [
      { value: 'INCREASE_ALLOCATION' as const, label: 'Aumento Alocação' },
      { value: 'DECREASE_ALLOCATION' as const, label: 'Redução Alocação' },
    ]
  },
  assets: {
    label: 'Gestão de Ativos',
    icon: Package,
    types: [
      { value: 'ADD_ASSET' as const, label: 'Adição Ativo' },
      { value: 'DELETE_ASSET' as const, label: 'Remoção Ativo' },
    ]
  },
  movements: {
    label: 'Movimentações',
    icon: TrendingUp,
    types: [
      { value: 'DEPOSIT' as const, label: 'Depósitos' },
      { value: 'WITHDRAWAL' as const, label: 'Saques' },
    ]
  },
  wallet: {
    label: 'Carteira',
    icon: Wallet,
    types: [
      { value: 'START_WALLET' as const, label: 'Início Carteira' },
      { value: 'CLOSE_WALLET' as const, label: 'Fechamento Carteira' },
    ]
  },
}

const historyTypes = Object.values(historyTypeGroups).flatMap((group: any) => group.types)

export function History() {
  const [historic, setHistoric] = useState<HistoricEntry[]>([])
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<Filters>({
    eventTypes: [],
    dateRange: undefined,
    selectedAssets: [],
  })
  const [availableAssets, setAvailableAssets] = useState<{ uuid: string; name: string; icon: string }[]>([])
  const [selectedAssetsObjects, setSelectedAssetsObjects] = useState<{ uuid: string; name: string; icon: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { walletUuid } = useParams()

  useEffect(() => {
    async function fetchData() {
      if (walletUuid) {
        try {
          const [historicData, assetsData] = await Promise.all([
            getWalletHistoric(walletUuid),
            getAllAssetsOrg()
          ])
          setHistoric(historicData)
          setAvailableAssets(assetsData.map(asset => ({ uuid: asset.uuid, name: asset.name, icon: asset.icon })))
        } catch (error) {
          console.error('Failed to fetch data:', error)
        } finally {
          setIsLoading(false)
        }
      } else {
        console.error('organizationUuid or walletUuid is undefined')
        setIsLoading(false)
      }
    }
    fetchData()
  }, [walletUuid])

  const filteredHistoric = useMemo(() => {
    let filteredData = [...historic]

    if (searchTerm) {
      filteredData = filteredData.filter(
        (entry) =>
          entry.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.data.asset?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.historyType.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filters.eventTypes.length > 0) {
      filteredData = filteredData.filter((entry) =>
        filters.eventTypes.includes(entry.historyType),
      )
    }

    if (filters.selectedAssets.length > 0) {
      filteredData = filteredData.filter((entry) =>
        entry.data.asset && filters.selectedAssets.includes(entry.data.asset)
      )
    }

    if (filters.dateRange) {
      const { from, to } = filters.dateRange
      const fromDate = from ? new Date(from.setHours(0, 0, 0, 0)) : null
      const toDate = to ? new Date(to.setHours(23, 59, 59, 999)) : null

      filteredData = filteredData.filter((entry) => {
        const entryDate = new Date(entry.createAt)
        return (
          (!fromDate || entryDate >= fromDate) &&
          (!toDate || entryDate <= toDate)
        )
      })
    }

    return filteredData.sort(
      (a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime(),
    )
  }, [historic, filters, searchTerm])

  const getActiveFilters = () => {
    const activeFilters: { label: string; value: string; type: string }[] = []
    
    filters.eventTypes.forEach(type => {
      const historyType = historyTypes.find((ht: any) => ht.value === type)
      if (historyType) {
        activeFilters.push({ label: 'Operação', value: historyType.label, type: 'eventType' })
      }
    })
    
    selectedAssetsObjects.forEach(asset => {
      activeFilters.push({ label: 'Ativo', value: asset.name, type: 'asset' })
    })
    
    if (filters.dateRange?.from || filters.dateRange?.to) {
      const fromDate = filters.dateRange.from?.toLocaleDateString() || 'Início'
      const toDate = filters.dateRange.to?.toLocaleDateString() || 'Fim'
      activeFilters.push({ label: 'Período', value: `${fromDate} - ${toDate}`, type: 'dateRange' })
    }
    
    return activeFilters
  }

  const removeFilter = (filter: { label: string; value: string; type: string }) => {
    if (filter.type === 'eventType') {
      const historyType = historyTypes.find((ht: any) => ht.label === filter.value)
      if (historyType) {
        setFilters(prev => ({
          ...prev,
          eventTypes: prev.eventTypes.filter(type => type !== historyType.value)
        }))
      }
    } else if (filter.type === 'asset') {
      setSelectedAssetsObjects(prev => prev.filter(asset => asset.name !== filter.value))
      setFilters(prev => ({
        ...prev,
        selectedAssets: prev.selectedAssets.filter(asset => asset !== filter.value)
      }))
    } else if (filter.type === 'dateRange') {
      setFilters(prev => ({
        ...prev,
        dateRange: undefined
      }))
    }
  }

  const handleSelectAsset = (assetName: string) => {
    const asset = availableAssets.find(a => a.name === assetName)
    if (asset && !selectedAssetsObjects.some(sel => sel.uuid === asset.uuid)) {
      setSelectedAssetsObjects(prev => [...prev, asset])
      setFilters(prev => ({
        ...prev,
        selectedAssets: [...prev.selectedAssets, asset.name]
      }))
    }
  }

  const handleRemoveAsset = (assetUuid: string) => {
    const asset = selectedAssetsObjects.find(a => a.uuid === assetUuid)
    if (asset) {
      setSelectedAssetsObjects(prev => prev.filter(a => a.uuid !== assetUuid))
      setFilters(prev => ({
        ...prev,
        selectedAssets: prev.selectedAssets.filter(a => a !== asset.name)
      }))
    }
  }

  const activeFilters = getActiveFilters()

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  href="/wallets"
                >
                  Wallets
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  href={`/clients/${walletUuid}/infos`}
                >
                  Client Information
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  href={`/wallet/${walletUuid}/assets`}
                >
                  Client Wallet
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm font-medium text-foreground">
                  Historic
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <SwitchTheme />
        </div>

        {historic.length > 0 && (
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-foreground">
              {historic[0].user.name}
            </h2>
          </div>
        )}

        <div className="mb-6 flex gap-4">
          <Input
            className="flex-1 border border-border bg-background text-foreground focus:ring-2 focus:ring-primary"
            type="text"
            placeholder="Buscar por usuário, ativo ou operação..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                className="transform bg-[#FF4A3A] text-black transition-all duration-200 hover:scale-105 hover:bg-red-500 hover:text-white"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filtros
                {(filters.eventTypes.length > 0 || filters.dateRange) && (
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-black/20 text-black"
                  >
                    {filters.eventTypes.length + (filters.dateRange ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="h-[90vh] max-h-[90vh] w-[50%] max-w-none overflow-y-auto bg-white dark:bg-[#131313]">
              <DialogHeader className="text-black dark:text-[#fff]">
                <DialogTitle className="text-center text-2xl">
                  Filtros do Histórico
                </DialogTitle>
              </DialogHeader>

              {/* Active Filters Section */}
              {activeFilters.length > 0 && (
                <div className="mb-4 rounded-lg border border-yellow-200 bg-orange-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
                      Filtros Ativos ({activeFilters.length})
                    </h3>
                    <div className="text-sm text-orange-800 dark:text-yellow-200">
                      Mostrando {filteredHistoric.length} de {historic.length} operações
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeFilters.map((filter, index) => (
                      <Badge
                        key={index}
                        className="bg-orange-600 text-white hover:bg-orange-700 cursor-pointer transition-all duration-200 transform hover:scale-105"
                        onClick={() => removeFilter(filter)}
                      >
                        <span className="mr-1">{filter.label}:</span>
                        <span className="mr-2">{filter.value}</span>
                        <X className="h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {/* First Row - Operation Types Grid 2x2 */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {Object.entries(historyTypeGroups).slice(0, 4).map(([key, group]) => {
                    const IconComponent = group.icon
                    return (
                      <div key={key} className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="rounded-full bg-primary/10 p-2">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <h3 className="text-lg font-semibold text-black dark:text-white">
                            {group.label}
                          </h3>
                        </div>
                        <div className="space-y-2">
                          {group.types.map((type) => (
                            <div key={type.value} className="flex items-center gap-3 text-black dark:text-[#fff]">
                              <Checkbox
                                checked={filters.eventTypes.includes(type.value)}
                                onCheckedChange={() =>
                                  setFilters((prev) => ({
                                    ...prev,
                                    eventTypes: prev.eventTypes.includes(type.value)
                                      ? prev.eventTypes.filter((e) => e !== type.value)
                                      : [...prev.eventTypes, type.value],
                                  }))
                                }
                                className="border-gray-400 dark:border-gray-500"
                              />
                              <label className="text-sm font-medium">{type.label}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Second Row - Wallet Operations and Asset Filter */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Wallet Operations */}
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Wallet className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-black dark:text-white">
                        {historyTypeGroups.wallet.label}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {historyTypeGroups.wallet.types.map((type) => (
                        <div key={type.value} className="flex items-center gap-3 text-black dark:text-[#fff]">
                          <Checkbox
                            checked={filters.eventTypes.includes(type.value)}
                            onCheckedChange={() =>
                              setFilters((prev) => ({
                                ...prev,
                                eventTypes: prev.eventTypes.includes(type.value)
                                  ? prev.eventTypes.filter((e) => e !== type.value)
                                  : [...prev.eventTypes, type.value],
                              }))
                            }
                            className="border-gray-400 dark:border-gray-500"
                          />
                          <label className="text-sm font-medium">{type.label}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Asset Filter */}
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <BadgeCent className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-black dark:text-white">
                        Ativos
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <Select onValueChange={handleSelectAsset}>
                        <SelectTrigger className="w-full border-gray-300 bg-white text-black transition-all hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-primary">
                          <SelectValue placeholder="Selecionar ativos" />
                        </SelectTrigger>
                        <SelectContent className="border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800">
                          {availableAssets.map((asset) => (
                            <SelectItem
                              key={asset.uuid}
                              value={asset.name}
                              className="hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                            >
                              <div className="flex items-center gap-2">
                                <img src={asset.icon} alt={asset.name} className="w-5 h-5 rounded-full" />
                                <span>{asset.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {selectedAssetsObjects.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedAssetsObjects.map((asset) => (
                            <div
                              key={asset.uuid}
                              className="flex h-8 items-center justify-start rounded-md bg-yellow-600 px-2 text-white hover:bg-yellow-700 transition-colors cursor-pointer"
                              onClick={() => handleRemoveAsset(asset.uuid)}
                            >
                              <span className="mr-2">{asset.name}</span>
                              <X className="h-3 w-3" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Period Filter - Full Width */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-black dark:text-white">
                      Período
                    </h3>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-12 w-full justify-between border-gray-300 bg-white text-black transition-all hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-primary"
                      >
                        {filters.dateRange?.from?.toLocaleDateString() || 'Início'} -{' '}
                        {filters.dateRange?.to?.toLocaleDateString() || 'Fim'}
                        <CalendarIcon className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={filters.dateRange}
                        onSelect={(range) =>
                          setFilters((prev) => ({ ...prev, dateRange: range }))
                        }
                        className="rounded-md"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <DialogFooter>
                <Button
                  className="btn-standard"
                  onClick={() => {
                    setFilters({ eventTypes: [], dateRange: undefined, selectedAssets: [] })
                    setSelectedAssetsObjects([])
                  }}
                >
                  Limpar Todos os Filtros
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-4 flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-end">
            Mostrando {filteredHistoric.length} de {historic.length} operações
          </div>
        </div>

        <div className="mt-8">
          {filteredHistoric.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-foreground">
                Nenhuma operação encontrada
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm ||
                filters.eventTypes.length > 0 ||
                filters.dateRange
                  ? 'Tente ajustar os filtros ou termo de busca'
                  : 'Esta carteira ainda não possui histórico de operações'}
              </p>
            </div>
          ) : (
            <HistoryTimeline
              entries={filteredHistoric}
              fiatCurrency={
                filteredHistoric[0]?.data.organization_fiat || 'USD'
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}
