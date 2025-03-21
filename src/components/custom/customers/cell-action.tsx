import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  EyeOffIcon,
  MoreHorizontal,
  PencilIcon,
  StepForward,
} from 'lucide-react'
import CreateWalletModal from '../create-wallet-modal'
import { DisableCustomerModal } from '@/pages/customers/disable-customer-modal'
import { EditCustomerModal } from '@/pages/customers/edit-customer-modal'
import { CustomersOrganization } from './columns'

export default function CellActions({
  rowInfos,
}: {
  rowInfos: CustomersOrganization
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDisableDialogOpen, setIsDisableDialogOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleClose = () => {
    setIsDropdownOpen(false)
  }

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-gray-300 dark:hover:bg-[#171717]"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-32 rounded-lg border border-gray-200 bg-white p-0"
        >
          <DropdownMenuItem
            onClick={() => {
              setIsEditDialogOpen(true)
              handleClose()
            }}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-black transition-colors hover:bg-black hover:text-white focus:bg-black focus:text-white"
          >
            <PencilIcon className="h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>

          {rowInfos.isWallet === false && (
            <DropdownMenuItem
              onClick={() => {
                setIsModalOpen(true)
                handleClose()
              }}
              className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-black transition-colors hover:bg-black hover:text-white focus:bg-black focus:text-white"
            >
              <StepForward className="h-4 w-4" />
              <span>Continue</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={() => {
              setIsDisableDialogOpen(true)
              handleClose()
            }}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-black transition-colors hover:bg-black hover:text-white focus:bg-black focus:text-white"
          >
            <EyeOffIcon className="h-4 w-4" />
            <span>Disable</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditCustomerModal
        isOpen={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open)
          if (!open) setIsDropdownOpen(false)
        }}
        rowInfos={rowInfos}
      />

      <DisableCustomerModal
        isOpen={isDisableDialogOpen}
        onOpenChange={(open) => {
          setIsDisableDialogOpen(open)
          if (!open) setIsDropdownOpen(false)
        }}
      />

      <CreateWalletModal
        rowInfos={rowInfos}
        onClose={() => {
          setIsModalOpen(false)
          setIsDropdownOpen(false)
        }}
        isOpen={isModalOpen}
      />
    </>
  )
}
