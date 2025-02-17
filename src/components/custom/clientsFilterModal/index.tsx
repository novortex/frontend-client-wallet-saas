import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { OrderByFilter } from './OrderByFilter'
import { WalletTypeFilter } from './WalletTypeFilter'
import { ManagerFilter } from './ManagerFilter'
import { UnbalancedWalletFilter } from './UnbalanceWalletFilter'
import { AlertsFilter } from './AlertsFilter'
import { ExchangeFilter } from './ExchangeFilter'
import { BenchmarkFilter } from './BenchmarkFilter'
import { getBenchmarkOptions, getExchangesDisposables } from '@/services/managementService'
import { getAllManagersOnOrganization, getAllAssetsOrg } from '@/services/managementService'
import { AssetsFilter } from './AssetsFilter'

type ApplyFiltersProps = {
  handleApplyFilters: (filters: {
    selectedManagers: string[]
    selectedWalletTypes: string[]
    selectedAssets: string[]
    filterDelayed: boolean
    filterUnbalanced: boolean
    filterNewest: boolean
    filterOldest: boolean
    selectedExchanges: string[]
    selectedBenchmark: string[]
  }) => void
}

export function ClientsFilterModal({ handleApplyFilters }: ApplyFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [assets, setAssets] = useState<{ uuid: string; name: string }[]>([])
  const [selectedAssets, setSelectedAssets] = useState<{ uuid: string; name: string }[]>([])
  const [selectedManagers, setSelectedManagers] = useState<string[]>([])
  const [selectedWalletTypes, setSelectedWalletTypes] = useState<string[]>([])
  const [selectedBenchmark, setSelectedBenchmark] = useState<string[]>([])
  const [selectedExchanges, setSelectedExchanges] = useState<string[]>([])
  const [managers, setManagers] = useState<{ name: string }[]>([])
  const [benchmarks, setBenchmarks] = useState<{ name: string }[]>([])
  const [availableExchanges, setAvailableExchanges] = useState<{ name: string }[]>([])
  const [filters, setFilters] = useState({
    filterDelayed: false,
    filterUnbalanced: false,
    filterNewest: false,
    filterOldest: false,
    filterNearestRebalancing: false,
    filterFurtherRebalancing: false,
  })

  // Recupera os filtros salvos do localStorage e os aplica automaticamente ao montar o componente
  useEffect(() => {
    const savedFilters = localStorage.getItem('clientsFilters')
    if (savedFilters) {
      const parsedFilters = JSON.parse(savedFilters)
      setSelectedManagers(parsedFilters.selectedManagers || [])
      setSelectedWalletTypes(parsedFilters.selectedWalletTypes || [])
      setSelectedAssets(parsedFilters.selectedAssets || [])
      setSelectedBenchmark(parsedFilters.selectedBenchmark || [])
      setSelectedExchanges(parsedFilters.selectedExchanges || [])
      setFilters(
        parsedFilters.filters || {
          filterDelayed: false,
          filterUnbalanced: false,
          filterNewest: false,
          filterOldest: false,
          filterNearestRebalancing: false,
          filterFurtherRebalancing: false,
        }
      )

      handleApplyFilters({
        selectedAssets: (parsedFilters.selectedAssets || []).map((asset: { uuid: string; name: string }) => asset.uuid),
        selectedManagers: parsedFilters.selectedManagers || [],
        selectedWalletTypes: parsedFilters.selectedWalletTypes || [],
        selectedExchanges: parsedFilters.selectedExchanges || [],
        selectedBenchmark: parsedFilters.selectedBenchmark || [],
        ...parsedFilters.filters,
      })
    }
  }, [])

  useEffect(() => {
    const fetchBenchmarks = async () => {
      const result = await getBenchmarkOptions()
      setBenchmarks(result.map((benchmark) => ({ name: benchmark.name })))
    }

    const fetchManagers = async () => {
      const result = await getAllManagersOnOrganization()
      setManagers(result.map((item) => ({ name: item.name })))
    }

    const fetchAssets = async () => {
      try {
        const result = await getAllAssetsOrg()
        console.log('result get available assets: ', result)
        setAssets(result.map((item) => ({ uuid: item.uuid, name: item.name })))
      } catch (error) {
        console.error('Error fetching assets:', error)
      }
    }

    const fetchExchanges = async () => {
      const result = await getExchangesDisposables()
      setAvailableExchanges(result?.map((exchange) => ({ name: exchange.name })) || [])
    }

    fetchBenchmarks()
    fetchManagers()
    fetchExchanges()
    fetchAssets()
  }, [])

  useEffect(() => {
  }, [assets])

  const applyFilters = () => {
    // Salva os filtros atuais no localStorage
    const filtersToSave = {
      selectedAssets,
      selectedManagers,
      selectedWalletTypes,
      selectedExchanges,
      selectedBenchmark,
      filters,
    }
    localStorage.setItem('clientsFilters', JSON.stringify(filtersToSave))

    // Aplica os filtros utilizando os valores atuais
    handleApplyFilters({
      selectedAssets: selectedAssets.map((asset) => asset.uuid),
      selectedManagers,
      selectedWalletTypes,
      selectedExchanges,
      selectedBenchmark,
      ...filters,
    })
    setIsOpen(false)
  }

  const updateFilter = (filterName: string, value: boolean) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }))
  }

  const handleSelectExchange = (exchangeName: string) => {
    setSelectedExchanges((prev) => [...prev, exchangeName])
  }

  const handleRemoveExchange = (exchangeName: string) => {
    setSelectedExchanges((prev) => prev.filter((name) => name !== exchangeName))
  }

  const handleSelectManager = (name: string) => setSelectedManagers((prev) => [...prev, name])

  const handleSelectAsset = (asset: { uuid: string; name: string }) => {
    setSelectedAssets((prev) => [...prev, asset])
  }

  const handleRemoveAsset = (assetUuid: string) => {
    setSelectedAssets((prev) => prev.filter((asset) => asset.uuid !== assetUuid))
  }

  const handleRemoveManager = (name: string) => setSelectedManagers((prev) => prev.filter((manager) => manager !== name))

  const handleSelectBenchmark = (name: string) => {
    setSelectedBenchmark((prev) => [...prev, name])
  }

  const handleRemoveBenchmark = (name: string) => {
    setSelectedBenchmark((prev) => prev.filter((benchmark) => benchmark !== name))
  }

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

  const resetFilters = () => {
    setSelectedManagers([])
    setSelectedWalletTypes([])
    setSelectedBenchmark([])
    setSelectedExchanges([])
    setSelectedAssets([])
    setFilters({
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
        <Button type="button" variant="outline" className="gap-2 hover:bg-gray-700">
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#131313] h-[90vh] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-[#fff]">
          <DialogTitle className="text-2xl text-center">Filter Customer</DialogTitle>
        </DialogHeader>

        <WalletTypeFilter
          selectedWalletTypes={selectedWalletTypes}
          handleSelectWalletType={(type) => setSelectedWalletTypes((prev) => [...prev, type])}
          handleRemoveWalletType={(type) => setSelectedWalletTypes((prev) => prev.filter((t) => t !== type))}
        />

        <OrderByFilter
          filters={{
            newest: filters.filterNewest,
            older: filters.filterOldest,
            nearestRebalancing: filters.filterNearestRebalancing,
            furtherRebalancing: filters.filterFurtherRebalancing,
          }}
          onFilterChange={(name, value) => updateFilter(`filter${capitalize(name)}`, value)}
        />

        <UnbalancedWalletFilter
          filterUnbalanced={filters.filterUnbalanced}
          setFilterUnbalanced={(value) => updateFilter('filterUnbalanced', value)}
        />

        <AlertsFilter setFilterDelayed={(value) => updateFilter('filterDelayed', value)} />

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

        <AssetsFilter assets={assets} selectedAssets={selectedAssets} handleSelectAsset={handleSelectAsset} handleRemoveAsset={handleRemoveAsset} />

        <DialogFooter>
          <Button className="bg-[#F2BE38] text-black hover:text-white hover:bg-yellow-600" onClick={applyFilters}>
            Apply
          </Button>
          <Button variant="outline" onClick={resetFilters}>
            Clear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
