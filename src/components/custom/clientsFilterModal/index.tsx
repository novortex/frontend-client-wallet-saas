import { useState, useEffect } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { OrderByFilter } from './OrderByFilter'
import { WalletTypeFilter } from './WalletTypeFilter'
import { ManagerFilter } from './ManagerFilter'
import { UnbalancedWalletFilter } from './UnbalanceWalletFilter'
import { AlertsFilter } from './AlertsFilter'
import { ExchangeFilter } from './ExchangeFilter'
import { BenchmarkFilter } from './BenchmarkFilter'
import {
  getBenchmarkOptions,
  getExchangesDisposables,
  getAllManagersOnOrganization,
  getAllAssetsOrg,
} from '@/services/managementService'
import { AssetsFilter } from './AssetsFilter'
import { ContractFilter } from './ContractFilter'
import { CashFilter } from './CashFilter'

type ApplyFiltersProps = {
  handleApplyFilters: (filters: {
    selectedManagers: string[]
    selectedWalletTypes: string[]
    selectedAssets: string[]
    filterHasContract: boolean
    filterHasNoContract: boolean
    filterDelayed: boolean
    filterUnbalanced: boolean
    filterNewest: boolean
    filterOldest: boolean
    filterNearestRebalancing: boolean
    filterFurtherRebalancing: boolean
    selectedExchanges: string[]
    selectedBenchmark: string[]
    selectedCashOptions: string[]
  }) => void
  filteredCount: number
  totalCount: number
}

