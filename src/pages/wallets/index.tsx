import { useState, useEffect, useCallback } from 'react'
import { SwitchTheme } from '@/components/custom/switch-theme'
import { Input } from '@/components/ui/input'
import { ClientsFilterModal } from '@/components/custom/clientsFilterModal/index'
import { toast } from '@/components/ui/use-toast'
import { formatDate } from '@/utils'
import { TClientInfosResponse } from '@/types/customer.type'
import CardClient from './card-client'
import { getWalletOrganization } from '@/services/wallet/walleInfoService'
import { Loading } from '@/components/custom/loading'
import { getAllAssetsWalletClient } from '@/services/wallet/walletAssetService'

export function Clients() {
  const [clients, setClients] = useState<TClientInfosResponse[]>([])
  const [filteredClients, setFilteredClients] = useState<
    TClientInfosResponse[]
  >([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    selectedManagers: [] as string[],
    selectedWalletTypes: [] as string[],
    selectedAssets: [] as string[],
    filterHasContract: false,
    filterHasNoContract: false,
    filterDelayed: false,
    filterUnbalanced: false,
    filterNewest: false,
    filterOldest: false,
    filterNearestRebalancing: false,
    filterFurtherRebalancing: false,
    selectedExchanges: [] as string[],
    selectedBenchmark: [] as string[],
    selectedCashOptions: [] as string[],
  })
  const [walletCashData, setWalletCashData] = useState<Record<string, number>>(
    {},
  )

  const fetchClients = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getWalletOrganization()
      if (!result) {
        return toast({
          className: 'bg-red-500 border-0 text-black dark:text-white',
          title: 'Failed to get clients :(',
          description: 'Demo Vault !!',
        })
      }

      const cashData: Record<string, number> = {}

      for (const client of result) {
        try {
          const walletData = await getAllAssetsWalletClient(client.walletUuid)
          if (walletData) {
            cashData[client.walletUuid] = walletData.cash
          }
        } catch (err) {
          console.error(
            `Error fetching wallet data for ${client.walletUuid}:`,
            err,
          )
        }
      }

      setWalletCashData(cashData)
      setClients(result)
      setFilteredClients(result)
    } catch (error) {
      console.error('Error fetching clients:', error)
      toast({
        className: 'bg-red-500 border-0 text-black dark:text-white',
        title: 'Error',
        description: 'Failed to fetch clients. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const normalizeRiskProfile = (riskProfile: string) =>
    riskProfile.toLowerCase().replace(/_/g, '-')

  const applyFilters = useCallback(() => {
    const {
      selectedManagers,
      selectedWalletTypes,
      selectedAssets,
      filterHasContract,
      filterHasNoContract,
      filterUnbalanced,
      filterNewest,
      filterOldest,
      filterNearestRebalancing,
      filterFurtherRebalancing,
      selectedExchanges,
      selectedBenchmark,
      selectedCashOptions,
    } = filters

    const filtered = clients
      .filter((client) => {
        const nameMatches = client.infosClient.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())

        const managerMatches =
          selectedManagers.length === 0 ||
          selectedManagers.includes(client.managerName)

        const unbalancedMatches =
          !filterUnbalanced ||
          (client.nextBalance && new Date(client.nextBalance) < new Date())

        const hasContractMatches =
          (!filterHasContract && !filterHasNoContract) ||
          (filterHasContract && client.hasContract === true) ||
          (filterHasNoContract && client.hasContract === false)

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

        const assetsMatch =
          selectedAssets.length === 0 ||
          selectedAssets.every((assetUuid) =>
            client.assetsUuid.includes(assetUuid),
          )

        let cashMatches = true
        if (selectedCashOptions.length > 0) {
          const cashValue = walletCashData[client.walletUuid] || 0

          cashMatches = selectedCashOptions.some((option) => {
            if (option === '0' && cashValue === 0) return true
            if (option === '1-a-5' && cashValue > 0 && cashValue <= 5)
              return true
            if (option === '5-a-10' && cashValue > 5 && cashValue <= 10)
              return true
            if (option === '+10' && cashValue > 10) return true
            return false
          })
        }

        return (
          nameMatches &&
          managerMatches &&
          hasContractMatches &&
          unbalancedMatches &&
          walletTypeMatches &&
          exchangeMatches &&
          benchMarkMatches &&
          assetsMatch &&
          cashMatches
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
  }, [clients, filters, searchTerm, walletCashData])

  useEffect(() => {
    applyFilters()
  }, [filters, searchTerm, walletCashData])

  const handleApplyFilters = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="h-full bg-white p-10 dark:bg-transparent">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl font-medium text-black dark:text-white">
          Wallets
        </h1>
        <SwitchTheme />
      </div>

      <div className="mb-10 flex items-center justify-between">
        <Input
          className="w-5/6 border bg-gray-100 text-black focus:ring-0 dark:bg-[#171717] dark:text-white"
          type="text"
          placeholder="Search for ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          data-testid="search-input"
        />
        <ClientsFilterModal handleApplyFilters={handleApplyFilters} />
      </div>

      {clients.length === 0 ? (
        <div className="text-center text-black dark:text-white">
          No wallets found
        </div>
      ) : (
        <div className="grid w-full grid-cols-3 gap-7">
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
export { Clients as Wallets }
