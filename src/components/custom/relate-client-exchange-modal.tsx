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
import { registerWalletForCustomer } from '@/service/request'
import { useUserStore } from '@/store/user'
import { CustomersOrganization } from './tables/customers/columns'
import { useManagerOrganization } from '@/store/managers_benckmark_exchanges'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
      benchmark,
      contract,
      initialFee,
      investedAmount,
      manager,
      performanceFee,
      riskProfile,
    },
  ] = useRegisterWallet((state) => [state])

  const [uuidOrganization] = useUserStore((state) => [
    state.user.uuidOrganization,
  ])

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

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailPattern.test(email)
  }

  const handleFormValidation = () => {
    let valid = true

    if (!ExchangeSelected) {
      setExchangeError('Exchange is required.')
      valid = false
    } else {
      setExchangeError('')
    }

    if (exchangeInfo1 && !validateEmail(exchangeInfo1)) {
      setEmailError('Invalid email format.')
      valid = false
    } else {
      setEmailError('')
    }

    return valid
  }

  const closeModal = async () => {
    if (!handleFormValidation()) return

    toast({
      className: 'bg-yellow-500 border-0',
      title: 'Processing create wallet for this customer ',
      description: 'Demo Vault !!',
    })

    const result = await registerWalletForCustomer(
      uuidOrganization,
      rowInfos.id,
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
        className: 'bg-red-500 border-0',
        title: 'Failed create a wallet for this customer ',
        description: 'Demo Vault !!',
      })
    }

    if (!signal) {
      setSignal(true)
    } else {
      setSignal(false)
    }

    onClose()

    return toast({
      className: 'bg-green-500 border-0',
      title: 'Success !! wallet created for this customer ',
      description: 'Demo Vault !!',
    })
  }

  const percentage = calculateProgress()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-4/5 w-[60%] bg-[#131313] text-[#fff] max-w-full border-transparent">
        <DialogHeader>
          <DialogTitle className="flex flex-row gap-4 text-3xl items-center">
            Register new Wallet - (Exchange){' '}
            <Wallet className="text-[#F2BE38]" />
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-center items-start">
          <div style={{ width: 65, height: 65 }}>
            <CircularProgressbar
              value={percentage}
              text={`${Math.round(percentage)}%`}
            />
          </div>
        </div>

        <div className="flex flex-col justify-evenly items-center gap-5">
          <div className="w-2/3 flex flex-row gap-4">
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
              <SelectTrigger className="bg-[#131313] border-[#323232] text-[#959CB6]">
                <SelectValue>
                  {ExchangeSelected
                    ? exchanges.find((mgr) => mgr.uuid === ExchangeSelected)
                        ?.name
                    : 'Name'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-[#131313] border-[#323232] text-[#959CB6]">
                {exchanges.map((bench) => (
                  <SelectItem key={bench.name} value={bench.uuid}>
                    {bench.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {exchangeError && (
              <Label className="text-red-500 mt-2">{exchangeError}</Label>
            )}
          </div>

          <Input
            className="w-2/3 bg-[#131313] border-[#323232] text-[#959CB6]"
            placeholder="Account email"
            value={exchangeInfo1}
            onChange={(e) => setExchangeInfo1(e.target.value)}
          />
          {emailError && (
            <Label className="text-red-500 mt-2">{emailError}</Label>
          )}
          <Input
            className="w-2/3 bg-[#131313] border-[#323232] text-[#959CB6]"
            placeholder="Email password"
            value={exchangeInfo2}
            onChange={(e) => setExchangeInfo2(e.target.value)}
          />
          <Input
            className="w-2/3 bg-[#131313] border-[#323232] text-[#959CB6]"
            placeholder="Account password"
            value={exchangeInfo3}
            onChange={(e) => setExchangeInfo3(e.target.value)}
          />
        </div>

        <DialogFooter className="flex justify-end items-end">
          <Button
            className="bg-[#1877F2] w-1/6 hover:bg-blue-600 p-5 flex items-center justify-center gap-3"
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
