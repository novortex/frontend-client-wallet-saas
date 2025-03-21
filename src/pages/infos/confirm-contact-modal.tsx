import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { CircleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useParams } from 'react-router-dom'
import { useSignalStore } from '@/store/signalEffect'
import { confirmContactClient } from '@/services/managementService'

interface ConfirmContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ConfirmContactModal({
  isOpen,
  onClose,
}: ConfirmContactModalProps) {
  const { walletUuid } = useParams()
  const [setSignal, signal] = useSignalStore((state) => [
    state.setSignal,
    state.signal,
  ])

  const handleConfirmContact = async () => {
    try {
      if (walletUuid) {
        await confirmContactClient(walletUuid)

        if (!signal) {
          setSignal(true)
        } else {
          setSignal(false)
        }

        onClose()
      }
    } catch (error) {
      console.error('Erro ao confirmar contato do cliente:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-1/2 w-[200%] dark:bg-[#131313] dark:text-[#fff]">
        <DialogHeader className="flex items-center justify-center">
          <DialogTitle className="text-2xl dark:text-[#fff]">
            Confirm contact
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center gap-6">
          <CircleAlert className="text-red-600 dark:text-[#F2BE38]" />
          <p className="flex w-2/3 text-center">
            Do you confirm that you have contacted the client? Upon
            confirmation, the next recommended contact date will be updated and
            cannot be undone.
          </p>
        </div>
        <DialogFooter className="flex items-end justify-end">
          <Button
            className="bg-[#10A45C] hover:bg-green-500 hover:text-black"
            onClick={handleConfirmContact}
          >
            Confirm
          </Button>
          <Button
            className="bg-[#EF4E3D] hover:bg-red-500 hover:text-black"
            onClick={onClose}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
