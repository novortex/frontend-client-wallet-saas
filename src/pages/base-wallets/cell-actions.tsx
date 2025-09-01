import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import {
  MoreHorizontal,
  ArrowUpDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BaseWalletTarget } from '@/types/baseWallet.type'

export function BaseWalletCellActions({
  rowInfos,
  onEditAllocation,
}: {
  rowInfos: BaseWalletTarget
  onEditAllocation: (target: BaseWalletTarget) => void
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleClose = () => {
    setIsDropdownOpen(false)
  }

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-300 dark:hover:bg-[#171717]">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-32 rounded-lg border border-gray-200 bg-white p-0"
      >
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-black transition-colors hover:bg-black hover:text-white focus:bg-black focus:text-white"
          onClick={(e) => {
            e.stopPropagation()
            console.log('Dropdown item clicked, rowInfos:', rowInfos)
            try {
              onEditAllocation(rowInfos)
              handleClose()
            } catch (error) {
              console.error('Error in dropdown click handler:', error)
            }
          }}
        >
          <ArrowUpDown className="h-4 w-4" />
          <span>Allocation</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}