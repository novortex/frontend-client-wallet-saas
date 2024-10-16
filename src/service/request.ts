/* eslint-disable camelcase */
import { instance } from '@/config/api'

export type TWalletCommission = {
  name: string
  commission: number
}

export type TWalletInfos = {
  manager: string
  lastContactAt: string | null
}

export type TWallet = {
  startDate: string // or Date
  investedAmount: number
  currentAmount: number
  closeDate: string // or Date
  initialFee: number | null
  initialFeePaid: boolean
  riskProfile: string // Adjust based on your risk profiles
  monthCloseDate: string // or Date
  contract: boolean
  performanceFee: number
  user: {
    name: string
    email: string
    phone: string
  }
  benchmark: {
    name: string
  }
  currentValueBenchmark: number
  lastRebalance: Date | null
  nextBalance: Date | null // or Date
  exchange: {
    name: string
  }
  accountEmail: string
  exchangePassword: string
  emailPassword: string
}

export type TWalletAssetsInfo = {
  startDate: Date | null
  investedAmount: number
  currentAmount: number
  monthCloseDate: Date | null
  performanceFee: number
  lastRebalance: Date | null
  isClosed: boolean
}

type TAsset = {
  uuid: string
  name: string
  icon: string
  investedAmount: number
  quantityAsset: number
  price: number
  currentAllocation: number
  idealAllocation: number
  idealAmountInMoney: number
  buyOrSell: number
}

type TUserLoginInfos = {
  user: {
    createAt: string // or Date if you prefer working with Date objects instead of ISO strings
    email: string
    name: string
    phone: string | null
    role: 'ADMIN' | 'USER' | 'OTHER_ROLE' // Adjust based on different roles you have
    updateAt: string // or Date if preferred
    uuidOrganizations: string
  }
}

type TRiskProfileCounts = {
  superLowRisk: number
  lowRisk: number
  standard: number
}

type TInfosCustomerResponse = {
  walletCommission: TWalletCommission[]
  walletPreInfos: TWalletInfos
  walletInfo: TWallet
}

type TAssetsOrganizationResponse = {
  uuid: string
  icon: string
  name: string
  price: number
  qntInWallet: number
  presencePercentage: string
  riskProfileCounts: TRiskProfileCounts
}

export type TNewCustomerResponse = {
  uuid: string
  name: string
  email: string
  password: string
  phone: string | null
  role: string
  createAt: string
  updateAt: string
  UserOrganizations: {
    userUuid: string
    organizationUuid: string
    active: boolean
  }[]
  uncryptedPassword: string
}

export type TClientInfosResponse = {
  walletUuid: string
  managerName: string
  infosClient: {
    name: string
    email: string
    phone?: string
  }
  lastBalance: Date | null
  nextBalance: Date | null
}

type WalletDataResponse = {
  wallet: TWalletAssetsInfo
  assets: TAsset[]
}

export type AssetsOrganizationForSelectedResponse = {
  uuid: string
  name: string
  icon: string
}

export type TManager = {
  userUuid: string
  active: boolean
  user: {
    name: string
    email: string
    phone: string | null
  }
}

export type TCustomersOrganization = {
  uuid: string
  name: string
  active: boolean
  email: string
  phone: string | null
  isWallet: boolean
  walletUuid: string | null
  exchange: {
    exchangeUuid: string
    exchangeName: string
  } | null
  emailExchange: string | null
  emailPassword: string | null
  exchangePassword: string | null
  manager: {
    managerUuid: string
    managerName: string
  } | null
  initialFeePaid: boolean | null
  contract: string | null
}

// Requests from api (backend)
export async function login(
  email: string,
  password: string,
): Promise<TUserLoginInfos | undefined> {
  try {
    const result = await instance.post<TUserLoginInfos>('auth/login', {
      email,
      password,
    })

    return result.data
  } catch (error) {
    console.log(error)
  }
}

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

export async function getAllAssetsWalletClient(
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
) {
  try {
    const data = { amount, walletUuid, currency, isWithdrawal }
    const result = await instance.post('wallet/deposit-withdrawal', data, {
      headers: { 'x-organization': organizationUuid },
    })
    return result.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function updateCurrentAmount(
  organizationUuid: string,
  walletUuid: string,
) {
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
