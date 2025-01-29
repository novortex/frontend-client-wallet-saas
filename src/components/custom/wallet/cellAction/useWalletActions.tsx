import { useParams } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { useSignalStore } from '@/store/signalEffect'
import {
  deleteAssetWallet,
  updateAssetWalletInformations,
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

  const handleUpdateInformationAssetWallet = async (
    quantity: number,
    idealAllocation: number,
  ) => {
    toast({
      className: 'bg-yellow-500 border-0',
      title: 'Processing add Asset in organization',
      description: 'Demo Vault !!',
    })

    const result = await updateAssetWalletInformations(
      walletUuid as string,
      rowInfos.id,
      quantity,
      idealAllocation,
    )

    if (result === false) {
      return toast({
        className: 'bg-red-500 border-0',
        title: 'Failed add Asset in organization',
        description: 'Demo Vault !!',
      })
    }

    setSignal(!signal)
    fetchData()

    return toast({
      className: 'bg-green-500 border-0',
      title: 'Success update !!',
      description: 'Demo Vault !!',
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
    handleUpdateInformationAssetWallet,
    handleDeleteAssetWallet,
  }
}
