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
    assets: { uuid: string, name: string }[]
    selectedAssets: { uuid: string, name: string }[]
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
        <div className="w-full flex flex-col gap-2">
            <div className="h-[20%] w-full font-bold text-[#959CB6]">
                Filter by assets
            </div>
            <div className="h-[80%] w-full flex flex-col items-center justify-center gap-4">
                <div className="h-full w-[100%] flex justify-center gap-2 items-center">
                    <div className="h-full w-[10%] flex justify-center items-center">
                        <BadgeCent className="text-[#D1AB00]" size="lg" />
                    </div>
                    <div className="w-full flex items-center justify-start">
                        <Select onValueChange={handleAssetSelection}>
                            <SelectTrigger className="w-full bg-[#131313] border-[#323232] text-[#fff]">
                                <SelectValue placeholder="Select assets" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#131313] border-2 border-[#323232]">
                                {assets.map((asset) => (
                                    <SelectItem
                                        key={asset.uuid}
                                        value={asset.name}
                                        className="bg-[#131313] border-0 focus:bg-[#252525] focus:text-white text-white"
                                    >
                                        <div>{asset.name}</div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex flex-wrap justify-start items-start gap-2 w-full">
                    {selectedAssets.map((asset) => (
                        <div
                            key={asset.uuid}
                            className="h-8 flex justify-start items-center bg-[#959CB6] text-white rounded-md px-2"
                        >
                            <div
                                className="cursor-pointer mr-2"
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
