import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useSignalStore } from '@/store/signalEffect'
import { addCryptoOrg } from '@/services/managementService'

export const useAddAsset = (onClose: () => void) => {
  const [assetId, setAssetId] = useState('')
  const [setSignal, signal] = useSignalStore((state) => [
    state.setSignal,
    state.signal,
  ])
  const { toast } = useToast()

  const handleAddAsset = async () => {
    onClose()

    if (!assetId) {
      return toast({
        className: 'bg-destructive border-0 text-destructive-foreground',
        title: 'Asset ID is required',
        description: 'Demo Vault !!',
      })
    }

    toast({
      className: 'bg-warning border-0 text-warning-foreground',
      title: 'Processing add Asset in organization',
      description: 'Demo Vault !!',
    })

    try {
      await addCryptoOrg(Number(assetId))

      setAssetId('')
      setSignal(!signal)

      toast({
        className: 'bg-success border-0 text-success-foreground',
        title: 'Success !! new Asset in organization',
        description: 'Demo Vault !!',
      })
    } catch (error: any) {
      setAssetId('')

      toast({
        className: 'bg-destructive border-0 text-destructive-foreground',
        title: 'Failed to add asset',
        description: error?.message || 'Unexpected error while adding asset',
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*$/.test(value)) {
      setAssetId(value)
    }
  }

  return { assetId, handleAddAsset, handleChange, setAssetId }
}
