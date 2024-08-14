import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { CircleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { confirmContactClient } from '@/service/request'
import { useParams } from 'react-router-dom'
import { useUserStore } from '@/store/user'

interface ConfirmContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ConfirmContactModal({
  isOpen,
  onClose,
}: ConfirmContactModalProps) {
  const { walletUuid } = useParams()
  const uuidOrganization = useUserStore((state) => state.user.uuidOrganization)

  const handleConfirmContact = async () => {
    try {
      if (walletUuid && uuidOrganization) {
        await confirmContactClient(uuidOrganization, walletUuid)
        onClose()
      }
    } catch (error) {
      console.error('Erro ao confirmar contato do cliente:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-1/2 w-[200%] bg-[#131313] text-[#fff]">
        <DialogHeader className="flex justify-center items-center">
          <DialogTitle className="text-2xl text-[#fff]">
            Confirmar contato
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-center items-center flex-col gap-6">
          <CircleAlert className="text-[#F2BE38]" />
          <p className="flex w-2/3 text-center">
            Você confirma que fez contato com o cliente? Ao confirmar, a próxima
            data de contato recomendada será atualizada sem possibilidade de
            reversão.
          </p>
        </div>
        <DialogFooter className="flex justify-end items-end">
          <Button
            className="bg-[#10A45C] hover:bg-green-500 hover:text-black"
            onClick={handleConfirmContact}
          >
            Confirmar
          </Button>
          <Button
            className="bg-[#EF4E3D] hover:bg-red-500 hover:text-black"
            onClick={onClose}
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
