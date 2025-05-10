import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface SendContractIdModalProps {
  isOpen: boolean
  onClose: () => void
  handleSendContractId: (contractId: string) => void
}

export function SendContractIdModal({
  isOpen,
  onClose,
  handleSendContractId,
}: SendContractIdModalProps) {
  const [contractId, setContractId] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContractId(e.target.value)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-[38%] w-[200%] border-transparent dark:bg-[#131313] dark:text-[#fff]">
        <DialogHeader>
          <DialogTitle className="text-3xl dark:text-[#fff]">
            Send Contract ID
          </DialogTitle>
        </DialogHeader>
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <div className="flex h-[80%] w-full justify-center">
            <Input
              type="text"
              value={contractId}
              onChange={handleChange}
              placeholder="Enter Contract ID"
              className="h-full bg-lightComponent dark:border-[#323232] dark:bg-[#131313] dark:text-[#959CB6]"
            />
          </div>
        </div>
        <DialogFooter className="flex items-end justify-end">
          <Button
            className="w-1/4 bg-[#1877F2] p-5 text-white hover:bg-blue-600"
            onClick={() => handleSendContractId(contractId)}
          >
            Send ID
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
