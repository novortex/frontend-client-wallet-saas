import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Link } from 'react-router-dom'

interface CellActionsProps {
  rowData: {
    id: string
  }
  onMarkAsDone: (id: string) => void
  loading: boolean
}

export function CellActions({
  rowData,
  onMarkAsDone,
  loading,
}: CellActionsProps) {
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
        className="w-48 rounded-lg border border-gray-200 bg-white p-0"
      >
        <Link to={`/clients/${rowData.id}/infos`}>
          <DropdownMenuItem className="flex cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm text-black transition-colors hover:bg-black hover:text-white focus:bg-black focus:text-white">
            <span className="w-full text-left">View wallet</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm text-black transition-colors hover:bg-black hover:text-white focus:bg-black focus:text-white"
          onClick={() => onMarkAsDone(rowData.id)}
          disabled={loading}
        >
          <span className="w-full text-left">Mark call as done</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
