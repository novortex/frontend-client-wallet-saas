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
      <DialogContent className="border-0 dark:bg-[#1C1C1C] dark:text-white">
        <DialogHeader>
          <DialogTitle className="mb-5 flex items-center gap-5">
            Disabled asset{' '}
            <TriangleAlert className="w-5 text-red-600 dark:text-yellow-400" />
          </DialogTitle>
          <DialogDescription>
            <p className="flex">
              Disabled the
              <span className="ml-2 font-bold dark:text-white">
                {rowInfos.asset.name}
              </span>
              <div className="ml-2 animate-bounce">
                <img
                  src={rowInfos.asset.urlImage}
                  alt={rowInfos.asset.name}
                  className="mr-2 h-6 w-6"
                />
              </div>
            </p>
            {!canDisable && (
              <p className="m-4 rounded bg-gray-300 p-4 font-bold text-red-600 dark:bg-transparent dark:text-yellow-200">
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
            <Button className="bg-gray-200 text-black hover:bg-gray-100 hover:text-black">
              Close
            </Button>
          </DialogClose>
          <Button
            disabled={!canDisable}
            onClick={onDisable}
            className="bg-blue-500 text-black hover:bg-blue-600"
          >
            Disable Asset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
