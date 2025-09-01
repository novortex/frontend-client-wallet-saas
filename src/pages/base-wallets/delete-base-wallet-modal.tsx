import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Trash2, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import { deleteBaseWallet } from '@/services/baseWalletService'

interface DeleteBaseWalletModalProps {
  isOpen: boolean
  onClose: () => void
  baseWalletName: string
  baseWalletUuid: string
  onSuccess: () => void
}

export default function DeleteBaseWalletModal({
  isOpen,
  onClose,
  baseWalletName,
  baseWalletUuid,
  onSuccess,
}: DeleteBaseWalletModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    
    try {
      await deleteBaseWallet(baseWalletUuid)
      
      toast({
        className: 'toast-success',
        title: 'Carteira excluída com sucesso',
        description: `A carteira padrão "${baseWalletName}" foi removida.`,
      })
      
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error deleting base wallet:', error)
      toast({
        className: 'toast-error',
        title: 'Erro ao excluir carteira',
        description: 'Não foi possível excluir a carteira padrão. Tente novamente.',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            Excluir Carteira Padrão
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Tem certeza que deseja excluir a carteira padrão
          </p>
          <p className="font-semibold text-foreground">
            "{baseWalletName}"?
          </p>
          <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-300">
            <p className="text-sm">
              Esta ação não pode ser desfeita. Todas as alocações de ativos desta carteira padrão serão perdidas.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Excluindo...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Excluir
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}