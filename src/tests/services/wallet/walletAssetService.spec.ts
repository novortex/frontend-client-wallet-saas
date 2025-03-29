import { instance } from '@/config/api'
import {
  addCryptoWalletClient,
  createDepositWithdrawal,
  deleteAssetWallet,
  getAllAssetsInOrgForAddWalletClient,
  getAllAssetsWalletClient,
  rebalanceWallet,
  updateAssetIdealAllocation,
} from '@/services/wallet/walletAssetService'

jest.mock('@/config/api', () => ({
  instance: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}))

describe('walletAssetService', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllAssetsWalletClient', () => {
    it('should fetch all assets for a wallet client', async () => {
      const mockData = { assets: [{ id: '1', name: 'Bitcoin' }] }
      ;(instance.get as jest.Mock).mockResolvedValue({ data: mockData })

      const result = await getAllAssetsWalletClient('123')
      expect(result).toEqual(mockData)
      expect(instance.get).toHaveBeenCalledWith('wallet/123/walletAssets')
    })

    it('should return undefined when fetching assets fails', async () => {
      ;(instance.get as jest.Mock).mockRejectedValue(new Error('Network error'))

      const result = await getAllAssetsWalletClient('123')
      expect(result).toBeUndefined()
    })
  })

  describe('updateAssetIdealAllocation', () => {
    it('should update ideal allocation successfully', async () => {
      const mockData = { success: true }
      ;(instance.put as jest.Mock).mockResolvedValue({ data: mockData })

      const result = await updateAssetIdealAllocation('123', '456', 30)
      expect(result).toEqual(mockData)
      expect(instance.put).toHaveBeenCalledWith('wallet/123/idealAllocation', {
        assetUuid: '456',
        idealAllocation: 30,
      })
    })

    it('should return false if update fails', async () => {
      ;(instance.put as jest.Mock).mockRejectedValue(
        new Error('Invalid allocation'),
      )

      const result = await updateAssetIdealAllocation('123', '456', -10)
      expect(result).toBe(false)
    })

    it('should handle invalid ideal allocation range', async () => {
      const result = await updateAssetIdealAllocation('123', '456', 150)
      expect(result).toBe(false)
    })
  })
})

describe('addCryptoWalletClient', () => {
  it('should add crypto asset to wallet', async () => {
    const mockResponse = { success: true }
    ;(instance.post as jest.Mock).mockResolvedValue({ data: mockResponse })

    const result = await addCryptoWalletClient('123', '456', 10, 20)
    expect(result).toEqual(mockResponse)
    expect(instance.post).toHaveBeenCalledWith('wallet/123/asset', {
      assetUuid: '456',
      quantity: 10,
      targetAllocation: 20,
    })
  })

  it('should return false when adding a crypto asset fails', async () => {
    ;(instance.post as jest.Mock).mockRejectedValue(
      new Error('Invalid asset data'),
    )

    const result = await addCryptoWalletClient('123', '', -5, 150)
    expect(result).toBe(false)
  })
})

describe('createDepositWithdrawal', () => {
  it('should create deposit or withdrawal', async () => {
    ;(instance.post as jest.Mock).mockResolvedValue({ data: {} })

    await createDepositWithdrawal(500, '123', 'USD', true)
    expect(instance.post).toHaveBeenCalledWith('wallet/deposit-withdrawal', {
      amount: 500,
      walletUuid: '123',
      currency: 'USD',
      isWithdrawal: true,
    })
  })

  it('should handle optional date parameter', async () => {
    ;(instance.post as jest.Mock).mockResolvedValue({ data: {} })

    await createDepositWithdrawal(500, '123', 'USD', false, '2024-01-01')
    expect(instance.post).toHaveBeenCalledWith('wallet/deposit-withdrawal', {
      amount: 500,
      walletUuid: '123',
      currency: 'USD',
      isWithdrawal: false,
      date: '2024-01-01',
    })
  })

  it('should throw an error when deposit or withdrawal fails', async () => {
    ;(instance.post as jest.Mock).mockRejectedValue(
      new Error('Invalid deposit data'),
    )

    await expect(
      createDepositWithdrawal(-500, '123', 'INVALID', true),
    ).rejects.toThrow('Invalid deposit data')
  })
})

describe('deleteAssetWallet', () => {
  it('should delete asset from wallet', async () => {
    ;(instance.delete as jest.Mock).mockResolvedValue({ data: {} })

    await deleteAssetWallet('123', '456')
    expect(instance.delete).toHaveBeenCalledWith('wallet/123/assets/456')
  })

  it('should throw an error when deleting a non-existent asset', async () => {
    ;(instance.delete as jest.Mock).mockRejectedValue(
      new Error('Asset not found'),
    )

    await expect(deleteAssetWallet('123', '999')).rejects.toThrow(
      'Asset not found',
    )
  })
})

describe('rebalanceWallet', () => {
  it('should rebalance wallet', async () => {
    const mockResponse = { success: true }
    ;(instance.put as jest.Mock).mockResolvedValue({ data: mockResponse })

    const result = await rebalanceWallet('123')
    expect(result).toEqual(mockResponse)
    expect(instance.put).toHaveBeenCalledWith('wallet/123/rebalanceWallet', {})
  })

  it('should throw an error when rebalancing wallet fails', async () => {
    ;(instance.put as jest.Mock).mockRejectedValue(
      new Error('Rebalance failed'),
    )

    await expect(rebalanceWallet('INVALID')).rejects.toThrow('Rebalance failed')
  })
})

describe('getAllAssetsInOrgForAddWalletClient', () => {
  it('should fetch all available assets in organization', async () => {
    const mockData = [{ id: '1', name: 'Bitcoin' }]
    ;(instance.get as jest.Mock).mockResolvedValue({ data: mockData })

    const result = await getAllAssetsInOrgForAddWalletClient()
    expect(result).toEqual(mockData)
    expect(instance.get).toHaveBeenCalledWith('wallet/assets')
  })

  it('should return undefined when fetching available assets fails', async () => {
    ;(instance.get as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch assets'),
    )

    const result = await getAllAssetsInOrgForAddWalletClient()
    expect(result).toBeUndefined()
  })
})
