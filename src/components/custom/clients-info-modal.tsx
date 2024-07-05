import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AddNewAssetModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ClientsInfoModal({ isOpen, onClose }: AddNewAssetModalProps) {
    const user = {
          name: 'Arthur Fraige',
          email: 'arthur.fraige@example.com',
          cpf: '123.456.789-00',
          phone: '(11) 98765-4321',
     
    }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-1/3 w-[200%] bg-[#131313] text-[#fff] m-0">
            <DialogHeader className="flex justify-center">
                <DialogTitle className="text-3xl">
                    Information
                </DialogTitle>
            </DialogHeader>
            <div className="flex flex-row">
                <div className="h-full w-1/2 flex justify-start items-center">Name</div>
                <div className="h-full w-1/2 flex justify-start items-center text-[#959CB6]">{user.name}</div>
            </div>
            <div className="flex flex-row">
                <div className="h-full w-1/2 flex justify-start items-center">Email</div>
                <div className="h-full w-1/2 flex justify-start items-center text-[#959CB6]">{user.email}</div>
            </div>
            <div className="flex flex-row">
                <div className="h-full w-1/2 flex justify-start items-center">Phone</div>
                <div className="h-full w-1/2 flex justify-start items-center text-[#959CB6]">{user.phone}</div>
            </div>
            <div className="flex flex-row">
                <div className="h-full w-1/2 flex justify-start items-center">CPF</div>
                <div className="h-full w-1/2 flex justify-start items-center text-[#959CB6]">{user.cpf}</div>
            </div>
      </DialogContent>
    </Dialog>
  )
}
