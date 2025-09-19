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
      setIsResultModalOpen(true)
    } catch (error) {
      toast({
        className: 'toast-error',
        title: 'Erro no cálculo do rebalanceamento',
        description: (error as Error).message || 'Algo deu errado.',
        duration: 6000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        className="flex items-center gap-2 bg-[#FF4A3A] px-4 font-medium text-black transition-all duration-200 transform hover:scale-105 hover:bg-red-500 hover:text-white"
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
