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
import { rebalanceWallet } from '@/services/wallet/walletAssetService'

interface ConfirmContactModalProps {
  isOpen: boolean
  onClose: () => void
  fetchData: () => Promise<void>
}

export default function ConfirmRebalanceModal({
  isOpen,
  onClose,
  fetchData,
}: ConfirmContactModalProps) {
  const { walletUuid } = useParams()
  const [setSignal, signal] = useSignalStore((state) => [
    state.setSignal,
    state.signal,
  ])

  const handleConfirmContact = async () => {
    try {
      if (walletUuid) {
        await rebalanceWallet(walletUuid)

        if (!signal) {
          setSignal(true)
        } else {
          setSignal(false)
        }

        fetchData()
        onClose()
      }
    } catch (error) {
      console.error('Erro ao confirmar rebalance wallet:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-1/2 w-[200%] dark:bg-[#131313] dark:text-[#fff]">
        <DialogHeader className="flex items-center justify-center">
          <DialogTitle className="text-2xl dark:text-[#fff]">
            Confirm Rebalance
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center gap-6">
          <CircleAlert className="h-8 w-8 text-red-600 dark:text-[#F2BE38]" />
          <p className="m-2 flex w-2/3 rounded bg-gray-200 p-4 text-center text-red-600 dark:m-0 dark:bg-transparent dark:text-yellow-400">
            Do you confirm you&apos;ve done rebalance in this wallet ?
          </p>
        </div>
        <DialogFooter className="flex items-end justify-end">
          <Button
            className="btn-green"
            onClick={handleConfirmContact}
          >
            Confirm
          </Button>
          <Button
            className="btn-red"
            onClick={onClose}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
