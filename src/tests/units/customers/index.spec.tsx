// import { render, screen, waitFor } from '@testing-library/react'
// import userEvent from '@testing-library/user-event'
// import { DisableCustomerModal } from '../../../pages/customers/disable-customer-modal.tsx'
// import { EditCustomerModal } from '../../../pages/customers/edit-customer-modal'
// import { ProfileTab } from '../../../pages/customers/profile-tab'
// import RegisterCustomerModal from '../../../pages/customers/register-customer-modal'
// import { CustomersOrganization } from '@/components/custom/customers/columns'
// import { WalletTab } from '../../../pages/customers/wallet-tab'
// import { Dialog } from '@/components/ui/dialog'

// // Mock data for EditCustomerModal
// const mockRowInfos: CustomersOrganization = {
//   id: '1',
//   name: 'John Doe',
//   email: 'john@example.com',
//   phone: '+1234567890888',
//   walletUuid: 'wallet-1',
//   contract: 'true',
//   initialFeePaid: true,
//   manager: { managerUuid: 'manager-1', managerName: 'Manager One' },
//   exchange: { exchangeUuid: 'b5cef8b0-2488-4498-a7ff-42cc09900bb3', exchangeName: 'exchange_1' },
//   performanceFee: 10,
//   active: false,
//   isWallet: false,
//   emailExchange: null,
//   emailPassword: null,
//   exchangePassword: null,
// }

// // Mock props for ProfileTab
// const mockProfileTabProps = {
//   name: 'John Doe',
//   email: 'john@example.com',
//   phone: '+1234567890888',
//   errors: { name: '', email: '', phone: '', general: '' },
//   setName: jest.fn(),
//   setEmail: jest.fn(),
//   setPhone: jest.fn(),
//   handleUpdateCustomer: jest.fn(),
// }

// // Tests for DisableCustomerModal
// describe('DisableCustomerModal', () => {
//   it('renders the modal with the correct title and description', () => {
//     render(<DisableCustomerModal isOpen={true} onOpenChange={() => {}} />)

//     expect(screen.getByText(/disabled asset/i)).toBeInTheDocument() // Regex para case insensitive
//     expect(
//       screen.getByText(
//         /warning: you are about to disable this crypto asset for all wallets\. this action is irreversible and will affect all users holding this asset\. please confirm that you want to proceed with this operation\./i
//       )
//     ).toBeInTheDocument()
//   })

//   it('renders the close and disabled buttons', () => {
//     render(<DisableCustomerModal isOpen={true} onOpenChange={() => {}} />)

//     const buttons = screen.getAllByRole('button')
//     const closeButton = buttons[0] 
//     expect(closeButton).toBeInTheDocument()
//     const disableButton = buttons[1]
//     expect(disableButton).toBeInTheDocument()
//   })

//   it('calls onOpenChange when the close button is clicked', async () => {
//     const onOpenChange = jest.fn()
//     render(<DisableCustomerModal isOpen={true} onOpenChange={onOpenChange} />)

//     const buttons = screen.getAllByRole('button')
//     const closeButton = buttons[0] 
//     await userEvent.click(closeButton)
//     expect(onOpenChange).toHaveBeenCalledWith(false)
//   })
// })

// // Tests for EditCustomerModal
// describe('EditCustomerModal', () => {
//   it('renders the modal with the correct title', () => {
//     render(
//       <EditCustomerModal
//         isOpen={true}
//         onOpenChange={() => {}}
//         rowInfos={mockRowInfos}
//       />
//     )

//     expect(screen.getByText(/customer edit/i)).toBeInTheDocument()
//   })

//   it('renders the Profile and Wallet tabs', () => {
//     render(
//       <EditCustomerModal
//         isOpen={true}
//         onOpenChange={() => {}}
//         rowInfos={mockRowInfos}
//       />
//     )

//     expect(screen.getByText('Profile')).toBeInTheDocument()
//     expect(screen.getByText(/wallet/i)).toBeInTheDocument()
//   })

//   it('calls handleUpdateCustomer when Save Profile is clicked', async () => {
//     render(
//       <EditCustomerModal
//         isOpen={true}
//         onOpenChange={() => {}}
//         rowInfos={mockRowInfos}
//       />
//     )

