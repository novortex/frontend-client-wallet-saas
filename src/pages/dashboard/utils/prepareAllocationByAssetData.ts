import { AllocationByAsset } from '@/types/asset.type'

export const prepareAllocationByAssetData = (data: AllocationByAsset) => {
  return data.sort((a, b) => b.total - a.total).slice(0, 10)
}
