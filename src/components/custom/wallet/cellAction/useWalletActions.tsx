import {
  deleteAssetWallet,
  tradeAsset,
  updateAssetIdealAllocation,
} from '@/services/wallet/walletAssetService'
import { useParams } from 'react-router-dom'
import { ClientActive } from '../columns'
import { useToast } from '@/components/ui/use-toast'
import { useSignalStore } from '@/store/signalEffect'
import { TradeType } from '@/types/wallet.type'

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

  const handleTradeAsset = async (tradeAmount: number, action: TradeType) => {
    if (tradeAmount === 0) {
      return toast({
        className: 'bg-red-500 border-0',
        title: 'Invalid tradeAmount',
        description: 'Please provide a valid amount to trade.',
      })
    }

    if (!walletUuid) {
      return toast({
        className: 'bg-red-500 border-0',
        title: 'Invalid wallet ID.',
        description: 'Could not find wallet.',
      })
    }

    toast({
      className: 'bg-yellow-500 border-0',
      title: `Processing ${action}...`,
      description: '',
    })

    try {
      const result = await tradeAsset(
        walletUuid as string,
        rowInfos.id,
        tradeAmount,
        action,
      )

      if (!result) {
        throw new Error('Failed to execute trade')
      }

      setSignal(!signal)
      fetchData()

      toast({
        className: 'bg-green-500 border-0',
        title: `${action} successful!`,
        description: '',
      })
    } catch (error: unknown) {
      console.error(error)
      toast({
        className: 'bg-red-500 border-0',
        title: 'Trade failed',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
      })
    }
  }

  const handleUpdateIdealAllocation = async (idealAllocation: number) => {
    if (!walletUuid) {
      return toast({
        className: 'bg-red-500 border-0',
        title: 'Invalid wallet ID.',
        description: 'Could not find wallet ID.',
      })
    }

    if (idealAllocation < 0 || idealAllocation > 100) {
      return toast({
        className: 'bg-red-500 border-0',
        title: 'Invalid ideal allocation',
        description: 'Ideal allocation must be between 0 and 100.',
      })
    }

    toast({
      className: 'bg-yellow-500 border-0',
      title: 'Processing update ideal allocation...',
      description: '',
    })

    try {
      const result = await updateAssetIdealAllocation(
        walletUuid as string,
        rowInfos.id,
        idealAllocation,
      )

      if (!result) {
        throw new Error('Failed to update ideal allocation')
      }

      setSignal(!signal)
      fetchData()

      toast({
        className: 'bg-green-500 border-0',
        title: 'Ideal allocation updated!',
        description: '',
      })
    } catch (error: unknown) {
      console.error(error)
      toast({
        className: 'bg-red-500 border-0',
        title: 'Failed to update ideal allocation.',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
      })
    }
  }

  const handleDeleteAssetWallet = async () => {
    if (!walletUuid) {
      return toast({
        className: 'bg-red-500 border-0',
        title: 'Invalid wallet ID.',
        description: 'Could not find wallet ID.',
      })
    }

    toast({
      className: 'bg-yellow-500 border-0',
      title: 'Processing delete Asset in wallet',
      description: 'Demo Vault !!',
    })

    try {
      const result = await deleteAssetWallet(walletUuid as string, rowInfos.id)

      if (result.error) {
        throw new Error('Failed to delete asset in wallet')
      }

      setSignal(!signal)
      fetchData()

      toast({
        className: 'bg-green-500 border-0',
        title: 'Success delete !!',
        description: 'Demo Vault !!',
      })
    } catch (error: unknown) {
      console.error(error)
      toast({
        className: 'bg-red-500 border-0',
        title: 'Failed to delete Asset in Wallet',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
      })
    }
  }

  return {
    handleTradeAsset,
    handleUpdateIdealAllocation,
    handleDeleteAssetWallet,
  }
}
