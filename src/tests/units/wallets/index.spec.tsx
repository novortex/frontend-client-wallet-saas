import { render, screen, waitFor } from '@testing-library/react'
import { Clients } from '@/pages/wallets'
import { useUserStore } from '@/store/user'
import { useSignalStore } from '@/store/signalEffect'
import {
  getAllManagersOnOrganization,
  getWalletOrganization,
} from '@/services/request'

jest.mock('@/store/user', () => ({
  useUserStore: jest.fn(),
}))

jest.mock('@/store/signalEffect', () => ({
  useSignalStore: jest.fn(),
}))

jest.mock('@/services/request', () => ({
  getWalletOrganization: jest.fn(),
  getAllManagersOnOrganization: jest.fn(),
}))

jest.mock('@/components/custom/card-client', () => ({
  CardClient: ({ name }: { name: string }) => <div>{name}</div>,
}))

describe('Clients Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useUserStore as unknown as jest.Mock).mockReturnValue([
      { uuidOrganization: 'org-123' },
    ])
    ;(useSignalStore as unknown as jest.Mock).mockReturnValue([{ signal: 1 }])
    ;(getAllManagersOnOrganization as jest.Mock).mockResolvedValue([
      { name: 'Manager A' },
    ])
  })

  it('renders correctly', async () => {
    ;(getWalletOrganization as jest.Mock).mockResolvedValue([
      {
        walletUuid: 'uuid-1',
        infosClient: { name: 'Client A', email: '', phone: '' },
        managerName: 'Manager A',
        lastBalance: '2024-01-01',
        nextBalance: '2024-02-01',
      },
    ])

    render(<Clients />)

    expect(screen.getByText('Wallets')).toBeInTheDocument()
  })
})
