import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '../ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { StepForwardIcon, User } from 'lucide-react'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { useState } from 'react'

interface RelateClientExchangeModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RelateClientExchangeModal({
  isOpen,
  onClose,
}: RelateClientExchangeModalProps) {
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)
  const [exchange, setExchange] = useState('')
  const [initialFee, setInitialFee] = useState(false)
  const [exchangeInfo1, setExchangeInfo1] = useState('')
  const [exchangeInfo2, setExchangeInfo2] = useState('')
  const [exchangeInfo3, setExchangeInfo3] = useState('')

  const handleCheckboxChange = () => {
    setIsCheckboxChecked(!isCheckboxChecked)
  }

  const calculateProgress = () => {
    let progress = 0
    const fieldsCount = isCheckboxChecked ? 5 : 2

    if (exchange) progress += 100 / fieldsCount
    if (initialFee) progress += 100 / fieldsCount

    if (isCheckboxChecked) {
      if (exchangeInfo1) progress += 100 / fieldsCount
      if (exchangeInfo2) progress += 100 / fieldsCount
      if (exchangeInfo3) progress += 100 / fieldsCount
    }

    return progress
  }

  const percentage = calculateProgress()

  const closeModal = () => {
    console.log('enviado')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-4/5 w-[60%] bg-[#131313] text-[#fff] max-w-full border-transparent">
        <DialogHeader>
          <DialogTitle className="flex flex-row gap-4 text-3xl items-center">
            Register new Customer <User className="text-[#F2BE38]" />
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
        <div className="flex flex-row">
          <div className="w-[48%] flex flex-col justify-start items-center gap-10">
            <div className="w-2/3">
              <Label>Exchange</Label>
              <Select onValueChange={(value) => setExchange(value)}>
                <SelectTrigger className="bg-[#131313] border-[#323232] text-[#959CB6]">
                  <SelectValue placeholder="Exchange">{exchange}</SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-[#131313] border-[#323232] text-[#959CB6]">
                  <SelectItem value="exchange1">Exchange 1</SelectItem>
                  <SelectItem value="exchange2">Exchange 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-2/3 flex flex-row gap-4">
              <Label>Initial Fee is paid?</Label>
              <Checkbox
                className="border-gray-500"
                checked={initialFee}
                onCheckedChange={() => setInitialFee(!initialFee)}
              />
            </div>
          </div>
          <div className="flex items-center justify-center w-[4%]">
            <div className="w-[2px] bg-gray-500 h-full"></div>
          </div>
          <div className="w-[48%] flex flex-col justify-evenly items-center gap-5">
            <div className="flex flex-row gap-4">
              <Label>Include exchange information?</Label>
              <Checkbox
                className="border-gray-500"
                checked={isCheckboxChecked}
                onCheckedChange={handleCheckboxChange}
              />
            </div>
            <Input
              className="w-2/3 bg-[#131313] border-[#323232] text-[#959CB6]"
              placeholder="Email da conta"
              value={exchangeInfo1}
              onChange={(e) => setExchangeInfo1(e.target.value)}
              disabled={!isCheckboxChecked}
            />
            <Input
              className="w-2/3 bg-[#131313] border-[#323232] text-[#959CB6]"
              placeholder="Senha do email"
              value={exchangeInfo2}
              onChange={(e) => setExchangeInfo2(e.target.value)}
              disabled={!isCheckboxChecked}
            />
            <Input
              className="w-2/3 bg-[#131313] border-[#323232] text-[#959CB6]"
              placeholder="Senha da conta"
              value={exchangeInfo3}
              onChange={(e) => setExchangeInfo3(e.target.value)}
              disabled={!isCheckboxChecked}
            />
          </div>
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
