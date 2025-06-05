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

    toast({
      className: 'bg-yellow-500 border-0',
      title: 'Processing add Asset in organization',
      description: 'Demo Vault !!',
    })
    if (!assetId) {
      return toast({
        className: 'bg-red-500 border-0',
        title: 'Asset ID is required',
        description: 'Demo Vault !!',
      })
    }
    const result = await addCryptoOrg(Number(assetId))

    if (result === false) {
      setAssetId('')
      return toast({
        className: 'bg-red-500 border-0',
        title: 'Failed add Asset in organization',
        description: 'Demo Vault !!',
      })
    }

    setAssetId('')
    setSignal(!signal)
    toast({
      className: 'bg-green-500 border-0',
      title: 'Success !! new Asset in organization',
      description: 'Demo Vault !!',
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*$/.test(value)) {
      // Permite apenas dígitos
      setAssetId(value)
    }
  }

  return { assetId, handleAddAsset, handleChange, setAssetId }
}
