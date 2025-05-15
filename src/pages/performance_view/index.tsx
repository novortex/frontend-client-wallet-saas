import React, { useEffect, useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table'
import { getPerformanceWallets } from '@/services/wallet/walletAssetService'

// Define the data type
export type PerformanceWallets = {
  user: string
  manager: string
  benchmark: string
  investedAmount: number
  currentAmount: number
  performance: number
}

// Função de busca de dados ajustada
async function fetchPerformanceData(): Promise<
  Record<string, PerformanceWallets>
> {
  try {
    const result = await getPerformanceWallets()
    if (!result) {
      throw new Error('Nenhum dado de performance foi retornado pela API.')
    }

    return result
  } catch (error) {
    console.error(
      'Erro ao buscar dados de performance em fetchPerformanceData:',
      error,
    )
    throw error
  }
}

export const PerformanceView: React.FC = () => {
  const [data, setData] = useState<PerformanceWallets[]>([])
  const [loading, setLoading] = useState<boolean>(true) // Estado de loading

  useEffect(() => {
    setLoading(true)
    fetchPerformanceData()
      .then((res) => {
        setData(Object.values(res)) // Converte o objeto para array
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const columns = useMemo<ColumnDef<PerformanceWallets>[]>(
    () => [
      {
        accessorKey: 'user',
        header: 'Cliente',
      },
      {
        accessorKey: 'manager',
        header: 'Manager',
      },
      {
        accessorKey: 'investedAmount',
        header: 'Valor Investido',
        cell: (info) => (
          <span className="text-slate-300">
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
        cell: (info) => (
          <span className="font-medium">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(info.getValue<number>())}
          </span>
        ),
      },
      {
        accessorKey: 'performance',
        header: 'Performance',
        cell: (info) => {
          const value = info.getValue<number>()
          const formattedPerformance = (value * 100).toFixed(2)
          const textColor = value >= 0 ? 'text-green-400' : 'text-red-400'
          return (
            <span className={`font-semibold ${textColor}`}>
              {value >= 0 ? '+' : ''}
              {formattedPerformance}%
            </span>
          )
        },
      },
      {
        accessorKey: 'benchmark',
        header: 'Benchmark',
      },
    ],
    [],
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (loading) {
    return (
      <div className="p-4 text-center text-slate-400 sm:p-6">
        Carregando dados da tabela...
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-neutral-900 p-4 text-slate-100 sm:p-6">
      <h2 className="mb-6 text-2xl font-bold text-slate-100 sm:text-3xl">
        Performance das carteiras
      </h2>
      <main>
        <div className="items-center overflow-x-auto rounded-lg border border-neutral-700 shadow-lg">
          {' '}
          {/* Container para scroll horizontal em telas pequenas e borda/sombra */}
          <table className="min-w-full divide-y divide-neutral-700">
            <thead className="bg-neutral-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      scope="col" // Adicionado para acessibilidade
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-300 sm:px-6 sm:py-3.5 sm:text-sm"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
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
                      className="whitespace-nowrap px-4 py-3 text-sm text-slate-200 sm:px-6 sm:py-4"
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
        {data.length === 0 && !loading && (
          <p className="mt-6 text-center text-slate-500">
            Nenhum dado de performance encontrado.
          </p>
        )}
      </main>
    </div>
  )
}
