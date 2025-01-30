// import { render, screen, fireEvent } from '@testing-library/react'
// import { AddNewWalletModal } from '@/components/custom/add-new-wallet-modal'
// import { useUserStore } from '@/store/user'
// import { useSignalStore } from '@/store/signalEffect'

// jest.mock('@/store/user', () => ({
//   useUserStore: jest.fn(),
// }))

// jest.mock('@/store/signalEffect', () => ({
//   useSignalStore: jest.fn(),
// }))

// jest.mock('@/components/ui/use-toast', () => ({
//   useToast: jest.fn(() => ({
//     toast: jest.fn(),
//   })),
// }))

// jest.mock('@/services/assetsService', () => ({
//   addCryptoWalletClient: jest.fn(),
//   getAllAssetsInOrgForAddWalletClient: jest.fn(),
// }))

// describe('AddNewWalletModal Component', () => {
//   const fetchDataMock = jest.fn()

//   beforeEach(() => {
//     ;(useUserStore as unknown as jest.Mock).mockImplementation(() => [
//       { uuidOrganization: 'test-org-id' },
//     ])
//     ;(useSignalStore as unknown as jest.Mock).mockImplementation(() => [
//       jest.fn(),
//       false,
//     ])
//   })

//   it('renders correctly when open', () => {
//     // Arrange & Act
//     render(
//       <AddNewWalletModal
//         aria-describedby="1"
//         isOpen={true}
//         onClose={() => {}}
//         walletUuid="test-wallet-id"
//         fetchData={fetchDataMock}
//       />,
//     )

//     // Assert
//     expect(screen.getByText(/New Asset/i)).toBeInTheDocument()
//     expect(
//       screen.getByPlaceholderText(/Asset Quantity \(Ex: 10\)/i),
//     ).toBeInTheDocument()
//     expect(
//       screen.getByPlaceholderText(/Ideal Allocation \(%\)/i),
//     ).toBeInTheDocument()
//     expect(
//       screen.getByRole('button', { name: /Add asset/i }),
//     ).toBeInTheDocument()
//   })

//   it('closes the modal when the onClose function is called', () => {
//     // Arrange
//     const handleClose = jest.fn()
//     render(
//       <AddNewWalletModal
//         aria-describedby="1"
//         isOpen={true}
//         onClose={handleClose}
//         walletUuid="test-wallet-id"
//         fetchData={fetchDataMock}
//       />,
//     )

//     // Act
//     fireEvent.click(screen.getByRole('button', { name: /Close/i }))

//     // Assert
//     expect(handleClose).toHaveBeenCalled()
//   })

//   it('shows an error message when the Add asset button is clicked without filling in the Asset ID', async () => {
//     // Arrange
//     render(
//       <AddNewWalletModal
//         aria-describedby="1"
//         isOpen={true}
//         onClose={() => {}}
//         walletUuid="test-wallet-id"
//         fetchData={fetchDataMock}
//       />,
//     )

//     // Act
//     fireEvent.click(screen.getByRole('button', { name: /Add asset/i }))

//     // Assert
//     expect(
//       screen.getByText(
//         /Allocation must be a number between 0 and 100 with up to two decimal places after the point/i,
//       ),
//     ).toBeInTheDocument()
//     expect(screen.getByText(/Asset must be selected/i)).toBeInTheDocument()
//     expect(
//       screen.getByText(/Asset value must be a positive number/i),
//     ).toBeInTheDocument()
//   })
// })
