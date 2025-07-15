import { useState, useEffect, useMemo, useCallback } from 'react'
import { getWalletOrganization } from '@/services/wallet/walleInfoService'

export interface WalletRecord {
  walletUuid: string
  clientName: string
  managerName: string
  nextRebalancing: string | null
  isDelayedRebalancing: boolean
}

export interface ManagerStats {
  managerName: string
  totalWallets: number
  balancedWallets: number
  delayedWallets: number
  percentage: number
}

export interface FilterOptions {
  manager: string[]
  status: string[] // 'balanced', 'delayed'
  searchTerm: string
}

export interface WalletMonitoringStats {
  totalManagers: number
  perfectManagers: number // 100%
  goodManagers: number // 80-99%
  warningManagers: number // 60-79%
  criticalManagers: number // <60%
}

export function useWalletMonitoring() {
  const [loading, setLoading] = useState(true)
  const [wallets, setWallets] = useState<WalletRecord[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<FilterOptions>({
    manager: [],
    status: [],
    searchTerm: '',
  })
  const [searchTerm, setSearchTerm] = useState('')

  // Constantes de paginação
  const ITEMS_PER_PAGE = 10

  // Função para determinar se uma carteira está com rebalanceamento atrasado
  const calculateRebalancingStatus = (
    nextRebalancing: string | null,
  ): boolean => {
    if (!nextRebalancing) return false

    const rebalanceDate = new Date(nextRebalancing)
    const currentDate = new Date()

    // Remove a hora para comparar apenas a data
    rebalanceDate.setHours(0, 0, 0, 0)
    currentDate.setHours(0, 0, 0, 0)

    return rebalanceDate < currentDate
  }

  // Buscar dados das carteiras
  const fetchWallets = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getWalletOrganization()

      if (response && Array.isArray(response)) {
        const walletRecords: WalletRecord[] = response.map((wallet) => ({
          walletUuid: wallet.walletUuid,
          clientName: wallet.infosClient?.name || 'N/A',
          managerName: wallet.managerName || 'N/A',
          nextRebalancing: wallet.nextBalance,
          isDelayedRebalancing: calculateRebalancingStatus(wallet.nextBalance),
        }))

        setWallets(walletRecords)
      }
    } catch (error) {
      console.error('Error fetching wallets:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Agrupar dados por manager e calcular estatísticas
  const processManagerStats = useMemo(() => {
    const managerMap = new Map<string, ManagerStats>()

    wallets.forEach((wallet) => {
      const { managerName, isDelayedRebalancing } = wallet

      if (!managerMap.has(managerName)) {
        managerMap.set(managerName, {
          managerName,
          totalWallets: 0,
          balancedWallets: 0,
          delayedWallets: 0,
          percentage: 0,
        })
      }

      const managerStat = managerMap.get(managerName)!
      managerStat.totalWallets++

      if (isDelayedRebalancing) {
        managerStat.delayedWallets++
      } else {
        managerStat.balancedWallets++
      }

      // Calcular percentual (carteiras balanceadas / total)
      managerStat.percentage =
        managerStat.totalWallets > 0
          ? (managerStat.balancedWallets / managerStat.totalWallets) * 100
          : 0
    })

    return Array.from(managerMap.values()).sort(
      (a, b) => b.percentage - a.percentage,
    )
  }, [wallets])

  // Estatísticas gerais
  const stats: WalletMonitoringStats = useMemo(() => {
    const totalManagers = processManagerStats.length
    const perfectManagers = processManagerStats.filter(
      (m) => m.percentage === 100,
    ).length
    const goodManagers = processManagerStats.filter(
      (m) => m.percentage >= 80 && m.percentage < 100,
    ).length
    const warningManagers = processManagerStats.filter(
      (m) => m.percentage >= 60 && m.percentage < 80,
    ).length
    const criticalManagers = processManagerStats.filter(
      (m) => m.percentage < 60,
    ).length

    return {
      totalManagers,
      perfectManagers,
      goodManagers,
      warningManagers,
      criticalManagers,
    }
  }, [processManagerStats])

  // Aplicar filtros
  const applyFilters = useMemo(() => {
    let filtered = [...processManagerStats]

    // Filtro por manager
    if (filters.manager.length > 0) {
      filtered = filtered.filter((manager) =>
        filters.manager.includes(manager.managerName),
      )
    }

    // Filtro por status
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

    // Filtro por busca
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter((manager) =>
        manager.managerName.toLowerCase().includes(searchLower),
      )
    }

    return filtered
  }, [processManagerStats, filters])

  // Paginação
  const paginatedManagers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return applyFilters.slice(startIndex, endIndex)
  }, [applyFilters, currentPage])

  const totalPages = Math.ceil(applyFilters.length / ITEMS_PER_PAGE)
  const canPreviousPage = currentPage > 1
  const canNextPage = currentPage < totalPages

  // Unique managers para filtro
  const uniqueManagers = useMemo(
    () =>
      Array.from(
        new Set(
          processManagerStats.map((m) => ({
            name: m.managerName,
          })),
        ),
      ),
    [processManagerStats],
  )

  useEffect(() => {
    fetchWallets()
  }, [fetchWallets])

  useEffect(() => {
    setCurrentPage(1) // Reset page when filters change
  }, [applyFilters])

  useEffect(() => {
    setFilters((prev) => ({ ...prev, searchTerm }))
  }, [searchTerm])

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
    totalItems: applyFilters.length,
  }
}
