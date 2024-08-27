import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '../ui/label'

interface CloseWalletModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CloseWalletModal({
  isOpen,
  onClose,
}: CloseWalletModalProps) {
  console.log('oi')

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div>
            <DialogTitle></DialogTitle>
            <Button></Button>
          </div>
          <div></div>
        </DialogHeader>
        <div>
          <div></div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
