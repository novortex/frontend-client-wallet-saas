import React, { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  Check,
  Clock,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react'
import {
  confirmContactClient,
  getCallMonitoring,
} from '@/services/managementService'

interface CallRecord {
  id: string
  clientName: string
  managerName: string
  startDate: string | null
  closingDate: string | null
  status: string
  monthCloseDate?: string | null
}

interface Manager {
  name: string
}

const CallMonitoring = () => {
  const [calls, setCalls] = useState<CallRecord[]>([])
  const [managers, setManagers] = useState<Manager[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedManager, setSelectedManager] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [updating, setUpdating] = useState<Set<string>>(new Set())
  const itemsPerPage = 10

  const fetchData = async () => {
    try {
      setLoading(true)
      const data = await getCallMonitoring()
      setCalls(data.clients)

      const uniqueManagers = Array.from(
        new Set(data.clients.map((call: CallRecord) => call.managerName)),
      )
        .map((name) => ({ name }))
        .filter((manager) => manager.name !== 'No Manager' && manager.name)

      setManagers(uniqueManagers as Manager[])
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

  const getStatusBadge = (call: CallRecord) => {
    if (!call.monthCloseDate) {
      return (
        <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Outdated
        </span>
      )
    }

    const statusInfo = calculateCallStatus(call.monthCloseDate)

    switch (statusInfo.status) {
      case 'ok':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
            <Check className="mr-1 h-3 w-3" />
            {statusInfo.message}
          </span>
        )
      case 'days_left':
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
            <Clock className="mr-1 h-3 w-3" />
            {statusInfo.message}
          </span>
        )
      case 'overdue':
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-100">
            <AlertTriangle className="mr-1 h-3 w-3" />
            {statusInfo.message}
          </span>
        )
    }
  }

  const formatDate = (date: string | null | undefined) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-US')
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

  const filteredCalls = calls.filter((call) => {
    const matchesSearch = call.clientName
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesManager =
      !selectedManager || call.managerName === selectedManager
    return matchesSearch && matchesManager
  })

  const totalPages = Math.ceil(filteredCalls.length / itemsPerPage)
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center space-x-2 text-foreground">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6 text-foreground">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Monthly Call Monitoring</h1>
          <button
            onClick={fetchData}
            className="flex items-center space-x-2 rounded-lg bg-secondary px-3 py-2 text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="mb-6 rounded-lg bg-card p-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by client name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-border bg-input px-3 py-2 pl-10 text-foreground placeholder-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
            </div>

            <div className="md:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                <select
                  value={selectedManager}
                  onChange={(e) => setSelectedManager(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-border bg-input px-3 py-2 pl-10 text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="">All managers</option>
                  {managers.map((manager) => (
                    <option key={manager.name} value={manager.name}>
                      {manager.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className="rounded-lg bg-green-100 p-4 dark:bg-green-900">
            <div className="text-sm text-green-600 dark:text-green-300">
              On time
            </div>
            <div className="text-2xl font-bold text-green-800 dark:text-green-100">
              {stats.ok}
            </div>
          </div>
          <div className="rounded-lg bg-yellow-100 p-4 dark:bg-yellow-900">
            <div className="text-sm text-yellow-600 dark:text-yellow-300">
              Due soon
            </div>
            <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-100">
              {stats.days_left}
            </div>
          </div>
          <div className="rounded-lg bg-red-100 p-4 dark:bg-red-900">
            <div className="text-sm text-red-600 dark:text-red-300">
              Overdue
            </div>
            <div className="text-2xl font-bold text-red-800 dark:text-red-100">
              {stats.overdue}
            </div>
          </div>
          <div className="rounded-lg bg-muted p-4">
            <div className="text-sm text-muted-foreground">Outdated</div>
            <div className="text-2xl font-bold text-foreground">
              {stats.no_call}
            </div>
          </div>
          <div className="rounded-lg bg-secondary p-4">
            <div className="text-sm text-secondary-foreground">Total</div>
            <div className="text-2xl font-bold text-secondary-foreground">
              {stats.total}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Manager
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Last Call
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedCalls.map((call) => (
                  <tr
                    key={call.id}
                    className="transition-colors hover:bg-muted/50"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">
                      {call.clientName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                      {call.managerName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                      {formatDate(call.monthCloseDate)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {getStatusBadge(call)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center">
                      <button
                        onClick={() => handleMarkAsDone(call.id)}
                        disabled={updating.has(call.id)}
                        className="inline-flex items-center rounded-lg bg-yellow-500 px-3 py-1 text-xs font-medium text-black transition-colors hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {updating.has(call.id) ? (
                          <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                        ) : (
                          <Check className="mr-1 h-3 w-3" />
                        )}
                        {updating.has(call.id) ? 'Updating...' : 'Mark as done'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border bg-muted px-6 py-3">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages} • {filteredCalls.length}{' '}
                calls found
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="rounded bg-secondary px-3 py-1 text-sm text-secondary-foreground hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="rounded bg-yellow-500 px-3 py-1 text-sm text-black hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {filteredCalls.length === 0 && (
          <div className="rounded-lg bg-card p-8 text-center">
            <div className="mb-2 text-muted-foreground">No calls found</div>
            <div className="text-sm text-muted-foreground">
              {searchTerm || selectedManager
                ? 'Try adjusting the filters to find calls.'
                : 'No calls to monitor at the moment.'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CallMonitoring
