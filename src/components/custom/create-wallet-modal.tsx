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
import { useRegisterWallet } from '@/store/registerWallet'
import { useManagerOrganization } from '@/store/managers_benckmark_exchanges'
import { CustomersOrganization } from './tables/customers/columns'

interface CreateWalletModalProps {
  isOpen: boolean
  onClose: () => void
  rowInfos: CustomersOrganization
}

export default function CreateWalletModal({
  isOpen,
  onClose,
  rowInfos,
}: CreateWalletModalProps) {
  const [currency, setCurrency] = useState('')
  const [performanceFee, setPerformanceFee] = useState('')
  const [benchmark, setBenchmark] = useState('')
  const [riskProfile, setRiskProfile] = useState('')
  const [initialFee, setInitialFee] = useState('')
  const [investedAmount, setInvestedAmount] = useState('')
  const [contractChecked, setContractChecked] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [manager, setManager] = useState('')

  const [saveFirstModal] = useRegisterWallet((state) => [state.firstModal])
  const [managersOrganization, benchs] = useManagerOrganization((state) => [
    state.managers,
    state.benchs,
  ])

  const openModal = () => {
    setIsModalOpen(true)

    saveFirstModal({
      performanceFee: Number(performanceFee),
      benchmark,
      riskProfile,
      initialFee: Number(initialFee),
      investedAmount: Number(investedAmount),
      contract: contractChecked,
      manager,
    })
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
                <SelectValue>
                  {benchmark
                    ? benchs.find((mgr) => mgr.cuid === benchmark)?.name
                    : 'Name'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-[#131313] border-[#323232] text-[#959CB6]">
                {benchs.map((bench) => (
                  <SelectItem key={bench.name} value={bench.cuid}>
                    {bench.name}
                  </SelectItem>
                ))}
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
                <SelectItem value="SUPER_LOW_RISK">SUPER LOW RISK</SelectItem>
                <SelectItem value="LOW_RISK">LOW RISK</SelectItem>
                <SelectItem value="STANDARD">STANDARD</SelectItem>
                <SelectItem value="HIGH">HIGH RISK</SelectItem>
                <SelectItem value="SUPER_HIGH_RISK">SUPER HIGH RISK</SelectItem>
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
                <SelectValue>
                  {manager
                    ? managersOrganization.find((mgr) => mgr.uuid === manager)
                        ?.name
                    : 'Name'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-[#131313] border-[#323232] text-[#959CB6]">
                {managersOrganization.map((manager) => (
                  <SelectItem key={manager.uuid} value={manager.uuid}>
                    {manager.name}
                  </SelectItem>
                ))}
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
      <RelateClientExchangeModal
        rowInfos={rowInfos}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </Dialog>
  )
}
