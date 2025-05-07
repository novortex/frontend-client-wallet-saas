import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { TriangleAlert } from 'lucide-react'
import { deleteCustomer } from '@/services/managementService'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Loading } from '@/components/custom/loading'

interface DisableCustomerModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  customerUuid: string
}

export function DisableCustomerModal({
  isOpen,
  onOpenChange,
  customerUuid,
}: DisableCustomerModalProps) {
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)

  const handleDisableCustomer = async () => {
    setLoading(true)

    toast({
      className: 'bg-yellow-500 border-0',
      title: 'Processing disable customer request...',
    })

    try {
      await deleteCustomer(customerUuid)

      toast({
        className: 'bg-green-500 border-0',
        title: 'Sucessfuly disable customer!',
      })

      onOpenChange(false)
    } catch (error) {
      console.error(error)
      toast({
        className: 'bg-red-500 border-0',
        title: 'Error on disabling customer.',
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading data-testid="loading-component" />

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="border-0 dark:bg-[#1C1C1C] dark:text-white">
        <DialogHeader>
          <DialogTitle className="mb-5 flex items-center gap-5">
            Disabled Customer{' '}
            <TriangleAlert 
              className="w-5 text-red-600 dark:text-yellow-400" 
              data-testid="triangle-alert-icon"
            />
          </DialogTitle>
          <DialogDescription>
            <p className="m-4 rounded bg-gray-300 p-4 font-bold text-red-600 dark:bg-transparent dark:text-yellow-200">
              Warning: You are about to disable this customer and all his data.
              This action is irreversible . Please confirm that you want to
              proceed with this operation.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button 
              className="bg-gray-200 text-black hover:bg-gray-100 hover:text-black"
              data-testid="modal-close-button"
            >
              Close
            </Button>
          </DialogClose>
          <Button
            onClick={() => handleDisableCustomer()}
            className="bg-blue-500 text-black hover:bg-blue-600"
            data-testid="confirm-disable-button"
          >
            Confirm disabling
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
