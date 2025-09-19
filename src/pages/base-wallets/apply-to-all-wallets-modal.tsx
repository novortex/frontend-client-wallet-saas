import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCheck, AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from '@/components/ui/use-toast'
import { applyBaseWalletAllocationToAllWallets } from '@/services/baseWalletService'

interface ApplyToAllWalletsModalProps {
  isOpen: boolean
  onClose: () => void
  baseWalletName: string
  riskProfile: string
  onSuccess: () => void
}

export default function ApplyToAllWalletsModal({
  isOpen,
  onClose,
  baseWalletName,
  riskProfile,
  onSuccess,
}: ApplyToAllWalletsModalProps) {
  const [isApplying, setIsApplying] = useState(false)
  const [confirmationName, setConfirmationName] = useState('')

  useEffect(() => {
    if (isOpen) {
      setConfirmationName('')
    }
  }, [isOpen])

  const handleApply = async () => {
    if (confirmationName !== baseWalletName) {
      toast({
        className: 'toast-error',
        title: 'Nome incorreto',
        description: 'Digite o nome exato da carteira para confirmar a aplicação.',
        duration: 6000,
      })
      return
    }

    setIsApplying(true)
    
    try {
      const result = await applyBaseWalletAllocationToAllWallets(riskProfile)
      
      toast({
        className: 'toast-success',
        title: 'Aplicação realizada com sucesso',
        description: `Alocação aplicada em ${result.successfulUpdates} carteira(s) do perfil ${riskProfile}.`,
        duration: 4000,
      })
      
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error applying allocation to all wallets:', error)
      toast({
        className: 'toast-error',
        title: 'Erro ao aplicar alocação',
        description: 'Não foi possível aplicar a alocação em todas as carteiras. Tente novamente.',
        duration: 6000,
      })
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            Aplicar em Todas as Carteiras
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Tem certeza que deseja aplicar a alocação da carteira padrão
          </p>
          <p className="font-semibold text-foreground">
            "{baseWalletName}"
          </p>
          <p className="text-muted-foreground">
            em todas as carteiras com perfil de risco {riskProfile}?
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="confirmation-input" className="text-sm font-medium">
              Digite o nome da carteira para confirmar:
            </Label>
            <Input
              id="confirmation-input"
              type="text"
              placeholder={baseWalletName}
              value={confirmationName}
              onChange={(e) => setConfirmationName(e.target.value)}
              className="text-center"
            />
          </div>
          
          <div className="rounded-lg bg-orange-50 p-4 text-orange-800 dark:bg-yellow-900/20 dark:text-yellow-300">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4" />
              <p className="text-sm font-semibold">Atenção</p>
            </div>
            <p className="text-sm">
              Esta ação irá sobrescrever as alocações de ativos de TODAS as carteiras abertas com o mesmo perfil de risco.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isApplying}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            className="btn-green flex-1"
            onClick={handleApply}
            disabled={isApplying || confirmationName !== baseWalletName}
          >
            {isApplying ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Aplicando...
              </>
            ) : (
              <>
                <CheckCheck size={16} />
                Aplicar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}