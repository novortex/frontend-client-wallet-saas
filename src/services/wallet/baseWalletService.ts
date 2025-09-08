import { instance } from '@/config/api'
import { RiskProfile } from '@/pages/customers/index'

export interface GetBaseWalletByRiskResponse {
  uuid: string
}

export interface ApplyBaseWalletAllocationResponse {
  success: boolean
  walletUuid: string
  baseWalletUuid: string
}

export async function getBaseWalletByRisk(
  riskProfile: RiskProfile,
): Promise<GetBaseWalletByRiskResponse> {
  const { data } = await instance.get<GetBaseWalletByRiskResponse>(
    `/base-wallet/by-risk?riskProfile=${encodeURIComponent(String(riskProfile))}`,
  )
  return data
}

export async function applyBaseWalletAllocationWithSameRisk(input: {
  walletUuid: string
  baseWalletUuid: string
}): Promise<ApplyBaseWalletAllocationResponse> {
  const { data } = await instance.post<ApplyBaseWalletAllocationResponse>(
    '/base-wallet/apply-allocation',
    input,
  )
  return data
}

export async function applyBaseWalletAllocationForNewRisk(input: {
  walletUuid: string
  baseWalletUuid: string
}): Promise<ApplyBaseWalletAllocationResponse> {
  const { data } = await instance.post<ApplyBaseWalletAllocationResponse>(
    '/base-wallet/apply-new-allocation',
    input,
  )
  return data
}
