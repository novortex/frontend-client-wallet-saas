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
  const closingDate = new Date()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-4/5 w-[60%] bg-[#131313] text-[#fff] max-w-full border-transparent">
        <DialogHeader className="flex flex-col h-4/5">
          <div className="flex flex-row w-full h-1/2 items-end justify-between">
            <DialogTitle className="text-3xl">Closing wallet cycle</DialogTitle>
            <Button
              className="bg-[#1877F2] w-[10%] hover:bg-blue-600 p-5 flex items-center justify-center gap-3"
              onClick={onClose}
            >
              <StepForwardIcon />
              Finish
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
              value={3}
              tagValue={3}
              tagDescription={'OF INITIAL VALUE'}
              tagColor1={1}
              tagColor2={false}
            />
            <CardCloseWallet
              description={'Benchmark surpassed value'}
              value={3}
              tagValue={3}
              tagDescription={'OF BENCHMARK VALUE'}
              tagColor1={2}
              tagColor2={false}
            />
            <CardCloseWallet
              description={'Profitability'}
              value={3}
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
    </Dialog>
  )
}
