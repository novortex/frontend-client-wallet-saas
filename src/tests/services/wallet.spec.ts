import { instance } from '@/config/api'
import {
  getAllAssetsWalletClient,
  updateCurrentAmount,
} from '@/services/walletService'
import {
  mockResponse,
  organizationUuid,
  walletUuid,
} from '../mocks/wallet.mock'

jest.mock('@/config/api', () => ({
  instance: {
    get: jest.fn(),
    put: jest.fn(),
  },
}))

describe('walletService', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllAssetsWalletClient', () => {
    it('should return wallet assets data on successful request', async () => {
      // Arrange
      ;(instance.get as jest.Mock).mockResolvedValue({
        data: mockResponse,
      })

      // Act
      const data = await getAllAssetsWalletClient(organizationUuid, walletUuid)

      // Assert
      expect(data).toEqual(mockResponse)
      expect(instance.get).toHaveBeenCalledWith(
        `wallet/${walletUuid}/walletAssets`,
        {
          headers: { 'x-organization': organizationUuid },
        },
      )
    })
  })

  describe('updateCurrentAmount', () => {
    it('should update current amount on successful request', async () => {
      // Arrange
      ;(instance.put as jest.Mock).mockResolvedValue({}) // Simulando uma resposta vazia

      // Act
      await updateCurrentAmount(organizationUuid, walletUuid)

      // Assert
      expect(instance.put).toHaveBeenCalledWith(
        `wallet/${walletUuid}/currentAmount`,
        {},
        {
          headers: { 'x-organization': organizationUuid },
        },
      )
    })

    it('should throw an error when the request fails', async () => {
      // Arrange
      const errorMessage = 'Network Error'
      ;(instance.put as jest.Mock).mockRejectedValue(new Error(errorMessage))

      // Act & Assert
      await expect(
        updateCurrentAmount(organizationUuid, walletUuid),
      ).rejects.toThrow(errorMessage)
      expect(instance.put).toHaveBeenCalledWith(
        `wallet/${walletUuid}/currentAmount`,
        {},
        {
          headers: { 'x-organization': organizationUuid },
        },
      )
    })
  })
})
