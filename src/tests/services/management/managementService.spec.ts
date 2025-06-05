import { instance } from '@/config/api'
import {
  getAllAssetsOrg,
  addCryptoOrg,
  registerNewCustomer,
  confirmContactClient,
  getAllCustomersOrganization,
  convertedTimeZone,
  updateWallet,
  getAllBenchmark,
  getAllExchange,
  getExchangesDisposables,
  getBenchmarkOptions,
} from '@/services/managementService'

jest.mock('@/config/api', () => ({
  instance: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
  },
}))

describe('managementService', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllAssetsOrg', () => {
    it('should fetch all organization assets', async () => {
      const mockData = [{ id: '1', name: 'Bitcoin' }]
      ;(instance.get as jest.Mock).mockResolvedValue({ data: mockData })

      const result = await getAllAssetsOrg()
      expect(result).toEqual(mockData)
      expect(instance.get).toHaveBeenCalledWith('management/assets')
    })

    it('should handle error when fetching organization assets', async () => {
      ;(instance.get as jest.Mock).mockRejectedValue(new Error('Fetch error'))

      await expect(getAllAssetsOrg()).rejects.toThrow('Fetch error')
    })
  })

  describe('addCryptoOrg', () => {
    it('should add a new crypto asset to organization', async () => {
      const mockResponse = { success: true }
      ;(instance.post as jest.Mock).mockResolvedValue({ data: mockResponse })

      const result = await addCryptoOrg(1)
      expect(result).toEqual(mockResponse)
      expect(instance.post).toHaveBeenCalledWith('management/asset', {
        idCmc: 1,
      })
    })

    it('should handle error when adding a crypto asset', async () => {
      ;(instance.post as jest.Mock).mockRejectedValue(
        new Error('Invalid asset data'),
      )

      await expect(addCryptoOrg(0)).rejects.toThrow('Invalid asset data')
    })
  })

  describe('registerNewCustomer', () => {
    it('should register a new customer', async () => {
      const mockResponse = { uuid: '123' }
      ;(instance.post as jest.Mock).mockResolvedValue({ data: mockResponse })

      const result = await registerNewCustomer('John Doe', 'john@example.com')
      expect(result).toEqual(mockResponse)
      expect(instance.post).toHaveBeenCalledWith('management/costumer', {
        name: 'John Doe',
        email: 'john@example.com',
      })
    })
  })

  describe('confirmContactClient', () => {
    it('should confirm contact for a client', async () => {
      ;(instance.patch as jest.Mock).mockResolvedValue({ data: {} })

      await confirmContactClient('wallet-123')
      expect(instance.patch).toHaveBeenCalledWith('management/contact', {
        walletUuid: 'wallet-123',
      })
    })

    it('should handle error when confirming contact for a client', async () => {
      ;(instance.patch as jest.Mock).mockRejectedValue(
        new Error('Contact error'),
      )

      await expect(confirmContactClient('wallet-123')).rejects.toThrow(
        'Contact error',
      )
    })
  })

  describe('updateWallet', () => {
    it('should update wallet information', async () => {
      ;(instance.put as jest.Mock).mockResolvedValue({ data: {} })

      await updateWallet('wallet-123', {
        initialFeeIsPaid: true,
        contract: false,
        exchangeUuid: 'exchange-1',
        manager: 'manager-1',
        emailExchange: 'test@example.com',
        emailPassword: 'password',
        accountPassword: 'password123',
        performanceFee: 5,
        riskProfile: 'STANDARD',
      })

      expect(instance.put).toHaveBeenCalledWith(
        'management/wallet/wallet-123',
        expect.any(Object),
      )
    })
  })

  describe('getAllCustomersOrganization', () => {
    it('should fetch all customers in organization', async () => {
      const mockData = [{ uuid: '123', name: 'John Doe' }]
      ;(instance.get as jest.Mock).mockResolvedValue({ data: mockData })

      const result = await getAllCustomersOrganization()
      expect(result).toEqual(mockData)
      expect(instance.get).toHaveBeenCalledWith('management/clients')
    })
  })

  describe('convertedTimeZone', () => {
    it('should fetch converted timezone', async () => {
      const mockData = { timezone: 'UTC' }
      ;(instance.get as jest.Mock).mockResolvedValue({ data: mockData })

      const result = await convertedTimeZone()
      expect(result).toEqual(mockData)
      expect(instance.get).toHaveBeenCalledWith('management/timezone')
    })
  })

  describe('getAllBenchmark', () => {
    it('should fetch all benchmark data', async () => {
      const mockData = [{ id: '1', name: 'Benchmark 1' }]
      ;(instance.get as jest.Mock).mockResolvedValue({ data: mockData })

      const result = await getAllBenchmark()
      expect(result).toEqual(mockData)
      expect(instance.get).toHaveBeenCalledWith('management/benchmark')
    })
  })

  describe('getAllExchange', () => {
    it('should fetch all exchanges', async () => {
      const mockData = [{ id: '1', name: 'Exchange 1' }]
      ;(instance.get as jest.Mock).mockResolvedValue({ data: mockData })

      const result = await getAllExchange()
      expect(result).toEqual(mockData)
      expect(instance.get).toHaveBeenCalledWith('management/exchanges')
    })
  })

  describe('getExchangesDisposables', () => {
    it('should fetch disposable exchanges', async () => {
      const mockData = [{ name: 'Exchange 1', uuid: 'uuid-1' }]
      ;(instance.get as jest.Mock).mockResolvedValue({ data: mockData })

      const result = await getExchangesDisposables()
      expect(result).toEqual(mockData)
      expect(instance.get).toHaveBeenCalledWith('/management/exchanges')
    })
  })

  describe('getBenchmarkOptions', () => {
    it('should fetch benchmark options', async () => {
      const mockData = [{ id: '1', name: 'Benchmark Option' }]
      ;(instance.get as jest.Mock).mockResolvedValue({ data: mockData })

      const result = await getBenchmarkOptions()
      expect(result).toEqual(mockData)
      expect(instance.get).toHaveBeenCalledWith('/management/benchmark', {})
    })
  })
})
