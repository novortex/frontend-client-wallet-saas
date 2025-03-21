'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CellActions from './cell-action'

export type CustomersOrganization = {
  id: string
  name: string
  active: boolean
  email: string
  phone: string | null
  isWallet: boolean
  walletUuid: string | null
  exchange: {
    exchangeUuid: string
    exchangeName: string
  } | null
  emailExchange: string | null
  emailPassword: string | null
  exchangePassword: string | null
  manager: {
    managerUuid: string
    managerName: string
  } | null
  performanceFee: number | null
  initialFeePaid: boolean | null
  contract: string | null
}

export const columnsCustomerOrg: ColumnDef<CustomersOrganization>[] = [
  {
    accessorKey: 'name',
    header: () => <div className="w-fit pl-10 text-left">Name</div>,
    cell: ({ row }) => (
      <div className="w-fit whitespace-nowrap pl-4 text-left">
        {row.original.name}
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: () => <div className="w-fit pl-20 text-left">Email</div>,
    cell: ({ row }) => (
      <div className="w-fit whitespace-nowrap pl-4 text-left">
        {row.original.email}
      </div>
    ),
  },
  {
    accessorKey: 'phone',
    header: () => <div className="text-center">Phone</div>,
    cell: ({ row }) => (
      <div className="whitespace-nowrap text-center">
        {row.original.phone ?? ' - '}
      </div>
    ),
  },
  {
    accessorKey: 'active',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="w-full"
      >
        <div className="flex w-full items-center justify-center text-center">
          Status <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      </Button>
    ),
    cell: ({ row }) => {
      const active = row.original.active
      return (
        <div className="text-center">
          <span
            className={`rounded-full px-2 py-1 text-white ${active ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {active ? 'Active' : 'Inactive'}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'isWallet',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="w-full"
      >
        <div className="flex w-full items-center justify-center text-center">
          Stage <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      </Button>
    ),
    cell: ({ row }) => {
      const isWallet = row.original.isWallet
      return (
        <div className="text-center">
          <span
            className={`rounded-full px-2 py-1 text-white ${isWallet ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {isWallet ? 'Completed' : 'Need Wallet'}
          </span>
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <CellActions rowInfos={row.original} />
      </div>
    ),
  },
]
