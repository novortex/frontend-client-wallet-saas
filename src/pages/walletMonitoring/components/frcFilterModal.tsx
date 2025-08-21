import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

interface FrcFilterModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  managers: Array<{ name: string }>
  value: string[]
  onChange: (managers: string[]) => void
}

export function FrcFilterModal({
  isOpen,
  onOpenChange,
  managers,
  value,
  onChange,
}: FrcFilterModalProps) {
  const [localSelected, setLocalSelected] = useState<string[]>([])

  useEffect(() => {
    if (isOpen) setLocalSelected(value)
  }, [isOpen, value])

  const toggle = (name: string) => {
    setLocalSelected((prev) =>
      prev.includes(name) ? prev.filter((v) => v !== name) : [...prev, name],
    )
  }

  const apply = () => {
    onChange(localSelected)
    onOpenChange(false)
  }

  const clear = () => {
    setLocalSelected([])
    onChange([])
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-black dark:text-white">
            Filter FRC Monitoring
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 font-medium text-black dark:text-white">
              Managers
            </h3>
            <div className="max-h-40 space-y-2 overflow-y-auto">
              {managers.map((m) => (
                <label key={m.name} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localSelected.includes(m.name)}
                    onChange={() => toggle(m.name)}
                    className="rounded"
                  />
                  <span className="text-black dark:text-white">{m.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={clear} variant="outline" className="flex-1">
              Clear All
            </Button>
            <Button
              onClick={apply}
              className="flex-1 bg-[#F2BE38] text-black hover:bg-yellow-600"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
