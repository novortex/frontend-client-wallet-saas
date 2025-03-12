import { instance } from '@/config/api'
import { HistoricEntry } from '@/types/wallet.type'

export async function getWalletHistoric(
  walletUuid: string,
): Promise<HistoricEntry[]> {
  try {
    const result = await instance.get<HistoricEntry[]>(`historic/${walletUuid}`)
    return result.data
  } catch (error) {
    console.error('Error fetching wallet historic:', error)
    throw new Error('Failed to fetch wallet historic')
  }
}
