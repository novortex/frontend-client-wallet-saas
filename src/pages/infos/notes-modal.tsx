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
        title: 'Notes saved!',
        description: 'Client notes updated successfully.',
      })
      onClose()
    } catch (error) {
      const err = error as unknown as {
        response?: { data?: Record<string, unknown>; status?: number }
      }
      const data = (err?.response?.data as Record<string, unknown>) || {}
      const status = err?.response?.status
      const reason = typeof data.reason === 'string' ? data.reason : ''
      const code = typeof data.code === 'string' ? data.code : ''
      const errorKey = typeof data.error === 'string' ? data.error : ''
      const message = typeof data.message === 'string' ? data.message : ''
      const isMalicious =
        reason === 'XSS_DETECTED' ||
        code === 'INVALID_CONTENT' ||
        errorKey === 'MALICIOUS_CONTENT' ||
        /unsafe|malicious|xss/i.test(message) ||
        (status && [400, 422].includes(status) && /script|<|>/i.test(notes))

      if (isMalicious) {
        const serverMsg: string =
          message || 'Potentially unsafe content detected and blocked.'
        const sanitizedContent =
          typeof data.sanitizedContent === 'string' ? data.sanitizedContent : ''
        const sanitizedAlt =
          typeof data.sanitized === 'string' ? data.sanitized : ''
        const sanitized: string = sanitizedContent || sanitizedAlt
        const preview = notes
          .replace(/\s+/g, ' ')
          .slice(0, 160)
          .concat(notes.length > 160 ? '…' : '')

        toast({
          className:
            'border-0 bg-amber-500 text-black dark:bg-amber-400 dark:text-black',
          title: 'Unsafe content blocked',
          description: (
            <div className="space-y-2 text-xs">
              <p className="text-sm font-medium leading-snug">{serverMsg}</p>
              <div className="rounded bg-black/10 p-2 dark:bg-black/20">
                <span className="font-semibold">Attempted:</span> {preview}
              </div>
              {sanitized && (
                <div className="rounded bg-black/10 p-2 dark:bg-black/20">
                  <span className="font-semibold">Sanitized stored:</span>{' '}
                  {sanitized.slice(0, 160)}
                  {sanitized.length > 160 ? '…' : ''}
                </div>
              )}
              <p className="leading-snug text-muted-foreground">
                Please remove script / HTML tags and try saving again.
              </p>
            </div>
          ),
        })
      } else {
        toast({
          className: 'bg-red-500 border-0',
          title: 'Save error',
          description: 'Could not save notes. Please try again.',
        })
      }
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
            Client Notes - {customerName}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <textarea
            value={notes}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setNotes(e.target.value)
            }
            placeholder="Write your notes about the client here... (e.g., birthday, preferences, important reminders, etc.)"
            className="min-h-[300px] w-full resize-none rounded-md border-2 border-border bg-background p-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-[#323232] dark:bg-[#131313] dark:text-white"
          />
        </div>

        <DialogFooter className="flex gap-3">
          <Button
            onClick={attemptClose}
            variant="outline"
            className="border-border bg-background text-foreground hover:bg-muted dark:border-[#323232] dark:bg-[#131313] dark:text-white dark:hover:bg-[#171717]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-yellow"
          >
            {isSaving ? 'Saving...' : 'Save Notes'}
          </Button>
        </DialogFooter>

        {showUnsavedConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-sm rounded-lg border border-border bg-popover p-5 shadow-lg">
              <h4 className="mb-2 text-lg font-semibold text-popover-foreground">
                Discard changes?
              </h4>
              <p className="mb-5 text-sm text-muted-foreground">
                You have unsaved changes. Are you sure you want to discard them?
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowUnsavedConfirm(false)}
                  className="border-border bg-background text-foreground hover:bg-muted dark:border-[#323232] dark:bg-[#131313] dark:text-white dark:hover:bg-[#171717]"
                >
                  Back
                </Button>
                <Button
                  className="btn-yellow"
                  onClick={() => {
                    setShowUnsavedConfirm(false)
                    onClose()
                  }}
                >
                  Discard
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
