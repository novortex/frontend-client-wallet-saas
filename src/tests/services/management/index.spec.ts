import { instance } from '@/config/api'
import {
  getAllAssetsOrg,
  addCryptoOrg,
  registerNewCustomer,
  confirmContactClient,
  getAllManagersOnOrganization,
  getAllFiatCurrencies,
  updateCustomer,
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
  beforeEach(() => {
    jest.clearAllMocks()
  })

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

  it('should add a new crypto asset to organization', async () => {
    const mockResponse = { success: true }
    ;(instance.post as jest.Mock).mockResolvedValue({ data: mockResponse })
    const result = await addCryptoOrg([1, 2])
    expect(result).toEqual(mockResponse)
    expect(instance.post).toHaveBeenCalledWith('management/asset', {
      idCmc: [1, 2],
    })
  })

  it('should handle error when adding a crypto asset', async () => {
    ;(instance.post as jest.Mock).mockRejectedValue(
      new Error('Invalid asset data'),
    )
    await expect(addCryptoOrg([])).rejects.toThrow('Invalid asset data')
  })

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

  it('should confirm contact for a client', async () => {
    ;(instance.patch as jest.Mock).mockResolvedValue({ data: {} })
    await confirmContactClient('wallet-123')
    expect(instance.patch).toHaveBeenCalledWith('management/contact', {
      walletUuid: 'wallet-123',
    })
  })

  it('should handle error when confirming contact for a client', async () => {
    ;(instance.patch as jest.Mock).mockRejectedValue(new Error('Contact error'))
    await expect(confirmContactClient('wallet-123')).rejects.toThrow(
      'Contact error',
    )
  })

  it('should fetch all managers in an organization', async () => {
    const mockData = [{ name: 'Manager 1', uuid: 'uuid-1' }]
    ;(instance.get as jest.Mock).mockResolvedValue({ data: mockData })
    const result = await getAllManagersOnOrganization()
    expect(result).toEqual(mockData)
    expect(instance.get).toHaveBeenCalledWith('management/managers')
  })

  it('should handle error when fetching managers', async () => {
    ;(instance.get as jest.Mock).mockRejectedValue(
      new Error('Fetch managers error'),
    )
    await expect(getAllManagersOnOrganization()).rejects.toThrow(
      'Fetch managers error',
    )
  })

  it('should update customer data', async () => {
    ;(instance.put as jest.Mock).mockResolvedValue({ data: {} })
    await updateCustomer('uuid-123', {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123456789',
    })
    expect(instance.put).toHaveBeenCalledWith('management/customer/uuid-123', {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123456789',
    })
  })

  it('should handle error when updating customer data', async () => {
    ;(instance.put as jest.Mock).mockRejectedValue(new Error('Update error'))
    await expect(
      updateCustomer('uuid-123', {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123456789',
      }),
    ).rejects.toThrow('Update error')
  })

  it('should fetch all fiat currencies', async () => {
    const mockData = ['USD', 'EUR']
    ;(instance.get as jest.Mock).mockResolvedValue({ data: mockData })
    const result = await getAllFiatCurrencies()
    expect(result).toEqual(mockData)
    expect(instance.get).toHaveBeenCalledWith('management/fiat-currencies')
  })

  it('should handle error when fetching fiat currencies', async () => {
    ;(instance.get as jest.Mock).mockRejectedValue(new Error('Fetch error'))
    await expect(getAllFiatCurrencies()).rejects.toThrow('Fetch error')
  })
})
