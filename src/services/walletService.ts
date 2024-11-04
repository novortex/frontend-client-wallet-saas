import { instance } from '@/config/api'
import { WalletDataResponse } from '@/types/response.type'
import { HistoricEntry } from '@/types/wallet.type'

async function getAllAssetsWalletClient(
  organizationUuid: string,
  walletUuid: string,
) {
  try {
    const result = await instance.get<WalletDataResponse>(
      `wallet/${walletUuid}/walletAssets`,
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

async function updateCurrentAmount(
  organizationUuid: string,
  walletUuid: string,
): Promise<void> {
  try {
    const result = await instance.put(
      `wallet/${walletUuid}/currentAmount`,
      {},
      {
        headers: { 'x-organization': organizationUuid },
      },
    )
    return result.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

async function getWalletHistoric(organizationUuid: string, walletUuid: string) {
  try {
    const result = await instance.get<HistoricEntry[]>(
      `historic/${walletUuid}`,
      {
        headers: { 'x-organization': organizationUuid },
      },
    )

    return result.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export { getAllAssetsWalletClient, updateCurrentAmount, getWalletHistoric }
