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

import { EyeOffIcon, MoreHorizontal, PencilIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type AssetOrgs = {
  id: string
  active: {
    urlImage: string
    name: string
  }
  price: string
  appearances: string
  porcentOfApp: string
  quantSLowRisk: string
  quantLowRisk: string
  quantStandard: string
}

export const columnsAssetOrg: ColumnDef<AssetOrgs>[] = [
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
    accessorKey: 'price',
    header: 'Price',
  },
  {
    accessorKey: 'appearances',
    header: 'Appearances',
  },
  {
    accessorKey: 'porcentOfApp',
    header: '% of App.',
  },
  {
    accessorKey: 'quantSLowRisk',
    header: 'Qty. S. Low Risk',
  },
  {
    accessorKey: 'quantLowRisk',
    header: 'Qty. Low Risk',
  },
  {
    accessorKey: 'quantStandard',
    header: 'Qty. Standard',
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
            <DropdownMenuItem className="flex justify-center gap-3 border-b border-[#D4D7E3]">
              <PencilIcon className="w-5" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="flex justify-center gap-3">
              <EyeOffIcon className="w-5" /> Disable
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
