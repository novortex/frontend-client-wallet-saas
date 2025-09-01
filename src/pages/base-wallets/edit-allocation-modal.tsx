import { useRef } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BaseWalletTarget } from '@/types/baseWallet.type'
import { toast } from '@/components/ui/use-toast'

interface EditAllocationModalProps {
  isOpen: boolean
  onClose: () => void
  target: BaseWalletTarget | null
  onSave: (newAllocation: number) => void
}

export default function EditAllocationModal({
  isOpen,
  onClose,
  target,
  onSave,
}: EditAllocationModalProps) {
  const idealAllocationRef = useRef<HTMLInputElement>(null)
  
  console.log('EditAllocationModal rendered with:', { isOpen, target })


  const handleSave = () => {
    const idealAllocation = parseFloat(idealAllocationRef.current?.value ?? '0')
    if (idealAllocation < 0 || idealAllocation > 100) {
      return toast({
        className: 'toast-error',
        title: 'Alocação inválida',
        description: 'A alocação deve estar entre 0 e 100%.',
      })
    }
    onSave(idealAllocation)
    onClose()
  }

  const handleClose = () => {
    onClose()
  }

  if (!target) {
    console.log('EditAllocationModal: target is null, returning null')
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} modal>
      <DialogContent className="border-0 text-white dark:bg-[#1C1C1C]">
        <DialogHeader>
          <DialogTitle className="text-black dark:text-white">
            Update Ideal Allocation
          </DialogTitle>
        </DialogHeader>

        <div className="mt-3 flex">
          <div className="mr-2 h-6 w-6">
            {(target?.asset as any)?.icon && (
              <img 
                src={(target.asset as any).icon} 
                alt={target.asset?.name || 'Asset'} 
                className="h-6 w-6 rounded-full object-cover"
                onError={(e) => {
                  const imgTarget = e.target as HTMLImageElement
                  imgTarget.style.display = 'none'
                }}
              />
            )}
          </div>
          <span>{target?.asset?.name || 'Ativo'}</span>
        </div>
        <div className="mt-5 flex w-full gap-5">
          <label className="w-1/2">Ideal Allocation (%)</label>
          <Input
            className="h-full w-1/2 dark:border-[#323232] dark:bg-[#131313] dark:text-[#959CB6]"
            placeholder="Ideal Allocation"
            type="number"
            defaultValue={target?.idealAllocation || 0}
            ref={idealAllocationRef}
            min="0"
            max="100"
            step="0.1"
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={handleClose}
            >
              Close
            </Button>
          </DialogClose>
          <Button
            className="bg-green-500 text-black hover:bg-green-600"
            onClick={handleSave}
          >
            Save Allocation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}