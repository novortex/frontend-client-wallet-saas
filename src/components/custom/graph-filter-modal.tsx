import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

interface GraphFilterModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function GraphFilterModal({
  isOpen,
  onClose,
}: GraphFilterModalProps) {
  console.log('oi')
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-[50%] bg-[#131313]">
        Ranho de aids
      </DialogContent>
    </Dialog>
  )
}
