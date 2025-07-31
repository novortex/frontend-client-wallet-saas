import { useState, useEffect, useMemo, useCallback } from 'react'
import { getWalletOrganization } from '@/services/wallet/walleInfoService'
import { TClientInfosResponse } from '@/types/customer.type'

// Tipos existentes
interface WalletRecord {
  walletUuid: string
  clientName: string
  managerName: string
  nextRebalancing: string | null
  isDelayedRebalancing: boolean
}

interface ManagerStats {
  managerName: string
  balancedWallets: number
  delayedWallets: number
  totalWallets: number
  percentage: number
}

interface FilterOptions {
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
  const [currentPage, setCurrentPage] = useState(1)
  const [standardizationCurrentPage, setStandardizationCurrentPage] =
    useState(1)
  const [filters, setFilters] = useState<FilterOptions>({
    manager: [],
    status: [],
    searchTerm: '',
  })
  // FRC stats: [{ managerName, frc0Percent, frc1Percent, totalClients }]
  // Nova lógica FRC: 1 rebalanceamento por mês, se passou nextBalance e não rebalanceou, FRC=0
  const frcStats = useMemo(() => {
    const managerMap: Record<
      string,
      { frc0: number; frc1: number; total: number }
    > = {}
    const now = new Date()
    standardizedWallets.forEach((wallet) => {
      const manager = wallet.managerName
      if (!managerMap[manager]) {
        managerMap[manager] = { frc0: 0, frc1: 0, total: 0 }
      }
      // Preparado para FRC > 1: se no futuro houver wallet.rebalanceHistory (array de datas ISO)
      let frc = 0
      // @ts-expect-error: rebalanceHistory pode não existir ainda
      const history: string[] | undefined = wallet.rebalanceHistory
      if (history && Array.isArray(history)) {
        // Conta quantos rebalanceamentos no mês atual
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()
        const count = history.filter((dateStr) => {
          const d = new Date(dateStr)
          return (
            d.getMonth() === currentMonth && d.getFullYear() === currentYear
          )
        }).length
        frc = count
      } else {
        // Lógica fallback: só FRC 0 ou 1
        if (!wallet.lastRebalance) {
          frc = 0 // Nunca rebalanceou
        } else {
          const last = new Date(wallet.lastRebalance)
          const next = wallet.nextRebalance
            ? new Date(wallet.nextRebalance)
            : null
          const isThisMonth =
            last.getMonth() === now.getMonth() &&
            last.getFullYear() === now.getFullYear()
          // Se já passou nextBalance e não rebalanceou neste mês, FRC=0
          if (next && now > next && !isThisMonth) {
            frc = 0
          } else if (isThisMonth) {
            frc = 1
          } else {
            frc = 0
          }
        }
      }
      // Contabiliza nos buckets
      if (frc === 0) {
        managerMap[manager].frc0++
      } else if (frc === 1) {
        managerMap[manager].frc1++
      } else if (frc > 1) {
        // No futuro, se houver FRC > 1, pode adicionar um campo frcMoreThan1
        // managerMap[manager].frcMoreThan1 = (managerMap[manager].frcMoreThan1 || 0) + 1
      }
      managerMap[manager].total++
    })
    return Object.entries(managerMap).map(
      ([managerName, { frc0, frc1, total }]) => ({
        managerName,
        frc0Percent: total > 0 ? (frc0 / total) * 100 : 0,
        frc1Percent: total > 0 ? (frc1 / total) * 100 : 0,
        totalClients: total,
      }),
    )
  }, [standardizedWallets])
  const [searchTerm, setSearchTerm] = useState('')

  // Constantes de paginação
  const ITEMS_PER_PAGE = 10
  const STANDARDIZATION_TOLERANCE_DAYS = 7 // ±7 dias de tolerância

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

  // Função para calcular dias desde o último rebalanceamento
  const calculateDaysSinceLastRebalance = (
    lastRebalance: string | null,
  ): number | null => {
    if (!lastRebalance) return null

    const lastRebalanceDate = new Date(lastRebalance)
    const currentDate = new Date()

    lastRebalanceDate.setHours(0, 0, 0, 0)
    currentDate.setHours(0, 0, 0, 0)

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
        // Calcula quantos dias faltam para o próximo rebalanceamento
        const nextRebalanceDate = new Date(nextRebalance)
        const currentDate = new Date()

        nextRebalanceDate.setHours(0, 0, 0, 0)
        currentDate.setHours(0, 0, 0, 0)

        const daysUntilNextRebalance = Math.ceil(
          (nextRebalanceDate.getTime() - currentDate.getTime()) /
            (1000 * 60 * 60 * 24),
        )

        // Considera padronizada se está dentro do prazo (não atrasada)
        isWithinStandardInterval =
          daysUntilNextRebalance >= -STANDARDIZATION_TOLERANCE_DAYS
        isStandardized = isWithinStandardInterval

        if (daysUntilNextRebalance > 0) {
          statusDescription = `Next rebalance in ${daysUntilNextRebalance} days`
        } else if (daysUntilNextRebalance === 0) {
          statusDescription = 'Rebalance due today'
        } else {
          const daysOverdue = Math.abs(daysUntilNextRebalance)
          statusDescription = `Overdue by ${daysOverdue} days`
        }
      } else if (!lastRebalance) {
        statusDescription = 'Never rebalanced'
      } else if (!nextRebalance) {
        statusDescription = 'No next rebalance scheduled'
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
      }
    },
    [],
  )

  // Buscar dados das carteiras
  const fetchWallets = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getWalletOrganization()
      console.log('Wallets fetched:', response)

      if (response && Array.isArray(response)) {
        // Dados para balanceamento (já existente)
        const walletRecords: WalletRecord[] = response.map((wallet) => ({
          walletUuid: wallet.walletUuid,
          clientName: wallet.infosClient?.name || 'N/A',
          managerName: wallet.managerName || 'N/A',
          nextRebalancing: wallet.nextBalance,
          isDelayedRebalancing: calculateRebalancingStatus(wallet.nextBalance),
        }))

        setWallets(walletRecords)

        // Dados para padronização (novo)
        const standardizationResults = response.map((wallet) =>
          checkWalletStandardization(wallet),
        )
        setStandardizedWallets(standardizationResults)
      }
    } catch (error) {
      console.error('Error fetching wallets:', error)
    } finally {
      setLoading(false)
    }
  }, [checkWalletStandardization])

  // Agrupar dados por manager e calcular estatísticas (balanceamento)
  const managerStats = useMemo(() => {
    const managerMap = new Map<string, ManagerStats>()

    wallets.forEach((wallet) => {
      const existing = managerMap.get(wallet.managerName) || {
        managerName: wallet.managerName,
        balancedWallets: 0,
        delayedWallets: 0,
        totalWallets: 0,
        percentage: 0,
      }

      existing.totalWallets++
      if (wallet.isDelayedRebalancing) {
        existing.delayedWallets++
      } else {
        existing.balancedWallets++
      }

      existing.percentage =
        (existing.balancedWallets / existing.totalWallets) * 100

      managerMap.set(wallet.managerName, existing)
    })

    return Array.from(managerMap.values())
  }, [wallets])

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
    fetchWallets()
  }, [fetchWallets])

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
    frcStats,
  }
}
