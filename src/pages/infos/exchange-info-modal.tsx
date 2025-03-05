import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface AddNewAssetModalProps {
  isOpen: boolean
  onClose: () => void
  accountEmail: string
  exchangePassword: string
  emailPassword: string
}

export function ExchangeInfoModal({ isOpen, onClose, accountEmail, emailPassword, exchangePassword }: AddNewAssetModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-1/3 w-[200%] dark:bg-[#131313] dark:text-[#fff] m-0">
        <DialogHeader className="flex justify-center">
          <DialogTitle className="ml-4 text-3xl">Information Exchange</DialogTitle>
        </DialogHeader>
        <div className="flex flex-row hover:bg-gray-200 dark:hover:bg-[#1E1E1E] rounded-md">
          <div className="ml-4 h-full w-1/2 flex justify-start items-center">Account email</div>
          <div className="h-full w-1/2 flex justify-start items-center dark:text-[#959CB6]">{accountEmail}</div>
        </div>
        <div className="flex flex-row hover:bg-gray-200 dark:hover:bg-[#1E1E1E] rounded-md">
          <div className="ml-4 h-full w-1/2 flex justify-start items-center">Email password</div>
          <div className="h-full w-1/2 flex justify-start items-center dark:text-[#959CB6]">{emailPassword}</div>
        </div>
        <div className="flex flex-row hover:bg-gray-200 dark:hover:bg-[#1E1E1E] rounded-md">
          <div className="ml-4 h-full w-1/2 flex justify-start items-center">Exchange password</div>
          <div className="h-full w-1/2 flex justify-start items-center dark:text-[#959CB6]">{exchangePassword}</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
