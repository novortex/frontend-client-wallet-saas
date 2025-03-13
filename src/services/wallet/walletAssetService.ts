import { instance } from '@/config/api'
import { AddAssetFunctionResponse } from '@/types/addAsset.type'
import { AssetsOrganizationForSelectedResponse } from '@/types/asset.type'
import { WalletDataResponse } from '@/types/response.type'

export async function getAllAssetsWalletClient(walletUuid: string) {
  try {
    const result = await instance.get<WalletDataResponse>(
      `wallet/${walletUuid}/walletAssets`,
    )
    return result.data
  } catch (error) {
    console.log(error)
  }
}

export async function tradeAsset(
  walletUuid: string,
  assetUuid: string,
  quantity: number,
) {
  try {
    const result = await instance.put(`wallet/${walletUuid}/trade`, {
      assetUuid,
      quantity,
    })
    return result.data
  } catch (error) {
    console.log(error)
    return false
  }
}

export async function updateAssetIdealAllocation(
  walletUuid: string,
  assetUuid: string,
  idealAllocation: number,
) {
  try {
    const result = await instance.put(`wallet/${walletUuid}/idealAllocation`, {
      assetUuid,
      idealAllocation,
    })
    return result.data
  } catch (error) {
    console.log(error)
    return false
  }
}

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

export async function createDepositWithdrawal(
  amount: number,
  walletUuid: string,
  currency: string,
  isWithdrawal: boolean,
  date?: string,
) {
  try {
    const data = { amount, walletUuid, currency, isWithdrawal, date }
    const result = await instance.post('wallet/deposit-withdrawal', data)
    return result.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function deleteAssetWallet(walletUuid: string, assetUuid: string) {
  try {
    const result = await instance.delete(
      `wallet/${walletUuid}/assets/${assetUuid}`,
    )
    return result.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function rebalanceWallet(walletUuid: string) {
  try {
    const result = await instance.put(
      `wallet/${walletUuid}/rebalanceWallet`,
      {},
    )
    return result.data
  } catch (error) {
    console.error(error)
    throw error
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
