'use client'

import { ColumnDef } from '@tanstack/react-table'

import CellActions from './cell-action'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ClientActive = {
  id: string
  asset: {
    urlImage: string
    name: string
  }
  investedAmount: number
  assetQuantity: number
  price: number
  allocation: number
  idealAllocation: number
  idealAmount: number
  buyOrSell: number
}

export const columns: ColumnDef<ClientActive>[] = [
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
  },
  {
    accessorKey: 'investedAmount',
    header: 'Invested amount',
  },
  {
    accessorKey: 'assetQuantity',
    header: 'Asset quantity',
  },
  {
    accessorKey: 'price',
    header: 'Price',
  },
  {
    accessorKey: 'allocation',
    header: 'Allocation',
  },
  {
    accessorKey: 'idealAllocation',
    header: 'Ideal allocation',
  },
  {
    accessorKey: 'idealAmount',
    header: 'Ideal amount',
  },
  {
    accessorKey: 'buyOrSell',
    header: 'Buy/Sell',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellActions rowInfos={row.original} />,
  },
]
