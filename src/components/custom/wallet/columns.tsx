'use client'

import { ColumnDef } from '@tanstack/react-table'
import { CellActions } from './cellAction'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
  avaragePrice: number
  profitLoss: number
}

export const createColumns = (fetchData: () => void): ColumnDef<ClientActive>[] => [
  {
    accessorKey: 'asset',
    header: () => <div className="text-center">Asset</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <img src={row.original.asset.urlImage} alt={row.original.asset.name} className="w-6 h-6 mr-2" />
        <span>{row.original.asset.name}</span>
      </div>
    ),
    filterFn: (row, _columnId, filterValue) => {
      return row.original.asset.name.toLowerCase().includes(filterValue.toLowerCase())
    },
  },
  {
    accessorKey: 'currentAmount',
    header: () => <div className="text-center">Invested Amount</div>,
    cell: ({ row }) => {
      const value = Number(row.original.currentAmount)
      return <div className="text-center">{!isNaN(value) ? value.toFixed(2) : 'N/A'}</div>
    },
  },
  {
    accessorKey: 'assetQuantity',
    header: () => <div className="text-center">Quantity</div>,
    cell: ({ row }) => {
      const value = Number(row.original.assetQuantity)
      return <div className="text-center">{!isNaN(value) ? value.toFixed(6) : 'N/A'}</div>
    },
  },
  {
    accessorKey: 'price',
    header: () => <div className="text-center">Price</div>,
    cell: ({ row }) => {
      const value = Number(row.original.price)
      return <div className="text-center">{!isNaN(value) ? value.toFixed(2) : 'N/A'}</div>
    },
  },
  {
    accessorKey: 'allocation',
    header: () => <div className="text-center">Current Allocation</div>,
    cell: ({ row }) => {
      const value = Number(row.original.allocation)
      return <div className="text-center">{!isNaN(value) ? `${value.toFixed(2)}%` : 'N/A'}</div>
    },
  },
  {
    id: 'idealAllocation',
    accessorKey: 'idealAllocation',
    header: ({ column, table }) => {
      const total = table.getRowModel().rows.reduce((sum, row) => sum + row.original.idealAllocation, 0)
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="pl-0">
          Ideal Allocation ({total.toFixed(2)}%)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = Number(row.original.idealAllocation)
      return <div className="text-center">{!isNaN(value) ? `${value.toFixed(2)}%` : 'N/A'}</div>
    },
  },
  {
    accessorKey: 'idealAmount',
    header: () => <div className="text-center">Ideal Amount</div>,
    cell: ({ row }) => {
      const value = Number(row.original.idealAmount)
      return <div className="text-center">{!isNaN(value) ? value.toFixed(2) : 'N/A'}</div>
    },
  },
  {
    accessorKey: 'buyOrSell',
    header: () => <div className="text-center">Buy/Sell</div>,
    cell: ({ row }) => {
      const value = Number(row.original.buyOrSell)
      const textColor =
        isNaN(value) || value === 0 ? 'text-gray-600' : value > 0 ? 'text-green-400' : 'text-red-500'
      return <div className={`text-center ${textColor}`}>{!isNaN(value) ? value.toFixed(2) : 'N/A'}</div>
    },
  },
  {
    accessorKey: 'avaragePrice',
    header: () => <div className="text-center">Average Price</div>,
    cell: ({ row }) => {
      const value = Number(row.original.avaragePrice)
      const textColor =
        isNaN(value) ? 'text-gray-600' : value > 0 ? '' : ''
      return <div className={`text-center ${textColor}`}>{!isNaN(value) ? value.toFixed(2) : 'N/A'}</div>
    },
  },
  {
    accessorKey: 'profitLoss',
    header: () => <div className="text-center">P/L</div>,
    cell: ({ row }) => {
      const value = Number(row.original.profitLoss)
      const textColor =
        isNaN(value) || value === 0 ? 'text-gray-600' : value > 0 ? 'text-green-500' : 'text-red-500'
      return <div className={`text-center ${textColor}`}>{!isNaN(value) ? value.toFixed(2) : 'N/A'}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellActions rowInfos={row.original} fetchData={fetchData} />,
  },
]
