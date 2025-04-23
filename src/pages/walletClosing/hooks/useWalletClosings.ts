// hooks/useWalletClosings.ts
import { useState, useEffect } from 'react'
import { useSignalStore } from '@/store/signalEffect'
import { useToast } from '@/components/ui/use-toast'
import { WalletClosing, FilterOptions } from '../types'
import {
  getWalletClosings,
  getAllManagersOnOrganization,
} from '@/services/managementService'

export function useWalletClosings() {
  const [data, setData] = useState<WalletClosing[]>([])
  const [filteredData, setFilteredData] = useState<WalletClosing[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilters, setActiveFilters] = useState<FilterOptions | null>(null)
  const [filterCount, setFilterCount] = useState(0)
  const [managers, setManagers] = useState<{ uuid: string; name: string }[]>([])
  const [signal] = useSignalStore((state) => [state.signal])
  const { toast } = useToast()

  // Fetch data effect
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Buscar gerentes e dados das carteiras simultaneamente
        const [walletsResponse, managersResponse] = await Promise.all([
          getWalletClosings(),
          getAllManagersOnOrganization(),
        ])

        setData(walletsResponse.clients)
        setFilteredData(walletsResponse.clients)
        setManagers(managersResponse)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({
          className: 'bg-red-500 border-0 text-white',
          title: 'Failed to get wallet closings',
          description: 'Could not fetch wallet closings data from the server.',
        })
        setLoading(false)
      }
    }

    fetchData()
  }, [signal, toast])

  // Apply filters to data
  useEffect(() => {
    if (!activeFilters) {
      setFilteredData(data)
      setFilterCount(0)
      return
    }

    let filtered = [...data]
    let count = 0

    // Filter by status
    if (activeFilters.status.length > 0) {
      filtered = filtered.filter((item) => {
        // Status específicos exatos (Closed, OK)
        if (activeFilters.status.includes(item.status)) {
          return true
        }

        // Para filtrar status que contêm "days left"
        if (
          activeFilters.status.includes('days left') &&
          typeof item.status === 'string' &&
          item.status.includes('days left')
        ) {
          return true
        }

        // Para filtrar status que contêm "days overdue"
        if (
          activeFilters.status.includes('days overdue') &&
          typeof item.status === 'string' &&
          item.status.includes('days overdue')
        ) {
          return true
        }

        return false
      })
      count++
    }

    // Filter by manager - usando UUIDs reais
    if (activeFilters.manager.length > 0) {
      // Encontrar os nomes dos gerentes baseados nos UUIDs selecionados
      const selectedManagerNames = activeFilters.manager
        .map((uuid) => {
          const manager = managers.find((m) => m.uuid === uuid)
          return manager ? manager.name : ''
        })
        .filter((name) => name !== '')

      filtered = filtered.filter((item) =>
        selectedManagerNames.includes(item.managerName),
      )
      count++
    }

    // Filter by start date - from
    if (activeFilters.startDateFrom) {
      const fromDate = new Date(activeFilters.startDateFrom)
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.startDate)
        return itemDate >= fromDate
      })
      count++
    }

    // Filter by start date - to
    if (activeFilters.startDateTo) {
      const toDate = new Date(activeFilters.startDateTo)
      toDate.setHours(23, 59, 59) // Set to end of day
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.startDate)
        return itemDate <= toDate
      })
      count++
    }

    // Filter by closing date - from
    if (activeFilters.closingDateFrom) {
      const fromDate = new Date(activeFilters.closingDateFrom)
      filtered = filtered.filter((item) => {
        if (!item.closingDate) return false
        const itemDate = new Date(item.closingDate)
        return itemDate >= fromDate
      })
      count++
    }

    // Filter by closing date - to
    if (activeFilters.closingDateTo) {
      const toDate = new Date(activeFilters.closingDateTo)
      toDate.setHours(23, 59, 59) // Set to end of day
      filtered = filtered.filter((item) => {
        if (!item.closingDate) return false
        const itemDate = new Date(item.closingDate)
        return itemDate <= toDate
      })
      count++
    }

    // Filter by closed wallets
    if (!activeFilters.showClosedWallets) {
      filtered = filtered.filter(
        (item) => item.status !== 'Closed' && item.status !== 'Completed',
      )
      count++
    }

    setFilteredData(filtered)
    setFilterCount(count)
  }, [activeFilters, data, managers])

  // Manipulador de exportação
  const handleExport = () => {
    toast({
      className: 'bg-green-500 border-0',
      title: 'Export started',
      description: 'Your data is being exported...',
    })
  }

  // Aplicar filtros
  const handleApplyFilters = (filters: FilterOptions) => {
    setActiveFilters(filters)
    toast({
      className: 'bg-blue-500 border-0',
      title: 'Filters applied',
      description:
        'The wallet list has been filtered according to your criteria.',
    })
  }

  // Função para filtrar por termo de busca
  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      // Se não há termo de busca, apenas aplica os filtros existentes
      if (activeFilters) {
        handleApplyFilters(activeFilters)
      } else {
        setFilteredData(data)
      }
      return
    }

    // Filtra os dados com base no termo de busca
    const lowercaseSearchTerm = searchTerm.toLowerCase()

    // Começa com os dados já filtrados por outros critérios
    const dataToFilter = activeFilters ? [...filteredData] : [...data]

    const searchResults = dataToFilter.filter(
      (wallet) =>
        wallet.clientName.toLowerCase().includes(lowercaseSearchTerm) ||
        wallet.managerName.toLowerCase().includes(lowercaseSearchTerm),
    )

    setFilteredData(searchResults)
  }

  return {
    data: filteredData,
    loading,
    handleExport,
    handleApplyFilters,
    handleSearch,
    filterCount,
    activeFilters,
    managers,
  }
}
