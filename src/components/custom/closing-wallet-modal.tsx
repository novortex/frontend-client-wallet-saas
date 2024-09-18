import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { StepForwardIcon } from 'lucide-react'
import CardCloseWallet from './close-wallet-card'
import { formatDate } from '@/utils'
import ConfirmCloseWalletModal from './confirm-close-wallet-modal'
import {
  getInfosCustomer,
  TWallet,
  TWalletCommission,
  TWalletInfos,
  updateCurrentAmount,
} from '@/service/request'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useUserStore } from '@/store/user'

interface CloseWalletModalProps {
  isOpen: boolean
  onClose: () => void
  startDate?: string
}

export default function CloseWalletModal({
  isOpen,
  onClose,
  startDate,
}: CloseWalletModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const sendToConfirm = () => {
    onClose()
    openModal()
  }

  const closingDate = new Date()

  const [walletCommission, setWalletCommission] = useState<TWalletCommission[]>(
    [],
  )
  const [walletInfos, setWalletInfos] = useState<TWalletInfos>({
    manager: '',
    lastContactAt: '',
  })

  const [walletI, setWalletI] = useState<TWallet>({
    startDate: '',
    investedAmount: 0,
    currentAmount: 0,
    closeDate: '',
    initialFee: null,
    initialFeePaid: false,
    riskProfile: '',
    monthCloseDate: '',
    contract: false,
    performanceFee: 0,
    benchmark: { name: '' },
    currentValueBenchmark: 0,
    lastRebalance: null,
    nextBalance: null,
    user: {
      name: '',
      email: '',
      phone: '',
      cpf: '',
    },
    exchange: {
      accountEmail: '',
      emailPassword: '',
      exchangePassword: '',
      name: '',
    },
  })

  const { walletUuid } = useParams()
  const uuidOrganization = useUserStore((state) => state.user.uuidOrganization)

  useEffect(() => {
    const getInfo = async () => {
      await updateCurrentAmount(uuidOrganization, walletUuid)

      const result = await getInfosCustomer(walletUuid, uuidOrganization)

      if (!result) {
        return false
      }

      setWalletI(result.walletInfo)
      setWalletInfos(result.walletPreInfos)
      setWalletCommission(result.walletCommission)
    }

    getInfo()
  }, [uuidOrganization, walletUuid])

  const benchMarkSurpassedValue = () => {
    const benchmarkValue = walletI.currentValueBenchmark
    const currentValue = walletI.currentAmount
    const result = currentValue - benchmarkValue
    return result
  }

  const profitability = () => {
    const initialValue = walletI.investedAmount
    const currentValue = walletI.currentAmount
    const result = currentValue - initialValue
    return result
  }

  console.log(walletCommission)
  console.log(walletInfos)
  console.log(walletI)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-[90%] w-[70%] bg-[#131313] text-[#fff] max-w-full border-transparent">
        <DialogHeader className="flex flex-col h-4/5">
          <div className="flex flex-row w-full h-1/2 items-end justify-between">
            <DialogTitle className="text-3xl">Closing wallet cycle</DialogTitle>
            <Button
              className="bg-[#1877F2] w-[15%] hover:bg-blue-600 p-5 flex items-center justify-center gap-3"
              onClick={sendToConfirm}
            >
              <StepForwardIcon />
              Confirm
            </Button>
          </div>
          <div className="flex flex-row items-center w-full h-1/2 gap-10">
            <p>Start date: {startDate || '-'}</p>
            <p>Closing date: {formatDate(closingDate.toString())}</p>
          </div>
        </DialogHeader>
        <div className="flex flex-col gap-10">
          <div className="flex flex-row w-full justify-between">
            <CardCloseWallet
              description={'Current value'}
              value={walletI.currentAmount}
              tagValue={3}
              tagDescription={'OF INITIAL VALUE'}
              tagColor1={1}
              tagColor2={false}
            />
            <CardCloseWallet
              description={'Benchmark surpassed value'}
              value={benchMarkSurpassedValue()}
              tagValue={3}
              tagDescription={'OF BENCHMARK VALUE'}
              tagColor1={2}
              tagColor2={false}
            />
            <CardCloseWallet
              description={'Profitability'}
              value={profitability()}
              tagValue={3}
              tagDescription={'FOR COMMISSIONS'}
              tagColor1={4}
              tagColor2={false}
            />
          </div>
          <div className="flex flex-row w-full justify-between">
            <CardCloseWallet
              description={'Company commision amount'}
              value={3}
              tagValue={3}
              tagDescription={'OF TOTAL VALUE'}
              tagColor1={3}
              tagColor2={true}
              value2={20}
            />
            <CardCloseWallet
              description={'Responsible´s commision'}
              value={3}
              tagValue={3}
              tagDescription={'OF TOTAL VALUE'}
              tagColor1={3}
              tagColor2={true}
              value2={20}
            />
            <CardCloseWallet
              description={'Customer net profit'}
              value={3}
              tagValue={3}
              tagDescription={'OF TOTAL VALUE'}
              tagColor1={3}
              tagColor2={false}
            />
          </div>
        </div>
      </DialogContent>
      <ConfirmCloseWalletModal isOpen={isModalOpen} onClose={closeModal} />
    </Dialog>
  )
}
