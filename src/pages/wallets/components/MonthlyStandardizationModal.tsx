import { useCallback, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import {
  getAllAssetsInOrgForAddWalletClient,
  getAllAssetsWalletClient,
  updateAssetIdealAllocation,
  addCryptoWalletClient,
} from '@/services/wallet/walletAssetService'
import { getWalletOrganization } from '@/services/wallet/walleInfoService'
import { Loading } from '@/components/custom/loading'
import {
  AssetsOrganizationForSelectedResponse,
  TAsset,
} from '@/types/asset.type'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

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

type Change = {
  assetName: string
  assetUuid: string
  from: number
  to: number
  diff: number
  action: 'add' | 'update' | 'remove'
}

type PreviewWallet = {
  walletUuid: string
  client: string
  managerName: string
  startMonth: string
  changes: Change[]
  currentAUM: number
}

// Helper function to extract month from startDate
const getMonthFromDate = (startDate: string | Date | null): string => {
  if (!startDate) return ''

  const date = typeof startDate === 'string' ? new Date(startDate) : startDate
  if (isNaN(date.getTime())) return ''

  return MONTHS[date.getMonth()]
}

// Function to process changes in a strategic order
async function processWalletChanges(
  walletData: PreviewWallet,
  allocations: Record<string, number>,
  existingAssets: TAsset[],
) {
  const changes = walletData.changes.sort((a, b) => {
    if (a.action === 'remove' && b.action !== 'remove') return -1
    if (b.action === 'remove' && a.action !== 'remove') return 1
    if (a.diff < 0 && b.diff >= 0) return -1
    if (b.diff < 0 && a.diff >= 0) return 1
    if (a.action === 'add' && b.action !== 'add') return 1
    if (b.action === 'add' && a.action !== 'add') return -1
    return 0
  })

  for (const change of changes) {
    const allocation = allocations[change.assetUuid] || 0
    const currentAsset = existingAssets.find((a) => a.uuid === change.assetUuid)

    try {
      if (currentAsset) {
        await updateAssetIdealAllocation(
          walletData.walletUuid,
          change.assetUuid,
          allocation,
        )
      } else {
        if (allocation > 0) {
          await addCryptoWalletClient(
            walletData.walletUuid,
            change.assetUuid,
            0,
            allocation,
          )
        }
      }
    } catch (error) {
      console.error(
        `Error processing ${change.assetName} in wallet ${walletData.client}:`,
        error,
      )
      // Continue with next assets even if one fails
    }
  }
}

export function MonthlyStandardizationModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [assets, setAssets] = useState<AssetsOrganizationForSelectedResponse[]>(
    [],
  )
  const [selectedMonths, setSelectedMonths] = useState<string[]>(['January']) // Array of months
  const [allocations, setAllocations] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<PreviewWallet[] | null>(null)
  const [applying, setApplying] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  const fetchAssets = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getAllAssetsInOrgForAddWalletClient()
      setAssets(result || [])
      setAllocations({})
      setPreview(null)
    } catch (error) {
      console.error('Error fetching assets:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os ativos.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    if (open) {
      fetchAssets()
    }
  }, [open, fetchAssets])

  const handleAllocationChange = (uuid: string, value: string) => {
    setAllocations((prev) => ({
      ...prev,
      [uuid]: Math.max(0, Math.min(100, Number(value) || 0)),
    }))
  }

  // Function to handle multiple month selection
  const handleMonthToggle = (month: string) => {
    setSelectedMonths((prev) => {
      if (prev.includes(month)) {
        // Remove month if already selected
        return prev.filter((m) => m !== month)
      } else {
        // Add month if not selected
        return [...prev, month]
      }
    })
  }

  // Function to select all months
  const handleSelectAllMonths = () => {
    if (selectedMonths.length === MONTHS.length) {
      setSelectedMonths(['January']) // Keep at least one month
    } else {
      setSelectedMonths([...MONTHS])
    }
  }

  const total = assets.reduce(
    (sum, asset) => sum + (allocations[asset.uuid] || 0),
    0,
  )
  const isValid =
    Math.abs(total - 100) < 0.01 &&
    assets.length > 0 &&
    selectedMonths.length > 0

  const handlePreview = async () => {
    if (!isValid) {
      if (selectedMonths.length === 0) {
        toast({
          title: 'Nenhum mês selecionado',
          description: 'Selecione pelo menos um mês para continuar.',
          variant: 'destructive',
        })
        return
      }
      toast({
        title: 'Configuração inválida',
        description: 'A soma das alocações deve ser 100%.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const wallets = await getWalletOrganization()

      if (!wallets || wallets.length === 0) {
        setPreview([])
        toast({
          title: 'Nenhuma carteira encontrada',
          description: 'Não há carteiras disponíveis.',
          variant: 'destructive',
        })
        return
      }

      const result: PreviewWallet[] = []

      // Fetch data for all wallets in parallel
      const walletDetailsPromises = wallets.map(async (wallet) => {
        try {
          const walletAssetsResp = await getAllAssetsWalletClient(
            wallet.walletUuid,
          )
          return {
            wallet,
            walletInfo: walletAssetsResp?.wallet,
            walletAssets: walletAssetsResp?.assets || [],
          }
        } catch (error) {
          console.error(
            `Error fetching wallet data ${wallet.walletUuid}:`,
            error,
          )
          return {
            wallet,
            walletInfo: null,
            walletAssets: [],
          }
        }
      })

      const walletDetailsResults = await Promise.all(walletDetailsPromises)

      // Filter and process wallets for selected months
      for (const { wallet, walletInfo, walletAssets } of walletDetailsResults) {
        if (!walletInfo) continue

        const walletMonth = getMonthFromDate(walletInfo.startDate)

        // Check if wallet month is in selected months
        if (!selectedMonths.includes(walletMonth)) continue

        // Calculate required changes
        const changes: Change[] = []

        // Check each organization asset
        for (const asset of assets) {
          const targetAllocation = allocations[asset.uuid] || 0
          const currentAsset = walletAssets.find((wa) => wa.uuid === asset.uuid)
          const currentAllocation = currentAsset?.idealAllocation || 0

          if (Math.abs(targetAllocation - currentAllocation) > 0.01) {
            let action: 'add' | 'update' | 'remove' = 'update'

            if (targetAllocation > 0 && !currentAsset) {
              action = 'add'
            } else if (targetAllocation === 0 && currentAsset) {
              action = 'remove'
            }

            changes.push({
              assetName: asset.name,
              assetUuid: asset.uuid,
              from: currentAllocation,
              to: targetAllocation,
              diff: targetAllocation - currentAllocation,
              action,
            })
          }
        }

        result.push({
          walletUuid: wallet.walletUuid,
          client: wallet.infosClient?.name || 'Cliente sem nome',
          managerName: wallet.managerName || 'Sem gerente',
          startMonth: walletMonth,
          changes,
          currentAUM: walletInfo.currentAmount || 0,
        })
      }

      setPreview(result)

      if (result.length === 0) {
        toast({
          title: 'Nenhuma carteira encontrada',
          description: `Não há carteiras que começaram em ${selectedMonths.join(', ')}.`,
          variant: 'destructive',
        })
      } else {
        const walletsWithChanges = result.filter(
          (w) => w.changes.length > 0,
        ).length
        toast({
          title: 'Preview gerado!',
          description: `${result.length} carteiras encontradas, ${walletsWithChanges} precisam de mudanças.`,
        })
      }
    } catch (error) {
      console.error('Error in preview:', error)
      toast({
        title: 'Erro ao simular',
        description: 'Não foi possível simular as mudanças.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    if (!preview || preview.length === 0) {
      toast({
        title: 'Nenhuma carteira para atualizar',
        description: 'Execute o preview primeiro.',
        variant: 'destructive',
      })
      return
    }

    const walletsWithChanges = preview.filter((w) => w.changes.length > 0)
    if (walletsWithChanges.length === 0) {
      toast({
        title: 'Nenhuma mudança necessária',
        description: 'Todas as carteiras já estão padronizadas.',
      })
      return
    }

    setApplying(true)
    setProgress(0)

    try {
      for (const [idx, walletData] of walletsWithChanges.entries()) {
        // Fetch current assets of the wallet
        const walletAssetsResp = await getAllAssetsWalletClient(
          walletData.walletUuid,
        )
        const existingAssets = walletAssetsResp?.assets || []

        // Call the strategic function
        await processWalletChanges(walletData, allocations, existingAssets)

        setProgress(((idx + 1) / walletsWithChanges.length) * 100)
      }

      toast({
        title: 'Padronização aplicada!',
        description: 'Carteiras padronizadas com sucesso.',
      })
      setPreview(null)
    } catch (error) {
      console.error('General error in standardization:', error)
      toast({
        title: 'Erro ao aplicar',
        description:
          'Algumas mudanças podem não ter sido aplicadas. Verifique o console para detalhes.',
        variant: 'destructive',
      })
    } finally {
      setApplying(false)
      setProgress(0)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            Standardize Wallets by Month
            <Badge variant="outline">
              {selectedMonths.length} month
              {selectedMonths.length !== 1 ? 's' : ''} selected
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center p-20">
            <Loading />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Month selector */}
            <div className="rounded-lg border bg-blue-50 p-4 dark:bg-blue-900/20">
              <div className="mb-3 flex items-center justify-between">
                <label className="font-semibold text-blue-900 dark:text-blue-100">
                  Select the wallets&apos; months:
                </label>
                <Button
                  onClick={handleSelectAllMonths}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                >
                  {selectedMonths.length === MONTHS.length
                    ? 'Deselect All'
                    : 'Select All'}
                </Button>
              </div>

              {/* Grid of checkboxes for multiple selection */}
              <div className="grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-6">
                {MONTHS.map((month) => (
                  <label
                    key={month}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all hover:bg-blue-100 dark:hover:bg-blue-800/50 ${
                      selectedMonths.includes(month)
                        ? 'border-blue-500 bg-blue-100 text-blue-900 dark:bg-blue-800 dark:text-blue-100'
                        : 'border-gray-300 bg-white text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedMonths.includes(month)}
                      onChange={() => handleMonthToggle(month)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs">{month.slice(0, 3)}</span>
                  </label>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {selectedMonths.map((month) => (
                  <Badge
                    key={month}
                    variant="secondary"
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {month}
                  </Badge>
                ))}
              </div>

              {selectedMonths.length === 0 ? (
                <p className="mt-2 text-sm text-red-800 dark:text-red-200">
                  No month selected.
                </p>
              ) : (
                <p className="mt-2 text-sm text-blue-800 dark:text-blue-200">
                  Only wallets that started in{' '}
                  <strong>
                    {selectedMonths.length === 1
                      ? selectedMonths[0]
                      : selectedMonths.length === MONTHS.length
                        ? 'any month'
                        : `${selectedMonths.slice(0, -1).join(', ')} and ${selectedMonths[selectedMonths.length - 1]}`}
                  </strong>{' '}
                  will be affected.
                </p>
              )}
            </div>

            {/* Allocation configuration */}
            <div className="rounded-lg border p-4">
              <div className="mb-4 flex items-center justify-between">
                <label className="font-semibold text-gray-900 dark:text-gray-100">
                  Set the default allocation for each asset
                </label>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={isValid ? 'default' : 'destructive'}
                    className={`text-sm font-bold ${
                      isValid
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    Total: {total.toFixed(2)}%
                  </Badge>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full rounded-lg border bg-white dark:bg-gray-900">
                  <thead>
                    <tr className="border-b bg-gray-50 dark:bg-gray-800">
                      <th className="p-4 text-left font-semibold">Asset</th>
                      <th className="p-4 text-center font-semibold">
                        Ideal Allocation (%)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {assets.map((asset) => (
                      <tr
                        key={asset.uuid}
                        className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {asset.icon && (
                              <img
                                src={asset.icon}
                                alt={asset.name}
                                className="h-10 w-10 rounded-full border"
                              />
                            )}
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {asset.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              value={allocations[asset.uuid] ?? ''}
                              onChange={(e) =>
                                handleAllocationChange(
                                  asset.uuid,
                                  e.target.value,
                                )
                              }
                              className={`w-28 text-center font-bold ${
                                !isValid ? 'border-red-500' : 'border-green-500'
                              }`}
                              placeholder="0.00"
                            />
                            <span className="font-medium text-gray-500">%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {!isValid && selectedMonths.length > 0 && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-800 dark:bg-red-900/20 dark:text-red-200">
                  <span className="text-lg">⚠️</span>
                  <span className="font-medium">
                    The sum of allocations must be exactly 100%.
                  </span>
                </div>
              )}

              {selectedMonths.length === 0 && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-yellow-50 p-3 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
                  <span className="text-lg">⚠️</span>
                  <span className="font-medium">
                    Please select at least one month to continue.
                  </span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handlePreview}
                disabled={!isValid || loading}
                className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
              >
                Preview Changes
              </Button>

              <Button
                onClick={handleApply}
                disabled={!preview || preview.length === 0 || applying}
                className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
              >
                {applying ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Applying...
                  </>
                ) : (
                  <>Apply Standardization</>
                )}
              </Button>
            </div>

            {/* Progress bar during apply */}
            {applying && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Standardization progress:</span>
                  <span>{progress.toFixed(0)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            {/* Preview of changes */}
            {preview !== null && (
              <div className="rounded-lg border p-4">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  📊 Simulated Changes
                  <Badge variant="outline">
                    {preview.length} wallets found
                  </Badge>
                </h3>

                {preview.length === 0 ? (
                  <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                    <p className="mt-2 font-medium text-gray-600">
                      No wallets found for{' '}
                      <strong>
                        {selectedMonths.length === 1
                          ? selectedMonths[0]
                          : `${selectedMonths.slice(0, -1).join(', ')} and ${selectedMonths[selectedMonths.length - 1]}`}
                      </strong>
                    </p>
                    <p className="text-sm text-gray-500">
                      Try selecting different months or check if there are
                      registered wallets.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Summary by month */}
                    <div className="mb-4 flex flex-wrap gap-2">
                      {selectedMonths.map((month) => {
                        const walletsInMonth = preview.filter(
                          (w) => w.startMonth === month,
                        )
                        const walletsWithChanges = walletsInMonth.filter(
                          (w) => w.changes.length > 0,
                        )

                        if (walletsInMonth.length === 0) return null

                        return (
                          <Badge
                            key={month}
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            {month}: {walletsInMonth.length} wallets
                            {walletsWithChanges.length > 0 && (
                              <span className="text-orange-600">
                                ({walletsWithChanges.length} need changes)
                              </span>
                            )}
                          </Badge>
                        )
                      })}
                    </div>

                    {/* Detailed table */}
                    <div className="max-h-96 overflow-x-auto">
                      <table className="w-full border text-sm">
                        <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800">
                          <tr>
                            <th className="p-3 text-left font-semibold">
                              Client
                            </th>
                            <th className="p-3 text-left font-semibold">
                              Manager
                            </th>
                            <th className="p-3 text-center font-semibold">
                              Month
                            </th>
                            <th className="p-3 text-center font-semibold">
                              AUM
                            </th>
                            <th className="p-3 text-left font-semibold">
                              Required Changes
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {preview.map((wallet) => (
                            <tr
                              key={wallet.walletUuid}
                              className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50"
                            >
                              <td className="p-3 font-medium">
                                {wallet.client}
                              </td>
                              <td className="p-3 text-gray-600 dark:text-gray-400">
                                {wallet.managerName}
                              </td>
                              <td className="p-3 text-center">
                                <Badge variant="secondary" className="text-xs">
                                  {wallet.startMonth.slice(0, 3)}
                                </Badge>
                              </td>
                              <td className="p-3 text-center font-mono">
                                {new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: 'USD',
                                  minimumFractionDigits: 0,
                                }).format(wallet.currentAUM)}
                              </td>
                              <td className="p-3">
                                {wallet.changes.length === 0 ? (
                                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    ✅ Already standardized
                                  </Badge>
                                ) : (
                                  <div className="space-y-1">
                                    {wallet.changes.map((change, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center gap-2 text-xs"
                                      >
                                        <span className="font-medium">
                                          {change.assetName}:
                                        </span>
                                        <span className="text-gray-600">
                                          {change.from.toFixed(2)}%
                                        </span>
                                        <span>→</span>
                                        <span className="font-bold text-blue-600">
                                          {change.to.toFixed(2)}%
                                        </span>
                                        <span
                                          className={`text-xs ${
                                            change.diff > 0
                                              ? 'text-green-600'
                                              : 'text-red-600'
                                          }`}
                                        >
                                          ({change.diff > 0 ? '+' : ''}
                                          {change.diff.toFixed(2)}%)
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
