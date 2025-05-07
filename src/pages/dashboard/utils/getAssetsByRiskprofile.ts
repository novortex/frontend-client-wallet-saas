import { Portfolio } from '@/types/assetsDetails.type'

export const getAssetsByProfile = (data: Portfolio) => {
  return data
    .filter((item) => item.qntInWallet > 0)
    .map((asset) => ({
      name: asset.name,
      superLowRisk: asset.riskProfileCounts.superLowRisk,
      lowRisk: asset.riskProfileCounts.lowRisk,
      standard: asset.riskProfileCounts.standard,
      highRisk: asset.riskProfileCounts.highRisk,
      superHighRisk: asset.riskProfileCounts.superHighRisk,
    }))
}
