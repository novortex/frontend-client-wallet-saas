import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StepForwardIcon, Wallet, Plus, Minus } from 'lucide-react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { useRef, useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { createBaseWallet } from '@/services/baseWalletService'
import { getAllAssetsOrg } from '@/services/managementService'
import { CreateBaseWalletRequest } from '@/types/baseWallet.type'
import { TAssetsOrganizationResponse } from '@/types/response.type'

interface Asset {
  uuid: string
  name: string
  symbol?: string
}

interface AssetAllocation {
  assetUuid: string
  idealAllocation: number
  asset?: Asset
}

interface CreateBaseWalletModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const riskProfiles = [
  { value: 'SUPER_LOW_RISK', label: 'Super Baixo Risco' },
  { value: 'LOW_RISK', label: 'Baixo Risco' },
  { value: 'STANDARD', label: 'Risco Padrão' },
  { value: 'HIGH_RISK', label: 'Alto Risco' },
  { value: 'SUPER_HIGH_RISK', label: 'Super Alto Risco' },
]

export default function CreateBaseWalletModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateBaseWalletModalProps) {
  const [percentage, setPercentage] = useState(0)
  const [assets, setAssets] = useState<TAssetsOrganizationResponse[]>([])
  const [inputValues, setInputValues] = useState({
    name: '',
    riskProfile: '',
  })
  const [assetAllocations, setAssetAllocations] = useState<AssetAllocation[]>([])
  const [errors, setErrors] = useState({ 
    name: '', 
    riskProfile: '', 
    assets: '',
    allocation: '' 
  })
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      fetchAssets()
    }
  }, [isOpen])

  const fetchAssets = async () => {
    try {
      const result = await getAllAssetsOrg()
      if (result && Array.isArray(result)) {
        setAssets(result)
      }
    } catch (error) {
      console.error('Error fetching assets:', error)
      toast({
        className: 'toast-error',
        title: 'Erro ao carregar ativos',
        description: 'Falha ao carregar ativos disponíveis.',
        duration: 6000,
      })
    }
  }

  const updateProgress = () => {
    let progress = 0
    if (inputValues.name.trim()) progress += 50
    if (inputValues.riskProfile) progress += 50
    setPercentage(progress)
  }

  useEffect(() => {
    updateProgress()
  }, [inputValues, assetAllocations])

  const validateInputs = () => {
    const newErrors = { name: '', riskProfile: '', assets: '', allocation: '' }
    
    if (!inputValues.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }
    
    if (!inputValues.riskProfile) {
      newErrors.riskProfile = 'Perfil de risco é obrigatório'
    }
    
    // Only validate allocation if there are assets
    if (assetAllocations.length > 0) {
      const totalAllocation = assetAllocations.reduce(
        (sum, allocation) => sum + allocation.idealAllocation,
        0
      )
      
      if (totalAllocation > 100) {
        newErrors.allocation = 'A soma das alocações não pode exceder 100%'
      }
    }
    
    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  const handleCreateBaseWallet = async () => {
    if (!validateInputs()) return
    
    setIsLoading(true)
    try {
      const createRequest: CreateBaseWalletRequest = {
        name: inputValues.name.trim(),
        riskProfile: inputValues.riskProfile as any,
        targets: assetAllocations.map(allocation => ({
          assetUuid: allocation.assetUuid,
          idealAllocation: allocation.idealAllocation,
        }))
      }
      
      await createBaseWallet(createRequest)
      
      setInputValues({ name: '', riskProfile: '' })
      setAssetAllocations([])
      setPercentage(0)
      onClose()
      onSuccess()
      
      toast({
        className: 'toast-success',
        title: 'Sucesso!',
        description: 'Carteira padrão criada com sucesso.',
        duration: 4000,
      })
    } catch (error) {
      console.error('Error creating base wallet:', error)
      toast({
        className: 'toast-error',
        title: 'Erro ao criar carteira',
        description: 'Falha ao criar carteira padrão. Tente novamente.',
        duration: 6000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInputValues({ ...inputValues, [name]: value })
  }

  const addAssetAllocation = () => {
    setAssetAllocations([
      ...assetAllocations,
      { assetUuid: '', idealAllocation: 0 }
    ])
  }

  const removeAssetAllocation = (index: number) => {
    setAssetAllocations(assetAllocations.filter((_, i) => i !== index))
  }

  const updateAssetAllocation = (index: number, field: keyof AssetAllocation, value: any) => {
    const updated = [...assetAllocations]
    updated[index] = { ...updated[index], [field]: value }
    
    if (field === 'assetUuid') {
      const asset = assets.find(a => a.uuid === value)
      updated[index].asset = asset ? { 
        uuid: asset.uuid, 
        name: asset.name,
        symbol: asset.name 
      } : undefined
    }
    
    setAssetAllocations(updated)
  }

  const totalAllocation = assetAllocations.reduce(
    (sum, allocation) => sum + allocation.idealAllocation,
    0
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex h-[80vh] w-[70%] max-w-full flex-col border-transparent dark:bg-[#131313] dark:text-[#fff]">
        <DialogHeader>
          <DialogTitle className="flex flex-row items-center gap-4 text-3xl">
            Nova Carteira Padrão <Wallet className="dark:text-[#F2BE38]" />
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-grow flex-col justify-start gap-6 overflow-y-auto px-4">
          <div className="flex items-start justify-center">
            <div style={{ width: 65, height: 65 }}>
              <CircularProgressbar
                styles={buildStyles({
                  pathColor: `#F2BE38`,
                  textColor: '#F2BE38',
                })}
                value={percentage}
                text={`${percentage}%`}
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            {/* Name Input */}
            <div className="flex flex-col items-center">
              <Input
                className="w-1/2 dark:border-[#323232] dark:bg-[#131313] dark:text-[#959CB6]"
                placeholder="Nome da Carteira *"
                name="name"
                value={inputValues.name}
                onChange={handleInputChange}
                ref={nameRef}
              />
              {errors.name && (
                <div className="w-1/2 text-sm text-red-500 mt-1">
                  {errors.name}
                </div>
              )}
            </div>

            {/* Risk Profile Select */}
            <div className="flex flex-col items-center">
              <Select 
                value={inputValues.riskProfile} 
                onValueChange={(value) => setInputValues({ ...inputValues, riskProfile: value })}
              >
                <SelectTrigger className="w-1/2 dark:border-[#323232] dark:bg-[#131313] dark:text-[#959CB6]">
                  <SelectValue placeholder="Selecione o Perfil de Risco *" />
                </SelectTrigger>
                <SelectContent className="dark:border-[#323232] dark:bg-[#131313] dark:text-white">
                  {riskProfiles.map((profile) => (
                    <SelectItem 
                      key={profile.value} 
                      value={profile.value}
                      className="cursor-pointer transition-colors text-gray-600 hover:bg-gray-200 hover:text-white dark:text-gray-400 dark:hover:bg-[#1E1E1E] dark:hover:text-white"
                    >
                      {profile.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.riskProfile && (
                <div className="w-1/2 text-sm text-red-500 mt-1">
                  {errors.riskProfile}
                </div>
              )}
            </div>

            {/* Assets Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Alocação de Ativos (Opcional)</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAssetAllocation}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  Adicionar Ativo
                </Button>
              </div>
              
              {assetAllocations.map((allocation, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg dark:border-[#323232]">
                  <Select
                    value={allocation.assetUuid}
                    onValueChange={(value) => updateAssetAllocation(index, 'assetUuid', value)}
                  >
                    <SelectTrigger className="flex-1 dark:border-[#323232] dark:bg-[#131313]">
                      <SelectValue placeholder="Selecione um ativo" />
                    </SelectTrigger>
                    <SelectContent className="dark:border-[#323232] dark:bg-[#131313] dark:text-white">
                      {assets.map((asset) => (
                        <SelectItem 
                          key={asset.uuid} 
                          value={asset.uuid}
                          className="cursor-pointer transition-colors text-gray-600 hover:bg-gray-200 hover:text-white dark:text-gray-400 dark:hover:bg-[#1E1E1E] dark:hover:text-white"
                        >
                          <div className="flex items-center gap-3">
                            <img 
                              src={asset.icon} 
                              alt={asset.name}
                              className="w-5 h-5 rounded-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                              }}
                            />
                            <span>{asset.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Input
                    type="number"
                    placeholder="% Alocação"
                    value={allocation.idealAllocation}
                    onChange={(e) => updateAssetAllocation(index, 'idealAllocation', parseFloat(e.target.value) || 0)}
                    className="w-32 dark:border-[#323232] dark:bg-[#131313]"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeAssetAllocation(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Minus size={16} />
                  </Button>
                </div>
              ))}
              
              {errors.assets && (
                <div className="text-sm text-red-500">
                  {errors.assets}
                </div>
              )}
              
              {errors.allocation && (
                <div className="text-sm text-red-500">
                  {errors.allocation}
                </div>
              )}
              
              {assetAllocations.length > 0 && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total de Alocação: {totalAllocation.toFixed(1)}%
                </div>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex items-center justify-end pt-4">
          <Button
            className="flex w-1/6 items-center justify-center gap-3 bg-[#1877F2] p-5 hover:bg-blue-600"
            onClick={handleCreateBaseWallet}
            disabled={isLoading}
          >
            <StepForwardIcon />
            {isLoading ? 'Criando...' : 'Criar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}