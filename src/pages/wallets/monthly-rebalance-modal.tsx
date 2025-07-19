import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { getWalletOrganization } from '@/services/wallet/walleInfoService'
import { Loading } from '@/components/custom/loading'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { getAllAssetsWalletClient } from '@/services/wallet/walletAssetService'

interface MonthlyRebalanceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface WalletByMonth {
  walletUuid: string
  clientName: string
  managerName: string
  startMonth: string
  nextRebalancing: string | null
  isDelayedRebalancing: boolean
  currentAUM: number
  startDate: string | Date | null
}

interface MonthlyStats {
  month: string
  totalWallets: number
  needsRebalancing: number
  balancedWallets: number
  onTimePercentage: number
  totalAUM: number
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export function MonthlyRebalanceModal({
  open,
  onOpenChange,
}: MonthlyRebalanceModalProps) {
  const [loading, setLoading] = useState(false)
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([])
  const [walletsByMonth, setWalletsByMonth] = useState<
    Record<string, WalletByMonth[]>
  >({})
  const [rebalancingMonth, setRebalancingMonth] = useState<string | null>(null)
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null)

  const { toast } = useToast()

  // Função para determinar o mês baseado no startDate
  // Update the getStartMonth function to handle string | Date | null
  const getStartMonth = useCallback(
    (startDate: string | Date | null): string => {
      if (!startDate) {
        return 'January'
      }

      let date: Date

      if (typeof startDate === 'string') {
        date = new Date(startDate)
      } else if (startDate instanceof Date) {
        date = startDate
      } else {
        return 'January'
      }

      if (isNaN(date.getTime())) {
        return 'January'
      }

      return MONTHS[date.getMonth()]
    },
    [],
  )

  // Função para verificar se carteira está atrasada
  const isDelayedRebalancing = (nextRebalancing: string | null): boolean => {
    if (!nextRebalancing) return false

    const rebalanceDate = new Date(nextRebalancing)
    const currentDate = new Date()

    rebalanceDate.setHours(0, 0, 0, 0)
    currentDate.setHours(0, 0, 0, 0)

    return rebalanceDate < currentDate
  }

  const fetchMonthlyData = useCallback(async () => {
    try {
      setLoading(true)

      const walletResponse = await getWalletOrganization()

      if (!walletResponse || !Array.isArray(walletResponse)) {
        console.error('No wallets found')
        return
      }

      // Processar dados por mês
      const walletsByMonthMap: Record<string, WalletByMonth[]> = {}
      const monthlyStatsMap: Record<string, MonthlyStats> = {}

      // Inicializar todos os meses
      MONTHS.forEach((month) => {
        walletsByMonthMap[month] = []
        monthlyStatsMap[month] = {
          month,
          totalWallets: 0,
          needsRebalancing: 0,
          balancedWallets: 0,
          onTimePercentage: 0,
          totalAUM: 0,
        }
      })

      // 🚀 OTIMIZAÇÃO: Fazer todas as chamadas em paralelo
      const walletDetailsPromises = walletResponse.map((wallet) =>
        getAllAssetsWalletClient(wallet.walletUuid)
          .then((details) => ({ wallet, details }))
          .catch((error) => {
            console.error(
              `Error fetching details for wallet ${wallet.walletUuid}:`,
              error,
            )
            return { wallet, details: null }
          }),
      )

      // Aguardar todas as chamadas terminarem
      const walletDetailsResults = await Promise.all(walletDetailsPromises)

      // Processar os resultados
      walletDetailsResults.forEach(({ wallet, details }) => {
        if (details && details.wallet) {
          const { wallet: walletInfo } = details
          const startMonth = getStartMonth(walletInfo.startDate)
          const delayed = isDelayedRebalancing(wallet.nextBalance)
          const currentAmount = walletInfo.currentAmount || 0

          const walletData: WalletByMonth = {
            walletUuid: wallet.walletUuid,
            clientName:
              wallet.infosClient?.name || walletInfo.ownerName || 'N/A',
            managerName: wallet.managerName || 'N/A',
            startMonth,
            nextRebalancing: wallet.nextBalance,
            isDelayedRebalancing: delayed,
            currentAUM: Number(currentAmount),
            startDate: walletInfo.startDate || null,
          }

          walletsByMonthMap[startMonth].push(walletData)

          // Atualizar estatísticas do mês
          const stats = monthlyStatsMap[startMonth]
          stats.totalWallets++
          stats.totalAUM += Number(currentAmount)

          if (delayed) {
            stats.needsRebalancing++
          } else {
            stats.balancedWallets++
          }

          stats.onTimePercentage =
            stats.totalWallets > 0
              ? (stats.balancedWallets / stats.totalWallets) * 100
              : 0
        }
      })

      setWalletsByMonth(walletsByMonthMap)
      setMonthlyStats(Object.values(monthlyStatsMap))
    } catch (error) {
      console.error('Error fetching monthly data:', error)
      toast({
        className: 'bg-red-500 border-0 text-white',
        title: 'Error',
        description: 'Failed to load monthly rebalancing data.',
      })
    } finally {
      setLoading(false)
    }
  }, [toast, getStartMonth])

