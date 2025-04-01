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
import { ClientActive } from '../columns'
import { useWalletActions } from './useWalletActions'
import { toast } from '@/components/ui/use-toast'

interface AllocationDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  rowInfos: ClientActive
  fetchData: () => void
}

export function AllocationDialog({
  isOpen,
  onOpenChange,
  rowInfos,
  fetchData,
}: AllocationDialogProps) {
  const idealAllocationRef = useRef<HTMLInputElement>(null)
  const { handleUpdateIdealAllocation } = useWalletActions(rowInfos, fetchData)

  const handleSave = () => {
    const idealAllocation = parseFloat(idealAllocationRef.current?.value ?? '0')
    if (idealAllocation <= 0 || idealAllocation > 100) {
      return toast({
        className: 'bg-red-500 border-0',
        title: 'Invalid ideal allocation',
        description: 'Ideal allocation must be between 0 and 100.',
      })
    }
    handleUpdateIdealAllocation(idealAllocation)
    onOpenChange(false)
  }

  const handleClose = () => {
    onOpenChange(false)
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
            <img src={rowInfos.asset.urlImage} alt={rowInfos.asset.name} />
          </div>
          <span>{rowInfos.asset.name}</span>
        </div>
        <div className="mt-5 flex w-full gap-5">
          <label className="w-1/2">Ideal Allocation (%)</label>
          <Input
            className="h-full w-1/2 dark:border-[#323232] dark:bg-[#131313] dark:text-[#959CB6]"
            placeholder="Ideal Allocation"
            type="number"
            defaultValue={rowInfos.idealAllocation}
            ref={idealAllocationRef}
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
