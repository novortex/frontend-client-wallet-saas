// import { render, screen } from '@testing-library/react'
// import { Infos } from '@/pages/infos'
// import { useUserStore } from '@/store/user'
// import { useSignalStore } from '@/store/signalEffect'
// import { MemoryRouter } from 'react-router-dom'

// jest.mock('@/store/user', () => ({
//   useUserStore: jest.fn(),
// }))
// jest.mock('@/store/signalEffect', () => ({
//   useSignalStore: jest.fn(),
// }))

// jest.mock('@/services/request', () => ({
//   getInfosCustomer: jest.fn(),
//   convertedTimeZone: jest.fn(),
// }))
// jest.mock('@/services/walletService', () => ({
//   updateCurrentAmount: jest.fn(),
// }))

// describe('Infos Component', () => {
//   beforeEach(() => {
//     ;(useUserStore as unknown as jest.Mock).mockReturnValue({
//       uuidOrganization: 'mock-uuid',
//     })
//     ;(useSignalStore as unknown as jest.Mock).mockReturnValue([{}])
//   })

//   it('should render without crashing', () => {
//     render(
//       <MemoryRouter>
//         <Infos />
//       </MemoryRouter>,
//     )
//     expect(screen.getByText(/Wallets/i)).toBeInTheDocument()
//     expect(screen.getByText(/Information clients/i)).toBeInTheDocument()
//   })

//   it('should display correct wallet information', async () => {
//     render(
//       <MemoryRouter>
//         <Infos />
//       </MemoryRouter>,
//     )

//     expect(screen.getByText(/Initial amount invested/i)).toBeInTheDocument()
//     expect(screen.getByText(/Current value:/i)).toBeInTheDocument()
//   })
// })
