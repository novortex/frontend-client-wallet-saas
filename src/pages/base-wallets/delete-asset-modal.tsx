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
import { deleteAssetFromBaseWallet } from '@/services/baseWalletService'
import { BaseWalletTarget } from '@/types/baseWallet.type'

interface DeleteAssetModalProps {
  isOpen: boolean
  onClose: () => void
  target: BaseWalletTarget | null
  baseWalletUuid: string
  onSuccess: () => void
}

export default function DeleteAssetModal({
  isOpen,
  onClose,
  target,
  baseWalletUuid,
  onSuccess,
}: DeleteAssetModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!target) return

    if (target.idealAllocation > 0) {
      toast({
        className: 'toast-error',
        title: 'Não é possível remover',
        description: 'Defina a alocação como 0% antes de remover o ativo.',
        duration: 6000,
      })
      return
    }

    setIsDeleting(true)
    
    try {
      await deleteAssetFromBaseWallet(baseWalletUuid, target.assetUuid)
      
      toast({
        className: 'toast-success',
        title: 'Ativo removido com sucesso',
        description: `O ativo "${target.asset?.symbol || target.asset?.name || 'Ativo'}" foi removido da carteira padrão.`,
        duration: 4000,
      })
      
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('Error deleting asset from base wallet:', error)
      
      if (error.response?.status === 400) {
        toast({
          className: 'toast-error',
          title: 'Erro de validação',
          description: error.response.data.message || 'Defina a alocação como 0% antes de remover.',
          duration: 6000,
        })
      } else {
        toast({
          className: 'toast-error',
          title: 'Erro ao remover ativo',
          description: 'Não foi possível remover o ativo da carteira padrão. Tente novamente.',
          duration: 6000,
        })
      }
    } finally {
      setIsDeleting(false)
    }
  }

  if (!target) return null

  const assetName = target.asset?.symbol || target.asset?.name || 'Ativo'
  const fullAssetName = target.asset?.name || 'Ativo não identificado'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            Remover Ativo da Carteira
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Tem certeza que deseja remover o ativo
          </p>
          <div className="flex items-center justify-center gap-2">
            {(target.asset as any)?.icon && (
              <img 
                src={(target.asset as any).icon} 
                alt={fullAssetName}
                className="h-6 w-6 rounded-full object-cover"
                onError={(e) => {
                  const imgTarget = e.target as HTMLImageElement
                  imgTarget.style.display = 'none'
                }}
              />
            )}
            <p className="font-semibold text-foreground">
              {assetName} ({fullAssetName})
            </p>
          </div>
          
          {target.idealAllocation > 0 ? (
            <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-300">
              <p className="text-sm font-medium">
                ⚠️ Alocação atual: {target.idealAllocation.toFixed(2)}%
              </p>
              <p className="text-sm mt-1">
                Defina a alocação como 0% antes de remover o ativo.
              </p>
            </div>
          ) : (
            <div className="rounded-lg bg-yellow-50 p-4 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
              <p className="text-sm">
                Esta ação não pode ser desfeita. O ativo será removido permanentemente desta carteira padrão.
              </p>
            </div>
          )}
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
            disabled={isDeleting || target.idealAllocation > 0}
            className="flex-1 flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Removendo...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Remover
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}