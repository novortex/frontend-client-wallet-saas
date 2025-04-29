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
  presencePercentage: string
  riskProfileCounts: TRiskProfileCounts
}

export type WalletDataResponse = {
  wallet: TWalletAssetsInfo
  assets: TAsset[]
}
