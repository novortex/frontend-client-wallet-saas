import { instance } from '@/config/api'
import { HistoricEntry } from '@/types/wallet.type'

export async function getWalletHistoric(
  walletUuid: string
) {
  try {
    const result = await instance.get<
      HistoricEntry[]
    >(`historic/${walletUuid}`)
    return result.data
  } catch (error) {
    console.error(error)
    throw error
  }
}
