import { instance } from '@/config/api'
import { WalletDataResponse } from '@/types/response.type'
import { HistoricEntry, RebalanceReturn } from '@/types/wallet.type'

async function getAllAssetsWalletClient(walletUuid: string) {
  try {
    const result = await instance.get<WalletDataResponse>(
      `wallet/${walletUuid}/walletAssets`,
    )
    return result.data
  } catch (error) {
    console.log(error)
  }
}

async function updateCurrentAmount(walletUuid: string): Promise<void> {
  try {
    const result = await instance.put(`wallet/${walletUuid}/currentAmount`, {})
    return result.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

async function getWalletHistoric(walletUuid: string) {
  try {
    const result = await instance.get<HistoricEntry[]>(`historic/${walletUuid}`)
    return result.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

async function calculateRebalanceInWallet(
  walletUuid: string,
): Promise<RebalanceReturn[]> {
  try {
    const result = await instance.post<RebalanceReturn[]>(
      `wallet/${walletUuid}/rebalanceWallet`,
      {},
    )

    console.log(`result =>`, result)
    return result.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export {
  getAllAssetsWalletClient,
  updateCurrentAmount,
  getWalletHistoric,
  calculateRebalanceInWallet,
}
