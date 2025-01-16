import { instance } from '@/config/api'
import { AddAssetFunctionResponse } from '@/types/addAsset.type'
import { AssetsOrganizationForSelectedResponse } from '@/types/asset.type'

export async function addCryptoWalletClient(
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
    )
    return result.data
  } catch (error) {
    console.log(error)
    return false
  }
}

export async function getAllAssetsInOrgForAddWalletClient() {
  try {
    const result =
      await instance.get<AssetsOrganizationForSelectedResponse[]>(
        `wallet/assets`,
      )
    return result.data
  } catch (error) {
    console.log(error)
  }
}

export async function getExchangesDisposables() {
  try {
    const result = await instance.get<{ name: string; uuid: string }[]>(
      `/management/exchanges`,
    )
    return result.data
  } catch (error) {
    console.log(error)
  }
}
