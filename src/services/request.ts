import { instance } from '@/config/api'
import { AssetsOrganizationForSelectedResponse } from '@/types/asset.type'
import {
  TClientInfosResponse,
  TCustomersOrganization,
  TNewCustomerResponse,
} from '@/types/customer.type'
import {
  TAssetsOrganizationResponse,
  TInfosCustomerResponse,
  WalletDataResponse,
} from '@/types/response.type'

export async function getInfosCustomer(
  walletUuid: string,
  organizationUuid: string,
): Promise<TInfosCustomerResponse | undefined> {
  try {
    const result = await instance.get<TInfosCustomerResponse>(
      `wallet/${walletUuid}/infos`,
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

export async function getAllAssetsOrg(organizationUuid: string) {
  try {
    const result = await instance.get<TAssetsOrganizationResponse[]>(
      `management/${organizationUuid}/assets`,
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

export async function addCryptoOrg(organizationUuid: string, idCmc: number[]) {
  try {
    const result = await instance.post(
      `management/${organizationUuid}/asset`,
      {
        idCmc,
      },
      {
        headers: {
          'x-organization': organizationUuid,
        },
      },
    )

    return result.data
  } catch (error) {
    console.log(error)
    return false
  }
}

export async function registerNewCustomer(
  name: string,
  email: string,
  organizationUuid: string,
  phone?: string,
): Promise<TNewCustomerResponse> {
  try {
    const data = {
      name,
      email,
      phone,
      organizationUuid,
    }

    const result = await instance.post<TNewCustomerResponse>(
      'management/costumer',
      data,
      {
        headers: {
          'x-organization': organizationUuid,
        },
      },
    )

    return result.data
  } catch (error) {
    console.error('Error registering new customer:', error)
    throw error
  }
}

export async function getWalletOrganization(
  organizationUuid: string,
): Promise<TClientInfosResponse[]> {
  try {
    const response = await instance.get<TClientInfosResponse[]>(`wallet`, {
      headers: {
        'x-organization': organizationUuid,
      },
    })

    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function addCryptoWalletClient(
  organizationUuid: string,
  walletUuid: string,
  assetUuid: string,
  quantity: number,
  targetAllocation: number,
) {
  try {
    const result = await instance.post(
      `wallet/${walletUuid}/asset`,
      {
        assetUuid,
        quantity,
        targetAllocation,
      },
      {
        headers: {
          'x-organization': organizationUuid,
        },
      },
    )

    return result.data
  } catch (error) {
    console.log(error)
    return false
  }
}

export async function getAllAssetsInOrgForAddWalletClient(
  organizationUuid: string,
) {
  try {
    const result = await instance.get<AssetsOrganizationForSelectedResponse[]>(
      `wallet/${organizationUuid}/assets`,
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

export async function updateAssetWalletInformations(
  organizationUuid: string,
  walletUuid: string,
  assetUuid: string,
  quantity: number,
  targetAllocation: number,
) {
  try {
    const result = await instance.put(
      `wallet/${walletUuid}/asset`,
      {
        assetUuid,
        quantity,
        targetAllocation,
      },
      {
        headers: {
          'x-organization': organizationUuid,
        },
      },
    )

    return result.data
  } catch (error) {
    console.log(error)
    return false
  }
}

export async function confirmContactClient(
  organizationUuid: string,
  walletUuid: string,
) {
  try {
    const result = await instance.patch(
      'management/contact',
      {
        walletUuid,
      },
      {
        headers: {
          'x-organization': organizationUuid,
        },
      },
    )
    return result.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function getAllManagersOnOrganization(organizationUuid: string) {
  try {
    const result = await instance.get(
      `management/${organizationUuid}/managers`,
      {
        headers: {
          'x-organization': organizationUuid,
        },
      },
    )
    return result.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function getAllCustomersOrganization(organizationUuid: string) {
  try {
    const result = await instance.get<TCustomersOrganization[]>(
      `management/${organizationUuid}/clients`,
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

export async function convertedTimeZone(organizationUuid: string) {
  try {
    const result = await instance.get('management/timezone', {
      headers: {
        'x-organization': organizationUuid,
      },
    })
    return result.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function registerWalletForCustomer(
  organizationUuid: string,
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
  exchangePassword?: string,
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
    }

    const result = await instance.post<TNewCustomerResponse>('wallet', data, {
      headers: {
        'x-organization': organizationUuid,
      },
    })

    return result.data
  } catch (error) {
    console.error('Error registering new customer:', error)
    throw error
  }
}

export async function getAllBenchmark(organizationUuid: string) {
  try {
    const result = await instance.get('management/benchmark', {
      headers: {
        'x-organization': organizationUuid,
      },
    })

    return result.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function getAllExchange(organizationUuid: string) {
  try {
    const result = await instance.get('management/exchanges', {
      headers: {
        'x-organization': organizationUuid,
      },
    })

    return result.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function getAllFiatCurrencies(organizationUuid: string) {
  try {
    const result = await instance.get('management/fiat-currencies', {
      headers: {
        'x-organization': organizationUuid,
      },
    })
    return result.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function createDepositWithdrawal(
  organizationUuid: string,
  amount: number,
  walletUuid: string,
  currency: string,
  isWithdrawal: boolean,
  date?: Date,
) {
  try {
    const data = { amount, walletUuid, currency, isWithdrawal, date }
    const result = await instance.post('wallet/deposit-withdrawal', data, {
      headers: { 'x-organization': organizationUuid },
    })
    return result.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function deleteAssetWallet(
  organizationUuid: string,
  walletUuid: string,
  assetUuid: string,
) {
  try {
    const result = await instance.delete(
      `wallet/${walletUuid}/assets/${assetUuid}`,
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

export async function getWalletHistoric(
  organizationUuid: string,
  walletUuid: string,
) {
  try {
    const result = await instance.get(`historic/${walletUuid}`, {
      headers: { 'x-organization': organizationUuid },
    })
    return result.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function getGraphData(
  organizationUuid: string,
  walletUuid: string,
) {
  try {
    const result = await instance.get(`wallet/${walletUuid}/graphData`, {
      headers: { 'x-organization': organizationUuid },
    })
    return result.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function updateCustomer(
  organizationUuid: string,
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

export async function closeWallet(
  organizationUuid: string,
  walletUuid: string,
) {
  try {
    const result = await instance.put(
      `wallet/${walletUuid}/closeWallet`,
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

export async function updateWallet(
  organizationUuid: string,
  walletUuid: string,
  data: {
    initialFeeIsPaid: boolean
    contract: boolean
    exchangeUuid: string
    manager: string
    emailExchange: string
    emailPassword: string
    accountPassword: string
  },
) {
  try {
    const result = await instance.put(`management/wallet/${walletUuid}`, data, {
      headers: { 'x-organization': organizationUuid },
    })
    return result.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function startWallet(
  organizationUuid: string,
  walletUuid: string,
) {
  try {
    const result = await instance.put(
      `wallet/${walletUuid}/startWallet`,
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
  organizationUuid: string,
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
      responseType: 'blob', // Define o tipo de resposta como blob para arquivos binários (como PDFs)
      headers: {
        'Content-Type': 'application/json',
        'x-organization': organizationUuid,
      },
    })

    // Cria um link para download
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'close_wallet.pdf') // Nome do arquivo que será baixado
    document.body.appendChild(link)
    link.click() // Simula o clique no link para iniciar o download
  } catch (error) {
    console.error('Erro ao fazer download do PDF:', error)
  }
}

export async function rebalanceWallet(
  organizationUuid: string,
  walletUuid: string,
) {
  try {
    const result = await instance.put(
      `wallet/${walletUuid}/rebalanceWallet`,
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
