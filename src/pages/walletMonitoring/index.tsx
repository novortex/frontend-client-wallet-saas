import { useState } from 'react'
import { Search, Download, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loading } from '@/components/custom/loading'
import { SwitchTheme } from '@/components/custom/switch-theme'
import { useWalletMonitoring } from './hooks/useWalletMonitoring'
import { FilterModal } from './components/filterModal'
import { PerformanceBadge } from './components/statusBadge'
import { FrcFilterModal } from './components/frcFilterModal'

export default function WalletMonitoring() {
  const {
    loading,
    managers,
    stats,
    currentPage,
    setCurrentPage,
    canPreviousPage,
    canNextPage,
    totalPages,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    uniqueManagers,
    processedManagers,
    frcPage,
    setFrcPage,
    frcTotalPages,
    canFrcPrevious,
    canFrcNext,
    paginatedFrcManagers,
    frcSelectedManagers,
    setFrcSelectedManagers,
  } = useWalletMonitoring()

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isFrcFilterOpen, setIsFrcFilterOpen] = useState(false)

  // State to control the active tab
  const [activeTab, setActiveTab] = useState<'balance' | 'standardization'>(
    'balance',
  )

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchValue(value)
    setSearchTerm(value)
  }

  const handleClearSearch = () => {
    setSearchValue('')
    setSearchTerm('')
    setIsSearchOpen(false)
  }

  const handleExport = () => {
    alert('Export functionality not implemented yet')
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="h-full bg-white p-10 dark:bg-transparent">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl font-medium dark:text-white">
          Wallet Monitoring
        </h1>
        <SwitchTheme />
      </div>

      {/* Navigation tabs */}
      <div className="mb-6 flex border-b border-gray-300 dark:border-gray-600">
        <button
          className={`px-4 py-2 ${
            activeTab === 'balance'
              ? 'border-b-2 border-yellow-500 text-yellow-600'
              : 'text-black dark:text-white'
          }`}
          onClick={() => setActiveTab('balance')}
        >
          Balance Monitoring
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === 'standardization'
              ? 'border-b-2 border-yellow-500 text-yellow-600'
              : 'text-black dark:text-white'
          }`}
          onClick={() => setActiveTab('standardization')}
        >
          FRC Monitoring
        </button>
      </div>

      {/* Balance Monitoring tab content */}
      {activeTab === 'balance' && (
        <>
          {/* Statistics cards */}
          <div
            data-testid="stats-cards-container"
            className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-5"
          >
            <div className="rounded-lg bg-green-100 p-4 dark:bg-green-900">
              <div className="text-sm text-green-600 dark:text-green-300">
                Perfect (100%)
              </div>
              <div className="text-2xl font-bold text-green-800 dark:text-green-100">
                {stats.perfectManagers}
              </div>
            </div>
            <div className="rounded-lg bg-blue-100 p-4 dark:bg-blue-900">
              <div className="text-sm text-blue-600 dark:text-blue-300">
                Good (80-99%)
              </div>
              <div className="text-2xl font-bold text-blue-800 dark:text-blue-100">
                {stats.goodManagers}
              </div>
            </div>
            <div className="rounded-lg bg-yellow-100 p-4 dark:bg-yellow-900">
              <div className="text-sm text-yellow-600 dark:text-yellow-300">
                Warning (60-79%)
              </div>
              <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-100">
                {stats.warningManagers}
              </div>
            </div>
            <div className="rounded-lg bg-red-100 p-4 dark:bg-red-900">
              <div className="text-sm text-red-600 dark:text-red-300">
                Critical (&lt;60%)
              </div>
              <div className="text-2xl font-bold text-red-800 dark:text-red-100">
                {stats.criticalManagers}
              </div>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <div className="text-sm text-muted-foreground">
                Total Managers
              </div>
              <div className="text-2xl font-bold text-foreground">
                {stats.totalManagers}
              </div>
            </div>
          </div>

          {/* Table top bar */}
          <div className="mb-10 rounded-md border">
            <div className="flex items-center justify-between rounded-t-lg bg-lightComponent p-5 dark:bg-[#171717]">
              <h1 className="text-xl dark:text-white">
                Manager Performance Overview
              </h1>
              <div className="flex items-center gap-3">
                {isSearchOpen ? (
                  <div className="flex w-64 items-center">
                    <Input
                      placeholder="Search for a manager..."
                      value={searchValue}
                      onChange={handleSearchChange}
                      className="h-10 border-gray-300 bg-white text-black dark:border-[#323232] dark:bg-[#131313] dark:text-white"
                      autoFocus
                      onBlur={() => {
                        if (!searchValue.trim()) {
                          setIsSearchOpen(false)
                        }
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-8 w-8 p-0"
                      onClick={handleClearSearch}
                    >
                      ✕
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="flex items-center gap-2 rounded-lg bg-white p-2 text-black hover:bg-gray-100 dark:bg-[#272727] dark:text-white dark:hover:bg-[#323232]"
                    onClick={() => setIsSearchOpen(true)}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  className="flex items-center gap-2 rounded-lg bg-white p-2 text-black hover:bg-gray-100 dark:bg-[#272727] dark:text-white dark:hover:bg-[#323232]"
                  onClick={handleExport}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  className="flex items-center gap-2 rounded-lg bg-white p-2 text-black hover:bg-gray-100 dark:bg-[#272727] dark:text-white dark:hover:bg-[#323232]"
                  onClick={() => setIsFilterOpen(true)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
                <div className="ml-2 flex items-center space-x-2 border-l border-gray-300 pl-2 dark:border-gray-600">
                  <Button
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={!canPreviousPage}
                    className="bg-white text-black hover:bg-gray-200 dark:bg-[#323232] dark:text-white dark:hover:bg-[#3a3a3a]"
                  >
                    Previous
                  </Button>
                  <span className="mx-2 text-sm dark:text-white">
                    Page {currentPage} of {totalPages || 1}
                  </span>
                  <Button
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={!canNextPage}
                    className="bg-[#F2BE38] text-black hover:bg-yellow-600 hover:text-white"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-200 hover:bg-gray-300 dark:bg-[#131313] dark:hover:bg-[#101010]">
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      Manager
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      Balanced Wallets
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      Delayed Wallets
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      Total Wallets
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-lightComponent dark:bg-[#171717] dark:text-[#959CB6]">
                  {managers.map((manager) => (
                    <tr
                      key={manager.managerName}
                      className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-[#1a1a1a]"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {manager.managerName}
                      </td>
                      <td className="px-6 py-4 text-sm text-green-600 dark:text-green-400">
                        {manager.balancedWallets}
                      </td>
                      <td className="px-6 py-4 text-sm text-red-600 dark:text-red-400">
                        {manager.delayedWallets}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                        {manager.totalWallets}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="font-bold">
                          {manager.balancedWallets}/{manager.totalWallets}
                        </span>
                        <span className="ml-2 text-gray-500">
                          ({manager.percentage.toFixed(1)}%)
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <PerformanceBadge
                          percentage={manager.percentage}
                          showPercentage={false}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {managers.length === 0 && (
              <div className="mt-6 rounded-lg bg-card p-8 text-center">
                <div className="mb-2 text-muted-foreground">
                  No managers found
                </div>
                <div className="text-sm text-muted-foreground">
                  {searchTerm
                    ? 'Try adjusting the filters to find managers.'
                    : 'No managers to monitor at the moment.'}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* FRC Monitoring tab content */}
      {activeTab === 'standardization' && (
        <>
          {/* FRC statistics cards */}
          <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-red-100 p-4 dark:bg-red-900">
              <div className="text-sm text-red-600 dark:text-red-300">
                FRC = 0
              </div>
              <div className="text-2xl font-bold text-red-800 dark:text-red-100">
                {processedManagers.filter((m) => m.frcData).length > 0
                  ? (
                      processedManagers
                        .filter((m) => m.frcData)
                        .reduce(
                          (acc, manager) =>
                            acc + (manager.frcData?.frc0Percent || 0),
                          0,
                        ) / processedManagers.filter((m) => m.frcData).length
                    ).toFixed(1)
                  : '0.0'}
                %
              </div>
            </div>
            <div className="rounded-lg bg-green-100 p-4 dark:bg-green-900">
              <div className="text-sm text-green-600 dark:text-green-300">
                FRC = 1
              </div>
              <div className="text-2xl font-bold text-green-800 dark:text-green-100">
                {processedManagers.filter((m) => m.frcData).length > 0
                  ? (
                      processedManagers
                        .filter((m) => m.frcData)
                        .reduce(
                          (acc, manager) =>
                            acc + (manager.frcData?.frc1Percent || 0),
                          0,
                        ) / processedManagers.filter((m) => m.frcData).length
                    ).toFixed(1)
                  : '0.0'}
                %
              </div>
            </div>
            <div className="rounded-lg bg-yellow-100 p-4 dark:bg-yellow-900">
              <div className="text-sm text-yellow-600 dark:text-yellow-300">
                FRC &gt; 1
              </div>
              <div className="text-2xl font-bold text-green-800 dark:text-green-100">
                {processedManagers.filter((m) => m.frcData).length > 0
                  ? (
                      processedManagers
                        .filter((m) => m.frcData)
                        .reduce(
                          (acc, manager) =>
                            acc + (manager.frcData?.frcMoreThan1Percent || 0),
                          0,
                        ) / processedManagers.filter((m) => m.frcData).length
                    ).toFixed(1)
                  : '0.0'}
                %
              </div>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <div className="text-sm text-muted-foreground">Total Clients</div>
              <div className="text-2xl font-bold text-foreground">
                {processedManagers
                  .filter((m) => m.frcData)
                  .reduce(
                    (acc, manager) =>
                      acc + (manager.frcData?.totalClients || 0),
                    0,
                  )}
              </div>
            </div>
          </div>

          {/* FRC table top bar */}
          <div className="mb-10 rounded-md border">
            <div className="flex items-center justify-between rounded-t-lg bg-lightComponent p-5 dark:bg-[#171717]">
              <h1 className="text-xl dark:text-white">
                FRC Statistics by Manager
              </h1>
              <div className="flex items-center gap-3">
                {isSearchOpen ? (
                  <div className="flex w-64 items-center">
                    <Input
                      placeholder="Search for a manager..."
                      value={searchValue}
                      onChange={handleSearchChange}
                      className="h-10 border-gray-300 bg-white text-black dark:border-[#323232] dark:bg-[#131313] dark:text-white"
                      autoFocus
                      onBlur={() => {
                        if (!searchValue.trim()) {
                          setIsSearchOpen(false)
                        }
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-8 w-8 p-0"
                      onClick={handleClearSearch}
                    >
                      ✕
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="flex items-center gap-2 rounded-lg bg-white p-2 text-black hover:bg-gray-100 dark:bg-[#272727] dark:text-white dark:hover:bg-[#323232]"
                    onClick={() => setIsSearchOpen(true)}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  className="flex items-center gap-2 rounded-lg bg-white p-2 text-black hover:bg-gray-100 dark:bg-[#272727] dark:text-white dark:hover:bg-[#323232]"
                  onClick={handleExport}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  className="flex items-center gap-2 rounded-lg bg-white p-2 text-black hover:bg-gray-100 dark:bg-[#272727] dark:text-white dark:hover:bg-[#323232]"
                  onClick={() => setIsFrcFilterOpen(true)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
                <div className="ml-2 flex items-center space-x-2 border-l border-gray-300 pl-2 dark:border-gray-600">
                  <Button
                    size="sm"
                    onClick={() => setFrcPage((p) => Math.max(p - 1, 1))}
                    disabled={!canFrcPrevious}
                    className="bg-white text-black hover:bg-gray-200 dark:bg-[#323232] dark:text-white dark:hover:bg-[#3a3a3a]"
                  >
                    Previous
                  </Button>
                  <span className="mx-2 text-sm dark:text-white">
                    Page {frcPage} of {frcTotalPages}
                  </span>
                  <Button
                    size="sm"
                    onClick={() =>
                      setFrcPage((p) => Math.min(p + 1, frcTotalPages))
                    }
                    disabled={!canFrcNext}
                    className="bg-[#F2BE38] text-black hover:bg-yellow-600 hover:text-white"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>

            {/* FRC table by manager */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-200 hover:bg-gray-300 dark:bg-[#131313] dark:hover:bg-[#101010]">
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      Assessor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      FRC = 0
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      FRC = 1
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      FRC &gt; 1
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      Total Clientes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-lightComponent dark:bg-[#171717] dark:text-[#959CB6]">
                  {Array.isArray(paginatedFrcManagers) &&
                  paginatedFrcManagers.length > 0 ? (
                    paginatedFrcManagers.map((manager) => (
                      <tr
                        key={manager.managerName}
                        className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-[#1a1a1a]"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {manager.managerName}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {manager.frcData?.frc0Percent?.toFixed(2) ?? '--'}%
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {manager.frcData?.frc1Percent?.toFixed(2) ?? '--'}%
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {manager.frcData?.frcMoreThan1Percent?.toFixed(2) ??
                            '--'}
                          %
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {manager.frcData?.totalClients ?? '--'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-muted-foreground"
                      >
                        No FRC data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <FilterModal
        isOpen={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        onApplyFilter={setFilters}
        initialFilters={filters}
        managers={uniqueManagers}
      />
      <FrcFilterModal
        isOpen={isFrcFilterOpen}
        onOpenChange={setIsFrcFilterOpen}
        managers={uniqueManagers}
        value={frcSelectedManagers}
        onChange={setFrcSelectedManagers}
      />
    </div>
  )
}
