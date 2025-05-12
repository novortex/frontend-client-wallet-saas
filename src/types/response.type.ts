import { TAsset } from './asset.type'
import { TRiskProfileCounts } from './riskProfile.type'
import {
  TWallet,
  TWalletAssetsInfo,
  TWalletCommission,
  TWalletInfos,
} from './wallet.type'

export type TInfosCustomerResponse = {
  walletCommission: TWalletCommission[]
  walletPreInfos: TWalletInfos
  walletInfo: TWallet
}

export type TAssetsOrganizationResponse = {
  uuid: string
  icon: string
  name: string
  price: number
  qntInWallet: number
  presencePercentage: number
  riskProfileCounts: TRiskProfileCounts
}

export type Portifolio = TAssetsOrganizationResponse[]

export type WalletDataResponse = {
  wallet: TWalletAssetsInfo
  assets: TAsset[]
  revenue: number | string
}
