/* eslint-disable camelcase */
import { instance } from '@/config/api'
import { BenchmarksProps } from '@/types/asset.type'
import {
  TCustomersOrganization,
  TNewCustomerResponse,
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
  start_date_formated: string,
  end_date: string,
  end_date_formated: string,
  invested_amount_in_organization_fiat: string,
  benchmark_name: string,
  company_comission: string,
  total_comission: string,
  dollar_value: string,
  benchmark_price_start: string,
  benchmark_price_end: string,
  wallet_benchmark_value: string,
  close_wallet_value_in_organization_fiat: string,
  wallet_benchmark_exceeded_value: string,
  assets: { name: string; allocation: number }[],
) {
  const pdfData = {
    client_name,
    start_date,
    start_date_formated,
    end_date,
    end_date_formated,
    invested_amount_in_organization_fiat,
    benchmark_name,
    company_comission,
    total_comission,
    dollar_value,
    benchmark_price_start,
    benchmark_price_end,
    wallet_benchmark_value,
    close_wallet_value_in_organization_fiat,
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
