import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface AddNewAssetModalProps {
  isOpen: boolean
  onClose: () => void
  name: string
  email: string
  phone: string
}

export function ClientsInfoModal({
  isOpen,
  onClose,
  name,
  email,
  phone,
}: AddNewAssetModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="m-0 h-1/3 w-[200%] dark:bg-[#131313] dark:text-[#fff]">
        <DialogHeader className="flex justify-center">
          <DialogTitle className="ml-4 text-3xl">Information</DialogTitle>
        </DialogHeader>
        <div className="flex flex-row rounded-md hover:bg-gray-200 dark:hover:bg-[#1E1E1E]">
          <div className="ml-4 flex h-full w-1/2 items-center justify-start">
            Name
          </div>
          <div className="flex h-full w-1/2 items-center justify-start dark:text-[#959CB6]">
            {name}
          </div>
        </div>
        <div className="flex flex-row rounded-md hover:bg-gray-200 dark:hover:bg-[#1E1E1E]">
          <div className="ml-4 flex h-full w-1/2 items-center justify-start">
            Email
          </div>
          <div className="flex h-full w-1/2 items-center justify-start dark:text-[#959CB6]">
            {email}
          </div>
        </div>
        <div className="flex flex-row rounded-md hover:bg-gray-200 dark:hover:bg-[#1E1E1E]">
          <div className="ml-4 flex h-full w-1/2 items-center justify-start">
            Phone
          </div>
          <div className="flex h-full w-1/2 items-center justify-start dark:text-[#959CB6]">
            {phone}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
