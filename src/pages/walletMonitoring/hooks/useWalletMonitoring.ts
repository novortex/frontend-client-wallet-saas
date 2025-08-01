import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  getWalletOrganization,
  getFrcStatistics,
} from '@/services/wallet/walleInfoService'
import { TClientInfosResponse } from '@/types/customer.type'
import { FrcStats } from '@/types/wallet.type'

// Tipos existentes
interface WalletRecord {
  walletUuid: string
  clientName: string
  managerName: string
  nextRebalancing: string | null
  isDelayedRebalancing: boolean
  rebalanceHistory?: string[] // datas ISO dos rebalanceamentos
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
  const [filters, setFilters] = useState<FilterOptions>({
    managersSelected: [],
    dateFrom: '',
    dateTo: '',
    manager: [],
    status: [],
    searchTerm: '',
  })

  // States para FRC do backend - remover estados separados
  // const [frcStats, setFrcStats] = useState<FrcStats[]>([])
  // const [frcLoading, setFrcLoading] = useState(false)

  // Função para calcular dias desde o último rebalanceamento
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

  // Função para verificar se uma carteira está padronizada (baseado em datas)
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

  // Buscar dados consolidados (wallets + FRC)
  const fetchWalletsAndFrc = useCallback(async () => {
    try {
      setLoading(true)

      // Buscar ambos os dados em paralelo
      const [walletsResponse, frcStatsResponse] = await Promise.all([
        getWalletOrganization(),
        getFrcStatistics(),
      ])

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

        // Dados para padronização
        const standardizationResults = walletsResponse.map((wallet) =>
          checkWalletStandardization(wallet),
        )
        setStandardizedWallets(standardizationResults)

        // Criar um Map dos dados FRC por manager para facilitar o merge
        const frcByManagerName = new Map<string, FrcStats>()
        if (frcStatsResponse && Array.isArray(frcStatsResponse)) {
          frcStatsResponse.forEach((frc) => {
            frcByManagerName.set(frc.managerName, frc)
          })
        }

        // Calcular estatísticas de managers com dados FRC integrados
        const managerMap = new Map<
          string,
          ManagerStats & { frcData?: FrcStats }
        >()

        walletRecords.forEach((wallet) => {
          const existing = managerMap.get(wallet.managerName) || {
            managerName: wallet.managerName,
            balancedWallets: 0,
            delayedWallets: 0,
            totalWallets: 0,
            percentage: 0,
            frcData: undefined,
          }

          existing.totalWallets++
          if (wallet.isDelayedRebalancing) {
            existing.delayedWallets++
          } else {
            existing.balancedWallets++
          }

          existing.percentage =
            (existing.balancedWallets / existing.totalWallets) * 100

          // Adicionar dados FRC se disponíveis para este manager
          if (!existing.frcData) {
            existing.frcData = frcByManagerName.get(wallet.managerName)
          }

          managerMap.set(wallet.managerName, existing)
        })

        // Salvar os managers processados (com ou sem dados FRC)
        const processedManagersArray = Array.from(managerMap.values())

        setProcessedManagers(processedManagersArray)
      }
    } catch (error) {
      console.error('Error fetching wallet and FRC data:', error)
    } finally {
      setLoading(false)
    }
  }, [checkWalletStandardization])

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

    rebalanceDate.setHours(0, 0, 0, 0)
    currentDate.setHours(0, 0, 0, 0)

    return rebalanceDate < currentDate
  }

  // Usar dados processados (com FRC integrado) em vez de managerStats separado
  const managerStats = processedManagers

  // Calcular estatísticas gerais (balanceamento)
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

  // Calcular estatísticas de padronização
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

  // Aplicar filtros e busca
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

  // Aplicar filtros para padronização
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

  // Paginação para balanceamento
  const paginatedManagers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredManagers.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredManagers, currentPage])

  // Paginação para padronização
  const paginatedStandardizedWallets = useMemo(() => {
    const startIndex = (standardizationCurrentPage - 1) * ITEMS_PER_PAGE
    return filteredStandardizedWallets.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    )
  }, [filteredStandardizedWallets, standardizationCurrentPage])

  // Calcular informações de paginação
  const totalPages = Math.ceil(filteredManagers.length / ITEMS_PER_PAGE)
  const standardizationTotalPages = Math.ceil(
    filteredStandardizedWallets.length / ITEMS_PER_PAGE,
  )
  const canPreviousPage = currentPage > 1
  const canNextPage = currentPage < totalPages
  const canStandardizationPreviousPage = standardizationCurrentPage > 1
  const canStandardizationNextPage =
    standardizationCurrentPage < standardizationTotalPages

  // Managers únicos para filtros
  const uniqueManagers = useMemo(() => {
    return Array.from(new Set(wallets.map((w) => w.managerName))).map(
      (manager) => ({ name: manager }),
    )
  }, [wallets])

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
    // Novos retornos para padronização
    standardizationStats,
    standardizedWallets: paginatedStandardizedWallets,
    standardizationCurrentPage,
    setStandardizationCurrentPage,
    canStandardizationPreviousPage,
    canStandardizationNextPage,
    standardizationTotalPages,
    processedManagers,
  }
}
