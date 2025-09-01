import { instance } from '@/config/api'
import {
  BaseWallet,
  CreateBaseWalletRequest,
  UpdateBaseWalletRequest,
  ApplyAllocationRequest,
} from '@/types/baseWallet.type'

export async function getBaseWallets(): Promise<BaseWallet[]> {
  try {
    const response = await instance.get<BaseWallet[]>('base-wallet')
    return response.data
  } catch (error) {
    console.error('Error fetching base wallets:', error)
    throw error
  }
}

export async function getBaseWalletByRisk(
  riskProfile: string,
): Promise<BaseWallet> {
  try {
    const response = await instance.get<BaseWallet>('base-wallet/by-risk', {
      params: { riskProfile },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching base wallet by risk:', error)
    throw error
  }
}

export async function createBaseWallet(
  data: CreateBaseWalletRequest,
): Promise<BaseWallet> {
  try {
    const response = await instance.post<BaseWallet>('base-wallet', data)
    return response.data
  } catch (error) {
    console.error('Error creating base wallet:', error)
    throw error
  }
}

export async function updateBaseWallet(
  uuid: string,
  data: UpdateBaseWalletRequest,
): Promise<BaseWallet> {
  try {
    const response = await instance.put<BaseWallet>(`base-wallet/${uuid}`, data)
    return response.data
  } catch (error) {
    console.error('Error updating base wallet:', error)
    throw error
  }
}

export async function deleteAssetFromBaseWallet(
  baseWalletUuid: string,
  assetUuid: string,
): Promise<BaseWallet> {
  try {
    const response = await instance.delete<BaseWallet>(`base-wallet/${baseWalletUuid}/assets/${assetUuid}`)
    return response.data
  } catch (error) {
    console.error('Error deleting asset from base wallet:', error)
    throw error
  }
}

export async function deleteBaseWallet(uuid: string): Promise<void> {
  try {
    await instance.delete(`base-wallet/${uuid}`)
  } catch (error) {
    console.error('Error deleting base wallet:', error)
    throw error
  }
}

export async function applyBaseWalletAllocation(
  data: ApplyAllocationRequest,
): Promise<any> {
  try {
    const response = await instance.post('base-wallet/apply-allocation', data)
    return response.data
  } catch (error) {
    console.error('Error applying base wallet allocation:', error)
    throw error
  }
}

export async function applyBaseWalletAllocationToAllWallets(
  riskProfile: string,
): Promise<any> {
  try {
    const response = await instance.post('base-wallet/apply-allocation-to-all', {
      riskProfile
    })
    return response.data
  } catch (error) {
    console.error('Error applying base wallet allocation to all wallets:', error)
    throw error
  }
}