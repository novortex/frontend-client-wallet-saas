import { render, screen, waitFor } from '@testing-library/react'
import * as walletService from '@/services/walletService'
import { Graphs } from '@/pages/graphs'
import { MemoryRouter } from 'react-router-dom'

// Mockando o serviço de carteira
jest.mock('@/services/walletService')

// Mock do toast
const mockToast = jest.fn()

jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
    dismiss: jest.fn(),
    toasts: [],
  }),
}))

describe('Graphs Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders loading initially', () => {
    render(
      <MemoryRouter>
        <Graphs />
      </MemoryRouter>,
    )
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  test('displays error toast on failed fetch', async () => {
    // Simulando erro nas chamadas de serviço
    ;(
      walletService.getAllAssetsWalletClient as jest.Mock
    ).mockResolvedValueOnce(null)

    render(
      <MemoryRouter>
        <Graphs />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Failed get assets organization :(',
        }),
      )
    })
  })
})
