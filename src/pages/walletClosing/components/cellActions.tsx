// components/CellActions.tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { WalletClosing } from '../types'

interface CellActionsProps {
  rowData: WalletClosing
}

export function CellActions({ rowData }: CellActionsProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
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
        className="w-40 rounded-lg border border-gray-200 bg-white p-0"
      >
        <DropdownMenuItem className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-black transition-colors hover:bg-black hover:text-white focus:bg-black focus:text-white">
          <span>View Details</span>
        </DropdownMenuItem>

        {!rowData.closingDate && (
          <DropdownMenuItem className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-black transition-colors hover:bg-black hover:text-white focus:bg-black focus:text-white">
            <span>Close Wallet</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-black transition-colors hover:bg-black hover:text-white focus:bg-black focus:text-white">
          <span>Export Report</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
