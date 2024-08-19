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
  enterDate: string // or Date
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
    cpf: string
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
    accountEmail: string
    exchangePassword: string
    emailPassword: string
  }
}

export type TWalletAssetsInfo = {
  enterDate: Date | null
  investedAmount: number
  currentAmount: number
  monthCloseDate: Date | null
  performanceFee: number
  lastRebalance: Date | null
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
    cpf: string | null
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
  cpf: string | null
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
    cpf?: string
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
    cpf: string | null
  }
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
  organizationId: string,
  cpf?: string,
  phone?: string,
): Promise<TNewCustomerResponse> {
  try {
    const data = {
      name,
      email,
      cpf,
      phone,
      organizationId,
    }

    const result = await instance.post<TNewCustomerResponse>(
      'management/costumer',
      data,
      {
        headers: {
          'x-organization': organizationId,
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
        assetId: assetUuid,
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

