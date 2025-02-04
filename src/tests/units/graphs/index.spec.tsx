import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WalletGraph } from '../../../pages/graphs/graph-wallet'
import  Graphs  from '../../../pages/graphs/index'

// Mock do ResizeObserver para evitar falhas no Recharts
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver

// Mock do useParams para simular um UUID válido da carteira
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ walletUuid: 'mock-wallet-uuid' }),
}))

// Mock de dados de gráficos
jest.mock('@/services/wallet/walleInfoService', () => ({
  getGraphData: jest.fn().mockResolvedValue([
    {
      cuid: '1',
      amountPercentage: 10,
      cryptoMoney: 1000,
      benchmarkMoney: 900,
      walletUuid: 'mock-wallet-uuid',
      createAt: '2023-10-01',
    },
  ]),
}))

// Mock do Recharts para evitar erros ao renderizar gráficos
jest.mock('recharts', () => ({
  ...jest.requireActual('recharts'),
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
}))

// Mock do Recharts
jest.mock('recharts', () => ({
    ...jest.requireActual('recharts'),
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Line: () => <div data-testid="line" />,
    XAxis: () => <div data-testid="xaxis" />,
    YAxis: () => <div data-testid="yaxis" />,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
  }));

describe('WalletGraph Component', () => {
  it('renders WalletGraph correctly', async () => {
    await act(async () => {
      render(<WalletGraph />)
    })

    await waitFor(() => {
      expect(screen.queryByText(/Wallet/i)).toBeInTheDocument()
      expect(screen.queryByText(/Benchmark/i)).toBeInTheDocument()
      expect(screen.queryByText(/View: Days \/ Months/i)).toBeInTheDocument()
    })
  })

  it('toggles the switch', async () => {
    await act(async () => {
      render(<WalletGraph />)
    })

    const switches = screen.getAllByRole('checkbox')
    const switchElement = switches[0] // Selecionando o primeiro switch

    expect(switchElement).toBeChecked()

    await act(async () => {
      await userEvent.click(switchElement)
    })

    expect(switchElement).not.toBeChecked()
  })

  it('toggles wallet checkbox', async () => {
    await act(async () => {
      render(<WalletGraph />)
    })

    const checkboxes = screen.getAllByRole('checkbox')
    const walletCheckbox = checkboxes[1] // Selecionando o checkbox correto

    expect(walletCheckbox).toBeChecked()

    await act(async () => {
      await userEvent.click(walletCheckbox)
    })

    expect(walletCheckbox).not.toBeChecked()
  })

  it('toggles benchmark checkbox', async () => {
    await act(async () => {
      render(<WalletGraph />)
    })

    const checkboxes = screen.getAllByRole('checkbox')
    const benchmarkCheckbox = checkboxes[1] // Selecionando o checkbox correto

    expect(benchmarkCheckbox).toBeChecked()

    await act(async () => {
      await userEvent.click(benchmarkCheckbox)
    })

    expect(benchmarkCheckbox).not.toBeChecked()
  })

  it('loads and displays graph data - banchmark', async () => {
    await act(async () => {
      render(<WalletGraph />);
    });

    const switches = screen.getAllByRole('checkbox')
    const switchElement = switches[0]

    await act(async () => {
        await userEvent.click(switchElement)
      })

    await waitFor(() => {
      // Verifica se os componentes do gráfico foram renderizados
      expect(screen.getByTestId('line')).toBeInTheDocument();
      expect(screen.getByTestId('xaxis')).toBeInTheDocument();
      expect(screen.getByTestId('yaxis')).toBeInTheDocument();
      expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });
  });
  it('loads and displays graph data - wallet', async () => {
    await act(async () => {
      render(<WalletGraph />);
    });

    const switches = screen.getAllByRole('checkbox')
    const switchElement = switches[1]

    await act(async () => {
        await userEvent.click(switchElement)
      })

    await waitFor(() => {
      // Verifica se os componentes do gráfico foram renderizados
      expect(screen.getByTestId('line')).toBeInTheDocument();
      expect(screen.getByTestId('xaxis')).toBeInTheDocument();
      expect(screen.getByTestId('yaxis')).toBeInTheDocument();
      expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });
  });
})

describe('Graphs Component', () => {
  it('renders Graphs Component correctly', async () => {
    await act(async () => {
      render(<Graphs />)
    })

    waitFor(() => {
      expect(screen.queryByText(/Wallets/i)).toBeInTheDocument()
      expect(screen.queryByText(/Information clients/i)).toBeInTheDocument()
      expect(screen.queryByText(/Wallet Graphic/i)).toBeInTheDocument()
      expect(screen.queryByPlaceholderText(/Search for .../i)).toBeInTheDocument()
    })
  })

  it('loads and displays dashboard data', async () => {
    await act(async () => {
      render(<Graphs />)
    })

    waitFor(() => {
      expect(screen.queryByText(/Entry date/i)).toBeInTheDocument()
      expect(screen.queryByText(/Closing date/i)).toBeInTheDocument()
      expect(screen.queryByText(/Initial value/i)).toBeInTheDocument()
      expect(screen.queryByText(/Current value/i)).toBeInTheDocument()
    })
  })
})
