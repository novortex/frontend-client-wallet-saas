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
  riskProfile:
    | 'STANDARD'
    | 'SUPER_LOW_RISK'
    | 'LOW_RISK'
    | 'HIGH_RISK'
    | 'SUPER_HIGH_RISK'

  exchange: string
  nextBalance: Date | null
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
  performanceFee: number | null
  initialFeePaid: boolean | null
  contract: string | null
}
