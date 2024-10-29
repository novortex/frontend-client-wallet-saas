import '@testing-library/jest-dom'
import { Login } from '@/pages/login'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useLogin } from '@/hooks/useLogin'

jest.mock('@/hooks/useLogin')

describe('Login Component', () => {
  beforeEach(() => {
    ;(useLogin as jest.Mock).mockReturnValue({
      handleLogin: jest.fn().mockImplementation(async () => {
        // Simula um atraso de 1 segundo na resposta
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ success: true })
          }, 1000)
        })
      }),
    })
  })

  it('should render Login component with welcome message and input fields', () => {
    // Arrange & Act
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    )

    // Assert
    expect(screen.getByText(/Welcome/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/)).toBeInTheDocument()
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument()
  })

  it('should call handleLogin when Sign In button is clicked with valid inputs', async () => {
    // Arrange
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    )

    const emailInput = screen.getByLabelText(/Email/)
    const passwordInput = screen.getByLabelText(/Password/)
    const signInButton = screen.getByText(/Sign In/i)

    // Act
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(signInButton)
    })

    // Assert
    expect(useLogin().handleLogin).toHaveBeenCalledWith(
      'test@example.com',
      'password123',
    )
  })

  it('should disable the Sign In button while logging in', async () => {
    // Arrange
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    )

    const emailInput = screen.getByLabelText(/Email/)
    const passwordInput = screen.getByLabelText(/Password/)
    const signInButton = screen.getByText(/Sign In/i)

    // Act
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(signInButton)

    // Assert
    expect(signInButton).toBeDisabled()

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    })

    expect(signInButton).not.toBeDisabled()
  })
})
