import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  closeWallet,
  startWallet as requestStartWallet,
} from '@/service/request'
import { useParams } from 'react-router-dom'
import { useUserStore } from '@/store/user'
import { useSignalStore } from '@/store/signalEffect'

interface confirmCloseWalletModalProps {
  isOpen: boolean
  onClose: () => void
  startWallet: boolean
}

export default function ConfirmCloseWalletModal({
  isOpen,
  onClose,
  startWallet,
}: confirmCloseWalletModalProps) {
  const [inputValue, setInputValue] = useState('')
  const { walletUuid } = useParams()
  const [uuidOrganization] = useUserStore((state) => [
    state.user.uuidOrganization,
  ])
  const [signal, setSignal] = useSignalStore((state) => [
    state.signal,
    state.setSignal,
  ])

  // Define o valor de confirmação esperado com base em startWallet
  const expectedValue = startWallet ? 'startwallet' : 'closewallet'
  const isInputValid = inputValue === expectedValue

  // Função que envia a solicitação correta (startWallet ou closeWallet)
  const handleSendWalletAction = async () => {
    if (startWallet) {
      // Chama a função startWallet
      await requestStartWallet(uuidOrganization, walletUuid)
    } else {
      // Chama a função closeWallet
      await closeWallet(uuidOrganization, walletUuid)
    }

    if (!signal) {
      setSignal(true)
    } else {
      setSignal(false)
    }

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-2/5 w-[50%] bg-[#131313] text-[#fff] max-w-full border-transparent">
        <DialogHeader className="flex justify-center items-center">
          <DialogTitle className="text-3xl">Confirmation</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Label className="flex flex-row gap-3 text-lg">
            <p className="text-[#959CB6]"> Type to confirm: </p>
            {/* Exibe o valor de confirmação esperado (startwallet ou closewallet) */}
            <p>{expectedValue}</p>
          </Label>
          <Input
            placeholder="Type here"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-1/2 bg-[#131313] border-[#323232] text-[#959CB6]"
          />
        </div>
        <DialogFooter className="flex justify-end items-end">
          <Button
            className="bg-[#1877F2] w-[10%] hover:bg-blue-600 p-5"
            disabled={!isInputValid}
            onClick={handleSendWalletAction}
          >
            Finish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
