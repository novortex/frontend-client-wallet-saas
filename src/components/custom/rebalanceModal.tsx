import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calculator } from 'lucide-react'
import { useState } from 'react'
import { ResultRebalanceModal } from './resultRebalanceModal'
import { useWallet } from '@/hooks/useWallet'
import { toast } from '../ui/use-toast'
import { RebalanceReturn } from '@/types/wallet.type'

type RebalanceModalProps = {
  walletUuid: string
}

export function RebalanceModal({ walletUuid }: RebalanceModalProps) {
  const [isParametersModalOpen, setIsParametersModalOpen] =
    useState<boolean>(false)
  const [isResultModalOpen, setIsResultModalOpen] = useState<boolean>(false)

  const { calculateRebalance } = useWallet(walletUuid)
  const [loading, setLoading] = useState<boolean>(false)
  const [rebalanceResults, setRebalancesResults] = useState<RebalanceReturn[]>(
    [],
  )

  const handleValuesAndSubmit = async () => {
    setLoading(true)
    const results = await calculateRebalance({ minAmount: 2, minPercentage: 4 })

    setRebalancesResults(results)

    toast({
      className: 'bg-green-500 border-0',
      title: `rebalancing done successfully`,
    })

    setIsParametersModalOpen(false)
    setIsResultModalOpen(true)

    setLoading(false)
  }

  return (
    <>
      <Dialog
        open={isParametersModalOpen}
        onOpenChange={setIsParametersModalOpen}
      >
        <DialogTrigger asChild>
          <Button className="bg-[#F2BE38] hover:bg-[#F2BE38] text-[14px] text-black flex items-center justify-center gap-2 ">
            <Calculator />
            calculate rebalance
          </Button>
        </DialogTrigger>
        <DialogContent className="w-fit bg-[#1C1C1C] border-none p-10 gap-12 flex flex-col items-center justify-center">
          <DialogHeader>
            <DialogTitle className="text-[#F2BE38] text-center text-[24px]">
              Rebalancing parameters
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-12 w-full items-center">
            <div className="flex flex-col gap-2 w-full">
              <Label className="text-white flex items-center  gap-2">
                Minimum value
                <p className="text-[#49454F]"> ( Ex: 100 ) </p>
              </Label>
              <Input
                placeholder="R$"
                type="number"
                className="bg-[#171717] text-white w-full"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Label className="text-white flex items-center  gap-2">
                Minimum percentage
                <p className="text-[#49454F]"> ( Ex: 20 ) </p>
              </Label>
              <Input
                placeholder="%"
                type="number"
                className="bg-[#171717] text-white"
              />
            </div>
            <Button
              className="bg-[#F2BE38] hover:bg-[#F2BE38] rounded-[16px] w-[70%] text-black"
              onClick={handleValuesAndSubmit}
            >
              {loading ? 'rebalancing...' : 'Calc'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ResultRebalanceModal
        open={isResultModalOpen}
        onOpenChange={setIsResultModalOpen}
        rebalanceResults={rebalanceResults}
      />
    </>
  )
}