//     await userEvent.click(screen.getByText(/save profile/i))
//   })

//   it('calls handleUpdateWallet when Save Wallet is clicked', async () => {
//     render(
//       <EditCustomerModal
//         isOpen={true}
//         onOpenChange={() => {}}
//         rowInfos={mockRowInfos}
//       />
//     )

//     await userEvent.click(screen.getByText(/wallet/i))

//     waitFor(() => {
//     userEvent.click(screen.getByText('Save Wallet'))
//     })
//   })
// })

// // Tests for ProfileTab
// describe('ProfileTab', () => {
//     it('renders the name, email, and phone inputs', () => {
//       render(
//         <Dialog open={true} onOpenChange={() => {}}>
//           <ProfileTab {...mockProfileTabProps} />
//         </Dialog>
//       )
  
//       expect(screen.getByText(/name/i)).toBeInTheDocument()
//       expect(screen.getByText(/email/i)).toBeInTheDocument()
//       expect(screen.getByText('Phone')).toBeInTheDocument()
//     })
  
//     it('calls setName when the name input is changed', async () => {
//       render(
//         <Dialog open={true} onOpenChange={() => {}}>
//           <ProfileTab {...mockProfileTabProps} />
//         </Dialog>
//       )
  
//       const nameInput = screen.getByText(/name/i)
//       await userEvent.type(nameInput, 'J')
//       expect(mockProfileTabProps.setName).toHaveBeenCalledWith('John DoeJ') // testa se o input está vindo com o dado correto e se é possível escrever, ao mesmo tempo
//     })
  
//     // it('calls handleUpdateCustomer when Save Profile is clicked', async () => {
//     //   render(
//     //     <Dialog open={true} onOpenChange={() => {}}>
//     //       <ProfileTab {...mockProfileTabProps} />
//     //     </Dialog>
//     //   )
  
//     //   await userEvent.click(screen.getByText(/save profile/i))
//     //   expect(mockProfileTabProps.handleUpdateCustomer).toHaveBeenCalled()
//     // })
//   })

// // Tests for RegisterCustomerModal
// describe('RegisterCustomerModal', () => {
//     it('renders the name, email, and phone inputs', () => {
//       render(<RegisterCustomerModal isOpen={true} onClose={() => {}} />)
  
//       expect(screen.getByPlaceholderText(/name \*/i)).toBeInTheDocument()
//       expect(screen.getByPlaceholderText(/email \*/i)).toBeInTheDocument()
  
//       const textboxes = screen.getAllByRole('textbox')
//       const phoneInput = textboxes[textboxes.length - 1] 
//       expect(phoneInput).toBeInTheDocument()
//     })
//   })

// // Mock data for WalletTab
// const mockWalletTabProps = {
//   rowInfos: {
//     id: '1',
//     name: 'John Doe',
//     email: 'john@example.com',
//     phone: '+1234567890888',
//     walletUuid: 'wallet-1',
//     contract: 'true',
//     initialFeePaid: true,
//     manager: { managerUuid: 'manager-1', managerName: 'Manager One' },
//     exchange: { exchangeUuid: 'exchange-1', exchangeName: 'Exchange One' },
//     performanceFee: 10,
//     active: false,
//     isWallet: true,
//     emailPassword: 'password123',
//     emailExchange: 'exchange@example.com',
//     exchangePassword: 'exchangepass123',
//   },
//   ExchangeSelected: 'exchange-1',
//   setExchangeSelected: jest.fn(),
//   exchanges: [
//     { name: 'Exchange One', uuid: 'exchange-1' },
//     { name: 'Exchange Two', uuid: 'exchange-2' },
//   ],
//   emailPasswordRef: { current: { value: 'password123' } } as React.RefObject<HTMLInputElement>,
//   emailExchangeRef: { current: { value: 'exchange@example.com' } } as React.RefObject<HTMLInputElement>,
//   accountPasswordRef: { current: { value: 'exchangepass123' } } as React.RefObject<HTMLInputElement>,
//   manager: 'manager-1',
//   setManager: jest.fn(),
//   managersOrganization: [
//     { name: 'Manager One', uuid: 'manager-1' },
//     { name: 'Manager Two', uuid: 'manager-2' },
//   ],
//   performanceFee: '10',
//   setPerformanceFee: jest.fn(),
//   contractChecked: true,
//   setContractChecked: jest.fn(),
//   initialFeeIsPaid: true,
//   setInitialFeeIsPaid: jest.fn(),
//   handleUpdateWallet: jest.fn(),
// }

