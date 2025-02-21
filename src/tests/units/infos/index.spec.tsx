import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ClientsInfoModal } from '../../../pages/infos/client-info-modal'
import { ConfirmContactModal } from '../../../pages/infos/confirm-contact-modal'
import { ExchangeInfoModal } from '../../../pages/infos/exchange-info-modal'
import Infos from '../../../pages/infos/index'
import { MemoryRouter } from 'react-router-dom'


describe('Infos Components', () => {
    describe('ClientInfoModal Component', () => {
        it('renders client information correctly', async () => {
            render(<ClientsInfoModal isOpen={true} onClose={() => { }} name="John Doe" email="john@example.com" phone="+123456789" />)

            await waitFor(() => {
                expect(screen.getByText(/information/i)).toBeInTheDocument()
                expect(screen.getByText(/john doe/i)).toBeInTheDocument()
                expect(screen.getByText(/john@example.com/i)).toBeInTheDocument()
                expect(screen.getByText(/\+123456789/i)).toBeInTheDocument()
            })
        })

        it('closes modal when close button is clicked', async () => {
            const mockOnClose = jest.fn()
            render(<ClientsInfoModal isOpen={true} onClose={mockOnClose} name="John Doe" email="john@example.com" phone="+123456789" />)

            await waitFor(() => {
                const closeButton = screen.getByText(/close/i)
                fireEvent.click(closeButton)
                expect(mockOnClose).toHaveBeenCalledTimes(1)
            })
        })
    })

    describe('ConfirmContactModal Component', () => {
        it('renders and allows closing', async () => {
            const mockOnClose = jest.fn()
            render(<ConfirmContactModal isOpen={true} onClose={mockOnClose} />)

            await waitFor(() => {
                expect(screen.getByText(/confirm contact/i)).toBeInTheDocument()
                const closeButton = screen.getByText(/close/i)
                fireEvent.click(closeButton)
                expect(mockOnClose).toHaveBeenCalledTimes(1)
            })
        })
    })

    describe('ExchangeInfoModal Component', () => {
        it('renders exchange credentials correctly', async () => {
            render(
                <ExchangeInfoModal
                    isOpen={true}
                    onClose={() => { }}
                    accountEmail="account@example.com"
                    emailPassword="email-pass"
                    exchangePassword="exchange-pass"
                />
            )

            await waitFor(() => {
                expect(screen.getByText(/information exchange/i)).toBeInTheDocument()
                expect(screen.getByText(/account@example.com/i)).toBeInTheDocument()
                expect(screen.getByText(/email-pass/i)).toBeInTheDocument()
                expect(screen.getByText(/exchange-pass/i)).toBeInTheDocument()
            })
        })
    })

    jest.mock('@/services/wallet/walleInfoService', () => ({
        getInfosCustomer: jest.fn(() =>
            Promise.resolve({
                walletInfo: {
                    user: {
                        name: 'John Doe',
                        email: 'john@example.com',
                        phone: '+123456789',
                    },
                },
                walletPreInfos: {},
                walletCommission: [],
            })
        ),
        updateCurrentAmount: jest.fn(() => Promise.resolve()),
    }))

    jest.mock('@/services/managementService', () => ({
        convertedTimeZone: jest.fn(() => Promise.resolve('2025-01-01T00:00:00Z')),
    }))

    describe('Infos Page Component', () => {
        it('renders InfosPage correctly', async () => {
            await act(async () => {
                render(<Infos />, { wrapper: MemoryRouter })
            })
            expect(screen.getByText(/information clients/i)).toBeInTheDocument()
        })

        it('ensures Wallet and Graphics buttons are present and enabled', async () => {
            await act(async () => {
                render(<Infos />, { wrapper: MemoryRouter })
            })

            const walletButton = screen.getByText('Wallet')
            const graphicsButton = screen.getByText(/graphics/i)

            expect(walletButton).toBeInTheDocument()
            expect(walletButton).toBeEnabled()

            expect(graphicsButton).toBeInTheDocument()
            expect(graphicsButton).toBeEnabled()
        })
    })

})
