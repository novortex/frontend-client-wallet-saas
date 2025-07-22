import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { SwitchTheme } from '@/components/custom/switch-theme'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ClientsFilterModal } from '@/components/custom/clientsFilterModal/index'
import { MonthlyStandardizationModal } from './components/MonthlyStandardizationModal'
import { toast } from '@/components/ui/use-toast'
import { formatDate } from '@/utils'
import { TClientInfosResponse } from '@/types/customer.type'
import CardClient from './card-client'
import { getWalletOrganization } from '@/services/wallet/walleInfoService'
import { Loading } from '@/components/custom/loading'
import { getWalletsCash } from '@/services/wallet/walletAssetService'

const ITEMS_PER_PAGE = 12

export function Clients() {
  const [clients, setClients] = useState<TClientInfosResponse[]>([])
  const [filteredClients, setFilteredClients] = useState<
    TClientInfosResponse[]
  >([])
  const [displayedClients, setDisplayedClients] = useState<
    TClientInfosResponse[]
  >([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
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
  const [walletCashData, setWalletCashData] = useState<
    Record<string, number | null>
  >({})
  const [isMonthlyStandardizationOpen, setIsMonthlyStandardizationOpen] =
    useState(false)

  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingTriggerRef = useRef<HTMLDivElement | null>(null)

  const normalizeRiskProfile = useCallback((riskProfile: string) => {
    return riskProfile.toLowerCase().replace(/_/g, '-')
  }, [])

  const fetchClients = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getWalletOrganization()
      if (!result || result.length === 0) {
        setIsLoading(false)
        return toast({
          className: 'bg-red-500 border-0 text-black dark:text-white',
          title: 'Failed to get clients :(',
          description: 'Demo Vault !!',
        })
      }

      const walletsUuids = result.map((client) => client.walletUuid)

      const walletsCashResult = await getWalletsCash(walletsUuids)

      let cashData: Record<string, number | null> = {}

      if (
        walletsCashResult &&
        typeof walletsCashResult === 'object' &&
        !Array.isArray(walletsCashResult)
      ) {
        cashData = walletsCashResult
      } else {
        walletsUuids.forEach((uuid) => {
          cashData[uuid] = null
        })
      }

      setWalletCashData(cashData)
      setClients(result)
      setFilteredClients(result)
      setCurrentPage(1)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching clients:', error)
      toast({
        className: 'bg-red-500 border-0 text-black dark:text-white',
        title: 'Error',
        description: 'Failed to fetch clients. Please try again.',
      })
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchClients()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const memoizedFilteredClients = useMemo(() => {
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

    return clients
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
        if (filterNearestRebalancing && a.nextBalance && b.nextBalance)
          return (
            new Date(a.nextBalance).getTime() -
            new Date(b.nextBalance).getTime()
          )
        if (filterFurtherRebalancing && a.nextBalance && b.nextBalance)
          return (
            new Date(b.nextBalance).getTime() -
            new Date(a.nextBalance).getTime()
          )
        return 0
      })
  }, [clients, filters, searchTerm, walletCashData, normalizeRiskProfile])

  // Atualizar o estado filteredClients quando memoizedFilteredClients mudar
  useEffect(() => {
    setFilteredClients(memoizedFilteredClients)
    setCurrentPage(1) // Reset pagination when filters change
  }, [memoizedFilteredClients])

  // Update displayed clients when filteredClients or currentPage changes
  useEffect(() => {
    const startIndex = 0
    const endIndex = currentPage * ITEMS_PER_PAGE
    setDisplayedClients(filteredClients.slice(startIndex, endIndex))
  }, [filteredClients, currentPage])

  // Load more items
  const loadMore = useCallback(() => {
    if (isLoadingMore) return

    const totalItems = filteredClients.length
    const currentItems = currentPage * ITEMS_PER_PAGE

    if (currentItems >= totalItems) return

    setIsLoadingMore(true)

    // Simulate loading delay (remove this in production if not needed)
    setTimeout(() => {
      setCurrentPage((prev) => prev + 1)
      setIsLoadingMore(false)
    }, 300)
  }, [filteredClients.length, currentPage, isLoadingMore])

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    // Check if IntersectionObserver is available (for test environment compatibility)
    if (typeof IntersectionObserver === 'undefined') {
      return
    }

    const currentTriggerRef = loadingTriggerRef.current

    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !isLoadingMore && !isLoading) {
          loadMore()
        }
      },
      {
        rootMargin: '100px', // Start loading 100px before the trigger comes into view
      },
    )

    if (currentTriggerRef) {
      observerRef.current.observe(currentTriggerRef)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [loadMore, isLoadingMore, isLoading])

  const handleApplyFilters = useCallback(
    (newFilters: Partial<typeof filters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }))
    },
    [],
  )

  const hasMoreItems = displayedClients.length < filteredClients.length

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

      {/* Results counter */}
      <div className="mb-4 flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-end">
          Showing {displayedClients.length} of {filteredClients.length} wallets
          {filteredClients.length !== clients.length &&
            ` (${clients.length} total)`}
        </div>
        <div className="flex gap-4">
          <Button
            onClick={() => setIsMonthlyStandardizationOpen(true)}
            className="bg-[#F2BE38] text-black hover:bg-yellow-600 hover:text-white"
          >
            Monthly Rebalancing
          </Button>
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="text-center text-black dark:text-white">
          No wallets found
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="text-center text-black dark:text-white">
          No wallets match your current filters
        </div>
      ) : (
        <>
          <div className="grid w-full grid-cols-3 gap-7">
            {displayedClients.map((client) => (
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

          {/* Loading trigger for infinite scroll */}
          {hasMoreItems && (
            <div ref={loadingTriggerRef} className="mt-8 flex justify-center">
              {isLoadingMore && (
                <div className="flex items-center gap-2 text-black dark:text-white">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300"></div>
                  <span>Loading more wallets...</span>
                </div>
              )}
            </div>
          )}

          {/* End of results indicator */}
          {!hasMoreItems && displayedClients.length > ITEMS_PER_PAGE && (
            <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              You&apos;ve reached the end of the results
            </div>
          )}
        </>
      )}

      <MonthlyStandardizationModal
        open={isMonthlyStandardizationOpen}
        onOpenChange={setIsMonthlyStandardizationOpen}
      />
    </div>
  )
}

export { Clients as Wallets }
