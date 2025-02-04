import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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

export default function RelateClientModal({ isOpen, onClose }: RelateClientModalProps) {
  const [selectedManager, setSelectedManager] = React.useState('Select a manager')

  const handleAddManager = () => {
    console.log('Selected Manager:', selectedManager)

    setSelectedManager('Select a manager')

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-1/3 w-[200%] bg-[#131313] text-[#fff]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#fff]">Select a manager</DialogTitle>
        </DialogHeader>
        <div className="w-full flex flex-col gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full h-full bg-[#272727] border-[#323232] text-[#959CB6] flex justify-start">
                {selectedManager}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full bg-[#272727] border-[#323232] text-[#959CB6]">
              <DropdownMenuLabel>Managers</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {managers.map((manager, index) => (
                <DropdownMenuItem key={index} onClick={() => setSelectedManager(manager.name)}>
                  {manager.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="w-full flex flex-row gap-3 items-center">
            <Checkbox className="border-[#ffffff]" />
            <label htmlFor="addMyself" className="text-[#fff]">
              Add myself
            </label>
          </div>
        </div>
        <DialogFooter className="flex justify-end items-end">
          <Button className="bg-[#1877F2] w-1/4 hover:bg-blue-600 p-5" onClick={handleAddManager}>
            Add Customer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
