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
import { Wallet, StepForwardIcon } from 'lucide-react'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { useState } from 'react'
import RelateClientExchangeModal from './relate-client-exchange-modal'

interface CreateWalletModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateWalletModal({
  isOpen,
  onClose,
}: CreateWalletModalProps) {
  const [currency, setCurrency] = useState('')
  const [performanceFee, setPerformanceFee] = useState('')
  const [benchmark, setBenchmark] = useState('')
  const [riskProfile, setRiskProfile] = useState('')
  const [initialFee, setInitialFee] = useState('')
  const [investedAmount, setInvestedAmount] = useState('')
  const [contractChecked, setContractChecked] = useState(false)
  const [manager, setManager] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
    onClose()
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const calculateProgress = () => {
    let progress = 0

    if (currency) progress += 12.5
    if (performanceFee) progress += 12.5
    if (benchmark) progress += 12.5
    if (riskProfile) progress += 12.5
    if (initialFee) progress += 12.5
    if (investedAmount) progress += 12.5
    if (contractChecked) progress += 12.5
    if (manager) progress += 12.5

    return progress
  }

  const percentage = calculateProgress()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-4/5 w-[60%] bg-[#131313] text-[#fff] max-w-full border-transparent">
        <DialogHeader>
          <DialogTitle className="flex flex-row gap-4 text-3xl items-center">
            Register new Wallet <Wallet className="text-[#F2BE38]" />
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-evenly">
          <div className="w-[26%] h-full flex items-center flex-row">
            <div className="w-[35%]">
              <Select onValueChange={(value) => setCurrency(value)}>
                <SelectTrigger className="bg-[#131313] border-[#323232] text-[#959CB6]">
                  <SelectValue>{currency || 'USD'}</SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-[#131313] border-[#323232] text-[#959CB6]">
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  {/* Add more currency options if needed */}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex h-full w-[26%] justify-center items-center">
            <div style={{ width: 65, height: 65 }}>
              <CircularProgressbar
                value={percentage}
                text={`${Math.round(percentage)}%`}
              />
            </div>
          </div>
          <div className="flex h-full w-[26%]"></div>
        </div>
        <div className="flex flex-row justify-evenly items-center">
          <div className="w-[26%]">
            <Label>Performance Fee</Label>
            <Input
              placeholder="Ex: 10%"
              className="bg-[#131313] border-[#323232] text-[#959CB6]"
              value={performanceFee}
              onChange={(e) => setPerformanceFee(e.target.value)}
            />
          </div>
          <div className="w-[26%]">
            <Label>Benchmark</Label>
            <Select onValueChange={(value) => setBenchmark(value)}>
              <SelectTrigger className="bg-[#131313] border-[#323232] text-[#959CB6]">
                <SelectValue>{benchmark || 'Benchmark'}</SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-[#131313] border-[#323232] text-[#959CB6]">
                <SelectItem value="Benchmark1">Benchmark 1</SelectItem>
                <SelectItem value="Benchmark2">Benchmark 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-[26%]">
            <Label>Risk Profile</Label>
            <Select onValueChange={(value) => setRiskProfile(value)}>
              <SelectTrigger className="bg-[#131313] border-[#323232] text-[#959CB6]">
                <SelectValue>{riskProfile || 'STANDARD'}</SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-[#131313] border-[#323232] text-[#959CB6]">
                <SelectItem value="STANDARD">STANDARD</SelectItem>
                <SelectItem value="HIGH">HIGH</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-row justify-evenly items-center">
          <div className="w-[26%] h-full">
            <Label>Initial Fee $</Label>
            <Input
              placeholder="Ex: $ 1,000"
              className="bg-[#131313] border-[#323232] text-[#959CB6]"
              value={initialFee}
              onChange={(e) => setInitialFee(e.target.value)}
            />
          </div>
          <div className="w-[26%] h-full">
            <Label>Invested amount</Label>
            <Input
              placeholder="Ex: $ 1,000"
              className="bg-[#131313] border-[#323232] text-[#959CB6]"
              value={investedAmount}
              onChange={(e) => setInvestedAmount(e.target.value)}
            />
          </div>
          <div className="w-[26%] h-full flex flex-row gap-5 items-center">
            <Label>Contract</Label>
            <Checkbox
              className="border-gray-500"
              checked={contractChecked}
              onCheckedChange={() => setContractChecked(!contractChecked)}
            />
          </div>
        </div>
        <div className="flex flex-row justify-evenly items-center">
          <div className="w-[26%]">
            <Label>Choose a manager</Label>
            <Select onValueChange={(value) => setManager(value)}>
              <SelectTrigger className="bg-[#131313] border-[#323232] text-[#959CB6]">
                <SelectValue>{manager || 'Name'}</SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-[#131313] border-[#323232] text-[#959CB6]">
                <SelectItem value="Manager1">Manager 1</SelectItem>
                <SelectItem value="Manager2">Manager 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="flex justify-end items-end">
          <Button
            className="bg-[#1877F2] w-1/6 hover:bg-blue-600 p-5 flex items-center justify-center gap-3"
            onClick={openModal}
          >
            <StepForwardIcon />
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
      <RelateClientExchangeModal isOpen={isModalOpen} onClose={closeModal} />
    </Dialog>
  )
}
