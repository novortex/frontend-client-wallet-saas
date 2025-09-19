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
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

interface MandatorySelectManagerModalProps {
  customer: CustomersOrganization
  managers: { name: string; uuid: string }[]
  isOpen: boolean
  onClose: () => void
}

export function MandatorySelectManagerModal({
  customer,
  managers,
  isOpen,
  onClose,
}: MandatorySelectManagerModalProps) {
  const [selectedManager, setSelectedManager] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [, setSignal] = useSignalStore((state) => [
    state.signal,
    state.setSignal,
  ])
  const navigate = useNavigate()

  // Debug logs
  console.log('MandatorySelectManagerModal - managers:', managers)
  console.log('MandatorySelectManagerModal - managers length:', managers?.length)
  console.log('MandatorySelectManagerModal - customer object:', customer)
  console.log('MandatorySelectManagerModal - customer.id:', customer.id)

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

    if (!customer.id) {
      console.error('Customer ID is missing:', customer)
      toast({
        className: 'toast-error',
        title: 'Error',
        description: 'Customer ID is missing. Please try again.',
        duration: 6000,
      })
      return
    }

    console.log('Attempting to update manager for customer:', customer.id)
    console.log('Selected manager:', selectedManager)

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
      setSelectedManager('')
      onClose()
      
      // Recarrega a página para buscar os dados atualizados
      setTimeout(() => {
        window.location.reload()
      }, 1000)
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

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="dark:border-[#323232] dark:bg-[#131313] sm:max-w-[500px]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-center dark:text-white">
            Manager Required
          </DialogTitle>
          <DialogDescription className="text-center dark:text-[#959CB6]">
            A manager must be assigned to {customer.name}'s wallet before you
            can access this page.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-yellow-900/20">
              <svg
                className="h-8 w-8 text-orange-600 dark:text-orange-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.382 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
              Please select a manager to continue or go back to the previous
              page.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Label
              htmlFor="manager"
              className="text-left font-medium dark:text-white"
            >
              Select Manager
            </Label>
            <Select value={selectedManager} onValueChange={setSelectedManager}>
              <SelectTrigger className="dark:border-[#323232] dark:bg-[#131313] dark:text-white">
                <SelectValue placeholder="Choose a manager for this wallet" />
              </SelectTrigger>
              <SelectContent className="dark:border-[#323232] dark:bg-[#131313] dark:text-white">
                {managers && managers.length > 0 ? (
                  managers.map((manager) => (
                    <SelectItem key={manager.uuid} value={manager.uuid}>
                      {manager.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-managers" disabled>
                    No managers available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="flex items-center gap-2 hover:bg-gray-100 dark:border-[#323232] dark:text-white dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button
            onClick={handleSaveManager}
            disabled={
              isLoading ||
              !selectedManager ||
              !managers ||
              managers.length === 0
            }
            className="bg-blue-500 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Assigning...' : 'Assign Manager'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
