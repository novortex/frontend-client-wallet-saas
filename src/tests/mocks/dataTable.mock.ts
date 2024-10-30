import { AddAssetFunctionResponse } from '@/types/addAsset.type'
import { AssetsOrganizationForSelectedResponse } from '@/types/asset.type'

export const mockAddAssetResponse: AddAssetFunctionResponse = {
  addAsset: {
    assetUuid: 'ef8272cc-573a-4753-95cd-1b73e6210909',
    walletUuid: '4091e88c-bfa5-4608-8514-212502fb2598',
    quantity: 12,
    targetAllocation: 5,
  },
  saveHistory: {
    assetUuid: 'ef8272cc-573a-4753-95cd-1b73e6210909',
    createAt: '2024-10-30T00:32:31.389Z',
    cuid: 'cm2v570d8001ll0fen12n3m8j',
    data: {
      data: '30/10/2024',
      icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png',
      asset: 'Uniswap',
      quantity: 12,
      target_allocation: 5,
    },
    description:
      '"Uniswap" has been added to the wallet with a quantity of 12 and a target allocation of 5%.',
    historyType: 'ADD_ASSET',
    userUuid: '9ecfc98d-6313-444d-8d4e-1f171cd46fd8',
    walletUuid: '4091e88c-bfa5-4608-8514-212502fb2598',
  },
  updateCurrentAmountOfWallet: {
    accountEmail: null,
    benchmarkCuid: '70253247-8731-43c5-8710-1f41047a7816',
    closeDate: '2025-04-30T00:15:50.000Z',
    contract: false,
    createAt: '2024-08-15T19:45:17.475Z',
    currentAmount: 748378.2952146194,
    emailPassword: null,
    exchangePassword: null,
    exchangeUuid: 'b5cef8b0-2488-4498-a7ff-42cc09900bb3',
    initialFee: 0,
    initialFeePaid: false,
    investedAmount: 1000,
    isClosed: false,
    lastRebalance: null,
    monthCloseDate: '2024-05-30T00:15:50.000Z',
    organizationUuid: 'e74e88e2-2185-42a8-8ae2-8013057ba7b8',
    performanceFee: 25,
    rebalanceInterval: null,
    riskProfile: 'STANDARD',
    startDate: '2024-10-30T00:15:50.000Z',
    updateAt: '2024-10-30T00:32:31.394Z',
    userUuid: '71d3af95-86a1-4f8d-860f-e1f7aff7644b',
    uuid: '4091e88c-bfa5-4608-8514-212502fb2598',
  },
}

export const mockAssetsResponse: AssetsOrganizationForSelectedResponse[] = [
  {
    uuid: 'ef8272cc-573a-4753-95cd-1b73e6210909',
    name: 'Uniswap',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png',
  },
]
