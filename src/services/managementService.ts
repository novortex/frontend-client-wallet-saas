/* eslint-disable camelcase */
import { instance } from '@/config/api'
import { WalletClosing } from '@/pages/walletClosing/types'
import { BenchmarksProps } from '@/types/asset.type'
import {
  TCustomersOrganization,
  TNewCustomerResponse,
  TSendContractIdRequest,
} from '@/types/customer.type'
import { TAssetsOrganizationResponse } from '@/types/response.type'

export async function getAllAssetsOrg() {
  try {
    const result =
      await instance.get<TAssetsOrganizationResponse[]>('management/assets')

    return result.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function addCryptoOrg(idCmc: number[]) {
  try {
    const result = await instance.post('management/asset', { idCmc })
    return result.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function registerNewCustomer(
  name: string,
  email: string,
  phone?: string,
): Promise<TNewCustomerResponse> {
  try {
    const data = {
      name,
      email,
      phone,
    }
    const result = await instance.post<TNewCustomerResponse>(
      'management/costumer',
      data,
    )
    return result.data
  } catch (error) {
    console.error('Error registering new customer:', error)
    throw error
  }
}

export async function confirmContactClient(walletUuid: string) {
  try {
    const result = await instance.patch('management/contact', { walletUuid })
    return result.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function getAllManagersOnOrganization(): Promise<
  { name: string; uuid: string }[]
> {
  try {
    const result = await instance.get('management/managers')
    return result.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function getAllCustomersOrganization() {
  try {
    const result =
      await instance.get<TCustomersOrganization[]>('management/clients')
    return result.data
  } catch (error) {
    console.log(error)
  }
}

export async function convertedTimeZone() {
  try {
    const result = await instance.get('management/timezone')
    return result.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function getAllFiatCurrencies() {
  try {
    const result = await instance.get('management/fiat-currencies')
    return result.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function updateCustomer(
  customerUuid: string,
  data: {
    name: string
    email: string
    phone: string | null
  },
) {
  try {
    const result = await instance.put(
      `management/customer/${customerUuid}`,
      data,
    )
    return result.data
  } catch (error) {
    console.error('Error updating customer:', error)
    throw error
  }
}

export async function updateWallet(
  walletUuid: string,
  data: {
    initialFeeIsPaid: boolean
    contract: boolean
    exchangeUuid: string
    manager: string
    emailExchange: string
    emailPassword: string
    accountPassword: string
    performanceFee: number
    riskProfile:
      | 'SUPER_LOW_RISK'
      | 'LOW_RISK'
      | 'STANDARD'
      | 'HIGH_RISK'
      | 'SUPER_HIGH_RISK'
  },
) {
  try {
    const result = await instance.put(`management/wallet/${walletUuid}`, data)
    return result.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function downloadPdf(
  client_name: string,
  start_date: string,
  start_date_formatted: string,
  end_date: string,
  end_date_formatted: string,
  invested_amount_in_organization_fiat: string,
  benchmark_name: string,
  wallet_performance_fee: string,
  company_commission: string,
  total_commission: string,
  dollar_value: string,
  benchmark_price_start: string,
  benchmark_price_end: string,
  benchmark_performance: string,
  wallet_benchmark_value: string,
  close_wallet_value_in_organization_fiat: string,
  total_wallet_profit_percent: string,
  wallet_benchmark_exceeded_value: string,
  assets: { name: string; allocation: number }[],
) {
  const pdfData = {
    client_name,
    start_date,
    start_date_formatted,
    end_date,
    end_date_formatted,
    invested_amount_in_organization_fiat,
    benchmark_name,
    wallet_performance_fee,
    company_commission,
    total_commission,
    dollar_value,
    benchmark_price_start,
    benchmark_price_end,
    benchmark_performance,
    wallet_benchmark_value,
    close_wallet_value_in_organization_fiat,
    total_wallet_profit_percent,
    wallet_benchmark_exceeded_value,
    assets,
  }

  try {
    const response = await instance.post('management/generate-pdf', pdfData, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'close_wallet.pdf')
    document.body.appendChild(link)
    link.click()
  } catch (error) {
    console.error('Erro ao fazer download do PDF:', error)
  }
}

export async function getAllBenchmark() {
  try {
    const result = await instance.get('management/benchmark')
    return result.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function getAllExchange() {
  try {
    const result = await instance.get('management/exchanges')
    return result.data
  } catch (error) {
    console.error(error)
    throw error
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

export async function getBenchmarkOptions(): Promise<BenchmarksProps[]> {
  try {
    const result = await instance.get(`/management/benchmark`, {})
    return result.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function sendContractId(
  data: TSendContractIdRequest,
): Promise<any> {
  try {
    const response = await instance.post('/d4sign', data)
    return response.data
  } catch (error) {
    console.error('Error sending contract ID:', error)
  }
}

export async function getWalletClosings(): Promise<WalletClosing[]> {
  try {
    const result = await instance.get('management/wallet-closings')
    return result.data.clients
  } catch (error) {
    console.error('Error fetching wallet closings:', error)
    throw error
  }
}
