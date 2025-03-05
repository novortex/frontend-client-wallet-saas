import { useRef } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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

export function EditDialog({ isOpen, onOpenChange, rowInfos, onSave }: EditDialogProps) {
  const newQuantityAssetRef = useRef<HTMLInputElement>(null)
  const newIdealAllocationRef = useRef<HTMLInputElement>(null)
  const { validateInputs } = useValidation()

  const handleSave = () => {
    if (!validateInputs(newQuantityAssetRef.current?.value, newIdealAllocationRef.current?.value)) return

    const quantity = parseFloat(newQuantityAssetRef.current?.value ?? '0')
    const idealAllocation = parseFloat(newIdealAllocationRef.current?.value ?? '0')

    onSave(quantity, idealAllocation)
    onOpenChange(false)
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} modal>
      <DialogContent className="dark:bg-[#1C1C1C] border-0 text-white">
        <DialogHeader>
          <DialogTitle className="text-black dark:text-white">Editing information asset in wallet</DialogTitle>
          <DialogDescription>
            <div className="flex mt-3">
              <p>Now you are editing information about</p>
              <div className="ml-2 animate-bounce">
                <img src={rowInfos.asset.urlImage} alt={rowInfos.asset.name} className="w-6 h-6 mr-2" />
              </div>
              <p>{rowInfos.asset.name} in this wallet</p>
            </div>

            <div className="flex mt-5 gap-5 w-full">
              <Label className="w-1/2">Asset Quantity (Ex: 100)</Label>
              <Label className="w-1/2">Ideal Allocation (%)</Label>
            </div>
            <div className="flex mt-5 gap-5 w-full">
              <Input
                className="w-1/2 h-full dark:bg-[#131313] dark:border-[#323232] dark:text-[#959CB6]"
                placeholder="Quantity"
                type="number"
                defaultValue={rowInfos.assetQuantity}
                ref={newQuantityAssetRef}
              />
              <Input
                className="w-1/2 h-full dark:bg-[#131313] dark:border-[#323232] dark:text-[#959CB6]"
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
            <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleClose}>
              Close
            </Button>
          </DialogClose>
          <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-black">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
