import { useParams } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { useSignalStore } from '@/store/signalEffect'
import {
  deleteAssetWallet,
  tradeAsset,
  updateAssetIdealAllocation,
} from '@/services/wallet/walletAssetService'
import { ClientActive } from '../columns'

export function useWalletActions(
  rowInfos: ClientActive,
  fetchData: () => void,
) {
  const { walletUuid } = useParams()
  const { toast } = useToast()
  const [setSignal, signal] = useSignalStore((state) => [
    state.setSignal,
    state.signal,
  ])

  const handleUpdateInformationAssetWallet = () => {
    return 'method to be removed'
  }

  const handleTradeAsset = async (
    quantity: number,
  ) => {
    toast({
      className: 'bg-yellow-500 border-0',
      title: 'Processing trade...',
      description: '',
    })

    const result = await tradeAsset(
      walletUuid as string,
      rowInfos.id,
      quantity,
    )

    if (result === false) {
      return toast({
        className: 'bg-red-500 border-0',
        title: 'Failed at trading asset.',
        description: '',
      })
    }

    setSignal(!signal)
    fetchData()

    return toast({
      className: 'bg-green-500 border-0',
      title: 'Success on trade!',
      description: '',
    })
  }

  const handleUpdateIdealAllocation = async (
    idealAllocation: number,
  ) => {
    toast({
      className: 'bg-yellow-500 border-0',
      title: 'Processing update ideal allocation...',
      description: '',
    })

    const result = await updateAssetIdealAllocation(
      walletUuid as string,
      rowInfos.id,
      idealAllocation,
    )

    if (result === false) {
      return toast({
        className: 'bg-red-500 border-0',
        title: 'Failed to update ideal allocation.',
        description: '',
      })
    }

    setSignal(!signal)
    fetchData()

    return toast({
      className: 'bg-green-500 border-0',
      title: 'Success on update ideal allocation!',
      description: '',
    })
  }

  const handleDeleteAssetWallet = async () => {
    toast({
      className: 'bg-yellow-500 border-0',
      title: 'Processing delete Asset in wallet',
      description: 'Demo Vault !!',
    })

    const result = await deleteAssetWallet(walletUuid as string, rowInfos.id)

    if (result.error) {
      return toast({
        className: 'bg-red-500 border-0',
        title: 'Failed delete Asset in Wallet',
        description: 'Demo Vault !!',
      })
    }

    setSignal(!signal)
    fetchData()

    return toast({
      className: 'bg-green-500 border-0',
      title: 'Success delete !!',
      description: 'Demo Vault !!',
    })
  }

  return {
    handleTradeAsset,
    handleUpdateIdealAllocation,
    handleDeleteAssetWallet,
    handleUpdateInformationAssetWallet
  }
}
