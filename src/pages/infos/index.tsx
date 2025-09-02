import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/ui/copy-button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  CircleAlert,
  Check,
  DollarSign,
  Calendar,
  Wallet,
  BarChartBigIcon,
  PhoneCall,
  AlertTriangle,
  FileCheck,
  User,
  X,
  Download,
} from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { formatDate } from '@/utils'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useSignalStore } from '@/store/signalEffect'
import { TWallet, TWalletInfos } from '@/types/wallet.type'
import { SwitchTheme } from '@/components/custom/switch-theme'
import { ClientsInfoModal } from './client-info-modal'
import { ConfirmContactModal } from './confirm-contact-modal'
import { ExchangeInfoModal } from './exchange-info-modal'
import { ComingSoonModal } from './coming-soon-modal'
import { getAllCustomersOrganization } from '@/services/managementService'
import {
  getInfosCustomer,
  updateCurrentAmount,
} from '@/services/wallet/walleInfoService'

export function Infos() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalExchangeOpen, setIsModalExchangeOpen] = useState(false)
  const [isModalContactOpen, setisModalContactOpen] = useState(false)
  const [isComingSoonModalOpen, setIsComingSoonModalOpen] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [allCustomers, setAllCustomers] = useState<any[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [walletInfos, setWalletInfos] = useState<TWalletInfos>({
    manager: '',
    hasManager: false,
    lastContactAt: '',
  })

  const [walletI, setWalletI] = useState<TWallet>({
    customerUuid: '',
    startDate: '',
    investedAmount: 0,
    currentAmount: 0,
    closeDate: '',
    initialFee: null,
    initialFeePaid: false,
    riskProfile: '',
    monthCloseDate: '',
    lastMonthCloseDate: '',
    contract: false,
    performanceFee: 0,
    joinedAsClient: null,
    benchmark: { name: '' },
    currentValueBenchmark: 0,
    lastRebalance: null,
    nextBalance: null,
    user: {
      name: '',
      email: '',
      phone: '',
    },
    exchange: {
      name: '',
    },
    accountEmail: '',
    emailPassword: '',
    exchangePassword: '',
  })

  const navigate = useNavigate()
  const { walletUuid } = useParams()

  const [signal] = useSignalStore((state) => [state.signal])

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }


  const closeModalopenModalExchange = () => {
    setIsModalExchangeOpen(false)
  }

  const openModalContact = () => {
    setisModalContactOpen(true)
  }

  const closeModalContact = () => {
    setisModalContactOpen(false)
  }

  const openComingSoonModal = () => {
    setIsComingSoonModalOpen(true)
  }

  const closeComingSoonModal = () => {
    setIsComingSoonModalOpen(false)
  }


  // Função para filtrar clientes baseado na pesquisa
  const filterCustomers = (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }

    const filtered = allCustomers
      .filter((customer) =>
        customer.name.toLowerCase().includes(query.toLowerCase()),
      )
      .slice(0, 10) // Limite de 10 resultados

    setSearchResults(filtered)
    setShowDropdown(filtered.length > 0)
  }

  // Lidar com mudanças na pesquisa
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    setSelectedIndex(-1) // Reset selection
    filterCustomers(query)
  }

  // Lidar com navegação por teclado
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || searchResults.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev,
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          handleClientSelect(searchResults[selectedIndex])
        }
        break
      case 'Escape':
        setShowDropdown(false)
        setSelectedIndex(-1)
        break
    }
  }

  // Navegar para a página do cliente selecionado
  const handleClientSelect = (client: any) => {
    if (client.walletUuid) {
      navigate(`/clients/${client.walletUuid}/infos`)
      setSearchQuery('')
      setShowDropdown(false)
    }
  }

  // Fechar dropdown quando clicar fora
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      searchInputRef.current &&
      !searchInputRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false)
    }
  }

  // Função para buscar o customerUuid usando o walletUuid
  const findCustomerUuid = async (walletUuid: string) => {
    try {
      const customers = await getAllCustomersOrganization()
      const customer = customers?.find((c: any) => c.walletUuid === walletUuid)
      console.log('Found customer by walletUuid:', customer)
      return customer?.uuid || null
    } catch (error) {
      console.error('Error finding customer:', error)
      return null
    }
  }

  useEffect(() => {
    const getInfo = async () => {
      if (!walletUuid) {
        return navigate('client')
      }

      await updateCurrentAmount(walletUuid)

      const result = await getInfosCustomer(walletUuid)

      if (!result) {
        return false
      }

      // Debug logs
      console.log('API Response - walletInfo:', result.walletInfo)
      console.log(
        'API Response - customerUuid:',
        result.walletInfo?.customerUuid,
      )

      // Se a API não retorna customerUuid, busca pelos customers
      let customerUuid: string | null = result.walletInfo?.customerUuid || null
      if (!customerUuid) {
        console.log(
          'CustomerUuid not found in API response, searching in customers...',
        )
        customerUuid = await findCustomerUuid(walletUuid)
      }

      console.log('Final customerUuid:', customerUuid)

      // Atualiza o estado com o customerUuid correto
      setWalletI({
        ...result.walletInfo,
        customerUuid: customerUuid || '',
      })
      setWalletInfos(result.walletPreInfos)
    }

    getInfo()
  }, [navigate, walletUuid, signal])


  // Effect para carregar todos os clientes para pesquisa
  useEffect(() => {
    const loadAllCustomers = async () => {
      try {
        const customers = await getAllCustomersOrganization()
        setAllCustomers(customers || [])
      } catch (error) {
        console.error('Error loading customers for search:', error)
      }
    }

    loadAllCustomers()
  }, [])

  // Effect para lidar com cliques fora do dropdown
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header with improved spacing */}
        <div className="mb-8 flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  href="/wallets"
                >
                  Wallets
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm font-medium text-foreground">
                  Client Information
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <SwitchTheme />
        </div>

        {/* Search Section */}
        <div className="mb-6">
          <div className="relative">
            <Input
              ref={searchInputRef}
              className="h-12 border-2 border-border bg-background text-foreground transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              type="text"
              placeholder="Search for clients..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (searchResults.length > 0) setShowDropdown(true)
              }}
            />

            {/* Enhanced Dropdown */}
            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-y-auto rounded-lg border border-border bg-popover shadow-xl"
              >
                {searchResults.map((client, index) => (
                  <div
                    key={client.uuid}
                    className={`cursor-pointer border-b border-border px-4 py-3 text-sm transition-all duration-200 last:border-b-0 ${
                      index === selectedIndex
                        ? 'border-primary/20 bg-primary/10 text-primary'
                        : 'text-popover-foreground hover:bg-muted/50'
                    }`}
                    onClick={() => handleClientSelect(client)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="font-medium">{client.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {client.email}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Client Header Section */}
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                {walletI.user.name || 'Cliente não identificado'}
              </h1>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
              <Button
                className="h-11 btn-yellow px-4"
                onClick={openModal}
              >
                <CircleAlert className="h-4 w-4" />
                Information
              </Button>
              <Button
                className="h-11 btn-yellow px-4"
                onClick={openModalContact}
              >
                <PhoneCall className="h-4 w-4" />
                Contact confirm
              </Button>
              <Button
                className="h-11 btn-yellow px-4"
                onClick={() => navigate(`/wallet/${walletUuid}/assets`)}
              >
                <Wallet className="h-4 w-4" />
                Wallet
              </Button>
              <Button
                className="h-11 btn-yellow px-4"
                onClick={() => navigate(`/wallet/${walletUuid}/graphs`)}
              >
                <BarChartBigIcon className="h-4 w-4" />
                Graphics
              </Button>
              <Button
                className="h-11 btn-yellow px-4"
                onClick={openComingSoonModal}
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Manager, Contract and Risk Profile Section */}
          <Card className="flex h-[90px] items-center">
            <div className="flex w-full items-center justify-start gap-8 px-6">
              {' '}
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-muted-foreground">
                    Manager
                  </p>
                  <p className="text-base font-semibold text-foreground">
                    {walletInfos.manager ||
                      (walletInfos.hasManager === false
                        ? 'No manager assigned'
                        : '-')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-muted-foreground">
                    Risk Profile
                  </p>
                  <p className="text-base font-semibold text-foreground">
                    STANDARD
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <FileCheck className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-muted-foreground">
                    Contract
                  </p>
                  <div className="flex items-start">
                    {walletI.contract ? (
                      <div className="rounded-full bg-success/10 p-1">
                        <Check className="h-4 w-4 text-success" />
                      </div>
                    ) : (
                      <div className="rounded-full bg-destructive/10 p-1">
                        <X className="h-4 w-4 text-destructive" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Investment Details Card */}
          <Card className="w-full border-border bg-card shadow-sm transition-all duration-200 hover:shadow-md">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    Investment Details
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex min-h-[100px] flex-col justify-between rounded-lg border border-border bg-muted/30 p-4">
                  <p className="mb-2 text-sm font-medium text-muted-foreground">
                    Initial Amount Invested
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    R$
                    {walletI.investedAmount !== undefined
                      ? Number(walletI.investedAmount).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })
                      : '18,000.00'}
                  </p>
                </div>
                <div className="flex min-h-[100px] flex-col justify-between rounded-lg border border-border bg-muted/30 p-4">
                  <p className="mb-2 text-sm font-medium text-muted-foreground">
                    Current Value
                  </p>
                  <p className="text-2xl font-bold text-success">
                    R$
                    {walletI.currentAmount !== null &&
                    walletI.currentAmount !== undefined
                      ? Number(walletI.currentAmount).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })
                      : '3,584.69'}
                  </p>
                </div>
                <div className="flex min-h-[100px] flex-col justify-between rounded-lg border border-border bg-muted/30 p-4">
                  <p className="mb-2 text-sm font-medium text-muted-foreground">
                    Benchmark Value
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    R$
                    {walletI.currentValueBenchmark !== undefined
                      ? Number(walletI.currentValueBenchmark).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })
                      : '0.06'}
                  </p>
                </div>
                <div className="flex min-h-[100px] flex-col justify-between rounded-lg border border-border bg-muted/30 p-4">
                  <p className="mb-2 text-sm font-medium text-muted-foreground">
                    Performance Fee
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    R$
                    {walletI.performanceFee !== undefined
                      ? Number(walletI.performanceFee).toFixed(2)
                      : '37.00'}
                  </p>
                </div>
                <div className="flex min-h-[100px] flex-col justify-between rounded-lg border border-border bg-muted/30 p-4">
                  <p className="mb-2 text-sm font-medium text-muted-foreground">
                    Benchmark
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {walletI.benchmark.name || 'CDI'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline & Dates and Exchange & Account Side by Side */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Timeline & Dates Card */}
            <Card className="w-full border-border bg-card shadow-sm transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    Timeline & Dates
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex min-h-[100px] flex-col justify-between rounded-lg border border-border bg-muted/30 p-4">
                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                      Start Date
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {walletI.startDate !== null
                        ? formatDate(walletI.startDate?.toString())
                        : '28/08/2025'}
                    </p>
                  </div>
                  <div className="flex min-h-[100px] flex-col justify-between rounded-lg border border-border bg-muted/30 p-4">
                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                      Close Date
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {walletI.closeDate !== null
                        ? formatDate(walletI.closeDate?.toString())
                        : '28/08/2025'}
                    </p>
                  </div>
                  <div className="flex min-h-[100px] flex-col justify-between rounded-lg border border-border bg-muted/30 p-4">
                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                      Last Portfolio Call
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {walletI.lastMonthCloseDate !== null && walletI.lastMonthCloseDate !== '' && walletI.lastMonthCloseDate !== undefined
                        ? formatDate(walletI.lastMonthCloseDate?.toString())
                        : '-'}
                    </p>
                  </div>
                  <div className="flex min-h-[100px] flex-col justify-between rounded-lg border border-border bg-muted/30 p-4">
                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                      Next Portfolio Call
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {walletI.monthCloseDate !== null && walletI.monthCloseDate !== ''
                        ? formatDate(walletI.monthCloseDate?.toString())
                        : '-'}
                    </p>
                  </div>
                  <div className="flex min-h-[100px] flex-col justify-between rounded-lg border border-border bg-muted/30 p-4">
                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                      Next Rebalancing
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {walletI.nextBalance !== null
                        ? formatDate(walletI.nextBalance?.toString())
                        : '11/09/2025'}
                    </p>
                  </div>
                  <div className="flex min-h-[100px] flex-col justify-between rounded-lg border border-border bg-muted/30 p-4">
                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                      Last Rebalance
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {walletI.lastRebalance !== null
                        ? formatDate(walletI.lastRebalance?.toString())
                        : '28/08/2025'}
                    </p>
                  </div>
                  <div className="flex min-h-[100px] flex-col justify-between rounded-lg border border-border bg-muted/30 p-4">
                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                      Client Since
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {walletI.joinedAsClient !== null
                        ? formatDate(walletI.joinedAsClient?.toString())
                        : '28/08/2025'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exchange & Account Card */}
            <Card className="w-full border-border bg-card shadow-sm transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    Exchange & Account
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex min-h-[100px] flex-col justify-between rounded-lg border border-border bg-muted/30 p-4">
                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                      Exchange
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {walletI.exchange.name || 'Binance'}
                    </p>
                  </div>
                  <div className="flex min-h-[100px] flex-col justify-between rounded-lg border border-border bg-muted/30 p-4">
                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                      Initial Fee
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      R$
                      {walletI.initialFee !== undefined
                        ? Number(walletI.initialFee).toFixed(2)
                        : '800.00'}
                    </p>
                  </div>
                  <div className="flex min-h-[100px] flex-col justify-between rounded-lg border border-border bg-muted/30 p-4">
                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                      Initial Fee Status
                    </p>
                    <p
                      className={`text-xl font-bold ${
                        walletI.initialFeePaid
                          ? 'text-success'
                          : 'text-destructive'
                      }`}
                    >
                      {walletI.initialFeePaid ? 'Paid' : 'Pending'}
                    </p>
                  </div>
                  <div className="flex min-h-[100px] flex-col justify-between rounded-lg border border-border bg-muted/30 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground">
                        Account Email
                      </p>
                      {walletI.accountEmail && <CopyButton text={walletI.accountEmail} />}
                    </div>
                    <p className="truncate text-xl font-bold text-foreground" title={walletI.accountEmail || '-'}>
                      {walletI.accountEmail || '-'}
                    </p>
                  </div>
                  <div className="flex min-h-[100px] flex-col justify-between rounded-lg border border-border bg-muted/30 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground">
                        Email Password
                      </p>
                      {walletI.emailPassword && <CopyButton text={walletI.emailPassword} />}
                    </div>
                    <p className="truncate text-xl font-bold text-foreground" title={walletI.emailPassword || '-'}>
                      {walletI.emailPassword || '-'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ClientsInfoModal
        isOpen={isModalOpen}
        onClose={closeModal}
        name={walletI.user.name}
        email={walletI.user.email}
        phone={walletI.user.phone}
      />
      <ExchangeInfoModal
        isOpen={isModalExchangeOpen}
        onClose={closeModalopenModalExchange}
        accountEmail={walletI.accountEmail}
        emailPassword={walletI.emailPassword}
        exchangePassword={walletI.exchangePassword}
      />
      <ConfirmContactModal
        isOpen={isModalContactOpen}
        onClose={closeModalContact}
      />
      <ComingSoonModal
        isOpen={isComingSoonModalOpen}
        onClose={closeComingSoonModal}
      />
      
    </div>
  )
}

export default Infos
