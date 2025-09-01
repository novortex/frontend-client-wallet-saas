'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BaseWalletTarget } from '@/types/baseWallet.type'
import { BaseWalletCellActions } from './cell-actions'

export const createBaseWalletColumns = (
  onEditAllocation: (target: BaseWalletTarget) => void
): ColumnDef<BaseWalletTarget>[] => [
  {
    accessorKey: 'asset',
    header: () => <div className="text-left ml-6">Ativo</div>,
    cell: ({ row }) => (
      <div className="justify-left ml-6 flex items-center py-3">
        {(row.original.asset as any)?.icon && (
          <img
            src={(row.original.asset as any).icon}
            alt={row.original.asset?.name || 'Asset'}
            className="mr-2 h-6 w-6 rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
        )}
        <span>{row.original.asset?.symbol || row.original.asset?.name || 'Ativo não encontrado'}</span>
        {row.original.asset?.name && (
          <span className="ml-2 text-sm text-muted-foreground">
            ({row.original.asset.name})
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'price',
    header: () => <div className="text-center">Preço</div>,
    cell: ({ row }) => {
      const asset = (row.original.asset as any)
      const price = asset?.price
      return (
        <div className="text-center py-3">
          {price ? `$${Number(price).toFixed(2)}` : 'N/A'}
        </div>
      )
    },
  },
  {
    accessorKey: 'idealAllocation',
    header: ({ column, table }) => {
      const total = table
        .getRowModel()
        .rows.reduce((sum, row) => sum + row.original.idealAllocation, 0)
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="pl-0 justify-center w-full"
        >
          Alocação Ideal ({total.toFixed(2)}%)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = Number(row.original.idealAllocation)
      return (
        <div className="text-center py-3">
          {!isNaN(value) ? `${value.toFixed(2)}%` : 'N/A'}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <BaseWalletCellActions 
        rowInfos={row.original} 
        onEditAllocation={onEditAllocation}
      />
    ),
  },
]