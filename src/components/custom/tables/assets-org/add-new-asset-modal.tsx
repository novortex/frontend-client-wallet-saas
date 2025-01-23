import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAddAsset } from '@/hooks/useAddAsset'
import { AssetInfo, AssetInput } from '../../AssetInput'

interface AddNewAssetModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddNewAssetModal({
  isOpen,
  onClose,
}: AddNewAssetModalProps) {
  const { assetId, handleAddAsset, handleChange } = useAddAsset(onClose)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-1/3 w-[200%] bg-[#131313] text-[#fff] border-transparent">
        <DialogHeader>
          <DialogTitle className="text-3xl text-[#fff]">New Asset</DialogTitle>
        </DialogHeader>
        <div className="w-full flex flex-col gap-4">
          <AssetInput value={assetId} onChange={handleChange} />
          <AssetInfo />
        </div>
        <DialogFooter className="flex justify-end items-end">
          <Button
            className="bg-[#1877F2] w-1/4 hover:bg-blue-600 p-5"
            onClick={handleAddAsset}
          >
            Add asset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
