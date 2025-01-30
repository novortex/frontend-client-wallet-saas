import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { EyeOffIcon, PencilIcon, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ClientActive } from '../columns'
import { EditDialog } from './editDialog'
import { DisableDialog } from './disableDialog'
import { useWalletActions } from './useWalletActions'

export function CellActions({
  rowInfos,
  fetchData,
}: {
  rowInfos: ClientActive
  fetchData: () => void
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDisableDialogOpen, setIsDisableDialogOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { handleUpdateInformationAssetWallet, handleDeleteAssetWallet } =
    useWalletActions(rowInfos, fetchData)

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
        className="bg-white rounded-lg w-32 p-0 border border-gray-200"
      >
        <DropdownMenuItem
          className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer hover:bg-black hover:text-white focus:bg-black focus:text-white transition-colors"
          onClick={() => {
            setIsEditDialogOpen(true)
            handleClose()
          }}
        >
          <PencilIcon className="h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer hover:bg-black hover:text-white focus:bg-black focus:text-white transition-colors"
          onClick={() => {
            setIsDisableDialogOpen(true)
            handleClose()
          }}
        >
          <EyeOffIcon className="h-4 w-4" />
          <span>Disable</span>
        </DropdownMenuItem>
      </DropdownMenuContent>

      {isEditDialogOpen && (
        <EditDialog
          isOpen={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open)
            if (!open) setIsDropdownOpen(false)
          }}
          rowInfos={rowInfos}
          onSave={handleUpdateInformationAssetWallet}
        />
      )}

      {isDisableDialogOpen && (
        <DisableDialog
          isOpen={isDisableDialogOpen}
          onOpenChange={(open) => {
            setIsDisableDialogOpen(open)
            if (!open) setIsDropdownOpen(false)
          }}
          rowInfos={rowInfos}
          onDisable={handleDeleteAssetWallet}
        />
      )}
    </DropdownMenu>
  )
}
