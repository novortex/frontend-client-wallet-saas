import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '../ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Wallet, StepForwardIcon } from 'lucide-react'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { useEffect, useState } from 'react'
import RelateClientExchangeModal from './relate-client-exchange-modal'
import { useRegisterWallet } from '@/store/registerWallet'
import { useManagerOrganization } from '@/store/managers_benckmark_exchanges'
import { getAllFiatCurrencies } from '@/services/managementService'
import { CustomersOrganization } from './customers/columns'

interface CreateWalletModalProps {
  isOpen: boolean
  onClose: () => void
  rowInfos: CustomersOrganization
}

export default function CreateWalletModal({ isOpen, onClose, rowInfos }: CreateWalletModalProps) {
  const [currency, setCurrency] = useState('')
  const [performanceFee, setPerformanceFee] = useState('')
  const [benchmark, setBenchmark] = useState('')
  const [riskProfile, setRiskProfile] = useState('')
  const [initialFee, setInitialFee] = useState('')
  const [investedAmount, setInvestedAmount] = useState('')
  const [contractChecked, setContractChecked] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [manager, setManager] = useState('')
  const [fiatCurrencies, setFiatCurrencies] = useState<string[]>([])

  const [saveFirstModal] = useRegisterWallet((state) => [state.firstModal])
  const [managersOrganization, benchs] = useManagerOrganization((state) => [state.managers, state.benchs])

  // Função para validar os inputs
  const validateInputs = () => {
    const newErrors = {
      performanceFee: '',
      benchmark: '',
      riskProfile: '',
      initialFee: '',
      investedAmount: '',
      manager: '',
    }

    // Validação da Performance Fee: deve ser um número entre 0 e 100
    if (!/^\d+(\.\d{0,2})?$/.test(performanceFee) || +performanceFee < 0 || +performanceFee > 100) {
      newErrors.performanceFee = 'Performance Fee must be a number between 0 and 100 with up to two decimal places.'
    }

    // Validação do Benchmark: deve ser selecionado
    if (!benchmark) {
      newErrors.benchmark = 'Benchmark must be selected.'
    }

    // Validação do Risk Profile: deve ser selecionado
    if (!riskProfile) {
      newErrors.riskProfile = 'Risk Profile must be selected.'
    }

    // Validação do Initial Fee: deve ser um número positivo e aceitar ponto como separador decimal
    if (!/^\d+(\.\d{1,2})?$/.test(initialFee)) {
      newErrors.initialFee = 'Initial Fee must include only numbers and a point with up to two decimal places (e.g., 199.99).'
    }

    // Validação do Invested Amount: deve ser um número positivo e aceitar ponto como separador decimal
    if (!/^\d+(\.\d{1,2})?$/.test(investedAmount)) {
      newErrors.investedAmount = 'Invested Amount must include only numbers and a point with up to two decimal places (e.g., 199.99).'
    }
    // Validação do Manager: deve ser selecionado
    if (!manager) {
      newErrors.manager = 'Manager must be selected.'
    }

    // Definir os erros e retornar se a validação passou
    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  const [errors, setErrors] = useState({
    performanceFee: '',
    benchmark: '',
    riskProfile: '',
    initialFee: '',
    investedAmount: '',
    manager: '',
  })

  const openModal = () => {
    if (validateInputs()) {
      setIsModalOpen(true)

      saveFirstModal({
        currency,
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
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

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
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#131313] border-[#323232] text-[#959CB6]">
                  {fiatCurrencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex h-full w-[26%] justify-center items-center">
            <div style={{ width: 65, height: 65 }}>
              <CircularProgressbar value={percentage} text={`${Math.round(percentage)}%`} />
            </div>
          </div>
          <div className="flex h-full w-[26%]"></div>
        </div>
        <div className="flex flex-row justify-evenly items-center">
          <div className="w-[26%]">
            <Label>Performance Fee *</Label>
            <Input
              placeholder="Ex: 10"
              className="bg-[#131313] border-[#323232] text-[#959CB6]"
              value={performanceFee}
              onChange={(e) => setPerformanceFee(e.target.value)}
            />
            {errors.performanceFee && <p className="text-red-500">{errors.performanceFee}</p>}
          </div>
          <div className="w-[26%]">
            <Label>Benchmark *</Label>
            <Select onValueChange={(value) => setBenchmark(value)}>
              <SelectTrigger className="bg-[#131313] border-[#323232] text-[#959CB6]">
                <SelectValue>{benchmark ? benchs.find((mgr) => mgr.cuid === benchmark)?.name : 'Name'}</SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-[#131313] border-[#323232] text-[#959CB6]">
                {benchs.map((bench) => (
                  <SelectItem key={bench.name} value={bench.cuid}>
                    {bench.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.benchmark && <p className="text-red-500">{errors.benchmark}</p>}
          </div>
          <div className="w-[26%]">
            <Label>Risk Profile *</Label>
            <Select onValueChange={(value) => setRiskProfile(value)}>
              <SelectTrigger className="bg-[#131313] border-[#323232] text-[#959CB6]">
                <SelectValue>{riskProfile || 'STANDARD'}</SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-[#131313] border-[#323232] text-[#959CB6]">
                <SelectItem value="SUPER_LOW_RISK">SUPER LOW RISK</SelectItem>
                <SelectItem value="LOW_RISK">LOW RISK</SelectItem>
                <SelectItem value="STANDARD">STANDARD</SelectItem>
                <SelectItem value="HIGH_RISK">HIGH RISK</SelectItem>
                <SelectItem value="SUPER_HIGH_RISK">SUPER HIGH RISK</SelectItem>
              </SelectContent>
            </Select>
            {errors.riskProfile && <p className="text-red-500">{errors.riskProfile}</p>}
          </div>
        </div>
        <div className="flex flex-row justify-evenly items-center">
          <div className="w-[26%] h-full">
            <Label>Initial Fee $ *</Label>
            <Input
              placeholder="Ex: 1000"
              className="bg-[#131313] border-[#323232] text-[#959CB6]"
              value={initialFee}
              onChange={(e) => setInitialFee(e.target.value)}
              min="0"
              step="any"
            />
            {errors.initialFee && <p className="text-red-500">{errors.initialFee}</p>}
          </div>
          <div className="w-[26%] h-full">
            <Label>Invested amount *</Label>
            <Input
              placeholder="Ex: 1000"
              className="bg-[#131313] border-[#323232] text-[#959CB6]"
              value={investedAmount}
              onChange={(e) => setInvestedAmount(e.target.value)}
              min="0"
              step="any"
            />
            {errors.investedAmount && <p className="text-red-500">{errors.investedAmount}</p>}
          </div>
          <div className="w-[26%] h-full flex flex-row gap-5 items-center">
            <Label>Contract</Label>
            <Checkbox className="border-gray-500" checked={contractChecked} onCheckedChange={() => setContractChecked(!contractChecked)} />
          </div>
        </div>
        <div className="flex flex-row justify-evenly items-center">
          <div className="w-[26%]">
            <Label>Choose a manager *</Label>
            <Select onValueChange={(value) => setManager(value)}>
              <SelectTrigger className="bg-[#131313] border-[#323232] text-[#959CB6]">
                <SelectValue>{manager ? managersOrganization.find((mgr) => mgr.uuid === manager)?.name : 'Name'}</SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-[#131313] border-[#323232] text-[#959CB6]">
                {managersOrganization.map((manager) => (
                  <SelectItem key={manager.uuid} value={manager.uuid}>
                    {manager.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.manager && <p className="text-red-500">{errors.manager}</p>}
          </div>
        </div>
        <DialogFooter className="flex justify-end items-end">
          <Button className="bg-[#1877F2] w-1/6 hover:bg-blue-600 p-5 flex items-center justify-center gap-3" onClick={openModal}>
            <StepForwardIcon />
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
      <RelateClientExchangeModal rowInfos={rowInfos} isOpen={isModalOpen} onClose={closeModal} />
    </Dialog>
  )
}
