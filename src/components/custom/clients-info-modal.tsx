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

export default function ClientsInfoModal({
  isOpen,
  onClose,
  name,
  email,
  phone,
}: AddNewAssetModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-1/3 w-[200%] bg-[#131313] text-[#fff] m-0">
        <DialogHeader className="flex justify-center">
          <DialogTitle className="text-3xl">Information</DialogTitle>
        </DialogHeader>
        <div className="flex flex-row">
          <div className="h-full w-1/2 flex justify-start items-center">
            Name
          </div>
          <div className="h-full w-1/2 flex justify-start items-center text-[#959CB6]">
            {name}
          </div>
        </div>
        <div className="flex flex-row">
          <div className="h-full w-1/2 flex justify-start items-center">
            Email
          </div>
          <div className="h-full w-1/2 flex justify-start items-center text-[#959CB6]">
            {email}
          </div>
        </div>
        <div className="flex flex-row">
          <div className="h-full w-1/2 flex justify-start items-center">
            Phone
          </div>
          <div className="h-full w-1/2 flex justify-start items-center text-[#959CB6]">
            {phone}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
