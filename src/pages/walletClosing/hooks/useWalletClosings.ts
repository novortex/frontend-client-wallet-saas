// hooks/useWalletClosings.ts
import { useState, useEffect } from 'react'
import { useSignalStore } from '@/store/signalEffect'
import { useToast } from '@/components/ui/use-toast'
import { WalletClosing, FilterOptions } from '../types'

// Dados mockados para demonstração
const mockWalletClosings: WalletClosing[] = [
  {
    id: '1',
    clientName: 'André Luiz Barros',
    managerName: 'Pedro Silva',
    startDate: '2024-01-15',
    closingDate: '2024-03-30',
    status: 'Completed',
  },
  {
    id: '2',
    clientName: 'Leticia Matos Sá',
    managerName: 'Arthur Mendes',
    startDate: '2024-02-20',
    closingDate: null,
    status: 'Pending',
  },
  {
    id: '3',
    clientName: 'Antonio Claudio Pereira Barros',
    managerName: 'Abner Costa',
    startDate: '2023-11-05',
    closingDate: '2024-02-15',
    status: 'Completed',
  },
  {
    id: '4',
    clientName: 'Maria Eduarda Limonge Salemi',
    managerName: 'Pedro Silva',
    startDate: '2024-03-10',
    closingDate: null,
    status: 'Processing',
  },
  {
    id: '5',
    clientName: 'João Deccache',
    managerName: 'Arthur Mendes',
    startDate: '2023-12-01',
    closingDate: '2024-02-01',
    status: 'Failed',
  },
  {
    id: '6',
    clientName: 'Alexandre Machado',
    managerName: 'Abner Costa',
    startDate: '2024-02-10',
    closingDate: null,
    status: 'Processing',
  },
  {
    id: '7',
    clientName: 'José Tarcísio',
    managerName: 'Pedro Silva',
    startDate: '2023-10-20',
    closingDate: '2024-01-20',
    status: 'Completed',
  },
  {
    id: '8',
    clientName: 'Carlos Jr',
    managerName: 'Arthur Mendes',
    startDate: '2024-03-01',
    closingDate: null,
    status: 'Pending',
  },
  {
    id: '9',
    clientName: 'Bruno Ricardo De Castro Prieto',
    managerName: 'Abner Costa',
    startDate: '2023-09-15',
    closingDate: '2023-12-15',
    status: 'Failed',
  },
  {
    id: '10',
    clientName: 'Luis Samaia',
    managerName: 'Pedro Silva',
    startDate: '2024-01-05',
    closingDate: '2024-04-05',
    status: 'Completed',
  },
  // Dados adicionais para paginação
  {
    id: '11',
    clientName: 'Marcela Ribeiro',
    managerName: 'Pedro Silva',
    startDate: '2024-01-10',
    closingDate: '2024-03-15',
    status: 'Completed',
  },
  {
    id: '12',
    clientName: 'Rafael Moreira',
    managerName: 'Arthur Mendes',
    startDate: '2024-02-05',
    closingDate: null,
    status: 'Processing',
  },
  {
    id: '13',
    clientName: 'Carla Santana',
    managerName: 'Abner Costa',
    startDate: '2023-12-15',
    closingDate: '2024-02-28',
    status: 'Completed',
  },
  {
    id: '14',
    clientName: 'Thiago Oliveira',
    managerName: 'Pedro Silva',
    startDate: '2024-01-20',
    closingDate: null,
    status: 'Pending',
  },
  {
    id: '15',
    clientName: 'Juliana Martins',
    managerName: 'Arthur Mendes',
    startDate: '2023-11-30',
    closingDate: '2024-01-25',
    status: 'Failed',
  },
  {
    id: '16',
    clientName: 'Leonardo Alves',
    managerName: 'Abner Costa',
    startDate: '2024-02-15',
    closingDate: null,
    status: 'Processing',
  },
  {
    id: '17',
    clientName: 'Paulo Roberto Coelho',
    managerName: 'Pedro Silva',
    startDate: '2023-10-10',
    closingDate: '2024-01-10',
    status: 'Completed',
  },
  {
    id: '18',
    clientName: 'Camila Fonseca',
    managerName: 'Arthur Mendes',
    startDate: '2024-03-05',
    closingDate: null,
    status: 'Pending',
  },
  {
    id: '19',
    clientName: 'Gustavo Henrique Lima',
    managerName: 'Abner Costa',
    startDate: '2023-09-20',
    closingDate: '2023-12-20',
    status: 'Failed',
  },
  {
    id: '20',
    clientName: 'Gabriela Souza',
    managerName: 'Pedro Silva',
    startDate: '2024-01-25',
    closingDate: '2024-04-10',
    status: 'Completed',
  },
  {
    id: '21',
    clientName: 'Roberto Carlos Pereira',
    managerName: 'Arthur Mendes',
    startDate: '2023-12-05',
    closingDate: null,
    status: 'Processing',
  },
  {
    id: '22',
    clientName: 'Fernanda Costa Silva',
    managerName: 'Abner Costa',
    startDate: '2024-02-01',
    closingDate: '2024-03-20',
    status: 'Completed',
  },
  {
    id: '23',
    clientName: 'Diego Almeida',
    managerName: 'Pedro Silva',
    startDate: '2023-11-15',
    closingDate: null,
    status: 'Pending',
  },
  {
    id: '24',
    clientName: 'Mariana Ferreira',
    managerName: 'Arthur Mendes',
    startDate: '2024-01-30',
    closingDate: '2024-03-25',
    status: 'Failed',
  },
  {
    id: '25',
    clientName: 'Lucas Rodrigues',
    managerName: 'Abner Costa',
    startDate: '2023-10-25',
    closingDate: null,
    status: 'Processing',
  },
]

export function useWalletClosings() {
  const [data, setData] = useState<WalletClosing[]>([])
  const [filteredData, setFilteredData] = useState<WalletClosing[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilters, setActiveFilters] = useState<FilterOptions | null>(null)
  const [filterCount, setFilterCount] = useState(0)
  const [signal] = useSignalStore((state) => [state.signal])
  const { toast } = useToast()

  // Fetch data effect
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulando chamada de API
        setData(mockWalletClosings)
        setFilteredData(mockWalletClosings)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({
          className: 'bg-red-500 border-0 text-white',
          title: 'Failed to get wallet closings',
          description: 'Demo Vault !!',
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

    // Aplicar filtros (código mantido como no original)
    // Filter by status
    if (activeFilters.status.length > 0) {
      filtered = filtered.filter((item) =>
        activeFilters.status.includes(item.status),
      )
      count++
    }

    // Filter by manager
    if (activeFilters.manager.length > 0) {
      filtered = filtered.filter((item) => {
        const managerId =
          item.managerName === 'Pedro Silva'
            ? 'm1'
            : item.managerName === 'Arthur Mendes'
              ? 'm2'
              : item.managerName === 'Abner Costa'
                ? 'm3'
                : ''
        return activeFilters.manager.includes(managerId)
      })
      count++
    }

    // Outros filtros como no original...

    // Filter by closed wallets
    if (!activeFilters.showClosedWallets) {
      filtered = filtered.filter((item) => !item.closingDate)
      count++
    }

    setFilteredData(filtered)
    setFilterCount(count)
  }, [activeFilters, data])

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
  }
}
