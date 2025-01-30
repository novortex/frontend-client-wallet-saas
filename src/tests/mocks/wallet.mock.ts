import { WalletDataResponse } from '@/types/response.type'

const organizationUuid = 'e74e88e2-2185-42a8-8ae2-8013057ba7b8'
const walletUuid = '4091e88c-bfa5-4608-8514-212502fb2598'

const mockResponse: WalletDataResponse = {
  wallet: {
    ownerName: null,
    startDate: null,
    investedAmount: null,
    currentAmount: null,
    performanceFee: null,
    lastRebalance: null,
    monthCloseDate: null,
    isClosed: false,
    ownerName: '',
  },
  assets: [
    {
      uuid: '1',
      name: 'Asset 1',
      icon: 'icon1.png',
      currentAmount: 1000,
      quantityAsset: 10,
      price: 100,
      currentAllocation: 50,
      idealAllocation: 50,
      idealAmountInMoney: 500,
      buyOrSell: 1,
    },
    {
      uuid: '2',
      name: 'Asset 2',
      icon: 'icon2.png',
      currentAmount: 2000,
      quantityAsset: 20,
      price: 150,
      currentAllocation: 50,
      idealAllocation: 50,
      idealAmountInMoney: 1000,
      buyOrSell: 1,
    },
  ],
}

export { organizationUuid, walletUuid, mockResponse }
