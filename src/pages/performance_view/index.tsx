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
import PerformanceChart from '@/pages/performance_view/barGraph'

export type PerformanceWallets = {
  user: string
  manager: string
  benchmark: string
  investedAmount: number
  currentAmount: string
  performance: number
}

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
  const [managerFilter, setManagerFilter] = useState<string>('')
  const [benchmarkFilter, setBenchmarkFilter] = useState<string>('')
  const [performanceFilter, setPerformanceFilter] = useState<string>('')
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
      const managerMatch = managerFilter ? item.manager === managerFilter : true
      const benchmarkMatch = benchmarkFilter
        ? item.benchmark === benchmarkFilter
        : true

      let performanceMatch = true

      if (isCustomFilter) {
        performanceMatch = filterByCustomPerformance(item.performance)
      } else if (performanceFilter) {
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
    setManagerFilter('')
    setBenchmarkFilter('')
    setPerformanceFilter('')
    setIsCustomFilter(false)
    setCustomMinPerformance('')
    setCustomMaxPerformance('')
  }

  // Função para alternar entre filtro predefinido e customizado
  const handleFilterTypeChange = (isCustom: boolean) => {
    setIsCustomFilter(isCustom)
    if (isCustom) {
      setPerformanceFilter('') // Limpa filtro predefinido
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
          const textColor = value >= 0 ? 'text-green-400' : 'text-red-400'
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
    <div className="flex min-h-screen flex-col bg-neutral-900 p-4 text-slate-100 sm:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-100 sm:text-3xl">
          Performance das Carteiras
        </h2>
        {/* Estatísticas dos filtros aplicados */}
        {(managerFilter ||
          benchmarkFilter ||
          performanceFilter ||
          isCustomFilter) && (
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-400">
            <span>
              Resultados:{' '}
              <strong className="text-slate-200">{filteredStats.total}</strong>{' '}
              carteiras
            </span>
            <span className="text-green-400">
              Positivas: <strong>{filteredStats.positive}</strong>
            </span>
            <span className="text-red-400">
              Negativas: <strong>{filteredStats.negative}</strong>
            </span>
            <span>
              Média:{' '}
              <strong className="text-slate-200">
                {filteredStats.average.toFixed(2)}%
              </strong>
            </span>
            <span>
              Min:{' '}
              <strong className="text-red-300">
                {filteredStats.min.toFixed(2)}%
              </strong>
            </span>
            <span>
              Max:{' '}
              <strong className="text-green-300">
                {filteredStats.max.toFixed(2)}%
              </strong>
            </span>
          </div>
        )}
      </div>

      {/* Abas de navegação */}
      <div className="mb-6 flex border-b">
        <button
          className={`px-4 py-2 ${activeTab === 'table' ? 'border-b-2 border-yellow-500 text-yellow-600' : 'text-white'}`}
          onClick={() => setActiveTab('table')}
        >
          Tabela de Performance
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'chart' ? 'border-b-2 border-yellow-500 text-yellow-600' : 'text-white'}`}
          onClick={() => setActiveTab('chart')}
        >
          Gráfico de Barras
        </button>
      </div>

      {/* Filtros */}
      <div className="mb-6 space-y-4">
        {/* Filtros básicos */}
        <div className="flex flex-wrap gap-4">
          <select
            className="rounded bg-neutral-800 px-3 py-2 text-slate-100"
            value={managerFilter}
            onChange={(e) => setManagerFilter(e.target.value)}
          >
            <option value="">Todos os Managers</option>
            {managers.map((manager) => (
              <option key={manager} value={manager}>
                {manager}
              </option>
            ))}
          </select>

          <select
            className="rounded bg-neutral-800 px-3 py-2 text-slate-100"
            value={benchmarkFilter}
            onChange={(e) => setBenchmarkFilter(e.target.value)}
          >
            <option value="">Todos os Benchmarks</option>
            {benchmarks.map((benchmark) => (
              <option key={benchmark} value={benchmark}>
                {benchmark}
              </option>
            ))}
          </select>

          {/* Botão para limpar filtros */}
          {(managerFilter ||
            benchmarkFilter ||
            performanceFilter ||
            isCustomFilter) && (
            <button
              className="rounded bg-red-600 px-3 py-2 text-white transition-colors hover:bg-red-700"
              onClick={clearAllFilters}
            >
              Limpar Filtros
            </button>
          )}
        </div>

        {/* Filtros de Performance */}
        <div className="rounded-lg border border-neutral-700 bg-neutral-800/30 p-4">
          <h3 className="mb-3 font-semibold text-slate-200">
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
                className="text-yellow-500"
              />
              <span className="text-slate-300">Filtros Predefinidos</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="filterType"
                checked={isCustomFilter}
                onChange={() => handleFilterTypeChange(true)}
                className="text-yellow-500"
              />
              <span className="text-slate-300">Filtro Customizado</span>
            </label>
          </div>

          {/* Filtros predefinidos */}
          {!isCustomFilter && (
            <select
              className="w-full max-w-md rounded bg-neutral-800 px-3 py-2 text-slate-100"
              value={performanceFilter}
              onChange={(e) => setPerformanceFilter(e.target.value)}
            >
              <option value="">Todas as Performances</option>
              <optgroup label="Geral">
                <option value="positive">Apenas Positivas (&gt; 0%)</option>
                <option value="negative">Apenas Negativas (&lt; 0%)</option>
              </optgroup>
              <optgroup label="Performance Positiva">
                <option value="above5">Acima de 5%</option>
                <option value="above10">Acima de 10%</option>
                <option value="above20">Acima de 20%</option>
                <option value="range0-5">Entre 0% e 5%</option>
                <option value="range5-10">Entre 5% e 10%</option>
                <option value="range10-15">Entre 10% e 15%</option>
                <option value="range15-20">Entre 15% e 20%</option>
              </optgroup>
              <optgroup label="Performance Negativa">
                <option value="below-5">Abaixo de -5%</option>
                <option value="below-10">Abaixo de -10%</option>
                <option value="below-20">Abaixo de -20%</option>
                <option value="range-5-0">Entre -5% e 0%</option>
                <option value="range-10--5">Entre -10% e -5%</option>
                <option value="range-15--10">Entre -15% e -10%</option>
              </optgroup>
            </select>
          )}

          {/* Filtro customizado */}
          {isCustomFilter && (
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-slate-300">De:</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Min %"
                  className="w-24 rounded bg-neutral-800 px-3 py-2 text-slate-100"
                  value={customMinPerformance}
                  onChange={(e) => setCustomMinPerformance(e.target.value)}
                />
                <span className="text-slate-400">%</span>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-slate-300">Até:</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Max %"
                  className="w-24 rounded bg-neutral-800 px-3 py-2 text-slate-100"
                  value={customMaxPerformance}
                  onChange={(e) => setCustomMaxPerformance(e.target.value)}
                />
                <span className="text-slate-400">%</span>
              </div>

              <div className="text-xs text-slate-400">
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
        </div>
      </div>

      {/* Conteúdo da Tabela */}
      {activeTab === 'table' && (
        <div className="flex flex-col">
          <main>
            <div className="items-center overflow-x-auto border border-neutral-700 shadow-lg">
              <table className="min-w-full divide-y divide-neutral-700">
                <thead className="bg-neutral-800">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          scope="col"
                          className={`cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-300 sm:px-6 sm:py-3.5 sm:text-sm ${['investedAmount', 'currentAmount', 'performance'].includes(header.column.id) ? 'relative' : ''} `}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}

                          {/* Seta de ordenação */}
                          {[
                            'investedAmount',
                            'currentAmount',
                            'performance',
                          ].includes(header.column.id) && (
                            <span
                              className={`ml-1 inline-block transition-colors ${
                                header.column.getIsSorted()
                                  ? 'font-bold text-blue-400'
                                  : 'text-slate-500'
                              } `}
                            >
                              {header.column.getIsSorted() === 'asc' && '▲'}
                              {header.column.getIsSorted() === 'desc' && '▼'}
                              {!header.column.getIsSorted() && '▲'}
                            </span>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-neutral-700 bg-neutral-800/50">
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="transition-colors duration-150 hover:bg-neutral-700/60"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="whitespace-nowrap px-4 py-3 text-xl text-slate-200 sm:px-6 sm:py-4"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredData.length === 0 && !loading && (
              <p className="mt-6 text-center text-slate-500">
                {managerFilter ||
                benchmarkFilter ||
                performanceFilter ||
                isCustomFilter
                  ? 'Nenhuma carteira encontrada com os filtros aplicados.'
                  : 'Nenhum dado de performance encontrado.'}
              </p>
            )}
          </main>
        </div>
      )}

      {/* Conteúdo do Gráfico */}
      {activeTab === 'chart' && (
        <div className="mx-auto w-full max-w-7xl">
          <PerformanceChart data={filteredData} />
        </div>
      )}
    </div>
  )
}
