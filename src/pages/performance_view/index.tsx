import React, { useEffect, useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table'
import { getPerformanceWallets } from '@/services/wallet/walletAssetService'
import { Loading } from '@/components/custom/loading'
import PerformanceChart from './components/PerformanceChart'
import { PerformanceWallets } from './types/performanceWallets'
import { SwitchTheme } from '@/components/custom/switch-theme'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

async function fetchPerformanceData(): Promise<
  Record<string, PerformanceWallets>
> {
  const result = await getPerformanceWallets()
  if (!result)
    throw new Error('Nenhum dado de performance foi retornado pela API.')
  return result
}

export const PerformanceView: React.FC = () => {
  const [data, setData] = useState<PerformanceWallets[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [managerFilter, setManagerFilter] = useState<string>('all')
  const [benchmarkFilter, setBenchmarkFilter] = useState<string>('all')
  const [performanceFilter, setPerformanceFilter] = useState<string>('all')
  const [isCustomFilter, setIsCustomFilter] = useState<boolean>(false)
  const [customMinPerformance, setCustomMinPerformance] = useState<string>('')
  const [customMaxPerformance, setCustomMaxPerformance] = useState<string>('')

  const [sorting, setSorting] = useState<SortingState>([])
  const [activeTab, setActiveTab] = useState('table')

  useEffect(() => {
    setLoading(true)
    fetchPerformanceData()
      .then((res) => {
        const dataArray = Array.isArray(res) ? res : Object.values(res)

        const sortedData = dataArray.sort(
          (a, b) => a.performance - b.performance,
        )
        setData(sortedData)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Função para filtrar por performance
  const filterByPerformance = (
    performance: number,
    filterType: string,
  ): boolean => {
    switch (filterType) {
      case 'positive':
        return performance > 0
      case 'negative':
        return performance < 0
      case 'above5':
        return performance > 5
      case 'above10':
        return performance > 10
      case 'above20':
        return performance > 20
      case 'below-5':
        return performance < -5
      case 'below-10':
        return performance < -10
      case 'below-20':
        return performance < -20
      case 'range0-5':
        return performance >= 0 && performance <= 5
      case 'range5-10':
        return performance > 5 && performance <= 10
      case 'range10-15':
        return performance > 10 && performance <= 15
      case 'range15-20':
        return performance > 15 && performance <= 20
      case 'range-5-0':
        return performance >= -5 && performance < 0
      case 'range-10--5':
        return performance >= -10 && performance < -5
      case 'range-15--10':
        return performance >= -15 && performance < -10
      default:
        return true
    }
  }

  // Filtros aplicados
  const filteredData = useMemo(() => {
    const filterByCustomPerformance = (performance: number): boolean => {
      const min =
        customMinPerformance !== ''
          ? parseFloat(customMinPerformance)
          : -Infinity
      const max =
        customMaxPerformance !== ''
          ? parseFloat(customMaxPerformance)
          : Infinity

      return performance >= min && performance <= max
    }

    return data.filter((item) => {
      const managerMatch = managerFilter === 'all' ? true : item.manager === managerFilter
      const benchmarkMatch = benchmarkFilter === 'all' ? true : item.benchmark === benchmarkFilter

      let performanceMatch = true

      if (isCustomFilter) {
        performanceMatch = filterByCustomPerformance(item.performance)
      } else if (performanceFilter !== 'all') {
        performanceMatch = filterByPerformance(
          item.performance,
          performanceFilter,
        )
      }

      return managerMatch && benchmarkMatch && performanceMatch
    })
  }, [
    data,
    managerFilter,
    benchmarkFilter,
    performanceFilter,
    isCustomFilter,
    customMinPerformance,
    customMaxPerformance,
  ])

  const managers = useMemo(
    () => Array.from(new Set(data.map((d) => d.manager))),
    [data],
  )
  const benchmarks = useMemo(
    () => Array.from(new Set(data.map((d) => d.benchmark))),
    [data],
  )

  // Estatísticas dos dados filtrados
  const filteredStats = useMemo(() => {
    const positiveCount = filteredData.filter(
      (item) => item.performance > 0,
    ).length
    const negativeCount = filteredData.filter(
      (item) => item.performance < 0,
    ).length
    const averagePerformance =
      filteredData.length > 0
        ? filteredData.reduce((acc, item) => acc + item.performance, 0) /
          filteredData.length
        : 0

    const maxPerformance =
      filteredData.length > 0
        ? Math.max(...filteredData.map((item) => item.performance))
        : 0
    const minPerformance =
      filteredData.length > 0
        ? Math.min(...filteredData.map((item) => item.performance))
        : 0

    return {
      total: filteredData.length,
      positive: positiveCount,
      negative: negativeCount,
      average: averagePerformance,
      max: maxPerformance,
      min: minPerformance,
    }
  }, [filteredData])

  // Função para limpar todos os filtros
  const clearAllFilters = () => {
    setManagerFilter('all')
    setBenchmarkFilter('all')
    setPerformanceFilter('all')
    setIsCustomFilter(false)
    setCustomMinPerformance('')
    setCustomMaxPerformance('')
  }

  // Função para alternar entre filtro predefinido e customizado
  const handleFilterTypeChange = (isCustom: boolean) => {
    setIsCustomFilter(isCustom)
    if (isCustom) {
      setPerformanceFilter('all') // Limpa filtro predefinido
    } else {
      setCustomMinPerformance('') // Limpa filtro customizado
      setCustomMaxPerformance('')
    }
  }

  const columns = useMemo<ColumnDef<PerformanceWallets>[]>(
    () => [
      { accessorKey: 'user', header: 'Cliente' },
      { accessorKey: 'manager', header: 'Manager' },
      {
        accessorKey: 'investedAmount',
        header: 'Valor Investido',
        cell: (info) => (
          <span>
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(info.getValue<number>())}
          </span>
        ),
      },
      {
        accessorKey: 'currentAmount',
        header: 'AUM',
        cell: (info) => {
          let value = info.getValue<string | number>()

          // Garante que value é string
          if (typeof value !== 'string') {
            value = String(value ?? '')
          }

          // Extrai o valor numérico da string (remove símbolos de moeda)
          const numericValue = parseFloat(value.replace(/[^\d.-]/g, ''))

          // Determina o símbolo da moeda
          const currencySymbol = value.trim().startsWith('R$') ? 'R$ ' : '$ '

          // Formata o valor como moeda (com separador de milhares e 2 casas decimais)
          const formattedValue = numericValue.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })

          return (
            <span>
              {currencySymbol}
              {formattedValue}
            </span>
          )
        },
        // Para ordenar corretamente, precisamos de um accessorFn numérico
        accessorFn: (row) =>
          parseFloat(row.currentAmount.replace(/[^\d.-]/g, '')),
        sortingFn: 'basic',
      },
      {
        accessorKey: 'performance',
        header: 'Performance',
        cell: (info) => {
          const value = info.getValue<number>()
          const textColor = value >= 0 ? 'text-success' : 'text-destructive'
          return (
            <span className={`font-semibold ${textColor}`}>
              {value >= 0 ? '+' : ''}
              {value}%
            </span>
          )
        },
      },
      { accessorKey: 'benchmark', header: 'Benchmark' },
    ],
    [],
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (loading) return <Loading />

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Performance das Carteiras
            </h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe o desempenho das carteiras e compare com benchmarks
            </p>
          </div>
          <SwitchTheme />
        </div>
        
        {/* Estatísticas de Performance - Sempre visível */}
        <div className="mb-6 p-4 bg-card rounded-lg border border-border">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Resultados</p>
              <p className="text-sm font-semibold text-foreground">{filteredStats.total} carteiras</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Positivas</p>
              <p className="text-sm font-semibold text-success">{filteredStats.positive}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Negativas</p>
              <p className="text-sm font-semibold text-destructive">{filteredStats.negative}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Média</p>
              <p className="text-sm font-semibold text-foreground">{filteredStats.average.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Min</p>
              <p className="text-sm font-semibold text-destructive">{filteredStats.min.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Max</p>
              <p className="text-sm font-semibold text-success">{filteredStats.max.toFixed(2)}%</p>
            </div>
          </div>
        </div>

        {/* Abas de navegação */}
        <div className="mb-6 flex border-b border-border">
          <button
            className={`px-4 py-2 ${activeTab === 'table' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('table')}
          >
            Tabela de Performance
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'chart' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('chart')}
          >
            Gráfico de Barras
          </button>
        </div>

        {/* Filtros */}
        <div className="mb-6 space-y-4">
          {/* Filtros básicos */}
          <div className="flex flex-wrap gap-4">
            <Select value={managerFilter} onValueChange={setManagerFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Todos os Managers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Managers</SelectItem>
                {managers.map((manager) => (
                  <SelectItem key={manager} value={manager}>
                    {manager}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={benchmarkFilter} onValueChange={setBenchmarkFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Todos os Benchmarks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Benchmarks</SelectItem>
                {benchmarks.map((benchmark) => (
                  <SelectItem key={benchmark} value={benchmark}>
                    {benchmark}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Botão para limpar filtros */}
            {(managerFilter !== 'all' ||
              benchmarkFilter !== 'all' ||
              performanceFilter !== 'all' ||
              isCustomFilter) && (
              <button
                className="rounded-md bg-destructive px-3 py-2 text-sm text-destructive-foreground transition-colors hover:bg-destructive/90"
                onClick={clearAllFilters}
              >
                Limpar Filtros
              </button>
            )}
          </div>

          {/* Filtros de Performance */}
          <Card className="p-4">
            <h3 className="mb-3 font-semibold text-foreground">
              Filtro de Performance
            </h3>

            {/* Toggle entre filtro predefinido e customizado */}
            <div className="mb-4 flex gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="filterType"
                  checked={!isCustomFilter}
                  onChange={() => handleFilterTypeChange(false)}
                  className="text-primary"
                />
                <span className="text-foreground">
                  Filtros Predefinidos
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="filterType"
                  checked={isCustomFilter}
                  onChange={() => handleFilterTypeChange(true)}
                  className="text-primary"
                />
                <span className="text-foreground">
                  Filtro Customizado
                </span>
              </label>
            </div>

            {/* Filtros predefinidos */}
            {!isCustomFilter && (
              <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue placeholder="Todas as Performances" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Performances</SelectItem>
                  <SelectItem value="positive">Apenas Positivas (&gt; 0%)</SelectItem>
                  <SelectItem value="negative">Apenas Negativas (&lt; 0%)</SelectItem>
                  <SelectItem value="above5">Acima de 5%</SelectItem>
                  <SelectItem value="above10">Acima de 10%</SelectItem>
                  <SelectItem value="above20">Acima de 20%</SelectItem>
                  <SelectItem value="range0-5">Entre 0% e 5%</SelectItem>
                  <SelectItem value="range5-10">Entre 5% e 10%</SelectItem>
                  <SelectItem value="range10-15">Entre 10% e 15%</SelectItem>
                  <SelectItem value="range15-20">Entre 15% e 20%</SelectItem>
                  <SelectItem value="below-5">Abaixo de -5%</SelectItem>
                  <SelectItem value="below-10">Abaixo de -10%</SelectItem>
                  <SelectItem value="below-20">Abaixo de -20%</SelectItem>
                  <SelectItem value="range-5-0">Entre -5% e 0%</SelectItem>
                  <SelectItem value="range-10--5">Entre -10% e -5%</SelectItem>
                  <SelectItem value="range-15--10">Entre -15% e -10%</SelectItem>
                </SelectContent>
              </Select>
            )}

            {/* Filtro customizado */}
            {isCustomFilter && (
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-foreground">De:</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Min %"
                    className="w-24 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    value={customMinPerformance}
                    onChange={(e) => setCustomMinPerformance(e.target.value)}
                  />
                  <span className="text-muted-foreground">%</span>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-foreground">Até:</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Max %"
                    className="w-24 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    value={customMaxPerformance}
                    onChange={(e) => setCustomMaxPerformance(e.target.value)}
                  />
                  <span className="text-muted-foreground">%</span>
                </div>

                <div className="text-xs text-muted-foreground">
                {customMinPerformance !== '' || customMaxPerformance !== '' ? (
                  <span>
                    Filtro ativo: {customMinPerformance || '-∞'}% até{' '}
                    {customMaxPerformance || '+∞'}%
                  </span>
                ) : (
                  <span>Digite os valores para filtrar</span>
                )}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Conteúdo da Tabela */}
        {activeTab === 'table' && (
          <Card className="rounded-lg border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="bg-muted/50 hover:bg-muted/50"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="cursor-pointer font-semibold text-foreground"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                          {[
                            'investedAmount',
                            'currentAmount',
                            'performance',
                          ].includes(header.column.id) && (
                            <span
                              className={`ml-1 transition-colors ${
                                header.column.getIsSorted()
                                  ? 'text-primary'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {header.column.getIsSorted() === 'asc' && '▲'}
                              {header.column.getIsSorted() === 'desc' && '▼'}
                              {!header.column.getIsSorted() && '▲'}
                            </span>
                          )}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="hover:bg-muted/50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {managerFilter !== 'all' ||
                      benchmarkFilter !== 'all' ||
                      performanceFilter !== 'all' ||
                      isCustomFilter
                        ? 'Nenhuma carteira encontrada com os filtros aplicados.'
                        : 'Nenhum dado de performance encontrado.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        )}

        {/* Conteúdo do Gráfico */}
        {activeTab === 'chart' && (
          <Card className="p-6">
            <PerformanceChart data={filteredData} />
          </Card>
        )}
      </div>
    </div>
  )
}
