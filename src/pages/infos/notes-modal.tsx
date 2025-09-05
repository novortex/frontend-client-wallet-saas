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

  const handleClose = () => {
    if (notes !== initialNotes) {
      const confirm = window.confirm(
        'Você tem alterações não salvas. Deseja descartar as mudanças?',
      )
      if (!confirm) return
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
            onClick={handleClose}
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
      </DialogContent>
    </Dialog>
  )
}
