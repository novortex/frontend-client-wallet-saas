import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { useRef, useState } from 'react'
import { useManagerOrganization } from '@/store/managers_benckmark_exchanges'
import { useSignalStore } from '@/store/signalEffect'
import { useToast } from '@/components/ui/use-toast'
import {
  updateCustomer,
  updateWallet,
} from '@/services/managementService'
import { ProfileTab } from './profile-tab'
import { WalletTab } from './wallet-tab'
import { CustomersOrganization } from '@/components/custom/customers/columns'

interface EditCustomerModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  rowInfos: CustomersOrganization
}

export function EditCustomerModal({
  isOpen,
  onOpenChange,
  rowInfos,
}: EditCustomerModalProps) {
  const [contractChecked, setContractChecked] =
    useState<boolean>(!!rowInfos.contract)
  const [initialFeeIsPaid, setInitialFeeIsPaid] =
    useState(rowInfos.initialFeePaid)
  const [manager, setManager] = useState(
    rowInfos.manager?.managerUuid || ''
  )
  const [ExchangeSelected, setExchangeSelected] =
    useState(
      rowInfos.exchange?.exchangeUuid || ''
    )
  const [performanceFee, setPerformanceFee] =
    useState(
      rowInfos.performanceFee
        ? String(rowInfos.performanceFee)
        : ''
    )
  const [name, setName] = useState(
    rowInfos.name || ''
  )
  const [email, setEmail] = useState(
    rowInfos.email || ''
  )
  const [phone, setPhone] = useState(
    rowInfos.phone || ''
  )
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    general: '',
  })

  const accountPasswordRef =
    useRef<HTMLInputElement>(null)
  const emailExchangeRef =
    useRef<HTMLInputElement>(null)
  const emailPasswordRef =
    useRef<HTMLInputElement>(null)

  const [managersOrganization, exchanges] =
    useManagerOrganization((state) => [
      state.managers,
      state.exchanges,
    ])

  const [setSignal, signal] = useSignalStore(
    (state) => [state.setSignal, state.signal]
  )
  const { toast } = useToast()

  const handleUpdateCustomer = async () => {
    const newErrors = {
      name: '',
      email: '',
      phone: '',
      general: '',
    }

    const normalizedName = name
      .replace(/\s+/g, ' ')
      .trim()

    if (
      !/^[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}(?:\s[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,})+$/.test(
        normalizedName
      ) ||
      /\s$/.test(name)
    ) {
      newErrors.name =
        'Name must include both first and last names, each starting with a capital letter and containing at least two letters.'
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      newErrors.email = 'Invalid email format.'
    }

    if (
      !/^\d+$/.test(phone.replace(/\D/g, '')) ||
      phone.trim().length < 13
    ) {
      newErrors.phone =
        'The phone number must contain only numbers and include the country code.'
    }

    if (
      Object.values(newErrors).some(
        (error) => error
      )
    ) {
      setErrors(newErrors)
      return
    }

    try {
      const result = await updateCustomer(
        rowInfos.id,
        {
          name,
          email,
          phone,
        }
      )

      if (result !== true) {
        setErrors({
          ...newErrors,
          general:
            'Failed to update customer. Try again.',
        })
        return
      }

      setSignal(!signal)
      onOpenChange(false)

      toast({
        className: 'bg-green-500 border-0',
        title: 'Customer updated successfully',
        description:
          'The customer information has been updated.',
      })
    } catch (error) {
      setErrors({
        ...newErrors,
        general:
          'An unexpected error occurred. Please try again.',
      })
    }
  }

  const handleUpdateWallet =
    async (): Promise<void> => {
      try {
        toast({
          className: 'bg-yellow-500 border-0',
          title: 'Processing wallet update',
          description: 'Please wait...',
        })

        const result = await updateWallet(
          rowInfos.walletUuid || '',
          {
            accountPassword:
              accountPasswordRef.current?.value ??
              '',
            contract: contractChecked,
            emailExchange:
              emailExchangeRef.current?.value ??
              '',
            emailPassword:
              emailPasswordRef.current?.value ??
              '',
            exchangeUuid: ExchangeSelected,
            initialFeeIsPaid:
              initialFeeIsPaid ?? false,
            manager,
            performanceFee: parseFloat(
              String(performanceFee)
            ),
          }
        )

        if (result !== true) {
          toast({
            className: 'bg-red-500 border-0',
            title: 'Failed to update wallet',
            description: 'Please try again.',
          })
          return
        }

        setSignal(!signal)
        onOpenChange(false)

        toast({
          className: 'bg-green-500 border-0',
          title: 'Wallet updated successfully',
          description:
            'The wallet information has been updated.',
        })
      } catch (error) {
        toast({
          className: 'bg-red-500 border-0',
          title: `${(error as any).response?.data?.message[0] ?? 'Unknown error'}`,
          description: 'Please try again.',
        })
      }
    }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="bg-[#1C1C1C] border-0 text-white max-w-fit">
        <DialogHeader>
          <DialogTitle className="text-white text-3xl">
            Customer edit
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="Profile">
          <TabsList className="flex justify-between gap-5 bg-[#1C1C1C]">
            <TabsTrigger
              className="w-1/2 bg-[#171717] text-[#F2BE38] data-[state=active]:bg-yellow-500"
              value="Profile"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              className="w-1/2 bg-[#171717] text-[#F2BE38] data-[state=active]:bg-yellow-500"
              value="Wallet"
            >
              Wallet
            </TabsTrigger>
          </TabsList>

          <TabsContent
            className="mt-10"
            value="Profile"
          >
            <ProfileTab
              name={name}
              email={email}
              phone={phone}
              errors={errors}
              setName={setName}
              setEmail={setEmail}
              setPhone={setPhone}
              handleUpdateCustomer={
                handleUpdateCustomer
              }
            />
          </TabsContent>

          <TabsContent
            className="mt-10"
            value="Wallet"
          >
            <WalletTab
              rowInfos={rowInfos}
              ExchangeSelected={ExchangeSelected}
              setExchangeSelected={
                setExchangeSelected
              }
              exchanges={exchanges}
              emailPasswordRef={emailPasswordRef}
              emailExchangeRef={emailExchangeRef}
              accountPasswordRef={
                accountPasswordRef
              }
              manager={manager}
              setManager={setManager}
              managersOrganization={
                managersOrganization
              }
              performanceFee={performanceFee}
              setPerformanceFee={
                setPerformanceFee
              }
              contractChecked={contractChecked}
              setContractChecked={
                setContractChecked
              }
              initialFeeIsPaid={initialFeeIsPaid}
              setInitialFeeIsPaid={
                setInitialFeeIsPaid
              }
              handleUpdateWallet={
                handleUpdateWallet
              }
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
