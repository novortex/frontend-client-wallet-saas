import { useState, useEffect, useMemo, useCallback } from 'react'
import { getWalletOrganization } from '@/services/wallet/walleInfoService'
import { getWalletHistoric } from '@/services/historicService'
import { TClientInfosResponse } from '@/types/customer.type'
import { FrcStats, HistoricEntry } from '@/types/wallet.type'

interface WalletRecord {
  walletUuid: string
  clientName: string
  managerName: string
  nextRebalancing: string | null
  isDelayedRebalancing: boolean
  rebalanceHistory?: string[] // ISO dates of rebalancing
}

interface ManagerStats {
  managerName: string
  balancedWallets: number
  delayedWallets: number
  totalWallets: number
  percentage: number
}

export interface FilterOptions {
  managersSelected: string[]
  dateFrom: string
  dateTo: string
  manager: string[]
  status: string[]
  searchTerm: string
}

interface StandardizedWalletRecord {
  walletUuid: string
  clientName: string
  managerName: string
  lastRebalance: string | null
  nextRebalance: string | null
  daysSinceLastRebalance: number | null
  isWithinStandardInterval: boolean
  isStandardized: boolean
  statusDescription: string
  rebalanceHistory?: string[]
}

interface StandardizationStats {
  standardizedWallets: number
  nonStandardizedWallets: number
  totalWallets: number
  standardizationPercentage: number
}

