import { Button } from '@/components/ui/button'
import { ResultRebalanceModal } from './resultRebalanceModal'
import { useState } from 'react'
import { useWallet } from '@/hooks/useWallet'
import { toast } from '../ui/use-toast'
import { RebalanceReturn } from '@/types/wallet.type'
import { Calculator } from 'lucide-react'

type RebalanceModalProps = {
  walletUuid: string
}

export function RebalanceModal({ walletUuid }: RebalanceModalProps) {
  const [isResultModalOpen, setIsResultModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rebalanceResults, setRebalancesResults] = useState<RebalanceReturn[]>(
    [],
  )

  const { calculateRebalance } = useWallet(walletUuid)

  const handleRebalanceCalculation = async () => {
    setLoading(true)

    try {
      const results = await calculateRebalance()
      setRebalancesResults(results)

      toast({
        className: 'bg-green-500 border-0',
        title: 'Rebalancing done successfully',
      })

      setIsResultModalOpen(true)
    } catch (error) {
      toast({
        className: 'bg-red-500 border-0',
        title: 'Error during rebalance calculation',
        description: (error as Error).message || 'Something went wrong.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        className="flex items-center justify-center gap-2 bg-[#F2BE38] text-[14px] text-black hover:bg-yellow-600 hover:text-white"
        onClick={handleRebalanceCalculation}
        disabled={loading}
      >
        <Calculator />
        {loading ? 'Calculating...' : 'Calculate Rebalance'}
      </Button>

      <ResultRebalanceModal
        open={isResultModalOpen}
        onOpenChange={setIsResultModalOpen}
        rebalanceResults={rebalanceResults}
      />
    </>
  )
}
