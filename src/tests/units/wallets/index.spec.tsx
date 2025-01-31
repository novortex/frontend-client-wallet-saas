import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CardClient from '../../../pages/wallets/card-client';
import { Wallets } from '../../../pages/wallets/index.tsx';
import { getWalletOrganization } from '@/services/wallet/walleInfoService';

// Mock do serviço de busca de clientes
jest.mock('@/services/wallet/walleInfoService', () => ({
  getWalletOrganization: jest.fn(),
}));

// Mock do toast
jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn(),
}));

// Mock do useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock dos dados de clientes
const mockClients = [
  {
    walletUuid: '1',
    infosClient: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
    },
    managerName: 'Manager One',
    lastBalance: '2023-10-01',
    nextBalance: '2023-11-01',
  },
  {
    walletUuid: '2',
    infosClient: {
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '+0987654321',
    },
    managerName: 'Manager Two',
    lastBalance: '2023-09-01',
    nextBalance: '2023-12-01',
  },
];

// Testes para o componente CardClient
describe('CardClient', () => {
  it('renders the card with correct data', () => {
    render(
      <CardClient
        name="John Doe"
        email="john@example.com"
        phone="+1234567890"
        alerts={3}
        responsible="Manager One"
        lastRebalancing="2023-10-01"
        nextRebalancing="2023-11-01"
        walletUuid="1"
      />,
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Manager One')).toBeInTheDocument();
    expect(screen.getByText('3 alerts')).toBeInTheDocument();
    expect(screen.getByText('Next rebalancing:')).toBeInTheDocument();
    expect(screen.getByText('Last rebalancing:')).toBeInTheDocument();
  });

  it('navigates to the correct page on card click', () => {
    render(
      <CardClient
        name="John Doe"
        email="john@example.com"
        phone="+1234567890"
        alerts={3}
        responsible="Manager One"
        lastRebalancing="2023-10-01"
        nextRebalancing="2023-11-01"
        walletUuid="1"
      />,
    );

    fireEvent.click(screen.getByText('John Doe'));
    expect(mockNavigate).toHaveBeenCalledWith('/clients/1/infos', {
      state: { name: 'John Doe', email: 'john@example.com', phone: '+1234567890' },
    });
  });

  it('displays the correct alert color based on the number of alerts', () => {
    render(
      <CardClient
        name="John Doe"
        email="john@example.com"
        phone="+1234567890"
        alerts={5}
        responsible="Manager One"
        lastRebalancing="2023-10-01"
        nextRebalancing="2023-11-01"
        walletUuid="1"
      />,
    );

    const alertDiv = screen.getByText('5 alerts').parentElement;
    expect(alertDiv).toHaveClass('bg-yellow-500');
  });
});

// Testes para o componente Clients
describe('Clients', () => {
  beforeEach(() => {
    (getWalletOrganization as jest.Mock).mockResolvedValue(mockClients);
  });

  it('renders the list of clients', async () => {
    render(<Wallets />);

    waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
    });
  });

  it('filters clients based on search term', async () => {
    render(<Wallets />);

    waitFor(() => {
      const searchInput = screen.getByRole('input');
      userEvent.type(searchInput, 'John');
    });

    waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument();
    });
  });

  it('displays loading state while fetching data', async () => {
    (getWalletOrganization as jest.Mock).mockImplementation(
      () => new Promise(() => {}),
    );

    render(<Wallets />);

    waitFor(() => expect(screen.getByText(/loading/i)).toBeInTheDocument());
  });

  it('displays "No wallets found" when there are no clients', async () => {
    waitFor(() => (getWalletOrganization as jest.Mock).mockResolvedValue([]));

    render(<Wallets />);

    waitFor(() => {
      expect(screen.getByText('No wallets found')).toBeInTheDocument();
    });
  });

  it('applies filters correctly', async () => {
    render(<Wallets />);

    waitFor(() => {
    const filterButton = screen.getByText(/filters/i);
    userEvent.click(filterButton);
    });

    waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});