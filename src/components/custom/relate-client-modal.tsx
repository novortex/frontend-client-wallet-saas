import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import * as React from 'react'

interface RelateClientModalProps {
  isOpen: boolean
  onClose: () => void
}

const managers = [{ name: 'Arthur' }, { name: 'Pedro' }, { name: 'Abner' }]

export default function RelateClientModal({
  isOpen,
  onClose,
}: RelateClientModalProps) {
  const [selectedManager, setSelectedManager] =
    React.useState('Select a manager')

  const handleAddManager = () => {
    console.log('Selected Manager:', selectedManager)

    setSelectedManager('Select a manager')

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-1/3 w-[200%] bg-[#131313] text-[#fff]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#fff]">
            Select a manager
          </DialogTitle>
        </DialogHeader>
        <div className="flex w-full flex-col gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex h-full w-full justify-start border-[#323232] bg-[#272727] text-[#959CB6]"
              >
                {selectedManager}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full border-[#323232] bg-[#272727] text-[#959CB6]">
              <DropdownMenuLabel>Managers</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {managers.map((manager, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => setSelectedManager(manager.name)}
                >
                  {manager.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex w-full flex-row items-center gap-3">
            <Checkbox className="border-[#ffffff]" />
            <label htmlFor="addMyself" className="text-[#fff]">
              Add myself
            </label>
          </div>
        </div>
        <DialogFooter className="flex items-end justify-end">
          <Button
            className="w-1/4 bg-[#1877F2] p-5 hover:bg-blue-600"
            onClick={handleAddManager}
          >
            Add Customer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
