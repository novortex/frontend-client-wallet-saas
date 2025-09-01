import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { CustomersOrganization } from '@/components/custom/customers/columns'
import { updateCustomerManager } from '@/services/managementService'
import { useSignalStore } from '@/store/signalEffect'

interface SelectManagerModalProps {
  customer: CustomersOrganization
  managers: { name: string; uuid: string }[]
  isOpen: boolean
  onClose: () => void
}

export function SelectManagerModal({ customer, managers, isOpen, onClose }: SelectManagerModalProps) {
  const [selectedManager, setSelectedManager] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [, setSignal] = useSignalStore((state) => [state.signal, state.setSignal])

  const handleSaveManager = async () => {
    if (!selectedManager) {
      toast({
        className: 'toast-error',
        title: 'Error',
        description: 'Please select a manager',
        duration: 6000,
      })
      return
    }

    setIsLoading(true)
    try {
      await updateCustomerManager(customer.id, selectedManager)
      
      toast({
        className: 'toast-success',
        title: 'Success',
        description: 'Manager assigned successfully',
        duration: 4000,
      })
      
      setSignal(true)
      onClose()
      setSelectedManager('')
    } catch (error) {
      toast({
        className: 'toast-error',
        title: 'Error',
        description: 'Failed to assign manager',
        duration: 6000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] dark:bg-[#131313] dark:border-[#323232]">
        <DialogHeader>
          <DialogTitle className="dark:text-white">
            Assign Manager to {customer.name}
          </DialogTitle>
          <DialogDescription className="dark:text-[#959CB6]">
            Select a manager for this customer's wallet.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="manager" className="text-right dark:text-white">
              Manager
            </Label>
            <div className="col-span-3">
              <Select
                value={selectedManager}
                onValueChange={setSelectedManager}
              >
                <SelectTrigger className="dark:border-[#323232] dark:bg-[#131313] dark:text-white">
                  <SelectValue placeholder="Select a manager" />
                </SelectTrigger>
                <SelectContent className="dark:border-[#323232] dark:bg-[#131313] dark:text-white">
                  {managers.map((manager) => (
                    <SelectItem key={manager.uuid} value={manager.uuid}>
                      {manager.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="dark:border-[#323232] dark:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveManager}
            disabled={isLoading}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            {isLoading ? 'Saving...' : 'Assign Manager'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}