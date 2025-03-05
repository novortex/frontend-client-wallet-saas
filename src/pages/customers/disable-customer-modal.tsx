import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { TriangleAlert } from 'lucide-react'

interface DisableCustomerModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function DisableCustomerModal({ isOpen, onOpenChange }: DisableCustomerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="dark:bg-[#1C1C1C] border-0 dark:text-white">
        <DialogHeader>
          <DialogTitle className="flex gap-5 items-center mb-5">
            Disabled asset <TriangleAlert className="text-red-600 dark:text-yellow-400 w-5" />
          </DialogTitle>
          <DialogDescription>
            Disabled the for all wallets
            <p className="bg-gray-300 dark:bg-transparent rounded m-4 p-4 font-bold text-red-600 dark:text-yellow-200">
              Warning: You are about to disable this crypto asset for all wallets. This action is irreversible and will affect all users holding this
              asset. Please confirm that you want to proceed with this operation.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="bg-gray-200 hover:text-black hover:bg-gray-100 text-black">Close</Button>
          </DialogClose>
          <Button disabled className="bg-blue-500 hover:bg-blue-600 text-black">
            Disable Asset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
