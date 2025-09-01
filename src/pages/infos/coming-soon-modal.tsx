import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Clock } from 'lucide-react'

interface ComingSoonModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ComingSoonModal({
  isOpen,
  onClose,
}: ComingSoonModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10">
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Em Breve
          </DialogTitle>
        </DialogHeader>
        <div className="text-center">
          <p className="mb-6 text-muted-foreground">
            Esta funcionalidade está sendo desenvolvida e estará disponível em breve.
          </p>
          <Button 
            className="w-full bg-[#F2BE38] text-black hover:bg-yellow-500 hover:text-white transition-all duration-200 transform hover:scale-105"
            onClick={onClose}
          >
            Entendi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}