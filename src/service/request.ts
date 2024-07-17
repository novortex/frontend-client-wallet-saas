import { instance } from '@/config/api'

export type TWalletCommission = {
  name: string
  comission: number
}

export type TWalletInfos = {
  manager: string
  lastContacAt: string | null
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
  }
  benchmark: {
    name: string
  }
  currentValueBenchmark: number
  lastRebalance: string
  nextBalance: string // or Date
  exchange: {
    name: string
    accountEmail: string
    exchangePassword: string
    emailPassword: string
  }
}

export type TWalletAssetsInfo = {
  enterDate: string
  investedAmount: number
  currentAmount: number
  monthCloseDate: string
  performanceFee: number
  lastRebalance: string
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
    uuid: string
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

type WalletDataResponse = {
  wallet: TWalletAssetsInfo
  assets: TAsset[]
}

export type AssetsOrganizationForSelectedResponse = {
  uuid: string
  name: string
  icon: string
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
      `manager/client/${walletUuid}/infos`,
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
      `manager/${organizationUuid}/assets`,
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
      `admin/${organizationUuid}/cryptos`,
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

export async function getAllAssetsWalletClient(
  organizationUuid: string,
  walletUuid: string,
) {
  try {
    const result = await instance.get<WalletDataResponse>(
      `manager/wallet/${walletUuid}/walletAssets`,
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
      `manager/wallet/${walletUuid}/asset`,
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
      `manager/wallet/${organizationUuid}/assets`,
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
