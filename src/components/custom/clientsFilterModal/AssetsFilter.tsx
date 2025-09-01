import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BadgeCent, X } from 'lucide-react'

export function AssetsFilter({
  assets,
  selectedAssets,
  handleSelectAsset,
  handleRemoveAsset,
}: {
  assets: { uuid: string; name: string }[]
  selectedAssets: { uuid: string; name: string }[]
  handleSelectAsset: (asset: { uuid: string; name: string }) => void
  handleRemoveAsset: (assetUuid: string) => void
}) {
  const handleAssetSelection = (selectedName: string) => {
    const asset = assets.find((a) => a.name === selectedName)
    if (asset && !selectedAssets.some((sel) => sel.uuid === asset.uuid)) {
      handleSelectAsset(asset)
    }
  }
  const lastAsset = selectedAssets.at(-1) ?? null

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-2">
          <BadgeCent className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-black dark:text-white">
          Ativos
        </h3>
      </div>
      
      <div className="space-y-3">
        <Select
          value={lastAsset ? lastAsset.name : ''}
          onValueChange={handleAssetSelection}
        >
          <SelectTrigger className="w-full border-gray-300 bg-white text-black transition-all hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-primary">
            <SelectValue placeholder="Select assets" />
          </SelectTrigger>
          <SelectContent className="border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800">
            {assets.map((asset) => (
              <SelectItem
                key={asset.uuid}
                value={asset.name}
                className="hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
              >
                <div>{asset.name}</div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {selectedAssets.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedAssets.map((asset) => (
              <div
                key={asset.uuid}
                className="flex h-8 items-center justify-start rounded-md bg-yellow-600 px-2 text-white hover:bg-yellow-700 transition-colors cursor-pointer"
                onClick={() => handleRemoveAsset(asset.uuid)}
              >
                <span className="mr-2">{asset.name}</span>
                <X className="h-3 w-3" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
