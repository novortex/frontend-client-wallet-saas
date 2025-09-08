import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from '../ui/use-toast'
import { applyBaseWalletAllocation } from '@/services/baseWalletService'
import { AlertTriangle } from 'lucide-react'

type ApplyBaseWalletModalProps = {
  isOpen: boolean
  onClose: () => void
  walletUuid: string
  riskProfile: string
  fetchData: () => Promise<void>
}

export function ApplyBaseWalletModal({ 
  isOpen,
  onClose,
  walletUuid, 
  riskProfile, 
  fetchData 
}: ApplyBaseWalletModalProps) {
  const [loading, setLoading] = useState(false)

  const handleApplyAllocation = async () => {
    setLoading(true)

    try {
      await applyBaseWalletAllocation({
        walletUuid,
        riskProfile,
      })

      toast({
        className: 'toast-success',
        title: 'Alocações aplicadas com sucesso',
        description: 'As alocações da base wallet foram aplicadas à carteira.',
        duration: 4000,
      })

      await fetchData()
      onClose()
    } catch (error) {
      toast({
        className: 'toast-error',
        title: 'Erro ao aplicar alocações',
        description: 'Não foi possível aplicar as alocações da base wallet.',
        duration: 6000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
            <AlertTriangle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            Aplicar Base Wallet
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Deseja aplicar as alocações da base wallet para o perfil de risco
          </p>
          <p className="font-semibold text-foreground">
            "{riskProfile}"?
          </p>
          
          <div className="rounded-lg bg-yellow-50 p-4 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
            <p className="text-sm">
              Esta ação irá substituir as alocações atuais da carteira pelas alocações padrão da base wallet correspondente.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleApplyAllocation}
            disabled={loading}
            className="flex-1 flex items-center gap-2 bg-[#1877F2] hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Aplicando...
              </>
            ) : (
              'Aplicar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}