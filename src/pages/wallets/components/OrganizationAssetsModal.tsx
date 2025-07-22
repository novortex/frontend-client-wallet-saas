import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Loading } from '@/components/custom/loading'
import { getAllAssetsInOrgForAddWalletClient } from '@/services/wallet/walletAssetService'
import { Search, Coins } from 'lucide-react'

interface OrganizationAssetsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrganizationAssetsModal({
  open,
  onOpenChange,
}: OrganizationAssetsModalProps) {
  const [loading, setLoading] = useState(false)
  const [assets, setAssets] = useState<any[]>([])
  const [filteredAssets, setFilteredAssets] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()

  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true)
      const result = await getAllAssetsInOrgForAddWalletClient()
      if (result && Array.isArray(result)) {
        setAssets(result)
        setFilteredAssets(result)
      } else {
        toast({
          className: 'bg-yellow-500 border-0 text-white',
          title: 'No Assets',
          description: 'No assets found in the organization.',
        })
      }
    } catch (error) {
      toast({
        className: 'bg-red-500 border-0 text-white',
        title: 'Error',
        description: 'Failed to load organization assets.',
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredAssets(assets)
    } else {
      setFilteredAssets(
        assets.filter((asset) =>
          asset.name.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
    }
  }, [searchTerm, assets])

  useEffect(() => {
    if (open) {
      fetchAssets()
      setSearchTerm('')
    }
  }, [open, fetchAssets])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-black dark:text-white">
            <Coins size={24} />
            Organization Assets
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              ({assets.length} total assets)
            </span>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center p-20">
            <Loading />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
              />
              <Input
                type="text"
                placeholder="Search assets by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border bg-white pl-10 text-black dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Assets Summary */}
            <div className="mb-4">
              <span className="font-medium text-black dark:text-white">
                Total de moedas: {filteredAssets.length}
              </span>
            </div>

            {/* Assets List */}
            {filteredAssets.length === 0 ? (
              <div className="py-12 text-center">
                <Coins size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                  {searchTerm ? 'No assets found' : 'No assets available'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm
                    ? `No assets match "${searchTerm}". Try a different search term.`
                    : 'There are no assets configured in your organization.'}
                </p>
                {searchTerm && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchTerm('')}
                    className="mt-4"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  Moedas ({filteredAssets.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
                        <th className="p-4 text-left font-medium text-gray-900 dark:text-gray-100">
                          Ícone
                        </th>
                        <th className="p-4 text-left font-medium text-gray-900 dark:text-gray-100">
                          Nome
                        </th>
                        <th className="p-4 text-left font-medium text-gray-900 dark:text-gray-100">
                          UUID
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAssets.map((asset) => (
                        <tr
                          key={asset.uuid}
                          className="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                        >
                          <td className="p-4">
                            {asset.icon && (
                              <img
                                src={asset.icon}
                                alt={asset.name}
                                className="h-8 w-8 rounded-full object-cover"
                                onError={(e) => {
                                  ;(
                                    e.target as HTMLImageElement
                                  ).style.display = 'none'
                                }}
                              />
                            )}
                          </td>
                          <td className="p-4 font-medium text-gray-900 dark:text-gray-100">
                            {asset.name}
                          </td>
                          <td className="p-4 font-mono text-xs text-gray-500 dark:text-gray-400">
                            {asset.uuid}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
