import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { TriangleAlert } from 'lucide-react'

interface DisableCustomerModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function DisableCustomerModal({
  isOpen,
  onOpenChange,
}: DisableCustomerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="border-0 dark:bg-[#1C1C1C] dark:text-white">
        <DialogHeader>
          <DialogTitle className="mb-5 flex items-center gap-5">
            Disabled asset{' '}
            <TriangleAlert className="w-5 text-red-600 dark:text-yellow-400" />
          </DialogTitle>
          <DialogDescription>
            Disabled the for all wallets
            <p className="m-4 rounded bg-gray-300 p-4 font-bold text-red-600 dark:bg-transparent dark:text-yellow-200">
              Warning: You are about to disable this crypto asset for all
              wallets. This action is irreversible and will affect all users
              holding this asset. Please confirm that you want to proceed with
              this operation.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="bg-gray-200 text-black hover:bg-gray-100 hover:text-black">
              Close
            </Button>
          </DialogClose>
          <Button disabled className="bg-blue-500 text-black hover:bg-blue-600">
            Disable Asset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