  const handleRebalanceMonth = async (month: string) => {
    try {
      setRebalancingMonth(month)

      // Simular API call para rebalancear carteiras do mês
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log(`Rebalancing completed for ${month}`)

      // Refresh data
      await fetchMonthlyData()
    } catch (error) {
      console.error('Failed to rebalance month:', error)
    } finally {
      setRebalancingMonth(null)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 90)
      return 'border-green-500 bg-green-50 dark:bg-green-900'
    if (percentage >= 70)
      return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900'
    return 'border-red-500 bg-red-50 dark:bg-red-900'
  }

  const getStatusBadge = (isDelayed: boolean) => {
    if (isDelayed) {
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
          Delayed
        </span>
      )
    }
    return (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
        On Time
      </span>
    )
  }

  const toggleExpand = (month: string) => {
    setExpandedMonth(expandedMonth === month ? null : month)
  }

  useEffect(() => {
    if (open) {
      fetchMonthlyData()
    }
  }, [open, fetchMonthlyData])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-black dark:text-white">
            Monthly Wallet Rebalancing
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center p-20">
            <Loading />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cards de estatísticas por mês */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {monthlyStats
                .filter((month) => month.totalWallets > 0)
                .map((month) => (
                  <div
                    key={month.month}
                    className={`rounded-lg border-l-4 p-4 shadow ${getPerformanceColor(month.onTimePercentage)}`}
                  >
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-black dark:text-white">
                        {month.month}
                      </h3>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {month.totalWallets} wallets
                      </div>
                    </div>

                    <div className="mb-3 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Balanced:
                        </span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          {month.balancedWallets}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Delayed:
                        </span>
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">
                          {month.needsRebalancing}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Performance:
                        </span>
                        <span
                          className={`text-sm font-bold ${
                            month.onTimePercentage >= 90
                              ? 'text-green-600 dark:text-green-400'
                              : month.onTimePercentage >= 70
                                ? 'text-yellow-600 dark:text-yellow-400'
                                : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {month.onTimePercentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          AUM:
                        </span>
                        <span className="text-sm font-medium text-black dark:text-white">
                          {formatCurrency(month.totalAUM)}
                        </span>
                      </div>
                    </div>

                    {month.needsRebalancing > 0 && (
                      <Button
                        size="sm"
                        onClick={() => handleRebalanceMonth(month.month)}
                        disabled={rebalancingMonth === month.month}
                        className="w-full bg-[#F2BE38] text-black hover:bg-yellow-600 hover:text-white"
                      >
                        {rebalancingMonth === month.month ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                            Rebalancing...
                          </div>
                        ) : (
                          `Rebalance ${month.month}`
                        )}
                      </Button>
                    )}
                  </div>
                ))}
            </div>

            {/* Tabela detalhada */}
            <div className="rounded-lg border p-4">
              <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
                Detailed View by Month
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Month
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Total Wallets
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Balanced
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Delayed
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Performance
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Total AUM
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyStats
                      .filter((month) => month.totalWallets > 0)
                      .map((month) => (
                        <>
                          <tr
                            key={month.month}
                            className="cursor-pointer border-b border-gray-200 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                            onClick={() => toggleExpand(month.month)}
                          >
                            <td className="px-4 py-4 text-black dark:text-white">
                              <div className="flex items-center gap-2">
                                {expandedMonth === month.month ? (
                                  <ChevronDown
                                    size={16}
                                    className="text-gray-400"
                                  />
                                ) : (
                                  <ChevronRight
                                    size={16}
                                    className="text-gray-400"
                                  />
                                )}
                                <span className="font-medium">
                                  {month.month}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-black dark:text-white">
                              {month.totalWallets}
                            </td>
                            <td className="px-4 py-4 font-medium text-green-600 dark:text-green-400">
                              {month.balancedWallets}
                            </td>
                            <td className="px-4 py-4 font-medium text-red-600 dark:text-red-400">
                              {month.needsRebalancing}
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`font-bold ${
                                  month.onTimePercentage >= 90
                                    ? 'text-green-600 dark:text-green-400'
                                    : month.onTimePercentage >= 70
                                      ? 'text-yellow-600 dark:text-yellow-400'
                                      : 'text-red-600 dark:text-red-400'
                                }`}
                              >
                                {month.onTimePercentage.toFixed(1)}%
                              </span>
                            </td>
                            <td className="px-4 py-4 text-black dark:text-white">
                              {formatCurrency(month.totalAUM)}
                            </td>
                            <td className="px-4 py-4">
                              {month.needsRebalancing > 0 && (
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleRebalanceMonth(month.month)
                                  }}
                                  disabled={rebalancingMonth === month.month}
                                  className="bg-[#F2BE38] text-black hover:bg-yellow-600 hover:text-white"
                                >
                                  {rebalancingMonth === month.month
                                    ? 'Processing...'
                                    : 'Rebalance'}
                                </Button>
                              )}
                            </td>
                          </tr>

                          {/* Expanded row showing individual wallets */}
                          {expandedMonth === month.month &&
                            walletsByMonth[month.month] && (
                              <tr>
                                <td
                                  colSpan={7}
                                  className="bg-gray-50 px-4 py-2 dark:bg-gray-900"
                                >
                                  <div className="max-h-60 overflow-y-auto">
                                    <table className="w-full text-sm">
                                      <thead>
                                        <tr className="border-b border-gray-300 dark:border-gray-600">
                                          <th className="px-2 py-2 text-left text-xs text-gray-500 dark:text-gray-400">
                                            Client
                                          </th>
                                          <th className="px-2 py-2 text-left text-xs text-gray-500 dark:text-gray-400">
                                            Manager
                                          </th>
                                          <th className="px-2 py-2 text-left text-xs text-gray-500 dark:text-gray-400">
                                            Start Date
                                          </th>
                                          <th className="px-2 py-2 text-left text-xs text-gray-500 dark:text-gray-400">
                                            Next Rebalancing
                                          </th>
                                          <th className="px-2 py-2 text-left text-xs text-gray-500 dark:text-gray-400">
                                            Status
                                          </th>
                                          <th className="px-2 py-2 text-left text-xs text-gray-500 dark:text-gray-400">
                                            AUM
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {walletsByMonth[month.month].map(
                                          (wallet) => (
                                            <tr
                                              key={wallet.walletUuid}
                                              className="border-b border-gray-200 dark:border-gray-700"
                                            >
                                              <td className="px-2 py-2 text-gray-700 dark:text-gray-300">
                                                {wallet.clientName}
                                              </td>
                                              <td className="px-2 py-2 text-gray-700 dark:text-gray-300">
                                                {wallet.managerName}
                                              </td>
                                              <td className="px-2 py-2 text-gray-700 dark:text-gray-300">
                                                {wallet.startDate
                                                  ? new Date(
                                                      wallet.startDate,
                                                    ).toLocaleDateString(
                                                      'pt-BR',
                                                    )
                                                  : 'N/A'}
                                              </td>
                                              <td className="px-2 py-2 text-gray-700 dark:text-gray-300">
                                                {wallet.nextRebalancing
                                                  ? new Date(
                                                      wallet.nextRebalancing,
                                                    ).toLocaleDateString(
                                                      'pt-BR',
                                                    )
                                                  : '-'}
                                              </td>
                                              <td className="px-2 py-2">
                                                {getStatusBadge(
                                                  wallet.isDelayedRebalancing,
                                                )}
                                              </td>
                                              <td className="px-2 py-2 text-gray-700 dark:text-gray-300">
                                                {formatCurrency(
                                                  wallet.currentAUM,
                                                )}
                                              </td>
                                            </tr>
                                          ),
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            )}
                        </>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