export function useWalletMonitoring() {
  const [loading, setLoading] = useState(true)
  const [wallets, setWallets] = useState<WalletRecord[]>([])
  const [standardizedWallets, setStandardizedWallets] = useState<
    StandardizedWalletRecord[]
  >([])
  const [processedManagers, setProcessedManagers] = useState<
    (ManagerStats & { frcData?: FrcStats })[]
  >([])
  const [currentPage, setCurrentPage] = useState(1)
  const [standardizationCurrentPage, setStandardizationCurrentPage] =
    useState(1)
  // FRC specific pagination & filters (separate from balance/standardization)
  const [frcPage, setFrcPage] = useState(1)
  const [frcSelectedManagers, setFrcSelectedManagers] = useState<string[]>([])
  const [frcLoading, setFrcLoading] = useState(false)
  const [frcLoaded, setFrcLoaded] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    managersSelected: [],
    dateFrom: '',
    dateTo: '',
    manager: [],
    status: [],
    searchTerm: '',
  })

  // Function to calculate days since last rebalancing
  const calculateDaysSinceLastRebalance = (
    lastBalance?: string,
  ): number | null => {
    if (!lastBalance) return null

    const lastRebalanceDate = new Date(lastBalance)
    const currentDate = new Date()

    const diffTime = currentDate.getTime() - lastRebalanceDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  // Function to check if a wallet is standardized (based on dates)
  const checkWalletStandardization = useCallback(
    (wallet: TClientInfosResponse): StandardizedWalletRecord => {
      const lastRebalance = wallet.lastBalance
      const nextRebalance = wallet.nextBalance
      const daysSinceLastRebalance =
        calculateDaysSinceLastRebalance(lastRebalance)

      let isWithinStandardInterval = false
      let statusDescription = 'No rebalance data'
      let isStandardized = false

      if (lastRebalance && nextRebalance && daysSinceLastRebalance !== null) {
        const lastDate = new Date(lastRebalance)
        const nextDate = new Date(nextRebalance)
        const currentDate = new Date()

        const daysUntilNext = Math.ceil(
          (nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24),
        )

        const daysFromLastToNext = Math.ceil(
          (nextDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
        )

        const STANDARDIZATION_TOLERANCE_DAYS = 7
        isWithinStandardInterval =
          Math.abs(daysFromLastToNext - 30) <= STANDARDIZATION_TOLERANCE_DAYS
        isStandardized = isWithinStandardInterval && daysUntilNext > 0

        if (isStandardized) {
          statusDescription = `Standardized (${daysUntilNext} days until rebalance)`
        } else if (daysUntilNext <= 0) {
          statusDescription = `Overdue (${Math.abs(daysUntilNext)} days)`
        } else {
          statusDescription = `Non-standard interval (${daysFromLastToNext} days)`
        }
      }

      return {
        walletUuid: wallet.walletUuid,
        clientName: wallet.infosClient?.name || 'N/A',
        managerName: wallet.managerName || 'N/A',
        lastRebalance,
        nextRebalance,
        daysSinceLastRebalance,
        isWithinStandardInterval,
        isStandardized,
        statusDescription,
        rebalanceHistory:
          (wallet as TClientInfosResponse & { rebalanceHistory?: string[] })
            .rebalanceHistory || [],
      }
    },
    [],
  )

  // Helper to classify wallet FRC
  const classifyWalletFrc = (
    events: HistoricEntry[],
    last?: string | null,
    next?: string | null,
  ): 'FRC0' | 'FRC1' | 'FRC_GT1' => {
    const lastDate = last ? new Date(last) : null
    const nextDate = next ? new Date(next) : null
    // Filter only BUY/SELL inside the cycle window
    const relevant = events.filter((e) => {
      if (e.historyType !== 'BUY_ASSET' && e.historyType !== 'SELL_ASSET')
        return false
      const created = new Date(e.createAt)
      if (lastDate && created < lastDate) return false
      if (nextDate && created >= nextDate) return false
      return true
    })
    // Group by calendar day (1-day window). Multiple trades same day = 1 rebalance.
    const uniqueDays = new Set<string>()
    relevant.forEach((e) => {
      const d = new Date(e.createAt)
      // Using UTC date component; adjust if business timezone differs.
      const dayKey = d.toISOString().slice(0, 10) // YYYY-MM-DD
      uniqueDays.add(dayKey)
    })
    const rebalanceCount = uniqueDays.size
    if (rebalanceCount === 0) return 'FRC0'
    if (rebalanceCount === 1) return 'FRC1'
    return 'FRC_GT1'
  }

  // Fetch consolidated data (wallets + FRC)
  const fetchWalletsAndFrc = useCallback(async () => {
    try {
      setLoading(true)

      const walletsResponse = await getWalletOrganization()

      if (walletsResponse && Array.isArray(walletsResponse)) {
        const walletRecords: WalletRecord[] = walletsResponse.map((wallet) => ({
          walletUuid: wallet.walletUuid,
          clientName: wallet.infosClient?.name || 'N/A',
          managerName: wallet.managerName || 'N/A',
          nextRebalancing: wallet.nextBalance,
          isDelayedRebalancing: calculateRebalancingStatus(wallet.nextBalance),
          rebalanceHistory:
            (wallet as TClientInfosResponse & { rebalanceHistory?: string[] })
              .rebalanceHistory || [],
        }))

        setWallets(walletRecords)

        // Data for standardization
        const standardizationResults = walletsResponse.map((wallet) =>
          checkWalletStandardization(wallet),
        )
        setStandardizedWallets(standardizationResults)

        const managerFrcAccumulator = new Map<
          string,
          {
            managerName: string
            managerUuid?: string
            totalClients: number
            frc0Count: number
            frc1Count: number
            frcMoreThan1Count: number
          }
        >()

        for (const w of walletsResponse) {
          try {
            const history = await getWalletHistoric(w.walletUuid)
            const bucket = classifyWalletFrc(
              history || [],
              w.lastBalance,
              w.nextBalance,
            )
            const mgr = w.managerName || 'N/A'
            const selectedManager = managerFrcAccumulator.get(mgr) || {
              managerName: mgr,
              managerUuid: undefined,
              totalClients: 0,
              frc0Count: 0,
              frc1Count: 0,
              frcMoreThan1Count: 0,
            }
            selectedManager.totalClients += 1
            if (bucket === 'FRC0') selectedManager.frc0Count += 1
            else if (bucket === 'FRC1') selectedManager.frc1Count += 1
            else selectedManager.frcMoreThan1Count += 1
            managerFrcAccumulator.set(mgr, selectedManager)
          } catch (err) {
            // Ignore individual history errors so rest can proceed
            console.error(
              'Error fetching history for wallet',
              w.walletUuid,
              err,
            )
          }
        }

        // Build FrcStats objects
        const computedFrcStats: FrcStats[] = Array.from(
          managerFrcAccumulator.values(),
        ).map((m) => {
          const { totalClients, frc0Count, frc1Count, frcMoreThan1Count } = m
          return {
            managerName: m.managerName,
            managerUuid: m.managerUuid || '',
            totalClients,
            frc0Count,
            frc1Count,
            frcMoreThan1Count,
            frc0Percent:
              totalClients > 0 ? (frc0Count / totalClients) * 100 : 0,
            frc1Percent:
              totalClients > 0 ? (frc1Count / totalClients) * 100 : 0,
            frcMoreThan1Percent:
              totalClients > 0 ? (frcMoreThan1Count / totalClients) * 100 : 0,
            period: 'current-cycle',
          }
        })

        // Create a Map of FRC data by manager for merging
        const frcByManagerName = new Map<string, FrcStats>()
        computedFrcStats.forEach((frc) => {
          frcByManagerName.set(frc.managerName, frc)
        })

        // Calculate manager stats with integrated (computed) FRC data
        const managerMap = new Map<
          string,
          ManagerStats & { frcData?: FrcStats }
        >()

        walletRecords.forEach((wallet) => {
          const selectedManager = managerMap.get(wallet.managerName) || {
            managerName: wallet.managerName,
            balancedWallets: 0,
            delayedWallets: 0,
            totalWallets: 0,
            percentage: 0,
            frcData: undefined,
          }

          selectedManager.totalWallets++
          if (wallet.isDelayedRebalancing) {
            selectedManager.delayedWallets++
          } else {
            selectedManager.balancedWallets++
          }

          selectedManager.percentage =
            (selectedManager.balancedWallets / selectedManager.totalWallets) *
            100

          // Add FRC data if available for this manager
          if (!selectedManager.frcData) {
            selectedManager.frcData = frcByManagerName.get(wallet.managerName)
          }

          managerMap.set(wallet.managerName, selectedManager)
        })

        // Save processed managers (with or without FRC data)
        const processedManagersArray = Array.from(managerMap.values())

        setProcessedManagers(processedManagersArray)
      }
    } catch (error) {
      console.error('Error fetching wallet and FRC data:', error)
    } finally {
      setLoading(false)
    }
  }, [checkWalletStandardization])

  // lazy loaded
  const fetchFrcData = useCallback(async () => {
    if (frcLoaded) return // Already loaded

    try {
      setFrcLoading(true)

      const walletsResponse = await getWalletOrganization()

      if (walletsResponse && Array.isArray(walletsResponse)) {
        const managerFrcAccumulator = new Map<
          string,
          {
            managerName: string
            managerUuid?: string
            totalClients: number
            frc0Count: number
            frc1Count: number
            frcMoreThan1Count: number
          }
        >()

        for (const w of walletsResponse) {
          try {
            const history = await getWalletHistoric(w.walletUuid)
            const bucket = classifyWalletFrc(
              history || [],
              w.lastBalance,
              w.nextBalance,
            )
            const mgr = w.managerName || 'N/A'
            const selectedManager = managerFrcAccumulator.get(mgr) || {
              managerName: mgr,
              managerUuid: undefined,
              totalClients: 0,
              frc0Count: 0,
              frc1Count: 0,
              frcMoreThan1Count: 0,
            }
            selectedManager.totalClients += 1
            if (bucket === 'FRC0') selectedManager.frc0Count += 1
            else if (bucket === 'FRC1') selectedManager.frc1Count += 1
            else selectedManager.frcMoreThan1Count += 1
            managerFrcAccumulator.set(mgr, selectedManager)
          } catch (err) {
            // Ignore individual history errors so rest can proceed
            console.error(
              'Error fetching history for wallet',
              w.walletUuid,
              err,
            )
          }
        }

        // Build FrcStats objects
        const computedFrcStats: FrcStats[] = Array.from(
          managerFrcAccumulator.values(),
        ).map((m) => {
          const { totalClients, frc0Count, frc1Count, frcMoreThan1Count } = m
          return {
            managerName: m.managerName,
            managerUuid: m.managerUuid || '',
            totalClients,
            frc0Count,
            frc1Count,
            frcMoreThan1Count,
            frc0Percent:
              totalClients > 0 ? (frc0Count / totalClients) * 100 : 0,
            frc1Percent:
              totalClients > 0 ? (frc1Count / totalClients) * 100 : 0,
            frcMoreThan1Percent:
              totalClients > 0 ? (frcMoreThan1Count / totalClients) * 100 : 0,
            period: 'current-cycle',
          }
        })

        // Update processed managers with FRC data
        setProcessedManagers((prev) =>
          prev.map((manager) => {
            const frcData = computedFrcStats.find(
              (frc) => frc.managerName === manager.managerName,
            )
            return { ...manager, frcData }
          }),
        )

        setFrcLoaded(true)
      }
    } catch (error) {
      console.error('Error fetching FRC data:', error)
    } finally {
      setFrcLoading(false)
    }
  }, [frcLoaded])

  const [searchTerm, setSearchTerm] = useState('')

  // Pagination constants
  const ITEMS_PER_PAGE = 10

  // Function to determine if a wallet has overdue rebalancing
  const calculateRebalancingStatus = (
    nextRebalancing: string | null,
  ): boolean => {
    if (!nextRebalancing) return false

    const rebalanceDate = new Date(nextRebalancing)
    const currentDate = new Date()

    rebalanceDate.setHours(0, 0, 0, 0)
    currentDate.setHours(0, 0, 0, 0)

    return rebalanceDate < currentDate
  }

  const managerStats = processedManagers

  // Calculate overall statistics (balancing)
  const stats = useMemo(() => {
    const perfectManagers = managerStats.filter(
      (m) => m.percentage === 100,
    ).length
    const goodManagers = managerStats.filter(
      (m) => m.percentage >= 80 && m.percentage < 100,
    ).length
    const warningManagers = managerStats.filter(
      (m) => m.percentage >= 60 && m.percentage < 80,
    ).length
    const criticalManagers = managerStats.filter(
      (m) => m.percentage < 60,
    ).length

    return {
      perfectManagers,
      goodManagers,
      warningManagers,
      criticalManagers,
      totalManagers: managerStats.length,
    }
  }, [managerStats])

  // Calculate standardization statistics
  const standardizationStats = useMemo((): StandardizationStats => {
    const standardizedCount = standardizedWallets.filter(
      (w) => w.isStandardized,
    ).length
    const nonStandardizedCount = standardizedWallets.length - standardizedCount
    const standardizationPercentage =
      standardizedWallets.length > 0
        ? (standardizedCount / standardizedWallets.length) * 100
        : 0

    return {
      standardizedWallets: standardizedCount,
      nonStandardizedWallets: nonStandardizedCount,
      totalWallets: standardizedWallets.length,
      standardizationPercentage,
    }
  }, [standardizedWallets])

  // Apply filters and search
  const filteredManagers = useMemo(() => {
    let filtered = managerStats

    if (filters.manager.length > 0) {
      filtered = filtered.filter((manager) =>
        filters.manager.includes(manager.managerName),
      )
    }

    if (filters.status.length > 0) {
      filtered = filtered.filter((manager) => {
        if (filters.status.includes('perfect') && manager.percentage === 100)
          return true
        if (
          filters.status.includes('good') &&
          manager.percentage >= 80 &&
          manager.percentage < 100
        )
          return true
        if (
          filters.status.includes('warning') &&
          manager.percentage >= 60 &&
          manager.percentage < 80
        )
          return true
        if (filters.status.includes('critical') && manager.percentage < 60)
          return true
        return false
      })
    }

    if (searchTerm) {
      filtered = filtered.filter((manager) =>
        manager.managerName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    return filtered
  }, [managerStats, filters, searchTerm])

  // Apply filters for standardization
  const filteredStandardizedWallets = useMemo(() => {
    let filtered = standardizedWallets

    if (filters.manager.length > 0) {
      filtered = filtered.filter((wallet) =>
        filters.manager.includes(wallet.managerName),
      )
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (wallet) =>
          wallet.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          wallet.managerName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    return filtered
  }, [standardizedWallets, filters, searchTerm])

  // Pagination for balancing
  const paginatedManagers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredManagers.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredManagers, currentPage])

  // Pagination for standardization
  const paginatedStandardizedWallets = useMemo(() => {
    const startIndex = (standardizationCurrentPage - 1) * ITEMS_PER_PAGE
    return filteredStandardizedWallets.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    )
  }, [filteredStandardizedWallets, standardizationCurrentPage])

  // Calculate pagination info
  const totalPages = Math.ceil(filteredManagers.length / ITEMS_PER_PAGE)
  const standardizationTotalPages = Math.ceil(
    filteredStandardizedWallets.length / ITEMS_PER_PAGE,
  )
  const canPreviousPage = currentPage > 1
  const canNextPage = currentPage < totalPages
  const canStandardizationPreviousPage = standardizationCurrentPage > 1
  const canStandardizationNextPage =
    standardizationCurrentPage < standardizationTotalPages

  // Unique managers for filters
  const uniqueManagers = useMemo(() => {
    return Array.from(new Set(wallets.map((w) => w.managerName))).map(
      (manager) => ({ name: manager }),
    )
  }, [wallets])

  // FRC filtered managers
  const frcManagersFiltered = useMemo(() => {
    let list = processedManagers
    if (frcSelectedManagers.length > 0) {
      list = list.filter((m) => frcSelectedManagers.includes(m.managerName))
    }
    if (searchTerm) {
      list = list.filter((m) =>
        m.managerName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    return list
  }, [processedManagers, frcSelectedManagers, searchTerm])

  useEffect(() => {
    setFrcPage(1)
  }, [frcSelectedManagers, searchTerm, processedManagers])

  const frcTotalPages =
    Math.ceil(frcManagersFiltered.length / ITEMS_PER_PAGE) || 1
  const canFrcPrevious = frcPage > 1
  const canFrcNext = frcPage < frcTotalPages
  const paginatedFrcManagers = useMemo(() => {
    const start = (frcPage - 1) * ITEMS_PER_PAGE
    return frcManagersFiltered.slice(start, start + ITEMS_PER_PAGE)
  }, [frcManagersFiltered, frcPage])

  useEffect(() => {
    fetchWalletsAndFrc()
  }, [fetchWalletsAndFrc])

  return {
    loading,
    managers: paginatedManagers,
    stats,
    currentPage,
    setCurrentPage,
    canPreviousPage,
    canNextPage,
    totalPages,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    uniqueManagers,
    // New returns for standardization
    standardizationStats,
    standardizedWallets: paginatedStandardizedWallets,
    standardizationCurrentPage,
    setStandardizationCurrentPage,
    canStandardizationPreviousPage,
    canStandardizationNextPage,
    standardizationTotalPages,
    processedManagers,
    frcPage,
    setFrcPage,
    frcTotalPages,
    canFrcPrevious,
    canFrcNext,
    paginatedFrcManagers,
    frcSelectedManagers,
    setFrcSelectedManagers,
    frcLoading,
    fetchFrcData,
  }
}
