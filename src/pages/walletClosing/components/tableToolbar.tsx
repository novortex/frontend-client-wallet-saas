import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, SlidersHorizontal, Download } from 'lucide-react'

interface TableToolbarProps {
  onSearch: (value: string) => void
  onExport: () => void
  onOpenFilter: () => void
  filterCount: number
  pageIndex: number
  pageCount: number
  onPreviousPage: () => void
  onNextPage: () => void
  canPreviousPage: boolean
  canNextPage: boolean
}

export function TableToolbar({
  onSearch,
  onExport,
  onOpenFilter,
  filterCount,
  pageIndex,
  pageCount,
  onPreviousPage,
  onNextPage,
  canPreviousPage,
  canNextPage,
}: TableToolbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchValue(value)
    onSearch(value)
  }

  const handleClearSearch = () => {
    setSearchValue('')
    onSearch('')
    setIsSearchOpen(false)
  }

  return (
    <div className="flex items-center justify-between rounded-t-lg bg-lightComponent p-5 dark:bg-[#171717]">
      <h1 className="text-xl dark:text-white">Wallet closings status</h1>
      <div className="flex items-center gap-3">
        {/* Search input - conditionally rendered */}
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

        {/* Export button */}
        <Button
          className="flex items-center gap-2 rounded-lg bg-white p-2 text-black hover:bg-gray-100 dark:bg-[#272727] dark:text-white dark:hover:bg-[#323232]"
          onClick={onExport}
        >
          <Download className="h-4 w-4" />
        </Button>

        {/* Filter button */}
        <div className="relative">
          <Button
            className="flex items-center gap-2 rounded-lg bg-white p-2 text-black hover:bg-gray-100 dark:bg-[#272727] dark:text-white dark:hover:bg-[#323232]"
            onClick={onOpenFilter}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          {filterCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
              {filterCount}
            </span>
          )}
        </div>

        {/* Pagination controls simplificados */}
        <div className="ml-2 flex items-center space-x-2 border-l border-gray-300 pl-2 dark:border-gray-600">
          <Button
            size="sm"
            onClick={onPreviousPage}
            disabled={!canPreviousPage}
            className="bg-white text-black hover:bg-gray-200 dark:bg-[#323232] dark:text-white dark:hover:bg-[#3a3a3a]"
          >
            Previous
          </Button>

          {/* Página atual / total */}
          <span className="mx-2 text-sm dark:text-white">
            Page {pageIndex + 1} of {pageCount || 1}
          </span>

          <Button
            size="sm"
            onClick={onNextPage}
            disabled={!canNextPage}
            className="bg-[#F2BE38] text-black hover:bg-yellow-600 hover:text-white"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
