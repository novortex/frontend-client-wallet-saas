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
  const [sorting, setSorting] = useState<SortingState>([])

  useEffect(() => {
    setLoading(true)
    fetchPerformanceData()
      .then((res) => {
        const dataArray = Array.isArray(res) ? res : Object.values(res)
        setData(dataArray)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Filtros
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const managerMatch = managerFilter ? item.manager === managerFilter : true
      const benchmarkMatch = benchmarkFilter
        ? item.benchmark === benchmarkFilter
        : true
      return managerMatch && benchmarkMatch
    })
  }, [data, managerFilter, benchmarkFilter])

  // Listas únicas para os selects
  const managers = useMemo(
    () => Array.from(new Set(data.map((d) => d.manager))),
    [data],
  )
  const benchmarks = useMemo(
    () => Array.from(new Set(data.map((d) => d.benchmark))),
    [data],
  )

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
    <div className="flex min-h-screen flex-col items-center bg-neutral-900 p-4 text-slate-100 sm:p-6">
      <h2 className="mb-6 text-2xl font-bold text-slate-100 sm:text-3xl">
        Performance das carteiras
      </h2>
      {/* Filtros */}
      <div className="mb-4 flex flex-wrap gap-4">
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
      </div>
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
                          {!header.column.getIsSorted() && '▲'}{' '}
                          {/* Sempre mostra a seta, mas apagadinha */}
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
            Nenhum dado de performance encontrado.
          </p>
        )}
      </main>
    </div>
  )
}
