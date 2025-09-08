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
        className: 'toast-error',
        title: 'Invalid tradeAmount',
        description: 'Please provide a valid amount to trade.',
        duration: 6000,
      })
    }

    if (!walletUuid) {
      return toast({
        className: 'toast-error',
        title: 'Invalid wallet ID.',
        description: 'Could not find wallet.',
        duration: 6000,
      })
    }

    toast({
      className: 'toast-warning',
      title: `Processing ${action}...`,
      description: '',
      duration: 5000,
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
        className: 'toast-success',
        title: `${action} successful!`,
        description: '',
        duration: 4000,
      })
    } catch (error: unknown) {
      console.error(error)
      toast({
        className: 'toast-error',
        title: 'Trade failed',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
        duration: 6000,
      })
    }
  }

  const handleUpdateIdealAllocation = async (idealAllocation: number) => {
    if (!walletUuid) {
      return toast({
        className: 'toast-error',
        title: 'Invalid wallet ID.',
        description: 'Could not find wallet ID.',
        duration: 6000,
      })
    }

    if (idealAllocation < 0 || idealAllocation > 100) {
      return toast({
        className: 'toast-error',
        title: 'Invalid ideal allocation',
        description: 'Ideal allocation must be between 0 and 100.',
        duration: 6000,
      })
    }

    toast({
      className: 'toast-warning',
      title: 'Processing update ideal allocation...',
      description: '',
      duration: 5000,
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
        className: 'toast-success',
        title: 'Ideal allocation updated!',
        description: '',
        duration: 4000,
      })
    } catch (error: unknown) {
      console.error(error)
      toast({
        className: 'toast-error',
        title: 'Failed to update ideal allocation.',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
        duration: 6000,
      })
    }
  }

  const handleDeleteAssetWallet = async () => {
    if (!walletUuid) {
      return toast({
        className: 'toast-error',
        title: 'Invalid wallet ID.',
        description: 'Could not find wallet ID.',
        duration: 6000,
      })
    }

    toast({
      className: 'toast-warning',
      title: 'Processing delete Asset in wallet',
      description: 'Demo Vault !!',
      duration: 5000,
    })

    try {
      const result = await deleteAssetWallet(walletUuid as string, rowInfos.id)

      if (result.error) {
        throw new Error('Failed to delete asset in wallet')
      }

      setSignal(!signal)
      fetchData()

      toast({
        className: 'toast-success',
        title: 'Success delete !!',
        description: 'Demo Vault !!',
        duration: 4000,
      })
    } catch (error: unknown) {
      console.error(error)
      toast({
        className: 'toast-error',
        title: 'Failed to delete Asset in Wallet',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
        duration: 6000,
      })
    }
  }

  return {
    handleTradeAsset,
    handleUpdateIdealAllocation,
    handleDeleteAssetWallet,
  }
}
