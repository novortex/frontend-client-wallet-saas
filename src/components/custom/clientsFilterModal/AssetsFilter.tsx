import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BadgeCent } from 'lucide-react'

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

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="h-[20%] w-full font-bold dark:text-[#959CB6]">
        Filter by assets
      </div>
      <div className="flex h-[80%] w-full flex-col items-center justify-center gap-4">
        <div className="flex h-full w-[100%] items-center justify-center gap-2">
          <div className="flex h-full w-[10%] items-center justify-center">
            <BadgeCent className="text-[#D1AB00]" size="lg" />
          </div>
          <div className="flex w-full items-center justify-start">
            <Select onValueChange={handleAssetSelection}>
              <SelectTrigger className="w-full dark:border-[#323232] dark:bg-[#131313] dark:text-[#fff]">
                <SelectValue placeholder="Select assets" />
              </SelectTrigger>
              <SelectContent className="border-2 dark:border-[#323232] dark:bg-[#131313]">
                {assets.map((asset) => (
                  <SelectItem
                    key={asset.uuid}
                    value={asset.name}
                    className="border-0 dark:bg-[#131313] dark:text-white dark:focus:bg-[#252525] dark:focus:text-white"
                  >
                    <div>{asset.name}</div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex w-full flex-wrap items-start justify-start gap-2">
          {selectedAssets.map((asset) => (
            <div
              key={asset.uuid}
              className="flex h-8 items-center justify-start rounded-md bg-[#959CB6] px-2 text-white"
            >
              <div
                className="mr-2 cursor-pointer"
                onClick={() => handleRemoveAsset(asset.uuid)}
              >
                X
              </div>
              <div>{asset.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
