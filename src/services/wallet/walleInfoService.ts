import { instance } from '@/config/api'
import { TClientInfosResponse, TNewCustomerResponse } from '@/types/customer.type'
import { TInfosCustomerResponse } from '@/types/response.type'
import { RebalanceReturn } from '@/types/wallet.type'


export async function getWalletOrganization(): Promise<TClientInfosResponse[]> {
  try {
    const response = await instance.get<TClientInfosResponse[]>('wallet');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getInfosCustomer(walletUuid: string): Promise<TInfosCustomerResponse | undefined> {
  try {
    const result = await instance.get<TInfosCustomerResponse>(`wallet/${walletUuid}/infos`)
    return result.data

  } catch (error) {
    throw error;
  }
}

export async function registerWalletForCustomer(
  customerUuid: string,
  currency: string,
  investedAmount: number,
  initialFee: number,
  initialFeePaid: boolean,
  riskProfile: string,
  contract: boolean,
  performanceFee: number,
  benchmarkCuid: string,
  exchangeUuid: string,
  managerUuid: string,
  accountEmail?: string,
  emailPassword?: string,
  exchangePassword?: string
) {
  try {
    const data = {
      currency,
      investedAmount,
      initialFee,
      initialFeePaid,
      riskProfile,
      contract,
      performanceFee,
      userUuid: customerUuid,
      accountEmail,
      emailPassword,
      exchangePassword,
      exchangeUuid,
      benchmarkCuid,
      managerUuid,
    };

    const result = await instance.post<TNewCustomerResponse>('wallet', data);
    return result.data;
  } catch (error) {
    throw error;
  }
}

export async function updateCurrentAmount(walletUuid: string): Promise<void> {
  try {
    const result = await instance.put(`wallet/${walletUuid}/currentAmount`, {});
    return result.data;
  } catch (error) {
    throw error;
  }
}

export async function requestCloseWallet(walletUuid: string, data: { customDate: string }) {
  try {
    const result = await instance.put(`wallet/${walletUuid}/closeWallet`, data);
    return result.data;
  } catch (error) {
    throw error;
  }
}

export async function getGraphData(walletUuid: string) {
  try {
    const result = await instance.get(`wallet/${walletUuid}/graphData`);
    return result.data;
  } catch (error) {
    throw error;
  }
}

export async function requestStartWallet(walletUuid: string, data: { customDate: string }) {
  try {
    const result = await instance.put(`wallet/${walletUuid}/startWallet`, data);
    return result.data;
  } catch (error) {
    throw error;
  }
}

export async function calculateRebalanceInWallet(walletUuid: string): Promise<RebalanceReturn[]> {
  try {
    const result = await instance.post<RebalanceReturn[]>(`wallet/${walletUuid}/rebalanceWallet`, {})

    console.log(`result =>`, result)
    return result.data

  } catch (error) {
    throw error;
  }
}