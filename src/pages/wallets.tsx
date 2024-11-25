// @
import CardClient from '@/components/custom/card-client'
import { SwitchTheme } from '@/components/custom/switch-theme'
import { Input } from '@/components/ui/input'
import { ClientsFilterModal } from '@/components/custom/clientsFilterModal/index'
import { useState, useEffect, useCallback } from 'react'
import { getWalletOrganization } from '@/services/request'
import { useUserStore } from '@/store/user'
import { toast } from '@/components/ui/use-toast'
import { formatDate } from '@/utils'
import { useSignalStore } from '@/store/signalEffect'
import { TClientInfosResponse } from '@/types/customer.type'

export function Clients() {
  const [uuidOrganization] = useUserStore((state) => [
    state.user.uuidOrganization,
  ])
  const [clients, setClients] = useState<TClientInfosResponse[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isFilterModalClosed, setIsFilterModalClosed] = useState(false)
  const [signal] = useSignalStore((state) => [state.signal])

  // Fetch cached filters for managers and unbalanced status
  const getCachedFilters = () => {
    const cachedManagers = localStorage.getItem('selectedManagers')
    const cachedUnbalanced = localStorage.getItem('filterUnbalanced')
    return {
      selectedManagers: cachedManagers ? JSON.parse(cachedManagers) : [],
      filterUnbalanced: cachedUnbalanced === 'true',
    }
  }

  const { selectedManagers, filterUnbalanced } = getCachedFilters()

  // Fetch wallets and client data
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
    } catch (error) {
      console.error('Error fetching wallets and clients:', error)
    }
  }, [uuidOrganization])

  useEffect(() => {
    fetchWalletsAndClients()
  }, [fetchWalletsAndClients, signal])

  useEffect(() => {
    if (isFilterModalClosed) {
      fetchWalletsAndClients()
      setIsFilterModalClosed(false)
    }
  }, [isFilterModalClosed, fetchWalletsAndClients])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredClients = clients.filter((client) => {
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

    return nameMatches && managerMatches && unbalancedMatches
  })

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
          onChange={handleSearchChange}
        />
        <div className="flex gap-5">
          <ClientsFilterModal onClose={() => setIsFilterModalClosed(true)} />
        </div>
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
              client.lastBalance !== null
                ? formatDate(client.lastBalance.toString())
                : '-'
            }
            nextRebalancing={
              client.nextBalance !== null
                ? formatDate(client.nextBalance.toString())
                : '-'
            }
          />
        ))}
      </div>
    </div>
  )
}
