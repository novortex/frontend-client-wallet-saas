// import { render, screen, fireEvent, waitFor } from '@testing-library/react'
// import { MemoryRouter } from 'react-router-dom'
// import { useWallet } from '@/hooks/useWallet'
// import { useWalletModals } from '@/hooks/useWalletModals'
// import { DataTable } from '@/components/custom/tables/wallet-client/data-table'
// import { data, columns, walletUuid } from '../../mocks/walletDataTable.mock'

// jest.mock('@/hooks/useWallet')
// jest.mock('@/hooks/useWalletModals')

// const mockUseWallet = useWallet as jest.Mock
// const mockUseWalletModals = useWalletModals as jest.Mock
// const pagePath = '/wallet/4091e88c-bfa5-4608-8514-212502fb2598/assets'

// describe('DataTable Component', () => {
//   const fetchDataMock = jest.fn()

//   const calculateRebalanceMock = jest.fn().mockResolvedValue([
//     { amount: 100, percentage: 10 },
//     { amount: 200, percentage: 20 },
//   ])

//   beforeEach(() => {
//     jest.clearAllMocks()
//   })

//   test('Given that the user types a filter in the search input, When the filter is applied, Then the table should display only the filtered results', () => {
//     // Arrange
//     mockUseWallet.mockReturnValue({
//       data,
//       infosWallet: null,
//       loading: false,
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
//         <DataTable
//           columns={columns}
//           data={data}
//           walletUuid={walletUuid}
//           fetchData={fetchDataMock}
//           calculateRebalance={calculateRebalanceMock}
//         />
//       </MemoryRouter>,
//     )

//     const input = screen.getByPlaceholderText('Filter asset name...')
//     fireEvent.change(input, { target: { value: 'Bitcoin' } })

//     // Assert
//     expect(screen.getByText('Bitcoin')).toBeInTheDocument()
//     expect(screen.queryByText('Ethereum')).not.toBeInTheDocument()
//     expect(screen.queryByText('Litecoin')).not.toBeInTheDocument()
//   })

//   test('Given that the user clears the search input, When the table is rendered, Then all results should be displayed', () => {
//     // Arrange
//     mockUseWallet.mockReturnValue({
//       data,
//       infosWallet: null,
//       loading: false,
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
//         <DataTable
//           columns={columns}
//           data={data}
//           walletUuid={walletUuid}
//           fetchData={fetchDataMock}
//           calculateRebalance={calculateRebalanceMock}
//         />
//       </MemoryRouter>,
//     )

//     const input = screen.getByPlaceholderText('Filter asset name...')
//     fireEvent.change(input, { target: { value: 'Bitcoin' } })
//     fireEvent.change(input, { target: { value: '' } })

//     // Assert
//     expect(screen.getByText('Bitcoin')).toBeInTheDocument()
//     expect(screen.getByText('Ethereum')).toBeInTheDocument()
//     expect(screen.getByText('Litecoin')).toBeInTheDocument()
//   })

//   test('Given that the user types a filter in the search input that does not match any results, When the filter is applied, Then the table should display "No results"', () => {
//     // Arrange
//     mockUseWallet.mockReturnValue({
//       data,
//       infosWallet: null,
//       loading: false,
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
//         <DataTable
//           columns={columns}
//           data={data}
//           walletUuid={walletUuid}
//           fetchData={fetchDataMock}
//           calculateRebalance={calculateRebalanceMock}
//         />
//       </MemoryRouter>,
//     )

//     const input = screen.getByPlaceholderText('Filter asset name...')
//     fireEvent.change(input, { target: { value: 'NonExistentAsset' } })

//     // Assert
//     waitFor(() => {
//       expect(screen.getByText('No results.')).toBeInTheDocument()
//     })
//   })
// })
