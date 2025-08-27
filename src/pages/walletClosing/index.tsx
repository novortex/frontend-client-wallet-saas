import { useState, useRef } from 'react'
import { SwitchTheme } from '@/components/custom/switch-theme'
import { Loading } from '@/components/custom/loading'
import { Card, CardContent } from '@/components/ui/card'
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
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Wallet Closings
            </h1>
            <p className="text-sm text-muted-foreground">
              Track and manage wallet closing dates
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
          <div className="text-sm text-muted-foreground">Closed</div>
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

      <Card className="mb-10 bg-card border-border hover:shadow-md transition-shadow">
        <CardContent className="p-0">
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
        </CardContent>
      </Card>

        <FilterModal
          isOpen={isFilterModalOpen}
          onOpenChange={setIsFilterModalOpen}
          onApplyFilter={handleApplyFilters}
        />
      </div>
    </div>
  )
}
