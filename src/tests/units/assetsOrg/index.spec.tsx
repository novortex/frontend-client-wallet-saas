// import { render, screen, waitFor } from '@testing-library/react'
// import { getAllAssetsOrg } from '@/services/request'
// import { useUserStore } from '@/store/user'
// import { useSignalStore } from '@/store/signalEffect'
// import { useToast } from '@/components/ui/use-toast'
// import { AssetsOrg } from '@/pages/assets-org'
// import { MemoryRouter } from 'react-router-dom'

// // Mock do serviço de requisição
// jest.mock('@/services/request', () => ({
//   getAllAssetsOrg: jest.fn(),
// }))

// // Mock do store de usuário
// jest.mock('@/store/user', () => ({
//   useUserStore: jest.fn(),
// }))

// // Mock do store de sinal
// jest.mock('@/store/signalEffect', () => ({
//   useSignalStore: jest.fn(),
// }))

// // Mock do toast
// jest.mock('@/components/ui/use-toast', () => ({
//   useToast: jest.fn(),
// }))

// describe('AssetsOrg Component', () => {
//   const mockUuidOrganization = 'mock-uuid'

//   beforeEach(() => {
//     jest.clearAllMocks()
//     ;(useUserStore as unknown as jest.Mock).mockReturnValue([
//       { uuidOrganization: mockUuidOrganization },
//     ])
//     ;(useSignalStore as unknown as jest.Mock).mockReturnValue([
//       { signal: null },
//     ])
//     ;(useToast as jest.Mock).mockReturnValue({ toast: jest.fn() })
//   })

//   it('fetches and displays assets data', async () => {
//     // Arrange
//     const mockAssets = [
//       {
//         uuid: 'asset-1',
//         icon: 'https://example.com/icon1.png',
//         name: 'Asset One',
//         price: 100,
//         qntInWallet: 5,
//         presencePercentage: 50,
//         riskProfileCounts: {
//           superLowRisk: 1,
//           lowRisk: 2,
//           standard: 2,
//         },
//       },
//     ]

//     ;(getAllAssetsOrg as jest.Mock).mockResolvedValueOnce(mockAssets)

//     // Act
//     render(
//       <MemoryRouter>
//         <AssetsOrg />
//       </MemoryRouter>,
//     )

//     // Assert
//     expect(getAllAssetsOrg).toHaveBeenCalledWith({
//       uuidOrganization: mockUuidOrganization,
//     })

//     const assetName = await screen.findByText('Asset One')
//     expect(assetName).toBeInTheDocument()
//   })

//   it('displays a toast message on fetch failure', async () => {
//     // Arrange
//     ;(getAllAssetsOrg as jest.Mock).mockRejectedValueOnce(
//       new Error('Fetch error'),
//     )

//     const toastMock = jest.fn()

//     ;(useToast as jest.Mock).mockReturnValue({ toast: toastMock }) // Retorna um objeto com a função toast

//     // Act
//     render(
//       <MemoryRouter>
//         <AssetsOrg />
//       </MemoryRouter>,
//     )

//     // Assert
//     await waitFor(() =>
//       expect(toastMock).toHaveBeenCalledWith(
//         expect.objectContaining({
//           title: 'Failed get assets organization :(',
//           description: 'Demo Vault !!',
//         }),
//       ),
//     )
//   })
// })
