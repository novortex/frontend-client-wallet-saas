import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRef, useState, useEffect } from 'react'
import { useManagerOrganization } from '@/store/managers_benckmark_exchanges'
import { useSignalStore } from '@/store/signalEffect'
import { useToast } from '@/components/ui/use-toast'
import { updateCustomer, updateWallet } from '@/services/managementService'
import {
  getBaseWalletByRisk,
  applyBaseWalletAllocationForNewRisk,
} from '@/services/wallet/baseWalletService'
import { ProfileTab } from './profile-tab'
import { WalletTab } from './wallet-tab'
import { CustomersOrganization } from '@/components/custom/customers/columns'
import { CountryData } from 'react-phone-input-2'
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js'
import { RiskProfile } from './index'

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
  const [contractChecked, setContractChecked] = useState<boolean>(
    !!rowInfos.contract,
  )
  const [initialFeeIsPaid, setInitialFeeIsPaid] = useState(
    rowInfos.initialFeePaid,
  )
  const [manager, setManager] = useState(rowInfos.manager?.managerUuid || '')
  const [ExchangeSelected, setExchangeSelected] = useState(
    rowInfos.exchange?.exchangeUuid || '',
  )
  const [performanceFee, setPerformanceFee] = useState(
    rowInfos.performanceFee ? String(rowInfos.performanceFee) : '',
  )
  const [name, setName] = useState(rowInfos.name || '')
  const [email, setEmail] = useState(rowInfos.email || '')
  const [phone, setPhone] = useState(rowInfos.phone || '')
  const [riskProfile, setRiskProfile] = useState<RiskProfile>(null)
  const [phoneCountry, setPhoneCountry] = useState<CountryData>({
    name: '',
    dialCode: '',
    countryCode: '',
    format: '',
  })
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    general: '',
  })
  const [isUpdateWithBaseWallet, setIsUpdateWithBaseWallet] = useState(false)

  const accountPasswordRef = useRef<HTMLInputElement>(null)
  const emailExchangeRef = useRef<HTMLInputElement>(null)
  const emailPasswordRef = useRef<HTMLInputElement>(null)

  const [managersOrganization, exchanges] = useManagerOrganization((state) => [
    state.managers,
    state.exchanges,
  ])
  const [setSignal, signal] = useSignalStore((state) => [
    state.setSignal,
    state.signal,
  ])
  const { toast } = useToast()

  const validateInputs = () => {
    const newErrors = { name: '', email: '', phone: '', general: '' }
    const normalizedName = name.replace(/\s+/g, ' ').trim()
    if (
      !/^[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}(?:\s[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,})+$/.test(
        normalizedName,
      ) ||
      /\s$/.test(name)
    ) {
      newErrors.name =
        'Name must include both first and last names, each starting with a capital letter and containing at least two letters.'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format.'
    }
    if (!/^\d+$/.test(phone.replace(/\D/g, '')) || phone.trim().length < 13) {
      newErrors.phone =
        'The phone number must contain only numbers and include the country code.'
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  const formatPhoneNumber = (phone: string) => {
    try {
      const phoneNumber = parsePhoneNumber(
        phone,
        phoneCountry.countryCode.toUpperCase() as CountryCode,
      )
      return phoneNumber.formatInternational()
    } catch (error) {
      console.error('Invalid phone number:', error)
      return phone
    }
  }

  const handleUpdateCustomer = async () => {
    if (!validateInputs()) {
      toast({
        className: 'toast-error',
        title: 'Erro na validação',
        description: 'Por favor, corrija os erros nos campos destacados.',
        duration: 6000,
      })
      return
    }
    try {
      toast({
        className: 'toast-warning',
        title: 'Processando atualização',
        description: 'Aguarde enquanto atualizamos os dados...',
        duration: 5000,
      })
      const formattedPhone = formatPhoneNumber(phone)
      const formattedEmail = email.toLowerCase().trim()
      const result = await updateCustomer(rowInfos.id, {
        name,
        email: formattedEmail,
        phone: formattedPhone,
      })
      if (result === false) {
        toast({
          className: 'toast-error',
          title: 'Falha na atualização',
          description:
            'Não foi possível atualizar os dados do cliente. Tente novamente.',
          duration: 6000,
        })
        return
      }
      setSignal(!signal)
      onOpenChange(false)
      toast({
        className: 'toast-success',
        title: 'Sucesso!',
        description: 'Dados do cliente atualizados com sucesso.',
        duration: 4000,
      })
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      const errorMessage =
        error.response?.data?.message || 'Erro ao atualizar dados do cliente.'
      toast({
        className: 'toast-error',
        title: 'Erro inesperado',
        description: errorMessage,
        duration: 6000,
      })
    }
  }

  const handleUpdateWallet = async (): Promise<void> => {
    try {
      toast({
        className: 'toast-warning',
        title: 'Processando atualização',
        description: 'Atualizando dados da carteira...',
        duration: 5000,
      })
      if (!ExchangeSelected) {
        toast({
          className: 'toast-error',
          title: 'Campo obrigatório',
          description: 'Por favor, selecione uma exchange.',
          duration: 6000,
        })
        return
      }
      if (!manager) {
        toast({
          className: 'toast-error',
          title: 'Campo obrigatório',
          description: 'Por favor, selecione um gerente.',
          duration: 6000,
        })
        return
      }

      if (!rowInfos.walletUuid) {
        toast({
          className: 'bg-red-500 border-0',
          title: 'Erro',
          description: 'UUID da carteira não encontrado.',
        })
        return
      }

      // If checkbox is checked and riskProfile changed, call the backend route
      if (isUpdateWithBaseWallet && riskProfile !== rowInfos.riskProfile) {
        if (!riskProfile) {
          toast({
            className: 'bg-red-500 border-0',
            title: 'Campo obrigatório',
            description: 'Por favor, selecione um perfil de risco.',
          })
          return
        }
        try {
          const baseWallet = await getBaseWalletByRisk(riskProfile)
          if (!baseWallet || !baseWallet.uuid) {
            toast({
              className: 'bg-red-500 border-0',
              title: 'Erro',
              description:
                'Modelo base não encontrado para o perfil de risco selecionado.',
            })
            return
          }
          const baseWalletUuid = baseWallet.uuid

          await applyBaseWalletAllocationForNewRisk({
            walletUuid: rowInfos.walletUuid,
            baseWalletUuid,
          })

          toast({
            className: 'bg-green-500 border-0',
            title: 'Carteira atualizada!',
            description: 'Ideal allocation aplicado com sucesso.',
          })
        } catch (err) {
          console.error('Erro ao aplicar modelo base:', err)
          toast({
            className: 'bg-red-500 border-0',
            title: 'Erro na atualização da carteira',
            description:
              'Não foi possível aplicar o modelo base. Tente novamente.',
          })
          return
        }
      }

      const result = await updateWallet(rowInfos.walletUuid, {
        accountPassword: accountPasswordRef.current?.value ?? '',
        contract: contractChecked,
        emailExchange: emailExchangeRef.current?.value ?? '',
        emailPassword: emailPasswordRef.current?.value ?? '',
        exchangeUuid: ExchangeSelected,
        initialFeeIsPaid: initialFeeIsPaid ?? false,
        manager,
        performanceFee: parseFloat(String(performanceFee)),
        riskProfile: riskProfile || 'STANDARD',
      })
      if (!result) {
        toast({
          className: 'toast-error',
          title: 'Falha na atualização',
          description:
            'Não foi possível atualizar os dados da carteira. Verifique as informações e tente novamente.',
          duration: 6000,
        })
        return
      }
      setSignal(!signal)
      onOpenChange(false)
      toast({
        className: 'toast-success',
        title: 'Sucesso!',
        description: 'Dados da carteira atualizados com sucesso.',
        duration: 4000,
      })
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      console.error('Error updating wallet:', error)
      toast({
        className: 'toast-error',
        title: 'Erro na atualização',
        description:
          error.response?.data?.message ||
          'Erro ao atualizar dados da carteira.',
        duration: 6000,
      })
    }
  }

  useEffect(() => {
    if (isOpen) {
      setContractChecked(!!rowInfos.contract)
      setInitialFeeIsPaid(rowInfos.initialFeePaid)
      setManager(rowInfos.manager?.managerUuid || '')
      setExchangeSelected(rowInfos.exchange?.exchangeUuid || '')
      setPerformanceFee(
        rowInfos.performanceFee ? String(rowInfos.performanceFee) : '',
      )
      setName(rowInfos.name || '')
      setEmail(rowInfos.email || '')
      setPhone(rowInfos.phone || '')
      setRiskProfile(rowInfos.riskProfile as RiskProfile)
      setErrors({ name: '', email: '', phone: '', general: '' })
      setIsUpdateWithBaseWallet(false)
    }
  }, [isOpen, rowInfos])

  const showUpdateCheckbox = riskProfile !== rowInfos.riskProfile

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="mx-auto w-full max-w-[600px] border-0 dark:bg-[#1C1C1C] dark:text-white">
        <DialogHeader>
          <DialogTitle className="text-3xl dark:text-white">
            Customer edit
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="Profile">
          <TabsList className="flex justify-between gap-5 border dark:border-0 dark:bg-[#1C1C1C]">
            <TabsTrigger
              className="w-1/2 border bg-lightComponent text-[#F2BE38] data-[state=active]:bg-yellow-500 dark:border-0 dark:bg-[#171717] dark:data-[state=active]:bg-yellow-500 dark:data-[state=active]:text-black"
              value="Profile"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              className="w-1/2 border bg-lightComponent text-[#F2BE38] data-[state=active]:bg-yellow-500 dark:bg-[#171717] dark:data-[state=active]:bg-yellow-500 dark:data-[state=active]:text-black"
              value="Wallet"
            >
              Wallet
            </TabsTrigger>
          </TabsList>
          <TabsContent className="mt-10" value={'Profile'}>
            <ProfileTab
              name={name}
              email={email}
              phone={phone}
              errors={errors}
              setName={setName}
              setEmail={setEmail}
              setPhone={setPhone}
              setPhoneCountry={setPhoneCountry}
              handleUpdateCustomer={handleUpdateCustomer}
            />
          </TabsContent>
          <TabsContent className="mt-10" value={'Wallet'}>
            <WalletTab
              rowInfos={rowInfos}
              ExchangeSelected={ExchangeSelected}
              setExchangeSelected={setExchangeSelected}
              exchanges={exchanges}
              emailPasswordRef={emailPasswordRef}
              emailExchangeRef={emailExchangeRef}
              accountPasswordRef={accountPasswordRef}
              manager={manager}
              setManager={setManager}
              managersOrganization={managersOrganization}
              performanceFee={performanceFee}
              setPerformanceFee={setPerformanceFee}
              contractChecked={contractChecked}
              setContractChecked={setContractChecked}
              initialFeeIsPaid={initialFeeIsPaid}
              setInitialFeeIsPaid={setInitialFeeIsPaid}
              handleUpdateWallet={handleUpdateWallet}
              setRiskProfile={setRiskProfile}
              riskProfile={riskProfile}
              showUpdateCheckbox={showUpdateCheckbox}
              isUpdateWithBaseWallet={isUpdateWithBaseWallet}
              setIsUpdateWithBaseWallet={setIsUpdateWithBaseWallet}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
