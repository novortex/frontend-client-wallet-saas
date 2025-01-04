import { useState, useEffect, useCallback } from 'react'
import CardClient from '@/components/custom/card-client'
import { SwitchTheme } from '@/components/custom/switch-theme'
import { Input } from '@/components/ui/input'
import { ClientsFilterModal } from '@/components/custom/clientsFilterModal/index'
import { getWalletOrganization } from '@/services/request'
import { useUserStore } from '@/store/user'
import { toast } from '@/components/ui/use-toast'
import { formatDate } from '@/utils'
import { TClientInfosResponse } from '@/types/customer.type'

export function Clients() {
  const [uuidOrganization] = useUserStore((state) => [
    state.user.uuidOrganization,
  ])
  const [clients, setClients] = useState<TClientInfosResponse[]>([])
  const [filteredClients, setFilteredClients] = useState<
    TClientInfosResponse[]
  >([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    selectedManagers: [] as string[],
    selectedWalletTypes: [] as string[],
    filterDelayed: false,
    filterUnbalanced: false,
  })

  const fetchWalletsAndClients = useCallback(async () => {
    try {
      const result = await getWalletOrganization(uuidOrganization)
      if (!result) {
        return toast({
          className: 'bg-red-500 border-0 text-white',
          title: 'Failed to get clients :(',
          description: 'Demo Vault !!',
        })
      }
      setClients(result)
      setFilteredClients(result)
    } catch (error) {
      console.error('Error fetching wallets and clients:', error)
    }
  }, [uuidOrganization])

  useEffect(() => {
    fetchWalletsAndClients()
  }, [fetchWalletsAndClients])

  const normalizeRiskProfile = (riskProfile: string) =>
    riskProfile.toLowerCase().replace(/_/g, '-')

  const applyFilters = () => {
    const { selectedManagers, selectedWalletTypes, filterUnbalanced } = filters

    const filtered = clients.filter((client) => {
      const nameMatches =
        client.infosClient.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        client.managerName.toLowerCase().includes(searchTerm.toLowerCase())

      const managerMatches =
        selectedManagers.length === 0 ||
        selectedManagers.includes(client.managerName)

      const unbalancedMatches =
        !filterUnbalanced ||
        (client.nextBalance && new Date(client.nextBalance) < new Date())

      const walletTypeMatches =
        selectedWalletTypes.length === 0 ||
        selectedWalletTypes.some((type) => {
          const normalizedType = normalizeRiskProfile(type)
          const normalizedRiskProfile = normalizeRiskProfile(client.riskProfile)
          return normalizedType === normalizedRiskProfile
        })

      return (
        nameMatches && managerMatches && unbalancedMatches && walletTypeMatches
      )
    })

    setFilteredClients(filtered)
  }

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  useEffect(() => {
    applyFilters()
  }, [filters, searchTerm])

  return (
    <div className="p-10">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl text-white font-medium">Wallets</h1>
        <SwitchTheme />
      </div>
      <div className="flex items-center justify-between mb-10">
        <Input
          className="bg-[#171717] w-5/6 border-0 text-white focus:ring-0"
          type="text"
          placeholder="Search for ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ClientsFilterModal onApplyFilters={handleApplyFilters} />
      </div>
      <div className="w-full grid grid-cols-3 gap-7">
        {filteredClients.map((client) => (
          <CardClient
            key={client.walletUuid}
            walletUuid={client.walletUuid}
            name={client.infosClient.name}
            email={client.infosClient.email}
            phone={client.infosClient.phone}
            alerts={0}
            responsible={client.managerName}
            lastRebalancing={
              client.lastBalance
                ? formatDate(client.lastBalance.toString())
                : '-'
            }
            nextRebalancing={
              client.nextBalance
                ? formatDate(client.nextBalance.toString())
                : '-'
            }
          />
        ))}
      </div>
    </div>
  )
}
