export interface BaseWalletTarget {
  cuid?: string
  assetUuid: string
  idealAllocation: number
  asset?: {
    name: string
    symbol: string
  }
}

export interface BaseWallet {
  uuid: string
  name: string
  riskProfile: 'SUPER_LOW_RISK' | 'LOW_RISK' | 'STANDARD' | 'HIGH_RISK' | 'SUPER_HIGH_RISK'
  organizationUuid: string
  TargetAssets: BaseWalletTarget[]
  createdAt: string
  updatedAt: string
}

export interface CreateBaseWalletRequest {
  name: string
  riskProfile: 'SUPER_LOW_RISK' | 'LOW_RISK' | 'STANDARD' | 'HIGH_RISK' | 'SUPER_HIGH_RISK'
  targets: {
    assetUuid: string
    idealAllocation: number
  }[]
}

export interface UpdateBaseWalletRequest {
  name?: string
  targets?: {
    cuid?: string
    assetUuid: string
    idealAllocation: number
  }[]
  replaceTargets?: boolean
}

export interface ApplyAllocationRequest {
  walletUuid: string
  baseWalletUuid: string
}