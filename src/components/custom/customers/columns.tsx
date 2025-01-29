'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CellActions from './cell-action'

// Define the shape of our data
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

export const columnsCustomerOrg: ColumnDef<CustomersOrganization>[] =
  [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ getValue }) => {
        const phone = getValue<string | null>()
        return phone ?? ' - '
      },
    },
    {
      accessorKey: 'active',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(
                column.getIsSorted() === 'asc'
              )
            }
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ getValue }) => {
        const active = getValue<boolean>()
        return (
          <span
            className={`px-2 py-1 rounded-full text-white ${active ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {active ? 'Active' : 'Inactive'}
          </span>
        )
      },
    },
    {
      accessorKey: 'isWallet',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(
                column.getIsSorted() === 'asc'
              )
            }
          >
            Stage
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ getValue }) => {
        const isWallet = getValue<boolean>()
        return (
          <span
            className={`px-2 py-1 rounded-full text-white ${isWallet ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {isWallet
              ? 'Completed'
              : 'Need Wallet'}
          </span>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <CellActions rowInfos={row.original} />
      ),
    },
  ]
