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

type TInfosCustomerResponse = {
  walletCommission: TWalletCommission[]
  walletPreInfos: TWalletInfos
  walletInfo: TWallet
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
