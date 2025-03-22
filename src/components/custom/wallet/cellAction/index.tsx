import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import {
  EyeOffIcon,
  DollarSign,
  MoreHorizontal,
  ArrowUpDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ClientActive } from '../columns'
import { TradeDialog } from './TradeDialog'
import { AllocationDialog } from './AllocationDialog'
import { DisableDialog } from './disableDialog'
import { useWalletActions } from './useWalletActions'

export function CellActions({
  rowInfos,
  fetchData,
}: {
  rowInfos: ClientActive
  fetchData: () => void
}) {
  const [isTradeDialogOpen, setIsTradeDialogOpen] = useState(false)
  const [isAllocationDialogOpen, setIsAllocationDialogOpen] = useState(false)
  const [isDisableDialogOpen, setIsDisableDialogOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { handleDeleteAssetWallet } = useWalletActions(rowInfos, fetchData)

  const handleClose = () => {
    setIsDropdownOpen(false)
  }

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-32 rounded-lg border border-gray-200 bg-white p-0"
      >
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-black transition-colors hover:bg-black hover:text-white focus:bg-black focus:text-white"
          onClick={() => {
            setIsAllocationDialogOpen(true)
            handleClose()
          }}
        >
          <ArrowUpDown className="h-4 w-4" />
          <span>Allocation</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-black transition-colors hover:bg-black hover:text-white focus:bg-black focus:text-white"
          onClick={() => {
            setIsTradeDialogOpen(true)
            handleClose()
          }}
        >
          <DollarSign className="h-4 w-4" />
          <span>Trade</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-black transition-colors hover:bg-black hover:text-white focus:bg-black focus:text-white"
          onClick={() => {
            setIsDisableDialogOpen(true)
            handleClose()
          }}
        >
          <EyeOffIcon className="h-4 w-4" />
          <span>Disable</span>
        </DropdownMenuItem>
      </DropdownMenuContent>

      {isTradeDialogOpen && (
        <TradeDialog
          isOpen={isTradeDialogOpen}
          onOpenChange={setIsTradeDialogOpen}
          rowInfos={rowInfos}
          fetchData={fetchData}
        />
      )}

      {isAllocationDialogOpen && (
        <AllocationDialog
          isOpen={isAllocationDialogOpen}
          onOpenChange={setIsAllocationDialogOpen}
          rowInfos={rowInfos}
          fetchData={fetchData}
        />
      )}

      {isDisableDialogOpen && (
        <DisableDialog
          isOpen={isDisableDialogOpen}
          onOpenChange={setIsDisableDialogOpen}
          rowInfos={rowInfos}
          onDisable={handleDeleteAssetWallet}
        />
      )}
    </DropdownMenu>
  )
}
