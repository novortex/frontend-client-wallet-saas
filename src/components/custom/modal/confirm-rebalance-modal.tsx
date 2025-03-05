import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
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

export default function ConfirmRebalanceModal({ isOpen, onClose, fetchData }: ConfirmContactModalProps) {
  const { walletUuid } = useParams()
  const [setSignal, signal] = useSignalStore((state) => [state.setSignal, state.signal])

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
        <DialogHeader className="flex justify-center items-center">
          <DialogTitle className="text-2xl dark:text-[#fff]">Confirm Rebalance</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center items-center flex-col gap-6">
          <CircleAlert className="text-red-600 dark:text-[#F2BE38] w-8 h-8" />
          <p className="flex w-2/3 text-center text-red-600 m-2 bg-gray-200 rounded p-4 dark:bg-transparent dark:text-yellow-400 dark:m-0">Do you confirm you've done rebalance in this wallet ?</p>
        </div>
        <DialogFooter className="flex justify-end items-end">
          <Button className="text-white bg-[#10A45C] hover:bg-green-400 dark:hover:bg-green-500" onClick={handleConfirmContact}>
            Confirm
          </Button>
          <Button className="text-white bg-[#EF4E3D] hover:bg-red-800" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
