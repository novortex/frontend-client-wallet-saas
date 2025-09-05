import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'

interface NotesModalProps {
  isOpen: boolean
  onClose: () => void
  customerName: string
  initialNotes?: string
  onSave?: (notes: string) => Promise<void> | void
}

export function NotesModal({
  isOpen,
  onClose,
  customerName,
  initialNotes = '',
  onSave,
}: NotesModalProps) {
  const [notes, setNotes] = useState(initialNotes)
  const [isSaving, setIsSaving] = useState(false)
  const [showUnsavedConfirm, setShowUnsavedConfirm] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      setNotes(initialNotes)
    }
  }, [isOpen, initialNotes])

  const handleSave = async () => {
    if (!onSave) return
    setIsSaving(true)
    try {
      await Promise.resolve(onSave(notes))
      toast({
        className: 'bg-green-500 border-0',
        title: 'Notas salvas!',
        description: 'As notas do cliente foram atualizadas com sucesso.',
      })
      onClose()
    } catch (error) {
      toast({
        className: 'bg-red-500 border-0',
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar as notas. Tente novamente.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const attemptClose = () => {
    if (notes !== initialNotes) {
      setShowUnsavedConfirm(true)
    } else {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && attemptClose()}>
      <DialogContent className="mx-auto w-full max-w-2xl border-0 dark:bg-[#1C1C1C] dark:text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl dark:text-white">
            Notas do Cliente - {customerName}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <textarea
            value={notes}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setNotes(e.target.value)
            }
            placeholder="Digite suas notas sobre o cliente aqui... (ex: data de aniversário, preferências, lembretes importantes, etc.)"
            className="min-h-[300px] w-full resize-none rounded-md border-2 border-border bg-background p-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-[#323232] dark:bg-[#131313] dark:text-white"
          />
        </div>

        <DialogFooter className="flex gap-3">
          <Button
            onClick={attemptClose}
            variant="outline"
            className="border-border bg-background text-foreground hover:bg-muted dark:border-[#323232] dark:bg-[#131313] dark:text-white dark:hover:bg-[#171717]"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-yellow"
          >
            {isSaving ? 'Salvando...' : 'Salvar Notas'}
          </Button>
        </DialogFooter>

        {showUnsavedConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-sm rounded-lg border border-border bg-popover p-5 shadow-lg">
              <h4 className="mb-2 text-lg font-semibold text-popover-foreground">
                Descartar alterações?
              </h4>
              <p className="mb-5 text-sm text-muted-foreground">
                Você tem alterações não salvas. Tem certeza que deseja
                descartá-las?
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowUnsavedConfirm(false)}
                  className="border-border bg-background text-foreground hover:bg-muted dark:border-[#323232] dark:bg-[#131313] dark:text-white dark:hover:bg-[#171717]"
                >
                  Voltar
                </Button>
                <Button
                  className="btn-yellow"
                  onClick={() => {
                    setShowUnsavedConfirm(false)
                    onClose()
                  }}
                >
                  Descartar
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
