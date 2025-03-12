import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAddAsset } from '@/hooks/useAddAsset'
import { AssetInfo, AssetInput } from '../AssetInput'

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
      <DialogContent className="h-1/3 w-[200%] border-transparent text-black dark:bg-[#131313] dark:text-[#fff]">
        <DialogHeader>
          <DialogTitle className="text-3xl dark:text-[#fff]">
            New Asset
          </DialogTitle>
        </DialogHeader>
        <div className="flex w-full flex-col gap-4">
          <AssetInput value={assetId} onChange={handleChange} />
          <AssetInfo />
        </div>
        <DialogFooter className="flex items-end justify-end">
          <Button
            className="w-1/4 bg-[#1877F2] p-5 text-white hover:bg-blue-600"
            onClick={handleAddAsset}
          >
            Add asset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
