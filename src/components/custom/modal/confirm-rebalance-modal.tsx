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
  const [setSignal, signal] = useSignalStore(
    (state) => [state.setSignal, state.signal]
  )

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
      console.error(
        'Erro ao confirmar rebalance wallet:',
        error
      )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-1/2 w-[200%] bg-[#131313] text-[#fff]">
        <DialogHeader className="flex justify-center items-center">
          <DialogTitle className="text-2xl text-[#fff]">
            Confirm Rebalance
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-center items-center flex-col gap-6">
          <CircleAlert className="text-[#F2BE38]" />
          <p className="flex w-2/3 text-center">
            Do you confirm do rebalance in this
            wallet ?
          </p>
        </div>
        <DialogFooter className="flex justify-end items-end">
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
