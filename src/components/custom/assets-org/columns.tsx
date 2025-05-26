'use client'

import { ColumnDef } from '@tanstack/react-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import {
  EyeOffIcon,
  MoreHorizontal,
  PencilIcon,
  TriangleAlert,
} from 'lucide-react'
import { Button } from '../../ui/button'
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
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { disableAssetOrg } from '@/services/managementService'
import { useSignalStore } from '@/store/signalEffect'

import Price from './cellAction/price'

export type AssetOrgs = {
  id: string
  asset: {
    urlImage: string
    name: string
  }
  price: number
  appearances: string
  porcentOfApp: string
  quantSLowRisk: string
  quantLowRisk: string
  quantStandard: string
  quantHighRisk: string
  quantSHighRisk: string
  priceChange?: number
}

// Componente para o botão de desabilitar
function DisableAssetButton({ assetData }: { assetData: AssetOrgs }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()
  const [signal, setSignal] = useSignalStore((state) => [
    state.signal,
    state.setSignal,
  ])

  const handleDisableAsset = async () => {
    setIsLoading(true)
    try {
      await disableAssetOrg(assetData.id)

      toast({
        className: 'bg-green-500 border-0 text-white',
        title: 'Asset disabled successfully!',
        description: `${assetData.asset.name} has been disabled for the organization.`,
      })

      // Atualizar a lista de ativos - triggering uma nova busca
      setSignal(!signal)
      setIsOpen(false)
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Please try again later.'

      toast({
        className: 'bg-red-500 border-0 text-white',
        title: 'Cannot disable asset',
        description: errorMessage,
        duration: 5000, // Mostrar por mais tempo
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex justify-center gap-3 bg-white text-black hover:bg-black hover:text-white">
          <EyeOffIcon className="w-5" /> Disable
        </Button>
      </DialogTrigger>
      <DialogContent className="border-0 text-black dark:bg-[#1C1C1C] dark:text-white">
        <DialogHeader>
          <DialogTitle className="mb-5 flex items-center gap-5">
            Disable asset{' '}
            <TriangleAlert className="w-5 text-red-600 dark:text-yellow-400" />
          </DialogTitle>
          <DialogDescription>
            Disable the{' '}
            <span className="font-bold text-black dark:text-white">
              {assetData.asset.name}
            </span>{' '}
            for your organization
            <div className="mt-4 rounded bg-yellow-100 p-4 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              <p className="mb-2 font-semibold">⚠️ Warning:</p>
              <p className="text-sm">
                You are about to disable this crypto asset from your
                organization. This action will:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                <li>Remove the asset from available assets list</li>
                <li>Prevent new wallets from using this asset</li>
                <li>Keep existing wallet data intact</li>
              </ul>
              <p className="mt-2 text-sm font-medium">
                Note: This asset cannot be disabled if it&apos;s currently being
                used by any wallets.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              className="bg-gray-200 text-black hover:bg-gray-100 hover:text-black"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleDisableAsset}
            disabled={isLoading}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isLoading ? 'Disabling...' : 'Disable Asset'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const columnsAssetOrg: ColumnDef<AssetOrgs>[] = [
  {
    accessorKey: 'asset',
    header: () => <div className="text-center">Asset</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-start pl-4">
        <img
          src={row.original.asset.urlImage}
          alt={row.original.asset.name}
          className="mr-2 h-6 w-6"
        />
        <span>{row.original.asset.name}</span>
      </div>
    ),
  },
  {
    accessorKey: 'price',
    header: () => <div className="text-center">Price</div>,
    cell: ({ row }) => <Price row={row.original} />,
  },
  {
    accessorKey: 'appearances',
    header: () => <div className="text-center">Appearances</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.appearances}</div>
    ),
  },
  {
    accessorKey: 'porcentOfApp',
    header: () => <div className="text-center">% of App.</div>,
    cell: ({ row }) => {
      const percent = parseFloat(row.original.porcentOfApp)
      return (
        <div className="text-center">
          {percent ? percent.toFixed(2) + '%' : '0%'}
        </div>
      )
    },
  },
  {
    accessorKey: 'quantSLowRisk',
    header: () => <div className="text-center">Qty. S. Low Risk</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.quantSLowRisk}</div>
    ),
  },
  {
    accessorKey: 'quantLowRisk',
    header: () => <div className="text-center">Qty. Low Risk</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.quantLowRisk}</div>
    ),
  },
  {
    accessorKey: 'quantStandard',
    header: () => <div className="text-center">Qty. Standard</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.quantStandard}</div>
    ),
  },
  {
    accessorKey: 'quantHighRisk',
    header: () => <div className="text-center">Qty. High Risk</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.quantHighRisk}</div>
    ),
  },
  {
    accessorKey: 'quantSHighRisk',
    header: () => <div className="text-center">Qty. S. High Risk</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.quantSHighRisk}</div>
    ),
  },
  {
    id: 'actions',
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const uuidAssetOrganization = row.original
      return (
        <div className="text-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="border-0 bg-white text-black"
              align="center"
            >
              <div className="flex flex-col">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex justify-center gap-3 border-b border-[#D4D7E3] bg-white text-black hover:bg-black hover:text-white">
                      <PencilIcon className="w-5" /> Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="border-0 dark:bg-[#1C1C1C] dark:text-white">
                    <DialogHeader>
                      <DialogTitle className="dakr:text-white">
                        Edit asset{' '}
                        <span className="text-yellow-500">
                          {uuidAssetOrganization.asset.name}
                        </span>
                      </DialogTitle>
                      <DialogDescription>
                        Now you are editing information about{' '}
                        {uuidAssetOrganization.asset.name} in your organization
                        <div className="mt-5 flex items-center space-x-4">
                          <div className="space-y-2">
                            <h1 className="text-2xl text-black dark:text-white">
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
                        <Button className="bg-red-500 text-white hover:bg-red-600">
                          Close
                        </Button>
                      </DialogClose>
                      <Button
                        disabled
                        className="bg-green-500 text-black hover:bg-green-600"
                      >
                        Save
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <DisableAssetButton assetData={uuidAssetOrganization} />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
