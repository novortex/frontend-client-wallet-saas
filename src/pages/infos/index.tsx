import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  CircleAlert,
  Check,
  DollarSign,
  Calendar,
  Wallet,
  BarChartBigIcon,
  PhoneCall,
} from 'lucide-react'
import responsibleIcon from '../../assets/image/responsible-icon.png'
import { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { formatDate } from '@/utils'
import exportIcon from '../../assets/icons/export.svg'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useSignalStore } from '@/store/signalEffect'
import { TWallet, TWalletCommission, TWalletInfos } from '@/types/wallet.type'
import { SwitchTheme } from '@/components/custom/switch-theme'
import { ClientsInfoModal } from './client-info-modal'
import { ConfirmContactModal } from './confirm-contact-modal'
import { ExchangeInfoModal } from './exchange-info-modal'
import {
  convertedTimeZone,
  getAllCustomersOrganization,
} from '@/services/managementService'
import {
  getInfosCustomer,
  updateCurrentAmount,
} from '@/services/wallet/walleInfoService'

export function Infos() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalExchangeOpen, setIsModalExchangeOpen] = useState(false)
  const [isModalContactOpen, setisModalContactOpen] = useState(false)

  const [timeZone, setTimeZone] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [allCustomers, setAllCustomers] = useState<any[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [walletCommission, setWalletCommission] = useState<TWalletCommission[]>(
    [],
  )
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

  const openModalExchange = () => {
    setIsModalExchangeOpen(true)
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

  // Função para filtrar clientes baseado na pesquisa
  const filterCustomers = (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }

    const filtered = allCustomers.filter((customer) =>
      customer.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10) // Limite de 10 resultados

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
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
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
      console.log('API Response - customerUuid:', result.walletInfo?.customerUuid)

      // Se a API não retorna customerUuid, busca pelos customers
      let customerUuid: string | null = result.walletInfo?.customerUuid || null
      if (!customerUuid) {
        console.log('CustomerUuid not found in API response, searching in customers...')
        customerUuid = await findCustomerUuid(walletUuid)
      }

      console.log('Final customerUuid:', customerUuid)

      // Atualiza o estado com o customerUuid correto
      setWalletI({
        ...result.walletInfo,
        customerUuid: customerUuid || ''
      })
      setWalletInfos(result.walletPreInfos)
      setWalletCommission(result.walletCommission)

    }

    getInfo()

  }, [navigate, walletUuid, signal])

  useEffect(() => {
    const fetchTimeZone = async () => {
      try {
        const result = await convertedTimeZone()
        setTimeZone(result)
      } catch (error) {
        console.error('Error on fetching timezone')
      }
    }

    fetchTimeZone()
  }, [])

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
    <div className="relative min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                  href="/wallets"
                >
                  Wallets
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm font-medium text-foreground">
                  Information clients
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <SwitchTheme />
        </div>

        <div className="mb-10 flex items-center justify-between">
          <div className="relative w-5/6">
            <Input
              ref={searchInputRef}
              className="border border-border bg-background text-foreground focus:ring-2 focus:ring-primary"
              type="text"
              placeholder="Search for clients..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (searchResults.length > 0) setShowDropdown(true)
              }}
            />
            
            {/* Dropdown de resultados */}
            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-md border border-border bg-popover shadow-lg"
              >
                {searchResults.map((client, index) => (
                  <div
                    key={client.uuid}
                    className={`cursor-pointer px-4 py-3 text-sm transition-colors border-b border-border last:border-b-0 ${
                      index === selectedIndex 
                        ? 'bg-primary/20 text-primary' 
                        : 'text-popover-foreground hover:bg-muted/50'
                    }`}
                    onClick={() => handleClientSelect(client)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="font-medium">{client.name}</div>
                    <div className="text-xs text-muted-foreground">{client.email}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="">
            <Button className="flex gap-2 bg-muted p-5 text-foreground hover:bg-muted/80">
              {' '}
              <img src={exportIcon} alt="" /> Export
            </Button>
          </div>
        </div>

      <div className="grid grid-cols-5 gap-10">
        <div className="col-span-3 flex flex-col">
          <div className="mb-5 flex justify-between items-center">
            <div className="flex gap-5 items-center">
              <h1 className="text-3xl text-black dark:text-white">
                {walletI.user.name || '-'}
              </h1>
              {timeZone &&
              walletI.monthCloseDate &&
              new Date(timeZone) > new Date(walletI.monthCloseDate) ? (
                <Badge className="flex h-10 gap-2 bg-red-500 text-white hover:bg-red-500">
                  <Check className="w-5" /> Not registered
                </Badge>
              ) : (
                <Badge className="flex gap-2 bg-[#10A45C] text-white hover:bg-[#10A45C] hover:text-white">
                  <Check className="w-5" /> Confirm contact
                </Badge>
              )}
              
              <Button
                className="flex gap-3 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                onClick={openModal}
              >
                {' '}
                <CircleAlert className="w-5" /> Information
              </Button>
              <Button
                className="flex gap-3 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                onClick={openModalContact}
              >
                {' '}
                <PhoneCall className="w-5" />
                Contact confirm
              </Button>
            </div>

          </div>

          <div className="mb-14">
            <div className="flex h-full w-1/2 items-center justify-start gap-2 text-xl text-[#959CB6]">
              <img className="w-6" src={responsibleIcon} alt="" />
              <p>
                {walletInfos.manager ||
                  (walletInfos.hasManager === false
                    ? 'No manager assigned'
                    : '-')}
              </p>
            </div>
            <div className="flex text-xl">
              <DollarSign className="text-[#F2BE38]" />
              {walletCommission && walletCommission.length > 0 ? (
                walletCommission.map((item) => (
                  <div key={item.name}>
                    <p className="mr-5 text-[#959CB6]">
                      {item.name}{' '}
                      <span className="text-gray-300">
                        ({item.commission}%)
                      </span>
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-[#959CB6]">No commission</p>
              )}
            </div>
          </div>

          <Card className="w-full flex-1 bg-card border-border hover:shadow-md transition-shadow">
            <CardContent className="p-10">
            <div className="mb-5 flex justify-between gap-2 text-xl text-[#959CB6]">
              <div className="flex items-center gap-5">
                <div className="rounded-full bg-transparent p-2">
                  <img className="w-6" src={responsibleIcon} alt="" />
                </div>

                <p className="text-foreground">
                  Wallet informations
                </p>
                <div className="flex gap-3">
                  <Badge className="flex gap-2 bg-primary p-2 pl-5 pr-5 text-primary-foreground hover:bg-primary/90">
                    Contract: {walletI.contract ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>

              <Badge className="flex gap-2 bg-primary p-2 pl-5 pr-5 text-primary-foreground hover:bg-primary/90">
                {' '}
                <CircleAlert className="" /> {walletI.riskProfile}
              </Badge>
            </div>

            <div className="mb-5 grid w-full grid-cols-2 gap-5 p-2">
              <div className="flex gap-3">
                <Calendar className="text-primary" />
                <p className="text-foreground">
                  Initial amount invested:{' '}
                  {walletI.investedAmount !== undefined
                    ? Number(walletI.investedAmount).toFixed(2)
                    : '-'}
                </p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-primary" />
                <p className="text-foreground">
                  Current value referring to the benchmark:{' '}
                  {walletI.currentValueBenchmark !== undefined
                    ? Number(walletI.currentValueBenchmark).toFixed(2)
                    : '-'}
                </p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-primary" />
                <p className="text-foreground">
                  Current value:{' '}
                  {walletI.currentAmount !== null &&
                  walletI.currentAmount !== undefined
                    ? Number(walletI.currentAmount).toFixed(2)
                    : '-'}
                </p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-primary" />
                <p className="text-foreground">
                  Next rebalancing date:{' '}
                  {walletI.nextBalance !== null
                    ? formatDate(walletI.nextBalance?.toString())
                    : '-'}
                </p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-primary" />
                <p className="text-foreground">
                  Performance fee:{' '}
                  {walletI.performanceFee !== undefined
                    ? Number(walletI.performanceFee).toFixed(2)
                    : '-'}
                </p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-primary" />
                <p className="text-foreground">
                  Last rebalance date:{' '}
                  {walletI.lastRebalance !== null
                    ? formatDate(walletI.lastRebalance?.toString())
                    : '-'}
                </p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-primary" />
                <p className="text-foreground">
                  Benchmark: {walletI.benchmark.name || '-'}
                </p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-primary" />
                <p className="text-foreground">
                  Next monthly closing date:{' '}
                  {walletI.monthCloseDate !== null
                    ? formatDate(walletI.monthCloseDate?.toString())
                    : '-'}
                </p>
              </div>
            </div>

            <div className="mb-5 h-0.5 w-full rounded-md bg-gray-300 dark:bg-[#393939]"></div>

            <div className="grid w-full grid-cols-2 gap-5 p-2">
              <div className="flex gap-3">
                <Calendar className="text-primary" />
                <p className="text-foreground">
                  Exchange: {walletI.exchange.name || '-'}
                </p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-primary" />
                <p className="text-foreground">
                  Initial fee:{' '}
                  {walletI.initialFee !== undefined
                    ? Number(walletI.initialFee).toFixed(2)
                    : '-'}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={openModalExchange}
                >
                  Account exchange information
                </Button>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-primary" />
                <p className="text-foreground">
                  Initial fee was paid: {walletI.initialFeePaid ? '✅' : '❌'}
                </p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-primary" />
                <p className="text-foreground">
                  Joined as a client:{' '}
                  {walletI.joinedAsClient !== null
                    ? formatDate(walletI.joinedAsClient?.toString())
                    : 'n/a'}
                </p>
              </div>
            </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-2 flex flex-col">
          <div className="mb-5 flex gap-5 justify-end">
            <Card className="bg-card border-border hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col items-center p-8">
                <Calendar className="text-primary mb-2" size={24} />
                <p className="text-foreground font-medium mb-1">Start Date</p>
                <p className="text-muted-foreground text-sm">
                  {walletI.startDate !== null
                    ? formatDate(walletI.startDate?.toString())
                    : '-'}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col items-center p-8">
                <Calendar className="text-primary mb-2" size={24} />
                <p className="text-foreground font-medium mb-1">Close Date</p>
                <p className="text-muted-foreground text-sm">
                  {walletI.closeDate !== null
                    ? formatDate(walletI.closeDate?.toString())
                    : '-'}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="w-full flex-1 bg-card border-border hover:shadow-md transition-shadow">
            <CardContent className="p-10">
              <div className="mb-16 flex items-center justify-between">
                <h1 className="text-xl text-foreground">Alerts</h1>
                <div className="flex gap-5">
                  <Button
                    onClick={() => navigate(`/wallet/${walletUuid}/assets`)}
                    className="flex gap-3 bg-primary pb-5 pt-5 text-primary-foreground hover:bg-primary/90"
                  >
                    <Wallet />
                    <p>Wallet</p>
                  </Button>

                  <Button
                    onClick={() => navigate(`/wallet/${walletUuid}/graphs`)}
                    className="flex gap-3 bg-primary pb-5 pt-5 text-primary-foreground hover:bg-primary/90"
                  >
                    <BarChartBigIcon />
                    <p>Graphics</p>
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <Card className="w-full bg-destructive border-destructive hover:shadow-lg transition-all cursor-pointer hover:scale-105">
                  <CardContent className="p-5">
                    <h2 className="text-destructive-foreground font-medium">Alert when it happens X</h2>
                  </CardContent>
                </Card>
                <Card className="w-full bg-warning border-warning hover:shadow-lg transition-all cursor-pointer hover:scale-105">
                  <CardContent className="p-5">
                    <h2 className="text-warning-foreground font-medium">Alert when it happens Y</h2>
                  </CardContent>
                </Card>
                <Card className="w-full bg-success border-success hover:shadow-lg transition-all cursor-pointer hover:scale-105">
                  <CardContent className="p-5">
                    <h2 className="text-success-foreground font-medium">Alert when it happens Z</h2>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
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
    </div>
  )
}

export default Infos
