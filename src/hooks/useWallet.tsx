import { useEffect, useState } from 'react'
import {
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

  useEffect(() => {
    const fetchData = async () => {
      if (!walletUuid) {
        toast({
          className: 'bg-red-500 border-0 text-white',
          title: 'Failed get assets organization :(',
          description: 'Demo Vault !!',
        })
        return
      }

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

        const dataTable: ClientActive[] = result.assets.map((item) => ({
          id: item.uuid,
          asset: {
            urlImage: item.icon,
            name: item.name,
          },
          investedAmount: item.investedAmount,
          assetQuantity: item.quantityAsset,
          price: item.price,
          allocation: item.currentAllocation,
          idealAllocation: item.idealAllocation,
          idealAmount: item.idealAmountInMoney,
          buyOrSell: item.buyOrSell,
        }))

        setData(dataTable)
      } catch (error) {
        toast({
          className: 'bg-red-500 border-0 text-white',
          title: 'Failed get assets organization :(',
          description: 'Demo Vault !!',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast, uuidOrganization, walletUuid])

  return { data, infosWallet, loading }
}
