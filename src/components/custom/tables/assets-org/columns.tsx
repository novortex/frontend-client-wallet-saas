'use client'

import { ColumnDef } from '@tanstack/react-table'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Skeleton } from '@/components/ui/skeleton'

import {
  EyeOffIcon,
  MoreHorizontal,
  PencilIcon,
  TriangleAlert,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type AssetOrgs = {
  id: string
  asset: {
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
      const uuidAssetOrganization = row.original

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
            <div className="flex flex-col">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="flex justify-center gap-3 border-b border-[#D4D7E3] hover:bg-black hover:text-white"
                    variant="secondary"
                  >
                    <PencilIcon className="w-5" /> Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1C1C1C] border-0 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Edit asset{' '}
                      <span className="text-yellow-500">
                        {uuidAssetOrganization.asset.name}
                      </span>
                    </DialogTitle>
                    <DialogDescription>
                      Now you are editing information about{' '}
                      {uuidAssetOrganization.asset.name} in your organization
                      <div className="flex items-center space-x-4 mt-5">
                        <div className="space-y-2">
                          <h1 className="text-2xl text-white">
                            This feature is coming!!
                          </h1>
                          <Skeleton className="h-10 w-[250px]" />
                          <Skeleton className="h-10 w-[250px]" />
                        </div>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button className="bg-red-500 hover:bg-red-600 text-white">
                        Close
                      </Button>
                    </DialogClose>
                    <Button
                      disabled
                      className="bg-green-500 hover:bg-green-600 text-black"
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="flex justify-center gap-3 hover:bg-black hover:text-white"
                    variant="secondary"
                  >
                    <EyeOffIcon className="w-5" /> Disable
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1C1C1C] border-0 text-white">
                  <DialogHeader>
                    <DialogTitle className="flex gap-5 items-center mb-5">
                      Disabled asset{' '}
                      <TriangleAlert className="text-yellow-400 w-5" />
                    </DialogTitle>
                    <DialogDescription>
                      Disabled the{' '}
                      <span className="font-bold text-white">
                        {uuidAssetOrganization.asset.name}
                      </span>{' '}
                      for all wallets
                      <p className="mt-5 font-bold text-yellow-200">
                        Warning: You are about to disable this crypto asset for
                        all wallets. This action is irreversible and will affect
                        all users holding this asset. Please confirm that you
                        want to proceed with this operation.
                      </p>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button className="bg-red-500 hover:bg-red-600 text-white">
                        Close
                      </Button>
                    </DialogClose>
                    <Button
                      disabled
                      className="bg-blue-500 hover:bg-blue-600 text-black"
                    >
                      Disabled
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            {/* <DropdownMenuItem
              onClick={() => console.log(uuidAssetOrganization.id)}
              className="flex justify-center gap-3 border-b border-[#D4D7E3]"
            >
              <PencilIcon className="w-5" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="flex justify-center gap-3">
              <EyeOffIcon className="w-5" /> Disable
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
