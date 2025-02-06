import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import AddNewAssetModal from '../../../components/custom/assets-org/add-new-asset-modal'
import { columnsAssetOrg } from '../../../components/custom/assets-org/columns'
import { DataTableAssetOrg } from '../../../components/custom/assets-org/data-table'

describe('AddNewAssetModal Component', () => {
  it('renders modal with correct fields', () => {
    render(<AddNewAssetModal isOpen={true} onClose={() => {}} />)

    expect(screen.getByText(/new asset/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/idcmc/i)).toBeInTheDocument()
    expect(screen.getByText(/check the desired asset id/i)).toBeInTheDocument()
  })

  it('allows user to input CoinMarketCap ID and submit', async () => {
    const mockOnClose = jest.fn()
    render(<AddNewAssetModal isOpen={true} onClose={mockOnClose} />)

    const input = screen.getByPlaceholderText(/idcmc/i)
    fireEvent.change(input, { target: { value: '1' } })

    const addButton = screen.getByText(/add asset/i)
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })
  })
})

describe('DataTableAssetOrg Component', () => {
  const mockData = [
    {
      id: '1',
      asset: { urlImage: 'bitcoin.png', name: 'Bitcoin' },
      price: 40000,
      appearances: '5 wallets',
      porcentOfApp: '50%',
      quantSLowRisk: '2 wallets',
      quantLowRisk: '1 wallet',
      quantStandard: '2 wallets',
    },
  ]

  it('renders table with asset data', async () => {
    render(<DataTableAssetOrg data={mockData} columns={columnsAssetOrg} />)

    waitFor(() => {
      expect(screen.getByText(/bitcoin/i)).toBeInTheDocument()
      expect(screen.getByText(/u\$ 40000.00/i)).toBeInTheDocument()
      expect(screen.getByText(/5 wallets/i)).toBeInTheDocument()
      expect(screen.getByText(/50/i)).toBeInTheDocument()
    })
  })
})

// Testes para a definição das colunas (columns.tsx)
describe('columnsAssetOrg Definition', () => {
  it('should define all necessary columns', () => {
    expect(columnsAssetOrg).toBeDefined()
    expect(columnsAssetOrg.length).toBeGreaterThan(0)

    const columnTitles = columnsAssetOrg.map((col) => col.header)
    expect(columnTitles).toContain('Asset')
    expect(columnTitles).toContain('Price')
    expect(columnTitles).toContain('Appearances')
  })
})

// Testes para DataTableAssetOrg
const mockData = [
  {
    id: '1',
    asset: { urlImage: '/assets/bitcoin.png', name: 'Bitcoin' },
    price: 40000,
    appearances: '5 Wallets',
    porcentOfApp: '50%',
    quantSLowRisk: '2 Wallets',
    quantLowRisk: '1 Wallet',
    quantStandard: '2 Wallets',
  },
]

describe('DataTableAssetOrg Component', () => {
  it('displays column headers', async () => {
    render(<DataTableAssetOrg data={mockData} columns={columnsAssetOrg} />)

    waitFor(() => screen.findByText(/Asset/i))
    waitFor(() => screen.findByText(/Price/i))
    waitFor(() => screen.findByText(/Appearances/i))

    waitFor(() => expect(screen.getByText(/Asset/i)).toBeInTheDocument())
    waitFor(() => expect(screen.getByText(/Price/i)).toBeInTheDocument())
    waitFor(() => expect(screen.getByText(/Appearances/i)).toBeInTheDocument())
  })
})
