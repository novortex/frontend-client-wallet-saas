import { instance } from '@/config/api'
import { AddAssetFunctionResponse } from '@/types/addAsset.type'
import { AssetsOrganizationForSelectedResponse } from '@/types/asset.type'

export async function addCryptoWalletClient(
  organizationUuid: string,
  walletUuid: string,
  assetUuid: string,
  quantity: number,
  targetAllocation: number,
): Promise<AddAssetFunctionResponse | boolean> {
  try {
    const result = await instance.post<AddAssetFunctionResponse>(
      `wallet/${walletUuid}/asset`,
      {
        assetUuid,
        quantity,
        targetAllocation,
      },
      {
        headers: {
          'x-organization': organizationUuid,
        },
      },
    )

    return result.data
  } catch (error) {
    console.log(error)
    return false
  }
}

export async function getAllAssetsInOrgForAddWalletClient(
  organizationUuid: string,
) {
  try {
    const result = await instance.get<AssetsOrganizationForSelectedResponse[]>(
      `wallet/${organizationUuid}/assets`,
      {
        headers: {
          'x-organization': organizationUuid,
        },
      },
    )

    return result.data
  } catch (error) {
    console.log(error)
  }
}
