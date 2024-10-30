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
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ success: true })
          }, 1000)
        })
      }),
    })
  })

  it('Given that the Login component is rendered, When the component is displayed, Then it should show the welcome message and input fields for email and password, along with the Sign In button.', () => {
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

  it('Given that valid email and password inputs are provided, When the Sign In button is clicked, Then it should call the handleLogin function with the provided email and password.', async () => {
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

  it('Given that the Sign In button is clicked, When the login process is in progress, Then it should disable the Sign In button until the login process is complete, and then re-enable it after a timeout.', async () => {
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
