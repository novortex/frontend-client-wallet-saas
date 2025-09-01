import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { getAllAssetsOrg } from '@/services/managementService'
import { updateBaseWallet } from '@/services/baseWalletService'
import { TAssetsOrganizationResponse } from '@/types/response.type'
import { BaseWallet } from '@/types/baseWallet.type'

interface AddAssetModalProps {
  isOpen: boolean
  onClose: () => void
  baseWallet: BaseWallet
  onSuccess: () => void
}

export default function AddAssetModal({
  isOpen,
  onClose,
  baseWallet,
  onSuccess,
}: AddAssetModalProps) {
  const [selectedAssetUuid, setSelectedAssetUuid] = useState('')
  const [allocation, setAllocation] = useState('')
  const [assets, setAssets] = useState<TAssetsOrganizationResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingAssets, setIsLoadingAssets] = useState(true)

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setIsLoadingAssets(true)
        const assetsData = await getAllAssetsOrg()
        if (assetsData && Array.isArray(assetsData)) {
          // Filter out assets that are already in the base wallet
          const existingAssetUuids = baseWallet.TargetAssets.map(target => target.assetUuid)
          const availableAssets = assetsData.filter(asset => !existingAssetUuids.includes(asset.uuid))
          setAssets(availableAssets)
        }
      } catch (error) {
        console.error('Error fetching assets:', error)
        toast({
          className: 'toast-error',
          title: 'Erro',
          description: 'Falha ao carregar ativos disponíveis.',
          duration: 6000,
        })
      } finally {
        setIsLoadingAssets(false)
      }
    }

    if (isOpen) {
      fetchAssets()
    }
  }, [isOpen, baseWallet.TargetAssets])

  const handleAddAsset = async () => {
    if (!selectedAssetUuid) {
      toast({
        className: 'toast-error',
        title: 'Erro',
        description: 'Por favor, selecione um ativo.',
        duration: 6000,
      })
      return
    }

    if (!allocation || parseFloat(allocation) <= 0 || parseFloat(allocation) > 100) {
      toast({
        className: 'toast-error',
        title: 'Erro',
        description: 'Por favor, insira uma alocação válida entre 0 e 100.',
        duration: 6000,
      })
      return
    }

    setIsLoading(true)

    try {
      const newTarget = {
        assetUuid: selectedAssetUuid,
        idealAllocation: parseFloat(allocation)
      }

      const updatedTargets = [
        ...baseWallet.TargetAssets.map(target => ({
          cuid: target.cuid,
          assetUuid: target.assetUuid,
          idealAllocation: target.idealAllocation
        })),
        newTarget
      ]

      await updateBaseWallet(baseWallet.uuid, {
        targets: updatedTargets
      })

      toast({
        className: 'toast-success',
        title: 'Sucesso!',
        description: 'Ativo adicionado à carteira padrão com sucesso.',
        duration: 4000,
      })

      setSelectedAssetUuid('')
      setAllocation('')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error adding asset to base wallet:', error)
      toast({
        className: 'toast-error',
        title: 'Erro',
        description: 'Falha ao adicionar ativo à carteira padrão. Tente novamente.',
        duration: 6000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedAssetUuid('')
    setAllocation('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Adicionar Ativo à Carteira
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="asset-select">Ativo</Label>
            <Select 
              value={selectedAssetUuid} 
              onValueChange={setSelectedAssetUuid}
              disabled={isLoadingAssets}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingAssets ? "Carregando..." : "Selecione um ativo"} />
              </SelectTrigger>
              <SelectContent>
                {assets.map(asset => (
                  <SelectItem key={asset.uuid} value={asset.uuid}>
                    {asset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="allocation-input">Alocação (%)</Label>
            <Input
              id="allocation-input"
              type="number"
              placeholder="Ex: 25.5"
              value={allocation}
              onChange={(e) => setAllocation(e.target.value)}
              min="0"
              max="100"
              step="0.1"
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAddAsset}
            disabled={isLoading || isLoadingAssets}
            className="btn-yellow flex-1"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Adicionando...
              </>
            ) : (
              <>
                <Plus size={16} />
                Adicionar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}