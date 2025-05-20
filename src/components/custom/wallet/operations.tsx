import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { StepForwardIcon, HandCoins, Info, CalendarIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useParams } from 'react-router-dom'
import { useSignalStore } from '@/store/signalEffect'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { getAllFiatCurrencies } from '@/services/managementService'
import { createDepositWithdrawal } from '@/services/wallet/walletAssetService'

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
  const [dateError, setDateError] = useState('')
  const [fiatCurrencies, setFiatCurrencies] = useState<string[]>([])
  const [signal, setSignal] = useSignalStore((state) => [
    state.signal,
    state.setSignal,
  ])
  const [date, setDate] = useState<Date | null>(null)
  const { walletUuid } = useParams()
  const { toast } = useToast()

  useEffect(() => {
    const fetchFiatCurrencies = async () => {
      try {
        const result = await getAllFiatCurrencies()

        // Verificar o tipo de resposta e processar adequadamente
        let currencyList = []

        if (Array.isArray(result)) {
          // Se for um array, use diretamente
          currencyList = result
        } else if (result && typeof result === 'object') {
          // Se for um objeto com a propriedade currencies
          if (result.currencies) {
            currencyList = Object.keys(result.currencies)
          } else {
            // Tente usar as chaves do objeto diretamente
            currencyList = Object.keys(result)
          }
        }

        console.log('Currencies:', currencyList)
        setFiatCurrencies(currencyList)
      } catch (error) {
        console.error('Error fetching currencies', error)
      }
    }
    fetchFiatCurrencies()
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setOperation('')
      setAmount('')
      setCurrency('')
      setDate(null)
      setOperationError('')
      setAmountError('')
      setCurrencyError('')
      setDateError('')
    }
  }, [isOpen])

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

  const formatDateToISO = (date: Date | null): string => {
    if (!date) return '-'
    return date.toISOString()
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
    if (!date) {
      setDateError('Effective date of operation must be provided')
      valid = false
    } else {
      setDateError('')
    }
    if (!walletUuid) throw new Error('Wallet UUID is required.')
    if (!valid) return

    try {
      toast({
        className: 'bg-yellow-500 border-0',
        title: 'Operation in progress',
        description: `Operation: ${operation}, Amount: ${amount}, Currency: ${currency}`,
      })
      const customDateFormatted = formatDateToISO(date)
      const result = await createDepositWithdrawal(
        parseFloat(amount),
        walletUuid,
        currency,
        operation === 'Withdrawal',
        customDateFormatted,
      )
      fetchData()
      toast({
        className: 'bg-green-500 border-0',
        title: 'Operation successful',
        description: `Operation: ${operation}, Amount: ${amount}, Currency: ${currency}`,
      })
      setSignal(!signal)
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
    setDate(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-[95%] border-transparent dark:bg-[#131313] dark:text-[#fff]">
        <DialogHeader>
          <DialogTitle className="flex flex-row items-center gap-4 text-2xl">
            Withdrawal / Deposit <HandCoins className="text-[#F2BE38]" />
          </DialogTitle>
        </DialogHeader>
        <div className="flex w-full flex-col justify-center gap-2">
          <Label>Currency</Label>
          <Select onValueChange={(value) => setCurrency(value)}>
            <SelectTrigger className="w-1/6 border bg-lightComponent dark:border-[#323232] dark:bg-[#131313] dark:text-[#959CB6]">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent className="max-h-40% scrollbar-thumb-gray-500 border bg-lightComponent dark:border-[#323232] dark:bg-[#131313] dark:text-[#959CB6]">
              {fiatCurrencies.map((currency) => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {currencyError && (
            <Label className="mt-2 text-red-500">{currencyError}</Label>
          )}
        </div>
        <div className="flex w-full flex-col justify-center gap-2">
          <Label>Operation</Label>
          <Select onValueChange={(value) => setOperation(value)}>
            <SelectTrigger className="w-1/2 border bg-lightComponent dark:border-[#323232] dark:bg-[#131313] dark:text-[#959CB6]">
              <SelectValue placeholder="Select operation" />
            </SelectTrigger>
            <SelectContent className="border bg-lightComponent dark:border-[#323232] dark:bg-[#131313] dark:text-[#959CB6]">
              <SelectItem value="Withdrawal">Withdrawal</SelectItem>
              <SelectItem value="Deposit">Deposit</SelectItem>
            </SelectContent>
          </Select>
          {operationError && (
            <Label className="mt-2 text-red-500">{operationError}</Label>
          )}
        </div>
        <div className="flex w-full flex-col justify-center gap-2">
          <Label>Amount</Label>
          <Input
            className="w-1/2 border bg-lightComponent dark:border-[#323232] dark:bg-[#131313] dark:text-[#959CB6]"
            placeholder="Ex: 1000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {amountError && (
            <Label className="mt-2 text-red-500">{amountError}</Label>
          )}
        </div>
        <div className="flex w-full flex-col justify-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[50%] justify-between border bg-lightComponent dark:border-[#323232] dark:bg-[#131313] dark:text-[#959CB6]"
              >
                {date ? date.toLocaleDateString() : 'DD/MM/YYYY'}
                <CalendarIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                onSelect={(newDate) => newDate && setDate(newDate)}
                className="rounded-md dark:bg-[#131313] dark:text-white"
                classNames={{
                  day_today:
                    'bg-transparent text-black dark:text-white hover:bg-white hover:text-black rounded-md',
                  day_selected: 'bg-white text-black hover:bg-white rounded-md',
                }}
              />
            </PopoverContent>
          </Popover>
          {dateError && (
            <Label className="mt-2 text-red-500">{dateError}</Label>
          )}
        </div>
        <div className="flex w-full items-center">
          <Info className="w-[10%] text-blue-600" />
          <p className="w-[90%] text-[14px]">
            After clicking to finish this operation, the data will be updated
            with no way to revert it, so make sure to check the entire operation
            before completing it.
          </p>
        </div>
        <DialogFooter className="flex items-end justify-end">
          <Button
            className="flex w-1/4 items-center justify-center gap-3 bg-[#1877F2] p-5 hover:bg-blue-600"
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
