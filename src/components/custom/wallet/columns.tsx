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
}

export const createColumns = (
  fetchData: () => void,
): ColumnDef<ClientActive>[] => [
  {
    accessorKey: 'asset',
    header: 'Asset',
    cell: ({ row }) => (
      <div className="flex items-center">
        <img
          src={row.original.asset.urlImage}
          alt={row.original.asset.name}
          className="w-6 h-6 mr-2"
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
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="pl-0"
      >
        Invested amount
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const currentAmount = Number(row.original.currentAmount)
      return !isNaN(currentAmount) ? currentAmount.toFixed(2) : 'N/A'
    },
    sortingFn: 'basic',
    sortDescFirst: true,
  },
  {
    accessorKey: 'assetQuantity',
    header: 'Asset quantity',
    cell: ({ row }) => {
      const assetQuantity = Number(row.original.assetQuantity)
      return !isNaN(assetQuantity) ? assetQuantity.toFixed(6) : 'N/A'
    },
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      const price = Number(row.original.price)
      return !isNaN(price) ? price.toFixed(2) : 'N/A'
    },
  },
  {
    accessorKey: 'allocation',
    header: 'Allocation',
    cell: ({ row }) => {
      const allocation = Number(row.original.allocation)
      return !isNaN(allocation) ? allocation.toFixed(2) : 'N/A'
    },
  },
  {
    id: 'idealAllocation',
    accessorKey: 'idealAllocation',
    header: ({ column, table }) => {
      const idealAllocationSum = table
        .getRowModel()
        .rows.reduce((total, row) => total + row.original.idealAllocation, 0)

      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="pl-0"
        >
          Ideal allocation ({idealAllocationSum.toFixed(2)}%)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const idealAllocation = Number(row.original.idealAllocation)
      return !isNaN(idealAllocation) ? idealAllocation.toFixed(2) : 'N/A'
    },
    sortingFn: 'basic',
    sortDescFirst: true,
  },
  {
    accessorKey: 'idealAmount',
    header: 'Ideal amount',
    cell: ({ row }) => {
      const idealAmount = Number(row.original.idealAmount)
      return !isNaN(idealAmount) ? idealAmount.toFixed(2) : 'N/A'
    },
  },
  {
    accessorKey: 'buyOrSell',
    header: 'Buy/Sell',
    cell: ({ row }) => {
      const buyOrSell = Number(row.original.buyOrSell)
      return !isNaN(buyOrSell) ? buyOrSell.toFixed(2) : 'N/A'
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <CellActions rowInfos={row.original} fetchData={fetchData} />
    ),
  },
]
