// import { render, screen } from '@testing-library/react'
// import { MemoryRouter } from 'react-router-dom'
// import { useWallet } from '@/hooks/useWallet'
// import { useWalletModals } from '@/hooks/useWalletModals'
// import { Wallet } from '@/pages/wallet'

// jest.mock('@/hooks/useWallet')
// jest.mock('@/hooks/useWalletModals')

// const mockUseWallet = useWallet as jest.Mock
// const mockUseWalletModals = useWalletModals as jest.Mock
// const pagePath = '/wallet/4091e88c-bfa5-4608-8514-212502fb2598/assets'

// describe('Wallet Component', () => {
//   beforeEach(() => {
//     jest.clearAllMocks()
//   })

//   test('Given that the wallet is loading, When the component renders, Then it should display the loading indicator', () => {
//     // Arrange
//     mockUseWallet.mockReturnValue({
//       data: [],
//       infosWallet: null,
//       loading: true,
//     })

//     mockUseWalletModals.mockReturnValue({
//       isOperationModalOpen: false,
//       openOperationModal: jest.fn(),
//       closeOperationModal: jest.fn(),
//       isCloseWalletModalOpen: false,
//       openCloseWalletModal: jest.fn(),
//       closeCloseWalletModal: jest.fn(),
//       isModalRebalance: false,
//       openOrCloseModalRebalanced: jest.fn(),
//     })

//     // Act
//     render(
//       <MemoryRouter initialEntries={[pagePath]}>
//         <Wallet />
//       </MemoryRouter>,
//     )

//     // Assert
//     const loadingElement = screen.getByRole('status')
//     expect(loadingElement).toBeInTheDocument()
//   })
// })
