// import { instance } from '@/config/api'
// import {
//   getAllAssetsWalletClient,
//   updateCurrentAmount,
//   getWalletHistoric, // Importar a função que queremos testar
//   calculateRebalanceInWallet,
// } from '@/services/walletService'
// import {
//   mockResponse,
//   organizationUuid,
//   walletUuid,
// } from '../../mocks/wallet.mock'
// import { mockHistoricEntries } from '@/tests/mocks/walletHistoric.mock'

// jest.mock('@/config/api', () => ({
//   instance: {
//     get: jest.fn(),
//     put: jest.fn(),
//     post: jest.fn(),
//   },
// }))

// describe('walletService', () => {
//   afterEach(() => {
//     jest.clearAllMocks()
//   })

//   describe('getAllAssetsWalletClient', () => {
//     it('Given that the request to retrieve wallet assets is successful, When the getAllAssetsWalletClient function is called with valid organization and wallet UUIDs, Then it should return the wallet assets data as expected.', async () => {
//       // Arrange
//       ;(instance.get as jest.Mock).mockResolvedValue({
//         data: mockResponse,
//       })

//       // Act
//       const data = await getAllAssetsWalletClient(organizationUuid, walletUuid)

//       // Assert
//       expect(data).toEqual(mockResponse)
//       expect(instance.get).toHaveBeenCalledWith(
//         `wallet/${walletUuid}/walletAssets`,
//         {
//           headers: { 'x-organization': organizationUuid },
//         },
//       )
//     })
//   })

//   describe('updateCurrentAmount', () => {
//     it('Given that the request to update the current amount is successful, When the updateCurrentAmount function is called with valid organization and wallet UUIDs, Then it should update the current amount without errors..', async () => {
//       // Arrange
//       ;(instance.put as jest.Mock).mockResolvedValue({})

//       // Act
//       await updateCurrentAmount(organizationUuid, walletUuid)

//       // Assert
//       expect(instance.put).toHaveBeenCalledWith(
//         `wallet/${walletUuid}/currentAmount`,
//         {},
//         {
//           headers: { 'x-organization': organizationUuid },
//         },
//       )
//     })

//     it('Given that the request to update the current amount fails, When the updateCurrentAmount function is called with valid organization and wallet UUIDs, Then it should throw an error indicating the request failure.', async () => {
//       // Arrange
//       const errorMessage = 'Network Error'
//       ;(instance.put as jest.Mock).mockRejectedValue(new Error(errorMessage))

//       // Act & Assert
//       await expect(
//         updateCurrentAmount(organizationUuid, walletUuid),
//       ).rejects.toThrow(errorMessage)
//       expect(instance.put).toHaveBeenCalledWith(
//         `wallet/${walletUuid}/currentAmount`,
//         {},
//         {
//           headers: { 'x-organization': organizationUuid },
//         },
//       )
//     })
//   })

//   describe('getWalletHistoric', () => {
//     it('Given that the request to retrieve wallet historic is successful, When the getWalletHistoric function is called with valid organization and wallet UUIDs, Then it should return the wallet historic data as expected.', async () => {
//       // Arrange

//       ;(instance.get as jest.Mock).mockResolvedValue({
//         data: mockHistoricEntries,
//       })

//       // Act
//       const data = await getWalletHistoric(organizationUuid, walletUuid)

//       // Assert
//       expect(data).toEqual(mockHistoricEntries)
//       expect(instance.get).toHaveBeenCalledWith(`historic/${walletUuid}`, {
//         headers: { 'x-organization': organizationUuid },
//       })
//     })

//     it('Given that the request to retrieve wallet historic fails, When the getWalletHistoric function is called with valid organization and wallet UUIDs, Then it should throw an error indicating the request failure.', async () => {
//       // Arrange
//       const errorMessage = 'Network Error'
//       ;(instance.get as jest.Mock).mockRejectedValue(new Error(errorMessage))

//       // Act & Assert
//       await expect(
//         getWalletHistoric(organizationUuid, walletUuid),
//       ).rejects.toThrow(errorMessage)
//       expect(instance.get).toHaveBeenCalledWith(`historic/${walletUuid}`, {
//         headers: { 'x-organization': organizationUuid },
//       })
//     })
//   })

//   it('Given that the API request to calculate rebalance is successful, When calculateRebalanceInWallet is called with valid wallet UUID and data, Then it should return the expected result data.', async () => {
//     // Arrange
//     const mockResponse = { data: { rebalance: 'calculated' } }

//     // Mock 'post' instead of 'get'
//     ;(instance.post as jest.Mock).mockResolvedValue(mockResponse)

//     // Act
//     const result = await calculateRebalanceInWallet(
//       walletUuid,
//       organizationUuid,
//     )

//     // Assert
//     expect(result).toEqual(mockResponse.data)
//     expect(instance.post).toHaveBeenCalledWith(
//       `wallet/${walletUuid}/rebalanceWallet`,
//       {},
//       { headers: { 'x-organization': organizationUuid } },
//     )
//   })
// })
