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

  // Estatísticas dos status
  const stats = data.reduce(
    (acc, item) => {
      if (!item.status || item.status === 'Closed') {
        acc.no_call++
      } else if (item.status === 'OK') {
        acc.ok++
      } else if (
        typeof item.status === 'string' &&
        item.status.includes('days left')
      ) {
        acc.days_left++
      } else if (
        typeof item.status === 'string' &&
        item.status.includes('days overdue')
      ) {
        acc.overdue++
      }
      acc.total++
      return acc
    },
    { ok: 0, days_left: 0, overdue: 0, no_call: 0, total: 0 },
  )

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
          <div className="text-sm text-muted-foreground">Closed</div>
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