// // Tests for WalletTab
// describe('WalletTab', () => {
//   it('renders the wallet form when isWallet is true', () => {
//     render(
//         <Dialog open={true} onOpenChange={() => {}}>
//           <WalletTab {...mockWalletTabProps} />
//         </Dialog>
//       )

//     expect(screen.getByText('Exchange')).toBeInTheDocument()
//     expect(screen.getByText(/email password/i)).toBeInTheDocument()
//     expect(screen.getByText(/email \(exchange\)/i)).toBeInTheDocument()
//     expect(screen.getByText(/exchange password/i)).toBeInTheDocument()
//     expect(screen.getByText('Manager')).toBeInTheDocument()
//     expect(screen.getByText(/performance fee/i)).toBeInTheDocument()
//     expect(screen.getByText(/initial fee is paid\?/i)).toBeInTheDocument()
//     expect(screen.getByText(/contract/i)).toBeInTheDocument()
//     expect(screen.getByText(/save wallet/i)).toBeInTheDocument()
//     expect(screen.getByText(/close/i)).toBeInTheDocument()
//   })

//   it('renders a message when isWallet is false', () => {
//     const propsWithoutWallet = {
//       ...mockWalletTabProps,
//       rowInfos: { ...mockWalletTabProps.rowInfos, isWallet: false },
//     }
//     render(
//         <Dialog open={true} onOpenChange={() => {}}>
//           <WalletTab {...propsWithoutWallet} />
//         </Dialog>
//       )

//     expect(
//       screen.getByText(/please create a wallet first before filling these details\./i)
//     ).toBeInTheDocument()
//   })
  
//   describe('WalletTab Component', () => {
//     it('checks if the Performance Fee input has the correct initial value', async () => {
//       render(
//         <Dialog open={true} onOpenChange={() => {}}>
//           <WalletTab {...mockWalletTabProps} />
//         </Dialog>
//       )
  
//       const performanceFeeInput = screen.getByText(/performance fee/i)
//         .nextElementSibling as HTMLInputElement
  
//       expect(performanceFeeInput).toHaveValue('10')
//     })
  
//     it('allows clearing and updating the Performance Fee input', async () => {
//       render(
//         <Dialog open={true} onOpenChange={() => {}}>
//           <WalletTab {...mockWalletTabProps} />
//         </Dialog>
//       )
  
//       const performanceFeeInput = screen.getByText(/performance fee/i)
//         .nextElementSibling as HTMLInputElement
  
//       await userEvent.clear(performanceFeeInput)
//       waitFor(() => {
//       userEvent.type(performanceFeeInput, '20')
//       expect(mockWalletTabProps.setPerformanceFee).toHaveBeenCalledWith('20')
//       })
//     })
//   })
  

//   it('calls setInitialFeeIsPaid when the "Initial Fee is paid?" checkbox is clicked', async () => {
//     render(
//       <Dialog open={true} onOpenChange={() => {}}>
//         <WalletTab {...mockWalletTabProps} />
//       </Dialog>
//     )

//     const checkboxes = screen.getAllByRole('checkbox')
//     const initialFeeCheckbox = checkboxes[1]
    
//     await userEvent.click(initialFeeCheckbox)

//     expect(mockWalletTabProps.setInitialFeeIsPaid).toHaveBeenCalledWith(false)
//   })

//   it('calls setContractChecked when the "Contract" checkbox is clicked', async () => {
//     render(
//       <Dialog open={true} onOpenChange={() => {}}>
//         <WalletTab {...mockWalletTabProps} />
//       </Dialog>
//     )

//     const checkboxes = screen.getAllByRole('checkbox')
//     const contractCheckbox = checkboxes[0]
    
//     await userEvent.click(contractCheckbox)

//   expect(mockWalletTabProps.setContractChecked).toHaveBeenCalledWith(false)
//     })
// })



