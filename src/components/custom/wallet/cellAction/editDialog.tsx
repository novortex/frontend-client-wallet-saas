import { useRef } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ClientActive } from '../columns'
import { useValidation } from './useValidation'

interface EditDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  rowInfos: ClientActive
  onSave: (quantity: number, idealAllocation: number) => void
}

export function EditDialog({
  isOpen,
  onOpenChange,
  rowInfos,
  onSave,
}: EditDialogProps) {
  const newQuantityAssetRef = useRef<HTMLInputElement>(null)
  const newIdealAllocationRef = useRef<HTMLInputElement>(null)
  const { validateInputs } = useValidation()

  const handleSave = () => {
    if (
      !validateInputs(
        newQuantityAssetRef.current?.value,
        newIdealAllocationRef.current?.value,
      )
    )
      return

    const quantity = parseFloat(newQuantityAssetRef.current?.value ?? '0')
    const idealAllocation = parseFloat(
      newIdealAllocationRef.current?.value ?? '0',
    )

    onSave(quantity, idealAllocation)
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
            Editing information asset in wallet
          </DialogTitle>
          <DialogDescription>
            <div className="mt-3 flex">
              <p>Now you are editing information about</p>
              <div className="ml-2 animate-bounce">
                <img
                  src={rowInfos.asset.urlImage}
                  alt={rowInfos.asset.name}
                  className="mr-2 h-6 w-6"
                />
              </div>
              <p>{rowInfos.asset.name} in this wallet</p>
            </div>

            <div className="mt-5 flex w-full gap-5">
              <Label className="w-1/2">Asset Quantity (Ex: 100)</Label>
              <Label className="w-1/2">Ideal Allocation (%)</Label>
            </div>
            <div className="mt-5 flex w-full gap-5">
              <Input
                className="h-full w-1/2 dark:border-[#323232] dark:bg-[#131313] dark:text-[#959CB6]"
                placeholder="Quantity"
                type="number"
                defaultValue={rowInfos.assetQuantity}
                ref={newQuantityAssetRef}
              />
              <Input
                className="h-full w-1/2 dark:border-[#323232] dark:bg-[#131313] dark:text-[#959CB6]"
                placeholder="Ideal allocation"
                type="number"
                defaultValue={rowInfos.idealAllocation}
                ref={newIdealAllocationRef}
              />
            </div>
          </DialogDescription>
        </DialogHeader>
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
            onClick={handleSave}
            className="bg-green-500 text-black hover:bg-green-600"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
