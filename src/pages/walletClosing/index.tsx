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

  // Referência para a tabela
  const tableRef = useRef<WalletClosingsTableRef>(null)

  // Estado de paginação simplificado
  const [currentPage, setCurrentPage] = useState(0)

  // Itens por página
  const pageSize = 10

  // Calcular número total de páginas quando os dados mudam
  const totalPageCount = Math.ceil(data.length / pageSize)

  // Handle filter function
  const handleOpenFilterModal = () => {
    setIsFilterModalOpen(true)
  }

  // Handle search
  const onSearch = (value: string) => {
    handleSearch(value)
    // Resetar para a primeira página após uma busca
    setCurrentPage(0)
  }

  // Funções de navegação de página simplificadas
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1
      setCurrentPage(newPage)

      // Se a referência da tabela estiver disponível, navegar usando o método dela
      if (tableRef.current) {
        tableRef.current.previousPage()
      }
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPageCount - 1) {
      const newPage = currentPage + 1
      setCurrentPage(newPage)

      // Se a referência da tabela estiver disponível, navegar usando o método dela
      if (tableRef.current) {
        tableRef.current.nextPage()
      }
    }
  }

  // Callback para atualizar o estado de paginação a partir da tabela
  const handleTablePaginationChange = (pageIndex: number) => {
    setCurrentPage(pageIndex)
  }

  if (loading) {
    return <Loading />
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
          pageIndex={currentPage}
          pageCount={totalPageCount}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
          canPreviousPage={currentPage > 0}
          canNextPage={currentPage < totalPageCount - 1}
        />

        <WalletClosingsTable
          data={data}
          onSearch={onSearch}
          tableRef={tableRef}
          currentPage={currentPage}
          pageSize={pageSize}
          onPaginationChange={handleTablePaginationChange}
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
