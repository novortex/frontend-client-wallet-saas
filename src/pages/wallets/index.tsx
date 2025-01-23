import { useState, useEffect, useCallback } from 'react'
import { SwitchTheme } from '@/components/custom/switch-theme'
import { Input } from '@/components/ui/input'
import { ClientsFilterModal } from '@/components/custom/clientsFilterModal/index'
import { getWalletOrganization } from '@/services/request'
import { toast } from '@/components/ui/use-toast'
import { formatDate } from '@/utils'
import { TClientInfosResponse } from '@/types/customer.type'
import { useAuth } from '@/contexts/authContext'
import CardClient from './card-client'

export function Clients() {
  const [clients, setClients] = useState<TClientInfosResponse[]>([])
  const [filteredClients, setFilteredClients] = useState<
    TClientInfosResponse[]
  >([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { token } = useAuth()
  const [filters, setFilters] = useState({
    selectedManagers: [] as string[],
    selectedWalletTypes: [] as string[],
    filterUnbalanced: false,
    filterNewest: false,
    filterOldest: false,
    filterNearestRebalancing: false,
    filterFurtherRebalancing: false,
    selectedExchanges: [] as string[],
    selectedBenchmark: [] as string[],
  })

  const fetchClients = useCallback(async () => {
    if (!token) return

    setIsLoading(true)
    try {
      const result = await getWalletOrganization()
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
      console.error('Error fetching clients:', error)
      toast({
        className: 'bg-red-500 border-0 text-white',
        title: 'Error',
        description: 'Failed to fetch clients. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const normalizeRiskProfile = (riskProfile: string) =>
    riskProfile.toLowerCase().replace(/_/g, '-')

  const applyFilters = useCallback(() => {
    const {
      selectedManagers,
      selectedWalletTypes,
      filterUnbalanced,
      filterNewest,
      filterOldest,
      filterNearestRebalancing,
      filterFurtherRebalancing,
      selectedExchanges,
      selectedBenchmark,
    } = filters

    const filtered = clients
      .filter((client) => {
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
          selectedWalletTypes.some(
            (type) =>
              normalizeRiskProfile(type) ===
              normalizeRiskProfile(client.riskProfile),
          )

        const exchangeMatches =
          selectedExchanges.length === 0 ||
          selectedExchanges.some(
            (selectedExchanges) =>
              selectedExchanges.toLowerCase().trim() ===
              client.exchange.toLowerCase().trim(),
          )

        const benchMarkMatches =
          selectedBenchmark.length === 0 ||
          selectedBenchmark.includes(client.benchmark)

        return (
          nameMatches &&
          managerMatches &&
          unbalancedMatches &&
          walletTypeMatches &&
          exchangeMatches &&
          benchMarkMatches
        )
      })
      .sort((a, b) => {
        if (filterNewest)
          return new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
        if (filterOldest)
          return new Date(a.createAt).getTime() - new Date(b.createAt).getTime()
        if (filterNearestRebalancing)
          return (
            new Date(a.nextBalance).getTime() -
            new Date(b.nextBalance).getTime()
          )
        if (filterFurtherRebalancing)
          return (
            new Date(b.nextBalance).getTime() -
            new Date(a.nextBalance).getTime()
          )
        return 0
      })

    setFilteredClients(filtered)
  }, [clients, filters, searchTerm])

  useEffect(() => {
    applyFilters()
  }, [filters, searchTerm, applyFilters])

  const handleApplyFilters = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  if (isLoading) {
    return (
      <div className="p-10 flex justify-center items-center min-h-screen">
        <div className="text-white">Loading wallets...</div>
      </div>
    )
  }

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
        <ClientsFilterModal handleApplyFilters={handleApplyFilters} />
      </div>

      {clients.length === 0 ? (
        <div className="text-white text-center">No wallets found</div>
      ) : (
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
      )}
    </div>
  )
}
