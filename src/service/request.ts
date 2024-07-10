import { instance } from '@/config/api'

export type TWalletCommission = {
  name: string
  comission: number
}

export type TWalletInfos = {
  manager: string
  lastContactAt: string | null
}

export type TWallet = {
  uuid: string
  userUuid: string
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
  rebalanceCuid: string | null
  exchangeUuid: string
  organizationUuid: string
  createAt: string // or Date
  updateAt: string // or Date
  benchmarkCuid: string
}

type TUserLoginInfos = {
  user: {
    cpf: string | null
    createAt: string // ou Date se você preferir trabalhar com objetos Date em vez de strings ISO
    email: string
    name: string
    phone: string | null
    role: 'ADMIN' | 'USER' | 'OTHER_ROLE' // Ajuste conforme os diferentes papéis que você tem
    updateAt: string // ou Date se preferir
    uuid: string
    uuidOrganizations: string
  }
}

type TInfosCustomerResponse = {
  walletCommission: TWalletCommission[]
  walletInfos: TWalletInfos
  wallet: TWallet
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
