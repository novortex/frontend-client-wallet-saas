'use client'

import { ColumnDef } from '@tanstack/react-table'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  //   DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ClientActive = {
  id: string
  active: {
    urlImage: string
    name: string
  }
  qtyInCript: number
  inputData: string
  entryValue: string
  currentValue: string
  optimalValue: string
  optimalAllocation: string
  currentAllocation: string
}

export const columns: ColumnDef<ClientActive>[] = [
  {
    accessorKey: 'active',
    header: 'Active',
    cell: ({ row }) => (
      <div className="flex items-center">
        <img
          src={row.original.active.urlImage}
          alt={row.original.active.name}
          className="w-6 h-6 mr-2"
        />
        <span>{row.original.active.name}</span>
      </div>
    ),
  },
  {
    accessorKey: 'qtyInCript',
    header: 'Qty. in Cript',
  },
  {
    accessorKey: 'inputData',
    header: 'input data',
  },
  {
    accessorKey: 'entryValue',
    header: 'Entry value',
  },
  {
    accessorKey: 'currentValue',
    header: 'Current value',
  },
  {
    accessorKey: 'optimalValue',
    header: 'Optimal value',
  },
  {
    accessorKey: 'optimalAllocation',
    header: 'Optimal allocation',
  },
  {
    accessorKey: 'currentAllocation',
    header: 'Current allocation',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-white border-0 text-black"
            align="center"
          >
            {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
            {/* <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy active ID
            </DropdownMenuItem> */}
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Disable</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
