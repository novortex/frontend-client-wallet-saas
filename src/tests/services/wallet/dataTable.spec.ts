// import { instance } from '@/config/api'
// import {
//   addCryptoWalletClient,
//   getAllAssetsInOrgForAddWalletClient,
// } from '@/services/assetsService'
// import {
//   mockAddAssetResponse,
//   mockAssetsResponse,
// } from '@/tests/mocks/dataTable.mock'

// jest.mock('@/config/api')

// describe('dataTable', () => {
//   describe('addCryptoWalletClient', () => {
//     it('Given valid inputs, When the API call is successful, Then it should return the AddAssetFunctionResponse', async () => {
//       // Arrange
//       ;(instance.post as jest.Mock).mockResolvedValue({
//         data: mockAddAssetResponse,
//       })

//       // Act
//       const response = await addCryptoWalletClient(
//         '4091e88c-bfa5-4608-8514-212502fb2598',
//         'ef8272cc-573a-4753-95cd-1b73e6210909',
//         12,
//         5,
//       )

//       // Assert
//       expect(response).toEqual(mockAddAssetResponse)
//       expect(instance.post).toHaveBeenCalledWith(
//         'wallet/4091e88c-bfa5-4608-8514-212502fb2598/asset',
//         {
//           assetUuid: 'ef8272cc-573a-4753-95cd-1b73e6210909',
//           quantity: 12,
//           targetAllocation: 5,
//         },
//         {
//           headers: {
//             'x-organization': 'e74e88e2-2185-42a8-8ae2-8013057ba7b8',
//           },
//         },
//       )
//     })

//     it('Given an API error, When the API call fails, Then it should return false', async () => {
//       // Arrange
//       ;(instance.post as jest.Mock).mockRejectedValue(new Error('API Error'))

//       // Act
//       const response = await addCryptoWalletClient(
//         '4091e88c-bfa5-4608-8514-212502fb2598',
//         'ef8272cc-573a-4753-95cd-1b73e6210909',
//         12,
//         5,
//       )

//       // Assert
//       expect(response).toBe(false)
//     })
//   })

//   describe('getAllAssetsInOrgForAddWalletClient', () => {
//     it('Given a valid organization UUID, When the API call is successful, Then it should return an array of assets', async () => {
//       // Arrange
//       ;(instance.get as jest.Mock).mockResolvedValue({
//         data: mockAssetsResponse,
//       })

//       // Act
//       const response = await getAllAssetsInOrgForAddWalletClient()

//       // Assert
//       expect(response).toEqual(mockAssetsResponse)
//       expect(instance.get).toHaveBeenCalledWith(
//         'wallet/e74e88e2-2185-42a8-8ae2-8013057ba7b8/assets',
//         {},
//       )
//     })

//     it('Given an API error, When the API call fails, Then it should return undefined', async () => {
//       // Arrange
//       ;(instance.get as jest.Mock).mockRejectedValue(new Error('API Error'))

//       // Act
//       const response = await getAllAssetsInOrgForAddWalletClient()

//       // Assert
//       expect(response).toBeUndefined()
//     })
//   })
// })
