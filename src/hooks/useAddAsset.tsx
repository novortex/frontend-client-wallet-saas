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
        className: 'toast-error',
        title: 'ID do ativo é obrigatório',
        description: 'Por favor, insira um ID válido para o ativo.',
        duration: 6000,
      })
    }

    toast({
      className: 'toast-warning',
      title: 'Processando ativo',
      description: 'Adicionando ativo à organização...',
      duration: 5000,
    })

    try {
      await addCryptoOrg(Number(assetId))

      setAssetId('')
      setSignal(!signal)

      toast({
        className: 'toast-success',
        title: 'Ativo adicionado com sucesso',
        description: 'O novo ativo foi adicionado à organização.',
        duration: 4000,
      })
    } catch (error: any) {
      setAssetId('')

      toast({
        className: 'toast-error',
        title: 'Erro ao adicionar ativo',
        description: error?.message || 'Erro inesperado ao adicionar o ativo.',
        duration: 6000,
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
