import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ClientsInfoModal } from '../../../pages/infos/client-info-modal'
import { ConfirmContactModal } from '../../../pages/infos/confirm-contact-modal'
import { ExchangeInfoModal } from '../../../pages/infos/exchange-info-modal'

describe('ClientInfoModal Component', () => {
  it('renders client information correctly', () => {
    render(
      <ClientsInfoModal
        isOpen={true}
        onClose={() => {}}
        name="John Doe"
        email="john@example.com"
        phone="+123456789"
      />,
    )

    expect(screen.getByText(/information/i)).toBeInTheDocument()
    expect(screen.getByText(/john doe/i)).toBeInTheDocument()
    expect(screen.getByText(/john@example.com/i)).toBeInTheDocument()
    expect(screen.getByText(/\+123456789/i)).toBeInTheDocument()
  })

  it('closes modal when close button is clicked', () => {
    const mockOnClose = jest.fn()
    render(
      <ClientsInfoModal
        isOpen={true}
        onClose={mockOnClose}
        name="John Doe"
        email="john@example.com"
        phone="+123456789"
      />,
    )

    fireEvent.click(screen.getByText(/close/i))
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })
})

describe('ConfirmContactModal Component', () => {
  it('renders and allows closing', () => {
    const mockOnClose = jest.fn()
    render(<ConfirmContactModal isOpen={true} onClose={mockOnClose} />)

    expect(screen.getByText(/confirm contact/i)).toBeInTheDocument()
    fireEvent.click(screen.getByText(/close/i))
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })
})

describe('ExchangeInfoModal Component', () => {
  it('renders exchange credentials correctly', () => {
    render(
      <ExchangeInfoModal
        isOpen={true}
        onClose={() => {}}
        accountEmail="account@example.com"
        emailPassword="email-pass"
        exchangePassword="exchange-pass"
      />,
    )

    expect(screen.getByText(/information exchange/i)).toBeInTheDocument()
    expect(screen.getByText(/account@example.com/i)).toBeInTheDocument()
    expect(screen.getByText(/email-pass/i)).toBeInTheDocument()
    expect(screen.getByText(/exchange-pass/i)).toBeInTheDocument()
  })
})
