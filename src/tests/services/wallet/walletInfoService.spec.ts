import { instance } from '@/config/api'
import {
  calculateRebalanceInWallet,
  getGraphData,
  getInfosCustomer,
  getWalletKpis,
  getWalletOrganization,
  registerWalletForCustomer,
  requestCloseWallet,
  updateCurrentAmount,
} from '@/services/wallet/walleInfoService'

jest.mock('@/config/api', () => ({
  instance: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}))

describe('walletInfoService', () => {
  describe('getWalletOrganization', () => {
    it('should fetch wallet organization', async () => {
      const mockData = [{ id: 1, name: 'Wallet Test' }]
      ;(instance.get as jest.Mock).mockResolvedValue({ data: mockData })

      const result = await getWalletOrganization()
      expect(result).toEqual(mockData)
      expect(instance.get).toHaveBeenCalledWith('wallet')
    })
  })

  describe('getInfosCustomer', () => {
    it('should fetch customer information', async () => {
      const mockData = { id: '123', name: 'John Doe' }
      ;(instance.get as jest.Mock).mockResolvedValue({ data: mockData })

      const result = await getInfosCustomer('123')
      expect(result).toEqual(mockData)
      expect(instance.get).toHaveBeenCalledWith('wallet/123/infos')
    })

    it('should throw an error when fetching customer information for a non-existent wallet', async () => {
      ;(instance.get as jest.Mock).mockRejectedValue(
        new Error('Wallet not found'),
      )

      await expect(getInfosCustomer('non-existent-wallet')).rejects.toThrow(
        'Wallet not found',
      )
      expect(instance.get).toHaveBeenCalledWith(
        'wallet/non-existent-wallet/infos',
      )
    })
  })

  describe('registerWalletForCustomer', () => {
    it('should register a wallet for a customer', async () => {
      const mockResponse = { success: true }
      const payload = {
        currency: 'USD',
        investedAmount: 1000,
        initialFee: 10,
        initialFeePaid: true,
        riskProfile: 'STANDARD',
        contract: true,
        performanceFee: 5,
        userUuid: '123',
        accountEmail: undefined,
        emailPassword: undefined,
        exchangePassword: undefined,
        exchangeUuid: 'exchange1',
        benchmarkCuid: 'cuid1',
        managerUuid: 'manager1',
      }

      ;(instance.post as jest.Mock).mockResolvedValue({ data: mockResponse })

      const result = await registerWalletForCustomer(
        '123',
        'USD',
        1000,
        10,
        true,
        'Low',
        true,
        5,
        'cuid1',
        'exchange1',
        'manager1',
      )

      expect(result).toEqual(mockResponse)
      expect(instance.post).toHaveBeenCalledWith('wallet', payload)
    })

    it('should throw an error when registering a wallet with missing required fields', async () => {
      ;(instance.post as jest.Mock).mockRejectedValue(
        new Error('Missing required fields'),
      )
      await expect(
        registerWalletForCustomer(
          '',
          'USD',
          1000,
          10,
          true,
          'Low',
          true,
          5,
          'cuid1',
          'exchange1',
          'manager1',
        ),
      ).rejects.toThrow('Missing required fields')

      expect(instance.post).toHaveBeenCalledWith('wallet', expect.any(Object))
    })
  })

  describe('updateCurrentAmount', () => {
    it('should update current amount', async () => {
      ;(instance.put as jest.Mock).mockResolvedValue({ data: {} })

      await updateCurrentAmount('123')
      expect(instance.put).toHaveBeenCalledWith('wallet/123/currentAmount', {})
    })
  })

  describe('requestCloseWallet', () => {
    it('should request close wallet', async () => {
      ;(instance.put as jest.Mock).mockResolvedValue({ data: {} })

      await requestCloseWallet('123', { customDate: '2023-01-01' })
      expect(instance.put).toHaveBeenCalledWith('wallet/123/closeWallet', {
        customDate: '2023-01-01',
      })
    })

    it('should throw an error when requesting to close a non-existent wallet', async () => {
      ;(instance.put as jest.Mock).mockRejectedValue(
        new Error('Wallet not found'),
      )

      await expect(
        requestCloseWallet('non-existent-wallet', { customDate: '2023-01-01' }),
      ).rejects.toThrow('Wallet not found')

      expect(instance.put).toHaveBeenCalledWith(
        'wallet/non-existent-wallet/closeWallet',
        {
          customDate: '2023-01-01',
        },
      )
    })
  })

  describe('getGraphData', () => {
    it('should fetch graph data', async () => {
      const mockData = { graph: [] }
      ;(instance.get as jest.Mock).mockResolvedValue({ data: mockData })

      const result = await getGraphData('123')
      expect(result).toEqual(mockData)
      expect(instance.get).toHaveBeenCalledWith('wallet/123/graphData')
    })
  })

  describe('calculateRebalanceInWallet', () => {
    it('should calculate rebalance in wallet', async () => {
      const mockData = [{ asset: 'BTC', allocation: 50 }]
      ;(instance.post as jest.Mock).mockResolvedValue({ data: mockData })

      const result = await calculateRebalanceInWallet('123')
      expect(result).toEqual(mockData)
      expect(instance.post).toHaveBeenCalledWith(
        'wallet/123/rebalanceWallet',
        {},
      )
    })

    it('should throw an error when rebalancing a wallet with invalid data', async () => {
      ;(instance.post as jest.Mock).mockRejectedValue(
        new Error('Rebalance failed'),
      )

      await expect(calculateRebalanceInWallet('invalid')).rejects.toThrow(
        'Rebalance failed',
      )
      expect(instance.post).toHaveBeenCalledWith(
        'wallet/invalid/rebalanceWallet',
        {},
      )
    })
  })

  describe('getWalletKpis', () => {
    it('should fetch wallet KPIs', async () => {
      const mockData = { performance: 10 }
      ;(instance.get as jest.Mock).mockResolvedValue({ data: mockData })

      const result = await getWalletKpis('123', 'monthly')
      expect(result).toEqual(mockData)
      expect(instance.get).toHaveBeenCalledWith('wallet/123/kpis', {
        params: { period: 'monthly' },
      })
    })

    it('should throw an error when fetching wallet KPIs with an invalid period', async () => {
      ;(instance.get as jest.Mock).mockRejectedValue(
        new Error('Invalid period parameter'),
      )

      await expect(getWalletKpis('123', 'invalid-period')).rejects.toThrow(
        'Invalid period parameter',
      )
      expect(instance.get).toHaveBeenCalledWith('wallet/123/kpis', {
        params: { period: 'invalid-period' },
      })
    })
  })
})
