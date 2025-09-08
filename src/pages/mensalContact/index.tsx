import React, { useState } from 'react'
import { SwitchTheme } from '@/components/custom/switch-theme'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Monthly Call Monitoring
            </h1>
            <p className="text-sm text-muted-foreground">
              Track monthly client communication status
            </p>
          </div>
          <SwitchTheme />
        </div>

      {/* Cards de estatísticas */}
      <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-5">
        <Card className="bg-card border-border hover:shadow-md transition-shadow">
            <CardContent className="p-4">
          <div className="text-sm text-success">
            On time
          </div>
          <div className="text-2xl font-bold text-success">
            {stats.ok}
          </div>
            </CardContent>
          </Card>
        <Card className="bg-card border-border hover:shadow-md transition-shadow">
            <CardContent className="p-4">
          <div className="text-sm text-warning">
            Due soon
          </div>
          <div className="text-2xl font-bold text-warning">
            {stats.days_left}
          </div>
            </CardContent>
          </Card>
        <Card className="bg-card border-border hover:shadow-md transition-shadow">
            <CardContent className="p-4">
          <div className="text-sm text-destructive">Overdue</div>
          <div className="text-2xl font-bold text-destructive">
            {stats.overdue}
          </div>
            </CardContent>
          </Card>
        <Card className="bg-card border-border hover:shadow-md transition-shadow">
            <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">Outdated</div>
          <div className="text-2xl font-bold text-foreground">
            {stats.no_call}
          </div>
            </CardContent>
          </Card>
        <Card className="bg-card border-border hover:shadow-md transition-shadow">
            <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">Total</div>
          <div className="text-2xl font-bold text-foreground">
            {stats.total}
          </div>
            </CardContent>
          </Card>
      </div>

      {/* Barra superior da tabela */}
      <Card className="mb-10 bg-card border-border hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between rounded-t-lg p-5">
          <CardTitle className="text-xl text-foreground">Call monitoring status</CardTitle>
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
                className="bg-[#F2BE38] text-black hover:bg-yellow-500 hover:text-white transition-all duration-200 transform hover:scale-105"
              >
                Next
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
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
                          'pt-BR',
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
        </CardContent>
      </Card>
      <FilterModal
        isOpen={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        onApplyFilter={setFilters}
        initialFilters={filters}
      />
      </div>
    </div>
  )
}

export default CallMonitoring
