import { useState, useEffect } from 'react'
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
import { AssetsOrganizationForSelectedResponse } from '@/types/asset.type'
import { TClientInfosResponse } from '@/types/customer.type'

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
type Change = { assetName: string; from: number; to: number; diff: number }
type PreviewWallet = { walletUuid: string; client: string; changes: Change[] }

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
  const [selectedMonth, setSelectedMonth] = useState('January')
  const [allocations, setAllocations] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<PreviewWallet[] | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      setLoading(true)
      getAllAssetsInOrgForAddWalletClient().then((result) => {
        setAssets(result || [])
        setAllocations({})
        setPreview(null)
        setLoading(false)
      })
    }
  }, [open])

  const handleAllocationChange = (uuid: string, value: string) => {
    setAllocations((prev) => ({
      ...prev,
      [uuid]: Math.max(0, Math.min(100, Number(value) || 0)),
    }))
  }

  const total = assets.reduce(
    (sum, asset) => sum + (allocations[asset.uuid] || 0),
    0,
  )
  const isValid = Math.abs(total - 100) < 0.01 && assets.length > 0

  const handlePreview = async () => {
    setLoading(true)
    try {
      const wallets: TClientInfosResponse[] = await getWalletOrganization()
      const result: PreviewWallet[] = []

      for (const wallet of wallets) {
        // Buscar dados detalhados da carteira
        const walletAssetsResp = await getAllAssetsWalletClient(
          wallet.walletUuid,
        )
        const walletInfo = walletAssetsResp?.wallet
        const walletAssets = walletAssetsResp?.assets || []

        // Usar o startDate do objeto detalhado
        const walletMonth = (() => {
          if (!walletInfo?.startDate) return ''
          const date =
            typeof walletInfo.startDate === 'string'
              ? new Date(walletInfo.startDate)
              : walletInfo.startDate
          return MONTHS[date.getMonth()]
        })()
        if (walletMonth !== selectedMonth) continue

        const changes: Change[] = assets
          .map((asset) => {
            const current =
              walletAssets.find((a) => a.uuid === asset.uuid)
                ?.currentAllocation || 0
            const target = allocations[asset.uuid] || 0
            return {
              assetName: asset.name,
              from: current,
              to: target,
              diff: target - current,
            }
          })
          .filter((c) => Math.abs(c.diff) > 0.1)
        result.push({
          walletUuid: wallet.walletUuid,
          client: wallet.infosClient?.name || '',
          changes,
        })
      }
      setPreview(result)
    } catch (e) {
      toast({
        title: 'Erro ao simular',
        description: 'Não foi possível simular as mudanças.',
      })
    }
    setLoading(false)
  }

  const handleApply = async () => {
    setLoading(true)
    try {
      // Buscar todas as carteiras do mês selecionado
      const wallets: TClientInfosResponse[] = await getWalletOrganization()
      const walletsToUpdate: string[] = []

      // Filtrar carteiras do mês selecionado
      for (const wallet of wallets) {
        const walletAssetsResp = await getAllAssetsWalletClient(
          wallet.walletUuid,
        )
        const walletInfo = walletAssetsResp?.wallet

        const walletMonth = (() => {
          if (!walletInfo?.startDate) return ''
          const date =
            typeof walletInfo.startDate === 'string'
              ? new Date(walletInfo.startDate)
              : walletInfo.startDate
          return MONTHS[date.getMonth()]
        })()

        if (walletMonth === selectedMonth) {
          walletsToUpdate.push(wallet.walletUuid)
        }
      }

      // Aplicar as alocações para cada carteira e cada ativo
      const updatePromises: Promise<unknown>[] = []
      for (const walletUuid of walletsToUpdate) {
        // Buscar os ativos existentes na carteira
        const walletAssetsResp = await getAllAssetsWalletClient(walletUuid)
        const existingAssets = walletAssetsResp?.assets || []
        const existingAssetUuids = existingAssets.map((asset) => asset.uuid)

        for (const asset of assets) {
          const targetAllocation = allocations[asset.uuid] || 0
          if (targetAllocation > 0) {
            const assetExists = existingAssetUuids.includes(asset.uuid)

            if (assetExists) {
              // Se o ativo já existe, atualiza a alocação ideal
              updatePromises.push(
                updateAssetIdealAllocation(
                  walletUuid,
                  asset.uuid,
                  targetAllocation,
                ),
              )
            } else {
              // Se o ativo não existe, adiciona à carteira
              updatePromises.push(
                addCryptoWalletClient(
                  walletUuid,
                  asset.uuid,
                  0, // quantidade inicial zero
                  targetAllocation,
                ),
              )
            }
          }
        }
      }

      // Executar todas as atualizações em paralelo
      await Promise.all(updatePromises)

      toast({
        title: 'Padronização aplicada!',
        description: `${walletsToUpdate.length} carteiras de ${selectedMonth} foram padronizadas.`,
      })
      setPreview(null)
      onOpenChange(false)
    } catch (e) {
      toast({
        title: 'Erro ao aplicar',
        description: 'Não foi possível aplicar as mudanças.',
      })
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Padronizar carteiras por mês</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex items-center justify-center p-10">
            <Loading />
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="mb-2 block font-medium">Selecione o mês:</label>
              <select
                className="rounded border bg-white px-2 py-1 text-black"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block font-medium">
                Defina a alocação padrão para cada ativo
                <span
                  className={`ml-2 rounded px-2 py-1 text-xs font-semibold ${isValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                >
                  {total.toFixed(2)}%
                </span>
              </label>
              <div className="overflow-x-auto">
                <table className="w-full rounded-lg border bg-white dark:bg-gray-900">
                  <thead>
                    <tr className="border-b bg-gray-50 dark:bg-gray-800">
                      <th className="p-3 text-left font-semibold">Ativo</th>
                      <th className="p-3 text-center font-semibold">
                        Alocação
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {assets.map((asset) => (
                      <tr
                        key={asset.uuid}
                        className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            {asset.icon && (
                              <img
                                src={asset.icon}
                                alt={asset.name}
                                className="h-8 w-8 rounded-full border"
                              />
                            )}
                            <span className="font-medium">{asset.name}</span>
                          </div>
                        </td>
                        <td className="p-3">
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
                              className={`w-24 text-center font-semibold ${!isValid && 'border-red-500'}`}
                              style={{ fontVariantNumeric: 'tabular-nums' }}
                            />
                            <span className="font-medium text-gray-500">%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!isValid && (
                <div className="mt-2 flex items-center gap-2 font-medium text-red-600">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  A soma das alocações deve ser 100%.
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-4">
              <Button onClick={handlePreview} disabled={!isValid}>
                Pré-visualizar mudanças
              </Button>
              <Button
                onClick={handleApply}
                disabled={!isValid || !preview || preview.length === 0}
                variant="outline"
              >
                Aplicar para todas as carteiras
              </Button>
            </div>
            {preview !== null && (
              <div className="mt-6">
                <h3 className="mb-2 font-semibold">Mudanças simuladas:</h3>
                {preview.length === 0 ? (
                  <div className="rounded border bg-gray-50 p-4 text-center text-gray-500">
                    Nenhuma carteira encontrada para o mês selecionado.
                  </div>
                ) : (
                  <table className="w-full border text-sm">
                    <thead>
                      <tr>
                        <th className="p-2 text-left">Carteira</th>
                        <th className="p-2 text-left">Mudanças</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((w) => (
                        <tr key={w.walletUuid} className="border-b">
                          <td className="p-2 align-top font-medium">
                            {w.client}
                          </td>
                          <td className="p-2">
                            {w.changes.length === 0 ? (
                              <span className="text-green-600">
                                Já está padronizada
                              </span>
                            ) : (
                              <ul className="ml-4 list-disc">
                                {w.changes.map((c, idx) => (
                                  <li key={idx}>
                                    {c.assetName}: {c.from.toFixed(2)}% →{' '}
                                    <span className="font-bold">
                                      {c.to.toFixed(2)}%
                                    </span>{' '}
                                    ({c.diff > 0 ? '+' : ''}
                                    {c.diff.toFixed(2)}%)
                                  </li>
                                ))}
                              </ul>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
