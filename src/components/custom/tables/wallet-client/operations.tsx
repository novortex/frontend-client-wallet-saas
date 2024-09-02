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
import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { getAllFiatCurrencies } from '@/service/request'
import { useUserStore } from '@/store/user'

interface OperationsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function OperationsModal({
  isOpen,
  onClose,
}: OperationsModalProps) {
  const [operation, setOperation] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('')

  const [operationError, setOperationError] = useState('')
  const [amountError, setAmountError] = useState('')
  const [currencyError, setCurrencyError] = useState('')

  const [fiatCurrencies, setFiatCurrencies] = useState<string[]>([])
  const [uuidOrganization] = useUserStore((state) => [
    state.user.uuidOrganization,
  ])

  const { toast } = useToast()

  useEffect(() => {
    const fetchFiatCurrencies = async () => {
      try {
        const result = await getAllFiatCurrencies(uuidOrganization)

        const currencyAbbreviations = Object.keys(result.currencies)

        setFiatCurrencies(currencyAbbreviations)
      } catch (error) {
        console.error('Error fetching currencies', error)
      }
    }

    fetchFiatCurrencies()
  }, [uuidOrganization])

  const validateAmount = (amount: string) => {
    // Verifica se o valor é um número positivo e contém apenas números e pontos
    const numberPattern = /^\d+(\.\d{1,2})?$/
    if (!numberPattern.test(amount)) {
      setAmountError(
        'Amount must be a positive number and can only contain numbers and points, with up to two decimal places (e.g., 199.99).',
      )
      return false
    }

    // Verifica se o valor é positivo
    if (parseFloat(amount) <= 0) {
      setAmountError('Amount must be a positive number.')
      return false
    }

    setAmountError('')
    return true
  }

  const sendOperation = () => {
    let valid = true

    // Verifica se uma operação foi selecionada
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

    // Valida o campo de valor
    if (!validateAmount(amount)) {
      valid = false
    }

    if (!valid) return

    toast({
      className: 'bg-yellow-500 border-0',
      title: 'Processing operation',
      description: `Operation: ${operation}, Amount: ${amount}, Currency: ${currency}`,
    })

    console.log(`Operation: ${operation}, Amount: ${amount}`)

    setOperation('')
    setAmount('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#131313] h-2/3 text-[#fff] border-transparent">
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
