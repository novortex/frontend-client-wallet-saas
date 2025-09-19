import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '../ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { StepForwardIcon, Wallet } from 'lucide-react'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { useState } from 'react'
import { useRegisterWallet } from '@/store/registerWallet'
import { useToast } from '../ui/use-toast'
import { useSignalStore } from '@/store/signalEffect'
import { useManagerOrganization } from '@/store/managers_benckmark_exchanges'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { registerWalletForCustomer } from '@/services/wallet/walleInfoService'
import { CustomersOrganization } from './customers/columns'

interface RelateClientExchangeModalProps {
  isOpen: boolean
  onClose: () => void
  rowInfos: CustomersOrganization
}

export default function RelateClientExchangeModal({
  isOpen,
  onClose,
  rowInfos,
}: RelateClientExchangeModalProps) {
  const [initialFeeIsPaid, setInitialFeeIsPaid] = useState(false)
  const [exchangeInfo1, setExchangeInfo1] = useState('')
  const [exchangeInfo2, setExchangeInfo2] = useState('')
  const [exchangeInfo3, setExchangeInfo3] = useState('')
  const [ExchangeSelected, setExchangeSelected] = useState('')

  const [exchangeError, setExchangeError] = useState('')
  const [emailError, setEmailError] = useState('')

  const [exchanges] = useManagerOrganization((state) => [state.exchanges])

  const [setSignal, signal] = useSignalStore((state) => [
    state.setSignal,
    state.signal,
  ])

  const [
    {
      currency,
      benchmark,
      contract,
      initialFee,
      investedAmount,
      manager,
      performanceFee,
      riskProfile,
    },
  ] = useRegisterWallet((state) => [state])

  const { toast } = useToast()

  const calculateProgress = () => {
    let progress = 0

    if (exchangeInfo1) {
      progress += 33
    }

    if (exchangeInfo2) {
      progress += 33
    }

    if (exchangeInfo3) {
      progress += 34
    }

    return progress
  }


  const handleFormValidation = () => {
    let valid = true

    if (!ExchangeSelected) {
      setExchangeError('Exchange is required.')
      valid = false
    } else {
      setExchangeError('')
    }

    if (!exchangeInfo1.trim()) {
      setEmailError('Campo obrigatório.')
      valid = false
    } else {
      setEmailError('')
    }

    return valid
  }

  const closeModal = async () => {
    if (!handleFormValidation()) return

    toast({
      className: 'toast-warning',
      title: 'Processing create wallet for this customer ',
      description: 'Processando criação da wallet...',
      duration: 5000,
    })

    const result = await registerWalletForCustomer(
      rowInfos.id,
      currency,
      investedAmount,
      initialFee,
      initialFeeIsPaid,
      riskProfile,
      contract,
      performanceFee,
      benchmark,
      ExchangeSelected,
      manager,
      exchangeInfo1,
      exchangeInfo2,
      exchangeInfo3,
    )

    if (!result) {
      return toast({
        className: 'toast-error',
        title: 'Failed create a wallet for this customer ',
        description: 'Processando criação da wallet...',
        duration: 6000,
      })
    }

    if (!signal) {
      setSignal(true)
    } else {
      setSignal(false)
    }

    onClose()

    return toast({
      className: 'toast-success',
      title: 'Success !! wallet created for this customer ',
      description: 'Processando criação da wallet...',
      duration: 4000,
    })
  }

  const percentage = calculateProgress()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-4/5 w-[60%] max-w-full border-transparent bg-[#131313] text-[#fff]">
        <DialogHeader>
          <DialogTitle className="flex flex-row items-center gap-4 text-3xl">
            Register new Wallet - (Exchange){' '}
            <Wallet className="text-[#FF4A3A]" />
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-start justify-center">
          <div style={{ width: 65, height: 65 }}>
            <CircularProgressbar
              value={percentage}
              text={`${Math.round(percentage)}%`}
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-evenly gap-5">
          <div className="flex w-2/3 flex-row gap-4">
            <Label>Initial Fee is paid?</Label>
            <Checkbox
              className="border-gray-500"
              checked={initialFeeIsPaid}
              onCheckedChange={() => setInitialFeeIsPaid(!initialFeeIsPaid)}
            />
          </div>
          <div className="w-4/6">
            <Label>Exchanges *</Label>
            <Select onValueChange={(value) => setExchangeSelected(value)}>
              <SelectTrigger className="border-[#323232] bg-[#131313] text-[#959CB6]">
                <SelectValue>
                  {ExchangeSelected
                    ? exchanges.find((mgr) => mgr.uuid === ExchangeSelected)
                        ?.name
                    : 'Name'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="border-[#323232] bg-[#131313] text-[#959CB6]">
                {exchanges.map((bench) => (
                  <SelectItem key={bench.name} value={bench.uuid}>
                    {bench.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {exchangeError && (
              <Label className="mt-2 text-red-500">{exchangeError}</Label>
            )}
          </div>

          <Input
            className="w-2/3 border-[#323232] bg-[#131313] text-[#959CB6]"
            placeholder="Email ou nome de usuário"
            value={exchangeInfo1}
            onChange={(e) => setExchangeInfo1(e.target.value)}
          />
          {emailError && (
            <Label className="mt-2 text-red-500">{emailError}</Label>
          )}
          <Input
            className="w-2/3 border-[#323232] bg-[#131313] text-[#959CB6]"
            placeholder="Email password"
            value={exchangeInfo2}
            onChange={(e) => setExchangeInfo2(e.target.value)}
          />
          <Input
            className="w-2/3 border-[#323232] bg-[#131313] text-[#959CB6]"
            placeholder="Account password"
            value={exchangeInfo3}
            onChange={(e) => setExchangeInfo3(e.target.value)}
          />
        </div>

        <DialogFooter className="flex items-end justify-end">
          <Button
            className="flex w-1/6 items-center justify-center gap-3 bg-[#1877F2] p-5 hover:bg-blue-600"
            onClick={closeModal}
          >
            <StepForwardIcon />
            Finish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
