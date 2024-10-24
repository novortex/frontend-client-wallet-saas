import { render, screen, fireEvent } from '@testing-library/react';
import Login from '@/pages/login';
import '@testing-library/jest-dom/jest-globals';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('@/components/ui/use-toast', () => ({
  useToast: jest.fn(),
}));

jest.mock('@/service/request', () => ({
  login: jest.fn(),
}));

describe('Login Component - Falha no Login', () => {
  const mockToast = jest.fn();

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {}); 
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('deve mostrar uma mensagem de erro ao falhar no login', async () => {
    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(mockToast).toHaveBeenCalledWith({
      className: 'bg-red-500 border-0 text-white',
      title: 'Failed login :(',
      description: 'Demo Vault !!',
    });
  });
});
