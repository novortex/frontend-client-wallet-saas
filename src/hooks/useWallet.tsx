import { useEffect, useState, useCallback } from 'react'
import {
  calculateRebalanceInWallet,
  getAllAssetsWalletClient,
  updateCurrentAmount,
} from '@/services/walletService'
import { useToast } from '@/components/ui/use-toast'
import { useUserStore } from '@/store/user'
import { ClientActive } from '@/components/custom/tables/wallet-client/columns'
import { TWalletAssetsInfo } from '@/types/wallet.type'

export function useWallet(walletUuid: string) {
  const [data, setData] = useState<ClientActive[]>([])
  const [infosWallet, setInfosWallet] = useState<TWalletAssetsInfo>()
  const [loading, setLoading] = useState(true)
  const [uuidOrganization] = useUserStore((state) => [
    state.user.uuidOrganization,
  ])
  const { toast } = useToast()

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      await updateCurrentAmount(uuidOrganization, walletUuid)
      const result = await getAllAssetsWalletClient(
        uuidOrganization,
        walletUuid,
      )

      if (!result) {
        throw new Error('Failed to fetch assets')
      }

      setInfosWallet(result.wallet)
      setData(
        result.assets.map((item) => ({
          id: item.uuid,
          asset: { urlImage: item.icon, name: item.name },
          investedAmount: item.investedAmount,
          assetQuantity: item.quantityAsset,
          price: item.price,
          allocation: item.currentAllocation,
          idealAllocation: item.idealAllocation,
          idealAmount: item.idealAmountInMoney,
          buyOrSell: item.buyOrSell,
        })),
      )
    } catch (error) {
      toast({
        className: 'bg-red-500 border-0 text-white',
        title: 'Failed to get assets organization',
        description: 'Demo Vault!',
      })
    } finally {
      setLoading(false)
    }
  }, [toast, uuidOrganization, walletUuid])

  const calculateRebalance = useCallback(
    async (rebalanceData: { minAmount: number; minPercentage: number }) => {
      try {
        const result = await calculateRebalanceInWallet(
          walletUuid,
          uuidOrganization,
          rebalanceData,
        )

        toast({
          className: 'bg-green-500 border-0 text-white',
          title: 'Rebalance Successful',
          description: 'Wallet has been rebalanced successfully!',
        })

        return result
      } catch (error) {
        toast({
          className: 'bg-red-500 border-0 text-white',
          title: 'Failed to rebalance wallet',
          description:
            'An error occurred during rebalancing. Please try again.',
        })
        throw error
      }
    },
    [toast, walletUuid],
  )

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, infosWallet, loading, fetchData, calculateRebalance }
}
