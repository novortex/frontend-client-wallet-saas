import { useState, useEffect } from 'react'
import {
  confirmContactClient,
  getCallMonitoring,
  getAllManagersOnOrganization,
} from '@/services/managementService'
import { FilterOptions } from '../types/filter'

export interface CallRecord {
  id: string
  clientName: string
  managerName: string
  startDate: string | null
  closingDate: string | null
  status: string
  monthCloseDate?: string | null
}

export function useCallMonitoring() {
  const [calls, setCalls] = useState<CallRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [updating, setUpdating] = useState<Set<string>>(new Set())
  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    manager: [],
  })
  const [managers, setManagers] = useState<{ uuid: string; name: string }[]>([])
  const itemsPerPage = 10

  // Buscar managers para mapear nome <-> uuid
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const data = await getAllManagersOnOrganization()
        setManagers(data)
      } catch (error) {
        // ignore
      }
    }
    fetchManagers()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const data = await getCallMonitoring()
      setCalls(data.clients)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const calculateCallStatus = (monthCloseDate: string | null | undefined) => {
    if (!monthCloseDate) {
      return {
        status: 'no_call' as const,
        message: 'Outdated',
      }
    }
    const today = new Date()
    const lastCallDate = new Date(monthCloseDate)
    const daysSinceLastCall = Math.floor(
      (today.getTime() - lastCallDate.getTime()) / (1000 * 60 * 60 * 24),
    )
    if (daysSinceLastCall <= 20) {
      return {
        status: 'ok' as const,
        daysUntilNextCall: 30 - daysSinceLastCall,
        message: 'OK',
      }
    } else if (daysSinceLastCall <= 30) {
      return {
        status: 'days_left' as const,
        daysUntilNextCall: 30 - daysSinceLastCall,
        message: `${30 - daysSinceLastCall} days left`,
      }
    } else {
      return {
        status: 'overdue' as const,
        daysOverdue: daysSinceLastCall - 30,
        message: `${daysSinceLastCall - 30} days overdue`,
      }
    }
  }

  const handleMarkAsDone = async (walletId: string) => {
    try {
      setUpdating((prev) => new Set(prev).add(walletId))
      await confirmContactClient(walletId)
      setCalls((prevCalls) =>
        prevCalls.map((call) =>
          call.id === walletId
            ? { ...call, monthCloseDate: new Date().toISOString() }
            : call,
        ),
      )
    } catch (error) {
      console.error('Error marking call as done:', error)
    } finally {
      setUpdating((prev) => {
        const newSet = new Set(prev)
        newSet.delete(walletId)
        return newSet
      })
    }
  }

  // Filtro avançado
  const applyFilters = (calls: CallRecord[], filters: FilterOptions) => {
    return calls.filter((call) => {
      // Filtro por manager (comparar UUID)
      const manager = managers.find((m) => m.name === call.managerName)
      const managerUuid = manager ? manager.uuid : null
      const matchesManager =
        filters.manager.length === 0 ||
        (managerUuid && filters.manager.includes(managerUuid))
      // Filtro por status
      const statusInfo = calculateCallStatus(call.monthCloseDate)
      const matchesStatus =
        filters.status.length === 0 ||
        filters.status.includes(statusInfo.status)
      // Filtro por busca
      const matchesSearch = call.clientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      return matchesManager && matchesStatus && matchesSearch
    })
  }

  const filteredCalls = applyFilters(calls, filters)
  const totalPages = Math.ceil(filteredCalls.length / itemsPerPage)
  const canPreviousPage = currentPage > 1
  const canNextPage = currentPage < totalPages
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCalls = filteredCalls.slice(
    startIndex,
    startIndex + itemsPerPage,
  )

  const stats = calls.reduce(
    (acc, call) => {
      if (!call.monthCloseDate) {
        acc.no_call++
      } else {
        const statusInfo = calculateCallStatus(call.monthCloseDate)
        acc[statusInfo.status]++
      }
      acc.total++
      return acc
    },
    { ok: 0, days_left: 0, overdue: 0, no_call: 0, total: 0 },
  )

  return {
    calls,
    loading,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    updating,
    itemsPerPage,
    filters,
    setFilters,
    filteredCalls,
    paginatedCalls,
    totalPages,
    canPreviousPage,
    canNextPage,
    stats,
    calculateCallStatus,
    handleMarkAsDone,
    fetchData,
  }
}
