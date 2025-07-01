import React, { useState } from 'react'
import { SwitchTheme } from '@/components/custom/switch-theme'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Download, SlidersHorizontal, Search } from 'lucide-react'
import { useCallMonitoring } from './hooks/useCallMonitoring'
import { StatusBadge } from './components/StatusBadge'
import { FilterModal } from './components/FilterModal'
import { Loading } from '@/components/custom/loading'
import { CellActions } from './components/CellActions'

const CallMonitoring = () => {
  const {
    loading,
    paginatedCalls,
    stats,
    currentPage,
    setCurrentPage,
    canPreviousPage,
    canNextPage,
    totalPages,
    searchTerm,
    setSearchTerm,
    updating,
    handleMarkAsDone,
    calculateCallStatus,
    filters,
    setFilters,
  } = useCallMonitoring()

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

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
    alert('Exportar não implementado ainda')
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="h-full bg-white p-10 dark:bg-transparent">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl font-medium dark:text-white">
          Monthly Call Monitoring
        </h1>
        <SwitchTheme />
      </div>

      {/* Cards de estatísticas */}
      <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-5">
        <div className="rounded-lg bg-green-100 p-4 dark:bg-green-900">
          <div className="text-sm text-green-600 dark:text-green-300">
            On time
          </div>
          <div className="text-2xl font-bold text-green-800 dark:text-green-100">
            {stats.ok}
          </div>
        </div>
        <div className="rounded-lg bg-yellow-100 p-4 dark:bg-yellow-900">
          <div className="text-sm text-yellow-600 dark:text-yellow-300">
            Due soon
          </div>
          <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-100">
            {stats.days_left}
          </div>
        </div>
        <div className="rounded-lg bg-red-100 p-4 dark:bg-red-900">
          <div className="text-sm text-red-600 dark:text-red-300">Overdue</div>
          <div className="text-2xl font-bold text-red-800 dark:text-red-100">
            {stats.overdue}
          </div>
        </div>
        <div className="rounded-lg bg-muted p-4">
          <div className="text-sm text-muted-foreground">Outdated</div>
          <div className="text-2xl font-bold text-foreground">
            {stats.no_call}
          </div>
        </div>
        <div className="rounded-lg bg-secondary p-4">
          <div className="text-sm text-secondary-foreground">Total</div>
          <div className="text-2xl font-bold text-secondary-foreground">
            {stats.total}
          </div>
        </div>
      </div>

      {/* Barra superior da tabela */}
      <div className="mb-10 rounded-md border">
        <div className="flex items-center justify-between rounded-t-lg bg-lightComponent p-5 dark:bg-[#171717]">
          <h1 className="text-xl dark:text-white">Call monitoring status</h1>
          <div className="flex items-center gap-3">
            {isSearchOpen ? (
              <div className="flex w-64 items-center">
                <Input
                  placeholder="Search for a client..."
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
            <div className="relative">
              <Button
                className="flex items-center gap-2 rounded-lg bg-white p-2 text-black hover:bg-gray-100 dark:bg-[#272727] dark:text-white dark:hover:bg-[#323232]"
                onClick={() => setIsFilterOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <div className="ml-2 flex items-center space-x-2 border-l border-gray-300 pl-2 dark:border-gray-600">
              <Button
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200 hover:bg-gray-300 dark:bg-[#131313] dark:hover:bg-[#101010]">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-black dark:text-white">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-black dark:text-white">
                  Manager
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-black dark:text-white">
                  Last Call
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-black dark:text-white">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-lightComponent dark:bg-[#171717] dark:text-[#959CB6]">
              {paginatedCalls.map((call) => (
                <tr
                  key={call.id}
                  className="hover:bg-gray-200 dark:hover:bg-[#101010]"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">
                    {call.clientName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                    {call.managerName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                    {call.monthCloseDate
                      ? new Date(call.monthCloseDate).toLocaleDateString(
                          'en-US',
                        )
                      : '-'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <StatusBadge
                      call={call}
                      calculateCallStatus={calculateCallStatus}
                    />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <CellActions
                      rowData={call}
                      onMarkAsDone={handleMarkAsDone}
                      loading={updating.has(call.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginatedCalls.length === 0 && (
          <div className="mt-6 rounded-lg bg-card p-8 text-center">
            <div className="mb-2 text-muted-foreground">No calls found</div>
            <div className="text-sm text-muted-foreground">
              {searchTerm
                ? 'Try adjusting the filters to find calls.'
                : 'No calls to monitor at the moment.'}
            </div>
          </div>
        )}
      </div>
      <FilterModal
        isOpen={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        onApplyFilter={setFilters}
        initialFilters={filters}
      />
    </div>
  )
}

export default CallMonitoring
