import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
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
import { useUserStore } from '@/store/user'
import { getAllManagersOnOrganization } from '@/services/request'
import { AlertsFilter } from './AlertsFilter'
import { ExchangeFilter } from './ExchangeFilter'
import { BenchmarkFilter } from './BenchmarkFilter'
import { getBenchmarkOptions } from '@/services/assetsService'

type ApplyFiltersProps = {
  handleApplyFilters: (filters: {
    selectedManagers: string[]
    selectedWalletTypes: string[]
    filterDelayed: boolean
    filterUnbalanced: boolean
    filterNewest: boolean
    filterOldest: boolean
    selectedExchange: string
    selectedBenchmark: string[]
  }) => void
}

export function ClientsFilterModal({ handleApplyFilters }: ApplyFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedManagers, setSelectedManagers] = useState<string[]>([])
  const [selectedWalletTypes, setSelectedWalletTypes] = useState<string[]>([])
  const [selectedBenchmark, setSelectedBenchmark] = useState<string[]>([])
  const [selectedExchange, setSelectedExchange] = useState<string>('')
  const [managers, setManagers] = useState<{ name: string }[]>([])
  const [benchmarks, setBenchmarks] = useState<{ name: string }[]>([])
  const [filters, setFilters] = useState({
    filterDelayed: false,
    filterUnbalanced: false,
    filterNewest: false,
    filterOldest: false,
    filterNearestRebalancing: false,
    filterFurtherRebalancing: false,
  })

  const uuidOrganization = useUserStore((state) => state.user.uuidOrganization)

  useEffect(() => {
    const fetchBenchmarks = async () => {
      const result = await getBenchmarkOptions(uuidOrganization)
      console.log(`benchmarks`, result)
      setBenchmarks(result.map((benchmark) => ({ name: benchmark.name })))
    }

    const fetchManagers = async () => {
      const result = await getAllManagersOnOrganization(uuidOrganization)
      console.log(`managers`, result)
      setManagers(result.map((item) => ({ name: item.name })))
    }

    fetchBenchmarks()
    fetchManagers()
  }, [uuidOrganization])

  const applyFilters = () => {
    handleApplyFilters({
      selectedManagers,
      selectedWalletTypes,
      selectedExchange,
      selectedBenchmark,
      ...filters,
    })

    setIsOpen(false)
  }

  const updateFilter = (filterName: string, value: boolean) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }))
  }

  const handleSelectWalletType = (type: string) =>
    setSelectedWalletTypes((prev) => [...prev, type])
  const handleRemoveWalletType = (type: string) =>
    setSelectedWalletTypes((prev) => prev.filter((t) => t !== type))

  const handleExchangeChange = (value: string) => {
    setSelectedExchange(value)
  }

  const handleSelectManager = (name: string) =>
    setSelectedManagers((prev) => [...prev, name])

  const handleRemoveManager = (name: string) =>
    setSelectedManagers((prev) => prev.filter((manager) => manager !== name))

  const handleSelectBenchmark = (name: string) => {
    setSelectedBenchmark((prev) => [...prev, name])
  }
  const handleRemoveBenchmark = (name: string) => {
    setSelectedBenchmark((prev) =>
      prev.filter((benchmark) => benchmark !== name),
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="gap-2 hover:bg-gray-700"
        >
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#131313] h-fit">
        <DialogHeader className="text-[#fff]">
          <DialogTitle className="text-2xl text-center">
            Filter Customer
          </DialogTitle>
        </DialogHeader>

        <WalletTypeFilter
          selectedWalletTypes={selectedWalletTypes}
          handleSelectWalletType={handleSelectWalletType}
          handleRemoveWalletType={handleRemoveWalletType}
        />

        <OrderByFilter
          setFilterNewest={(value) => updateFilter('filterNewest', value)}
          setFilterOldest={(value) => updateFilter('filterOldest', value)}
          setFilterNearestRebalancing={(value) =>
            updateFilter('filterNearestRebalancing', value)
          }
          setFilterFurtherRebalancing={(value) =>
            updateFilter('filterFurtherRebalancing', value)
          }
        />

        <UnbalancedWalletFilter
          filterUnbalanced={filters.filterUnbalanced}
          setFilterUnbalanced={(value) =>
            updateFilter('filterUnbalanced', value)
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
          uuidOrganization={uuidOrganization}
          selectedExchange={selectedExchange}
          handleExchangeChange={handleExchangeChange}
        />

        <BenchmarkFilter
          benchmarks={benchmarks}
          selectedBenchmarks={selectedBenchmark}
          handleSelectBenchmark={handleSelectBenchmark}
          handleRemoveBenchmark={handleRemoveBenchmark}
        />

        <DialogFooter>
          <Button className="bg-[#1877f2] text-white" onClick={applyFilters}>
            Apply
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
