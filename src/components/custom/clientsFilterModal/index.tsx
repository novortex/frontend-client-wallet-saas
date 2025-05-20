import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
}

export function ClientsFilterModal({ handleApplyFilters }: ApplyFiltersProps) {
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
          variant="outline"
          className="gap-2 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[90vh] max-h-[90vh] w-[50%] max-w-none overflow-y-auto bg-white dark:bg-[#131313]">
        <DialogHeader className="text-black dark:text-[#fff]">
          <DialogTitle className="text-center text-2xl">
            Filter Customer
          </DialogTitle>
        </DialogHeader>
        <WalletTypeFilter
          selectedWalletTypes={selectedWalletTypes}
          handleSelectWalletType={(type) =>
            setSelectedWalletTypes((prev) => [...prev, type])
          }
          handleRemoveWalletType={(type) =>
            setSelectedWalletTypes((prev) => prev.filter((t) => t !== type))
          }
        />
        <CashFilter
          selectedCashOptions={selectedCashOptions}
          handleSelectCashOption={handleSelectCashOption}
          handleRemoveCashOption={handleRemoveCashOption}
        />
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
        <UnbalancedWalletFilter
          filterUnbalanced={filters.filterUnbalanced}
          setFilterUnbalanced={(value) =>
            updateFilter('filterUnbalanced', value)
          }
        />
        <ContractFilter
          hasContract={filters.filterHasContract}
          hasNoContract={filters.filterHasNoContract}
          setHasContract={(value) => updateFilter('filterHasContract', value)}
          setHasNoContract={(value) =>
            updateFilter('filterHasNoContract', value)
          }
        />
        <AlertsFilter
          setFilterDelayed={(value) => updateFilter('filterDelayed', value)}
        />
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
        <DialogFooter>
          <Button
            className="bg-[#F2BE38] text-black hover:bg-yellow-600 hover:text-white"
            onClick={resetFilters}
          >
            Clear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
