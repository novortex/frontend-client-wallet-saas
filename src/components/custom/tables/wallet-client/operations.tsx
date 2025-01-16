import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { StepForwardIcon, HandCoins, Info } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import {
  getAllFiatCurrencies,
  createDepositWithdrawal,
} from '@/services/request'
import { useParams } from 'react-router-dom'
import { useSignalStore } from '@/store/signalEffect'

interface OperationsModalProps {
  isOpen: boolean
  onClose: () => void
  fetchData: () => Promise<void>
}

export default function OperationsModal({
  isOpen,
  onClose,
  fetchData,
}: OperationsModalProps) {
  const [operation, setOperation] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('')

  const [operationError, setOperationError] = useState('')
  const [amountError, setAmountError] = useState('')
  const [currencyError, setCurrencyError] = useState('')

  const [fiatCurrencies, setFiatCurrencies] = useState<string[]>([])
  const [signal, setSignal] = useSignalStore((state) => [
    state.signal,
    state.setSignal,
  ])

  const { walletUuid } = useParams()

  const { toast } = useToast()

  // Estado para controlar o checkbox
  const [isCustomDateEnabled, setIsCustomDateEnabled] = useState(false)
  const [customDate, setCustomDate] = useState('')

  useEffect(() => {
    const fetchFiatCurrencies = async () => {
      try {
        const result = await getAllFiatCurrencies()

        const currencyAbbreviations = Object.keys(result.currencies)

        setFiatCurrencies(currencyAbbreviations)
      } catch (error) {
        console.error('Error fetching currencies', error)
      }
    }

    fetchFiatCurrencies()
  }, [])

  const validateAmount = (amount: string) => {
    const numberPattern = /^\d+(\.\d{1,2})?$/
    if (!numberPattern.test(amount)) {
      setAmountError(
        'Amount must be a positive number and can only contain numbers and points, with up to two decimal places (e.g., 199.99).',
      )
      return false
    }

    if (parseFloat(amount) <= 0) {
      setAmountError('Amount must be a positive number.')
      return false
    }

    setAmountError('')
    return true
  }

  const formatDate = (value: string) => {
    const cleanedValue = value.replace(/\D/g, '')

    if (cleanedValue.length <= 2) return cleanedValue
    if (cleanedValue.length <= 4)
      return `${cleanedValue.slice(0, 2)}/${cleanedValue.slice(2, 4)}`
    return `${cleanedValue.slice(0, 2)}/${cleanedValue.slice(2, 4)}/${cleanedValue.slice(4, 8)}`
  }

  const sendOperation = async () => {
    let valid = true

    if (!operation) {
      setOperationError('Operation is required.')
      valid = false
    } else {
      setOperationError('')
    }

    if (!currency) {
      setCurrencyError('Currency is required.')
      valid = false
    } else {
      setCurrencyError('')
    }

    if (!validateAmount(amount)) {
      valid = false
    }

    if (!walletUuid) throw new Error('Wallet UUID is required.')

    if (!valid) return

    const isWithdrawal = operation === 'Withdrawal'

    try {
      toast({
        className: 'bg-yellow-500 border-0',
        title: 'Operation in progress',
        description: `Operation: ${operation}, Amount: ${amount}, Currency: ${currency}`,
      })

      const customDateFormatted =
        isCustomDateEnabled && customDate
          ? new Date(customDate.split('/').reverse().join('-'))
          : undefined

      const result = await createDepositWithdrawal(
        parseFloat(amount),
        walletUuid,
        currency,
        isWithdrawal,
        customDateFormatted,
      )

      fetchData()

      toast({
        className: 'bg-green-500 border-0',
        title: 'Operation successful',
        description: `Operation: ${operation}, Amount: ${amount}, Currency: ${currency}`,
      })

      if (!signal) {
        setSignal(true)
      } else {
        setSignal(false)
      }
      console.log('Operation successful:', result)
    } catch (error) {
      toast({
        className: 'bg-red-500 border-0',
        title: 'Operation failed',
        description: 'Something went wrong. Please try again later.',
      })

      console.error('Operation failed:', error)
    }

    setOperation('')
    setAmount('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#131313] h-[85%] text-[#fff] border-transparent">
        <DialogHeader>
          <DialogTitle className="flex flex-row gap-4 text-3xl items-center">
            Withdrawal / Deposit <HandCoins className="text-[#F2BE38]" />
          </DialogTitle>
        </DialogHeader>
        <div className="w-full flex justify-center gap-2 flex-col">
          <Label>Currency</Label>
          <Select onValueChange={(value) => setCurrency(value)}>
            <SelectTrigger className="bg-[#131313] border-[#323232] text-[#959CB6] w-1/6">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent className="bg-[#131313] border-[#323232] text-[#959CB6]">
              {fiatCurrencies.map((currency) => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {currencyError && (
            <Label className="text-red-500 mt-2">{currencyError}</Label>
          )}
        </div>
        <div className="w-full flex justify-center gap-2 flex-col">
          <Label>Operation</Label>
          <Select onValueChange={(value) => setOperation(value)}>
            <SelectTrigger className="bg-[#131313] border-[#323232] text-[#959CB6] w-1/2">
              <SelectValue placeholder="Select operation" />
            </SelectTrigger>
            <SelectContent className="bg-[#131313] border-[#323232] text-[#959CB6]">
              <SelectItem value="Withdrawal">Withdrawal</SelectItem>
              <SelectItem value="Deposit">Deposit</SelectItem>
            </SelectContent>
          </Select>
          {operationError && (
            <Label className="text-red-500 mt-2">{operationError}</Label>
          )}
        </div>
        <div className="w-full flex justify-center gap-2 flex-col">
          <Label>Amount</Label>
          <Input
            className="w-1/2 bg-[#131313] border-[#323232] text-[#959CB6]"
            placeholder="Ex: 1000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {amountError && (
            <Label className="text-red-500 mt-2">{amountError}</Label>
          )}
        </div>
        <div className="w-full flex justify-center gap-4 flex-col">
          <div className="flex flex-row gap-2 items-center">
            <Checkbox
              className="border-gray-500"
              onCheckedChange={(checked) =>
                setIsCustomDateEnabled(checked === true)
              }
            />

            <Label>Set Deposit or Withdrawal on a different date</Label>
          </div>
          <Input
            className="w-1/2 bg-[#131313] border-[#323232] text-[#959CB6]"
            placeholder="DD/MM/YYYY"
            value={customDate}
            onChange={(e) => setCustomDate(formatDate(e.target.value))}
            maxLength={10}
            disabled={!isCustomDateEnabled}
          />
        </div>
        <div className="w-full flex items-center">
          <Info className="w-[10%] text-blue-600" />
          <p className="text-[14px] w-[90%]">
            After clicking to finish this operation, the data will be updated
            with no way to revert it, so make sure to check the entire operation
            before completing it.
          </p>
        </div>
        <DialogFooter className="flex justify-end items-end">
          <Button
            className="bg-[#1877F2] w-1/4 hover:bg-blue-600 p-5 flex items-center justify-center gap-3"
            onClick={sendOperation}
          >
            <StepForwardIcon />
            Finish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
