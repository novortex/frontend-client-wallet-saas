import { useState, useEffect, useCallback } from 'react'
import { SwitchTheme } from '@/components/custom/switch-theme'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { BaseWallet } from '@/types/baseWallet.type'
import CardBaseWallet from '@/components/custom/card-base-wallet'
import { getBaseWallets } from '@/services/baseWalletService'
import { Loading } from '@/components/custom/loading'
import { Plus } from 'lucide-react'
import CreateBaseWalletModal from './create-base-wallet-modal'

export function BaseWallets() {
  const [baseWallets, setBaseWallets] = useState<BaseWallet[]>([])
  const [filteredBaseWallets, setFilteredBaseWallets] = useState<BaseWallet[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const fetchBaseWallets = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getBaseWallets()
      if (!result || result.length === 0) {
        setIsLoading(false)
        return
      }

      setBaseWallets(result)
      setFilteredBaseWallets(result)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching base wallets:', error)
      toast({
        className: 'toast-error',
        title: 'Erro ao carregar carteiras',
        description: 'Não foi possível carregar as carteiras padrões.',
        duration: 6000,
      })
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBaseWallets()
  }, [fetchBaseWallets])

  useEffect(() => {
    const filtered = baseWallets.filter((baseWallet) => {
      const nameMatches = baseWallet.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const riskMatches = baseWallet.riskProfile
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      
      return nameMatches || riskMatches
    })
    setFilteredBaseWallets(filtered)
  }, [baseWallets, searchTerm])

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Carteiras Padrões
            </h1>
            <p className="text-sm text-muted-foreground">
              Gerencie modelos de carteiras por perfil de risco
            </p>
          </div>
          <SwitchTheme />
        </div>

        <div className="mb-10 flex items-center justify-between">
          <Input
            className="w-5/6 border border-border bg-background text-foreground focus:ring-2 focus:ring-primary"
            type="text"
            placeholder="Buscar por nome ou perfil de risco..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="search-input"
          />
          <Button 
            className="ml-4 btn-yellow"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={16} className="mr-2" />
            Nova Carteira
          </Button>
        </div>

        <div className="mb-4 flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-end">
            Mostrando {filteredBaseWallets.length} de {baseWallets.length} carteiras padrões
          </div>
        </div>

        {baseWallets.length === 0 ? (
          <div className="text-center text-black dark:text-white">
            Nenhuma carteira padrão encontrada
          </div>
        ) : filteredBaseWallets.length === 0 ? (
          <div className="text-center text-black dark:text-white">
            Nenhuma carteira padrão corresponde à sua busca
          </div>
        ) : (
          <div className="grid w-full grid-cols-3 gap-7">
            {filteredBaseWallets.map((baseWallet) => (
              <CardBaseWallet
                key={baseWallet.uuid}
                baseWallet={baseWallet}
              />
            ))}
          </div>
        )}
      </div>
      
      <CreateBaseWalletModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchBaseWallets}
      />
    </div>
  )
}