export function ClientsFilterModal({ handleApplyFilters, filteredCount, totalCount }: ApplyFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [assets, setAssets] = useState<{ uuid: string; name: string }[]>([])
  const [selectedAssets, setSelectedAssets] = useState<
    { uuid: string; name: string; cash?: number }[]
  >([])
  const [selectedManagers, setSelectedManagers] = useState<string[]>([])
  const [selectedWalletTypes, setSelectedWalletTypes] = useState<string[]>([])
  const [selectedBenchmark, setSelectedBenchmark] = useState<string[]>([])
  const [selectedExchanges, setSelectedExchanges] = useState<string[]>([])
  const [selectedCashOptions, setSelectedCashOptions] = useState<string[]>([])
  const [managers, setManagers] = useState<{ name: string }[]>([])
  const [benchmarks, setBenchmarks] = useState<{ name: string }[]>([])
  const [availableExchanges, setAvailableExchanges] = useState<
    { name: string }[]
  >([])
  const [filters, setFilters] = useState({
    filterHasContract: false,
    filterHasNoContract: false,
    filterDelayed: false,
    filterUnbalanced: false,
    filterNewest: false,
    filterOldest: false,
    filterNearestRebalancing: false,
    filterFurtherRebalancing: false,
  })
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    const savedFilters = localStorage.getItem('clientsFilters')
    if (savedFilters) {
      const parsedFilters = JSON.parse(savedFilters)
      setSelectedManagers(parsedFilters.selectedManagers || [])
      setSelectedWalletTypes(parsedFilters.selectedWalletTypes || [])
      setSelectedAssets(parsedFilters.selectedAssets || [])
      setSelectedBenchmark(parsedFilters.selectedBenchmark || [])
      setSelectedExchanges(parsedFilters.selectedExchanges || [])
      setSelectedCashOptions(parsedFilters.selectedCashOptions || [])
      setFilters(
        parsedFilters.filters || {
          filterHasContract: false,
          filterHasNoContract: false,
          filterDelayed: false,
          filterUnbalanced: false,
          filterNewest: false,
          filterOldest: false,
          filterNearestRebalancing: false,
          filterFurtherRebalancing: false,
        },
      )
      handleApplyFilters({
        selectedAssets: (parsedFilters.selectedAssets || []).map(
          (asset: { uuid: string; name: string }) => asset.uuid,
        ),
        selectedManagers: parsedFilters.selectedManagers || [],
        selectedWalletTypes: parsedFilters.selectedWalletTypes || [],
        selectedExchanges: parsedFilters.selectedExchanges || [],
        selectedBenchmark: parsedFilters.selectedBenchmark || [],
        selectedCashOptions: parsedFilters.selectedCashOptions || [],
        ...parsedFilters.filters,
      })
    }
    setIsInitialLoad(false)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const [benchmarkResult, managerResult, exchangeResult, assetsOrg] =
        await Promise.all([
          getBenchmarkOptions(),
          getAllManagersOnOrganization(),
          getExchangesDisposables(),
          getAllAssetsOrg(),
        ])

      setBenchmarks(
        benchmarkResult.map((benchmark) => ({ name: benchmark.name })),
      )
      setManagers(managerResult.map((item) => ({ name: item.name })))
      setAvailableExchanges(
        exchangeResult?.map((exchange) => ({ name: exchange.name })) || [],
      )
      setAssets(
        assetsOrg.map((asset) => ({
          uuid: asset.uuid,
          name: asset.name,
        })),
      )
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (isInitialLoad) return

    handleApplyFilters({
      selectedAssets: selectedAssets.map((asset) => asset.uuid),
      selectedManagers,
      selectedWalletTypes,
      selectedExchanges,
      selectedBenchmark,
      selectedCashOptions,
      filterHasContract: filters.filterHasContract,
      filterHasNoContract: filters.filterHasNoContract,
      filterDelayed: filters.filterDelayed,
      filterUnbalanced: filters.filterUnbalanced,
      filterNewest: filters.filterNewest,
      filterOldest: filters.filterOldest,
      filterNearestRebalancing: filters.filterNearestRebalancing,
      filterFurtherRebalancing: filters.filterFurtherRebalancing,
    })

    const filtersToSave = {
      selectedAssets,
      selectedManagers,
      selectedWalletTypes,
      selectedExchanges,
      selectedBenchmark,
      selectedCashOptions,
      filters,
    }
    localStorage.setItem('clientsFilters', JSON.stringify(filtersToSave))
  }, [
    selectedAssets,
    selectedManagers,
    selectedWalletTypes,
    selectedExchanges,
    selectedBenchmark,
    selectedCashOptions,
    filters,
    handleApplyFilters,
    isInitialLoad,
  ])

  const updateFilter = (filterName: string, value: boolean) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }))
  }

  const handleSelectExchange = (exchangeName: string) => {
    setSelectedExchanges((prev) => [...prev, exchangeName])
  }

  const handleRemoveExchange = (exchangeName: string) => {
    setSelectedExchanges((prev) => prev.filter((name) => name !== exchangeName))
  }

  const handleSelectManager = (name: string) =>
    setSelectedManagers((prev) => [...prev, name])

  const handleSelectAsset = (asset: {
    uuid: string
    name: string
    cash?: number
  }) => setSelectedAssets((prev) => [...prev, asset])

  const handleRemoveAsset = (assetUuid: string) => {
    setSelectedAssets((prev) =>
      prev.filter((asset) => asset.uuid !== assetUuid),
    )
  }

  const handleRemoveManager = (name: string) =>
    setSelectedManagers((prev) => prev.filter((manager) => manager !== name))

  const handleSelectBenchmark = (name: string) =>
    setSelectedBenchmark((prev) => [...prev, name])

  const handleRemoveBenchmark = (name: string) => {
    setSelectedBenchmark((prev) =>
      prev.filter((benchmark) => benchmark !== name),
    )
  }

  const handleSelectCashOption = (option: string) => {
    setSelectedCashOptions((prev) => [...prev, option])
  }

  const handleRemoveCashOption = (option: string) => {
    setSelectedCashOptions((prev) => prev.filter((opt) => opt !== option))
  }

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

  // Get all active filters for display
  const getActiveFilters = () => {
    const activeFilters: { label: string; value: string; type: string }[] = []
    
    selectedManagers.forEach(manager => 
      activeFilters.push({ label: 'Manager', value: manager, type: 'manager' })
    )
    selectedWalletTypes.forEach(type => 
      activeFilters.push({ label: 'Type', value: type, type: 'walletType' })
    )
    selectedAssets.forEach(asset => 
      activeFilters.push({ label: 'Asset', value: asset.name, type: 'asset' })
    )
    selectedExchanges.forEach(exchange => 
      activeFilters.push({ label: 'Exchange', value: exchange, type: 'exchange' })
    )
    selectedBenchmark.forEach(benchmark => 
      activeFilters.push({ label: 'Benchmark', value: benchmark, type: 'benchmark' })
    )
    selectedCashOptions.forEach(cash => 
      activeFilters.push({ label: 'Cash', value: cash, type: 'cash' })
    )
    
    if (filters.filterHasContract) activeFilters.push({ label: 'Status', value: 'Has Contract', type: 'contract' })
    if (filters.filterHasNoContract) activeFilters.push({ label: 'Status', value: 'No Contract', type: 'contract' })
    if (filters.filterUnbalanced) activeFilters.push({ label: 'Status', value: 'Unbalanced', type: 'unbalanced' })
    if (filters.filterDelayed) activeFilters.push({ label: 'Alert', value: 'Delayed', type: 'delayed' })
    if (filters.filterNewest) activeFilters.push({ label: 'Order', value: 'Newest', type: 'order' })
    if (filters.filterOldest) activeFilters.push({ label: 'Order', value: 'Oldest', type: 'order' })
    if (filters.filterNearestRebalancing) activeFilters.push({ label: 'Order', value: 'Nearest Rebalancing', type: 'order' })
    if (filters.filterFurtherRebalancing) activeFilters.push({ label: 'Order', value: 'Further Rebalancing', type: 'order' })
    
    return activeFilters
  }

  // Remove specific filter
  const removeFilter = (filter: { label: string; value: string; type: string }) => {
    switch (filter.type) {
      case 'manager':
        handleRemoveManager(filter.value)
        break
      case 'walletType':
        setSelectedWalletTypes(prev => prev.filter(t => t !== filter.value))
        break
      case 'asset':
        const assetToRemove = selectedAssets.find(a => a.name === filter.value)
        if (assetToRemove) handleRemoveAsset(assetToRemove.uuid)
        break
      case 'exchange':
        handleRemoveExchange(filter.value)
        break
      case 'benchmark':
        handleRemoveBenchmark(filter.value)
        break
      case 'cash':
        handleRemoveCashOption(filter.value)
        break
      case 'contract':
        if (filter.value === 'Has Contract') updateFilter('filterHasContract', false)
        if (filter.value === 'No Contract') updateFilter('filterHasNoContract', false)
        break
      case 'unbalanced':
        updateFilter('filterUnbalanced', false)
        break
      case 'delayed':
        updateFilter('filterDelayed', false)
        break
      case 'order':
        if (filter.value === 'Newest') updateFilter('filterNewest', false)
        if (filter.value === 'Oldest') updateFilter('filterOldest', false)
        if (filter.value === 'Nearest Rebalancing') updateFilter('filterNearestRebalancing', false)
        if (filter.value === 'Further Rebalancing') updateFilter('filterFurtherRebalancing', false)
        break
    }
  }

  const activeFilters = getActiveFilters()

  const resetFilters = () => {
    setSelectedManagers([])
    setSelectedWalletTypes([])
    setSelectedBenchmark([])
    setSelectedExchanges([])
    setSelectedAssets([])
    setSelectedCashOptions([])
    setFilters({
      filterHasContract: false,
      filterHasNoContract: false,
      filterDelayed: false,
      filterUnbalanced: false,
      filterNewest: false,
      filterOldest: false,
      filterNearestRebalancing: false,
      filterFurtherRebalancing: false,
    })
    handleApplyFilters({
      selectedAssets: [],
      selectedManagers: [],
      selectedWalletTypes: [],
      selectedExchanges: [],
      selectedBenchmark: [],
      selectedCashOptions: [],
      filterHasContract: false,
      filterHasNoContract: false,
      filterDelayed: false,
      filterUnbalanced: false,
      filterNewest: false,
      filterOldest: false,
      filterNearestRebalancing: false,
      filterFurtherRebalancing: false,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="gap-2 bg-[#F2BE38] text-black hover:bg-yellow-500 hover:text-white transition-all duration-200 transform hover:scale-105"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[90vh] max-h-[90vh] w-[50%] max-w-none overflow-y-auto bg-white dark:bg-[#131313]">
        <DialogHeader className="text-black dark:text-[#fff]">
          <DialogTitle className="text-center text-2xl">
            Filtros
          </DialogTitle>
        </DialogHeader>
        
        {/* Active Filters Section */}
        {activeFilters.length > 0 && (
          <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
                Filtros Ativos ({activeFilters.length})
              </h3>
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                Mostrando {filteredCount} de {totalCount} carteiras
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter, index) => (
                <Badge
                  key={index}
                  className="bg-yellow-600 text-white hover:bg-yellow-700 cursor-pointer transition-all duration-200 transform hover:scale-105"
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
          {/* First Row - Ordering and Wallet Type */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <OrderByFilter
              filters={{
                newest: filters.filterNewest,
                oldest: filters.filterOldest,
                nearestRebalancing: filters.filterNearestRebalancing,
                furtherRebalancing: filters.filterFurtherRebalancing,
              }}
              onFilterChange={(name, value) =>
                updateFilter(`filter${capitalize(name)}`, value)
              }
            />
            <WalletTypeFilter
              selectedWalletTypes={selectedWalletTypes}
              handleSelectWalletType={(type) =>
                setSelectedWalletTypes((prev) => [...prev, type])
              }
              handleRemoveWalletType={(type) =>
                setSelectedWalletTypes((prev) => prev.filter((t) => t !== type))
              }
            />
          </div>

          {/* Financial Information Section */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <CashFilter
              selectedCashOptions={selectedCashOptions}
              handleSelectCashOption={handleSelectCashOption}
              handleRemoveCashOption={handleRemoveCashOption}
            />
            <ContractFilter
              hasContract={filters.filterHasContract}
              hasNoContract={filters.filterHasNoContract}
              setHasContract={(value) => updateFilter('filterHasContract', value)}
              setHasNoContract={(value) =>
                updateFilter('filterHasNoContract', value)
              }
            />
          </div>

          {/* Status and Alerts Section */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <UnbalancedWalletFilter
              filterUnbalanced={filters.filterUnbalanced}
              setFilterUnbalanced={(value) =>
                updateFilter('filterUnbalanced', value)
              }
            />
            <AlertsFilter
              setFilterDelayed={(value) => updateFilter('filterDelayed', value)}
            />
          </div>

          {/* Selection Filters Section - Last */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <ManagerFilter
                managers={managers}
                selectedManagers={selectedManagers}
                handleSelectManager={handleSelectManager}
                handleRemoveManager={handleRemoveManager}
              />
              <ExchangeFilter
                exchanges={availableExchanges}
                selectedExchanges={selectedExchanges}
                handleSelectExchange={handleSelectExchange}
                handleRemoveExchange={handleRemoveExchange}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <BenchmarkFilter
                benchmarks={benchmarks}
                selectedBenchmarks={selectedBenchmark}
                handleSelectBenchmark={handleSelectBenchmark}
                handleRemoveBenchmark={handleRemoveBenchmark}
              />
              <AssetsFilter
                assets={assets}
                selectedAssets={selectedAssets}
                handleSelectAsset={handleSelectAsset}
                handleRemoveAsset={handleRemoveAsset}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            className="btn-standard"
            onClick={resetFilters}
          >
            Limpar Todos os Filtros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
