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
import { TriangleAlert } from 'lucide-react'
import { ClientActive } from '../columns'

interface DisableDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  rowInfos: ClientActive
  onDisable: () => void
}

export function DisableDialog({
  isOpen,
  onOpenChange,
  rowInfos,
  onDisable,
}: DisableDialogProps) {
  const canDisable =
    rowInfos.assetQuantity === 0 && rowInfos.idealAllocation === 0

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1C1C1C] border-0 text-white">
        <DialogHeader>
          <DialogTitle className="flex gap-5 items-center mb-5">
            Disabled asset <TriangleAlert className="text-yellow-400 w-5" />
          </DialogTitle>
          <DialogDescription>
            <p className="flex">
              Disabled the
              <span className="font-bold text-white ml-2">
                {rowInfos.asset.name}
              </span>
              <div className="ml-2 animate-bounce">
                <img
                  src={rowInfos.asset.urlImage}
                  alt={rowInfos.asset.name}
                  className="w-6 h-6 mr-2"
                />
              </div>
            </p>
            {!canDisable && (
              <p className="mt-5 font-bold text-yellow-200">
                Warning: It is not possible to disable this crypto asset because
                it still has allocated values and remaining quantities. Please
                check the allocations and ensure there is no balance before
                attempting again.
              </p>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              Close
            </Button>
          </DialogClose>
          <Button
            disabled={!canDisable}
            onClick={onDisable}
            className="bg-blue-500 hover:bg-blue-600 text-black"
          >
            Disable
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
