// index.tsx - Componente WalletClosings principal
import { useState, useRef } from 'react'
import { SwitchTheme } from '@/components/custom/switch-theme'
import { Loading } from '@/components/custom/loading'
import { FilterModal } from './components/filterModal'
import {
  WalletClosingsTable,
  WalletClosingsTableRef,
} from './components/walletClosingsTable'
import { TableToolbar } from './components/tableToolbar'
import { useWalletClosings } from './hooks/useWalletClosings'

export function WalletClosings() {
  const {
    data,
    loading,
    handleExport,
    handleApplyFilters,
    handleSearch,
    filterCount,
  } = useWalletClosings()

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  // Use a properly typed ref instead of 'any'
  const tableRef = useRef<WalletClosingsTableRef>(null)

  // Handle filter function
  const handleOpenFilterModal = () => {
    setIsFilterModalOpen(true)
  }

  // Handle search
  const onSearch = (value: string) => {
    handleSearch(value)
  }

  if (loading) {
    return <Loading />
  }

  // Informações de paginação para o toolbar
  const pageInfo = tableRef.current
    ? {
        pageIndex: tableRef.current.getState().pagination.pageIndex,
        pageCount: tableRef.current.getPageCount(),
        canPreviousPage: tableRef.current.getCanPreviousPage(),
        canNextPage: tableRef.current.getCanNextPage(),
        totalItems: data.length,
        pageSize: tableRef.current.getState().pagination.pageSize,
      }
    : {
        pageIndex: 0,
        pageCount: 1,
        canPreviousPage: false,
        canNextPage: false,
        totalItems: data.length,
        pageSize: 10,
      }

  return (
    <div className="h-full bg-white p-10 dark:bg-transparent">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl font-medium dark:text-white">
          Wallet Closings
        </h1>
        <SwitchTheme />
      </div>

      <div className="mb-10 rounded-md border">
        <TableToolbar
          onSearch={onSearch}
          onExport={handleExport}
          onOpenFilter={handleOpenFilterModal}
          filterCount={filterCount}
          pageIndex={pageInfo.pageIndex}
          pageCount={pageInfo.pageCount}
          onPreviousPage={() => tableRef.current?.previousPage()}
          onNextPage={() => tableRef.current?.nextPage()}
          canPreviousPage={pageInfo.canPreviousPage}
          canNextPage={pageInfo.canNextPage}
          totalItems={pageInfo.totalItems}
          pageSize={pageInfo.pageSize}
        />

        <WalletClosingsTable
          data={data}
          onSearch={onSearch}
          tableRef={tableRef}
        />
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onOpenChange={setIsFilterModalOpen}
        onApplyFilter={handleApplyFilters}
      />
    </div>
  )
}
