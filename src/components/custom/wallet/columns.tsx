'use client'

import { ColumnDef } from '@tanstack/react-table'
import { CellActions } from './cellAction'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export type ClientActive = {
  id: string
  asset: {
    urlImage: string
    name: string
  }
  currentAmount: number
  assetQuantity: number
  price: number
  allocation: number
  idealAllocation: number
  idealAmount: number
  buyOrSell: number
  averagePrice: number
  profitLoss: number
}

export const createColumns = (
  fetchData: () => void,
): ColumnDef<ClientActive>[] => [
  {
    accessorKey: 'asset',
    header: () => <div className="text-center">Asset</div>,
    cell: ({ row }) => (
      <div className="justify-left ml-6 flex items-center">
        <img
          src={row.original.asset.urlImage}
          alt={row.original.asset.name}
          className="mr-2 h-6 w-6"
        />
        <span>{row.original.asset.name}</span>
      </div>
    ),
    filterFn: (row, _columnId, filterValue) => {
      return row.original.asset.name
        .toLowerCase()
        .includes(filterValue.toLowerCase())
    },
  },
  {
    accessorKey: 'currentAmount',
    header: () => <div className="text-center">Invested Amount</div>,
    cell: ({ row }) => {
      const value = Number(row.original.currentAmount)
      return (
        <div className="text-center">
          {!isNaN(value) ? value.toFixed(2) : 'N/A'}
        </div>
      )
    },
  },
  {
    accessorKey: 'assetQuantity',
    header: () => <div className="text-center">Quantity</div>,
    cell: ({ row }) => {
      const value = Number(row.original.assetQuantity)
      return (
        <div className="text-center">
          {!isNaN(value) ? value.toFixed(6) : 'N/A'}
        </div>
      )
    },
  },
  {
    accessorKey: 'price',
    header: () => <div className="text-center">Price</div>,
    cell: ({ row }) => {
      const value = Number(row.original.price)
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [prevPrice, setPrevPrice] = useState(value)
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [highlight, setHighlight] = useState<'up' | 'down' | null>(null)

      // Efeito para detectar mudanças de preço e aplicar highlight
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        if (value !== prevPrice) {
          // Determinar se o preço subiu ou desceu
          setHighlight(value > prevPrice ? 'up' : 'down')

          // Salvar o novo preço como referência
          setPrevPrice(value)

          // Remover o highlight após 2 segundos
          const timer = setTimeout(() => {
            setHighlight(null)
          }, 2000)

          return () => clearTimeout(timer)
        }
      }, [value, prevPrice])

      return (
        <div
          className={`flex items-center justify-center text-center transition-colors duration-500 ${
            highlight === 'up'
              ? 'text-green-600 dark:text-green-400'
              : highlight === 'down'
                ? 'text-red-600 dark:text-red-400'
                : ''
          }`}
        >
          {highlight === 'up' && (
            <ArrowUp className="mr-1 h-4 w-4 text-green-600 dark:text-green-400" />
          )}
          {highlight === 'down' && (
            <ArrowDown className="mr-1 h-4 w-4 text-red-600 dark:text-red-400" />
          )}
          {value ? `U$ ${value.toFixed(2)}` : 'N/A'}
        </div>
      )
    },
  },
  {
    accessorKey: 'allocation',
    header: () => <div className="text-center">Allocation</div>,
    cell: ({ row }) => {
      const value = Number(row.original.allocation)
      return (
        <div className="text-center">
          {!isNaN(value) ? `${value.toFixed(2)}%` : 'N/A'}
        </div>
      )
    },
  },
  {
    id: 'idealAllocation',
    accessorKey: 'idealAllocation',
    header: ({ column, table }) => {
      const total = table
        .getRowModel()
        .rows.reduce((sum, row) => sum + row.original.idealAllocation, 0)
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="pl-0"
        >
          Ideal Allocation ({total.toFixed(2)}%)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = Number(row.original.idealAllocation)
      return (
        <div className="text-center">
          {!isNaN(value) ? `${value.toFixed(2)}%` : 'N/A'}
        </div>
      )
    },
  },
  {
    accessorKey: 'idealAmount',
    header: () => <div className="text-center">Ideal Amount</div>,
    cell: ({ row }) => {
      const value = Number(row.original.idealAmount)
      return (
        <div className="text-center">
          {!isNaN(value) ? value.toFixed(2) : 'N/A'}
        </div>
      )
    },
  },
  {
    accessorKey: 'buyOrSell',
    header: () => <div className="text-center">Buy/Sell</div>,
    cell: ({ row }) => {
      const value = Number(row.original.buyOrSell)
      const formattedValue =
        value > 0
          ? `+${Number(row.original.buyOrSell).toFixed(2)}`
          : Number(row.original.buyOrSell).toFixed(2)
      const textColor =
        isNaN(value) || value === 0
          ? 'text-gray-400'
          : value > 0
            ? 'text-green-400'
            : 'text-red-500'
      return (
        <div className={`text-center ${textColor}`}>
          {!isNaN(value) ? formattedValue : 'N/A'}
        </div>
      )
    },
  },
  {
    accessorKey: 'averagePrice',
    header: () => <div className="text-center">Average Price</div>,
    cell: ({ row }) => {
      const value = Number(row.original.averagePrice)
      const textColor = isNaN(value) ? 'text-gray-600' : value > 0 ? '' : ''
      return (
        <div className={`text-center ${textColor}`}>
          {!isNaN(value) ? value.toFixed(2) : 'N/A'}
        </div>
      )
    },
  },
  {
    accessorKey: 'profitLoss',
    header: () => <div className="text-center">P/L</div>,
    cell: ({ row }) => {
      const value = Number(row.original.profitLoss)
      const formattedValue =
        value > 0
          ? `+${Number(row.original.profitLoss).toFixed(2)}`
          : Number(row.original.profitLoss).toFixed(2)
      const textColor =
        isNaN(value) || value === 0
          ? 'text-gray-400'
          : value > 0
            ? 'text-green-400'
            : 'text-red-500'
      return (
        <div className={`text-center ${textColor}`}>
          {!isNaN(value) ? formattedValue : 'N/A'}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <CellActions rowInfos={row.original} fetchData={fetchData} />
    ),
  },
]
