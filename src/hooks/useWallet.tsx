import { useEffect, useState, useCallback } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { TWalletAssetsInfo } from '@/types/wallet.type'
import { getAllAssetsWalletClient } from '@/services/wallet/walletAssetService'
import { ClientActive } from '@/components/custom/wallet/columns'
import {
  calculateRebalanceInWallet,
  updateCurrentAmount,
} from '@/services/wallet/walleInfoService'

export function useWallet(walletUuid: string) {
  const [data, setData] = useState<ClientActive[]>([])
  const [infosWallet, setInfosWallet] = useState<TWalletAssetsInfo>()
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      await updateCurrentAmount(walletUuid)
      const result = await getAllAssetsWalletClient(walletUuid)

      if (!result) {
        throw new Error('Failed to fetch assets')
      }

      setInfosWallet(result.wallet)
      setData(
        result.assets
          .map((item) => ({
            id: item.uuid,
            asset: { urlImage: item.icon, name: item.name },
            currentAmount: item.currentAmount,
            assetQuantity: item.quantityAsset,
            price: item.price,
            allocation: item.currentAllocation,
            idealAllocation: item.idealAllocation,
            idealAmount: item.idealAmountInMoney,
            buyOrSell: item.buyOrSell,
            averagePrice: item.averagePrice,
            profitLossPercentage: item.profitLossPercentage,
          }))
          .sort((a, b) => b.currentAmount - a.currentAmount),
      )
    } catch (error) {
      toast({
        className: 'toast-error',
        title: 'Erro ao carregar ativos',
        description: 'Não foi possível carregar os ativos da organização.',
      })
    } finally {
      setLoading(false)
    }
  }, [toast, walletUuid])

  const calculateRebalance = useCallback(async () => {
    try {
      const result = await calculateRebalanceInWallet(walletUuid)

      toast({
        className: 'toast-success',
        title: 'Rebalanceamento realizado',
        description: 'A carteira foi rebalanceada com sucesso.',
      })

      return result
    } catch (error) {
      toast({
        className: 'toast-error',
        title: 'Erro no rebalanceamento',
        description: 'Ocorreu um erro ao rebalancear a carteira. Tente novamente.',
      })
      throw error
    }
  }, [toast, walletUuid])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, infosWallet, loading, fetchData, calculateRebalance }
}
