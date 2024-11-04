import { SwitchTheme } from '@/components/custom/switch-theme'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import exportIcon from '../assets/icons/export.svg'
import {
  CircleAlert,
  Check,
  DollarSign,
  Calendar,
  Wallet,
  BarChartBigIcon,
  PhoneCall,
} from 'lucide-react'
import responsibleIcon from '../assets/image/responsible-icon.png'
import ClientsInfoModal from '@/components/custom/clients-info-modal'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getInfosCustomer, convertedTimeZone } from '@/services/request'
import { useUserStore } from '@/store/user'
import { formatDate } from '@/utils'
import ExchangeInfoModal from '@/components/custom/modal/clients-info-modal'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import ConfirmContactModal from '@/components/custom/confirm-contact-modal'
import { useSignalStore } from '@/store/signalEffect'
import { TWallet, TWalletCommission, TWalletInfos } from '@/types/wallet.type'
import { updateCurrentAmount } from '@/services/walletService'

export function Infos() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalExchangeOpen, setIsModalExchangeOpen] = useState(false)
  const [isModalContactOpen, setisModalContactOpen] = useState(false)

  const [timeZone, setTimeZone] = useState(null)

  const [walletCommission, setWalletCommission] = useState<TWalletCommission[]>(
    [],
  )
  const [walletInfos, setWalletInfos] = useState<TWalletInfos>({
    manager: '',
    lastContactAt: '',
  })

  const [walletI, setWalletI] = useState<TWallet>({
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

  const uuidOrganization = useUserStore((state) => state.user.uuidOrganization)
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

  useEffect(() => {
    const getInfo = async () => {
      if (!walletUuid) {
        return navigate('client')
      }

      await updateCurrentAmount(uuidOrganization, walletUuid)

      const result = await getInfosCustomer(walletUuid, uuidOrganization)

      if (!result) {
        return false
      }

      setWalletI(result.walletInfo)
      setWalletInfos(result.walletPreInfos)
      setWalletCommission(result.walletCommission)
    }

    getInfo()
  }, [navigate, uuidOrganization, walletUuid, signal])

  useEffect(() => {
    const fetchTimeZone = async () => {
      try {
        const result = await convertedTimeZone(uuidOrganization)
        setTimeZone(result)
      } catch (error) {
        console.error('Error on fetching timezone')
      }
    }

    fetchTimeZone()
  }, [uuidOrganization])

  return (
    <div className="p-10">
      <div className="mb-10 flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="text-2xl text-white font-medium"
                href="/wallets"
              >
                Wallets
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-2xl text-white font-medium">
                Information clients
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <SwitchTheme />
      </div>

      <div className="flex items-center justify-between mb-10">
        <Input
          className="bg-[#171717] w-5/6 border-0 text-white focus:ring-0"
          type="text"
          placeholder="Search for ..."
        />
        <div className="">
          <Button className="bg-white text-black flex gap-2 hover:bg-gray-400 p-5">
            {' '}
            <img src={exportIcon} alt="" /> Export
          </Button>
        </div>
      </div>

      <div className="flex gap-10">
        <div className="flex flex-col w-3/5">
          <div className="flex justify-between mb-5">
            <div className="flex gap-5">
              <h1 className="text-3xl text-white">
                {walletI.user.name || '-'}
              </h1>
              {walletInfos.lastContactAt == null ||
              (timeZone &&
                walletI.monthCloseDate &&
                new Date(timeZone) > new Date(walletI.monthCloseDate)) ? (
                <Badge className="bg-red-500 h-10 text-white flex gap-2 hover:bg-red-800 hover:text-white">
                  <Check className="w-5" /> Not registered
                </Badge>
              ) : (
                <Badge className="bg-[#10A45C] text-white flex gap-2 hover:bg-[#10A45C] hover:text-white">
                  <Check className="w-5" /> Confirm contact
                </Badge>
              )}
            </div>

            <div className="flex gap-5">
              <Button
                className="bg-[#131313] text-[#F2BE38] flex gap-3 hover:bg-yellow-500 hover:text-black"
                onClick={openModal}
              >
                {' '}
                <CircleAlert className="w-5" /> Information
              </Button>
              <Button
                className="bg-[#131313] text-[#F2BE38] flex gap-3 hover:bg-yellow-500 hover:text-black"
                onClick={openModalContact}
              >
                {' '}
                <PhoneCall className="w-5" />
                Contact confirm
              </Button>
            </div>
          </div>

          <div className="mb-14">
            <div className="h-full w-1/2 flex items-center justify-start gap-2 text-[#959CB6] text-xl">
              <img className="w-6" src={responsibleIcon} alt="" />
              <p>{walletInfos.manager || '-'}</p>
            </div>
            <div className="flex text-xl">
              <DollarSign className="text-[#F2BE38]" />
              {walletCommission && walletCommission.length > 0 ? (
                walletCommission.map((item) => (
                  <div key={item.name}>
                    <p className="text-[#959CB6] mr-5">
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

          <div className="w-full bg-[#171717] p-10 rounded-xl border border-[#272727]">
            <div className="flex justify-between gap-2 text-[#959CB6] text-xl mb-5">
              <div className="flex items-center gap-5">
                <div className="bg-[#131313] border border-[#221D11] rounded-full p-2">
                  <img className="w-6" src={responsibleIcon} alt="" />
                </div>

                <p className="text-white">Wallet informations</p>
              </div>

              <Badge className="bg-[#F2BE38] text-black flex gap-2 hover:bg-[#F2BE38] hover:text-black p-2 pl-5 pr-5">
                {' '}
                <CircleAlert className="" /> {walletI.riskProfile}
              </Badge>
            </div>

            <div className="w-full p-2 grid grid-cols-2 gap-5 mb-5">
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-white">
                  Initial amount invested:{' '}
                  {walletI.investedAmount !== undefined
                    ? Number(walletI.investedAmount).toFixed(2)
                    : '-'}
                </p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-white">
                  Current value referring to the benchmark:{' '}
                  {walletI.currentValueBenchmark !== undefined
                    ? Number(walletI.currentValueBenchmark).toFixed(2)
                    : '-'}
                </p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-white">
                  Current value:{' '}
                  {walletI.currentAmount !== undefined
                    ? Number(walletI.currentAmount).toFixed(2)
                    : '-'}
                </p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-white">
                  Next rebalancing date:{' '}
                  {walletI.nextBalance !== null
                    ? formatDate(walletI.nextBalance?.toString())
                    : '-'}
                </p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-white">
                  Performance fee:{' '}
                  {walletI.performanceFee !== undefined
                    ? Number(walletI.performanceFee).toFixed(2)
                    : '-'}
                </p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-white">
                  Last rebalance date:{' '}
                  {walletI.lastRebalance !== null
                    ? formatDate(walletI.lastRebalance?.toString())
                    : '-'}
                </p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-white">
                  Benchmark: {walletI.benchmark.name || '-'}
                </p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-white">
                  Next monthly closing date:{' '}
                  {walletI.monthCloseDate !== null
                    ? formatDate(walletI.monthCloseDate?.toString())
                    : '-'}
                </p>
              </div>
            </div>

            <div className="bg-[#272727] w-full h-1 rounded-md mb-5"></div>

            <div className="w-full p-2 grid grid-cols-2 gap-5">
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-white">
                  Exchange: {walletI.exchange.name || '-'}
                </p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-white">
                  Initial fee:{' '}
                  {walletI.initialFee !== undefined
                    ? Number(walletI.initialFee).toFixed(2)
                    : '-'}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  className="bg-[#F2BE38] text-black hover:bg-yellow-400/35"
                  onClick={openModalExchange}
                >
                  Account exchange information
                </Button>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-white">
                  Initial fee was paid or not (checker):{' '}
                  {walletI.initialFeePaid ? '✅' : '❌'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-2/5">
          <div className="flex justify-end gap-7 mb-5">
            <div className="bg-[#171717] flex flex-col items-center p-10 rounded-lg">
              <Calendar className="text-[#F2BE38]" />
              <p className="text-white">Start Date</p>
              <p className="text-[#959CB6]">
                {walletI.startDate !== null
                  ? formatDate(walletI.startDate?.toString())
                  : '-'}
              </p>
            </div>
            <div className="bg-[#171717] flex flex-col items-center p-10 rounded-lg">
              <Calendar className="text-[#F2BE38]" />
              <p className="text-white">Close Date</p>
              <p className="text-[#959CB6]">
                {walletI.closeDate !== null
                  ? formatDate(walletI.closeDate?.toString())
                  : '-'}
              </p>
            </div>
          </div>

          <div className="w-full bg-[#171717] p-10 rounded-xl border border-[#272727] h-full">
            <div className="flex items-center justify-between mb-16">
              <h1 className="text-white text-xl">Alerts</h1>
              <div className="flex gap-5">
                <Button
                  onClick={() => navigate(`/wallet/${walletUuid}/assets`)}
                  className="bg-[#1877F2] hover:bg-blue-600 flex gap-3 pt-5 pb-5"
                >
                  <Wallet />
                  <p>Wallet</p>
                </Button>

                <Button
                  onClick={() => navigate(`/wallet/${walletUuid}/graphs`)}
                  className="bg-[#1877F2] hover:bg-blue-600 flex gap-3 pt-5 pb-5"
                >
                  <BarChartBigIcon />
                  <p>Graphics</p>
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="bg-[#EF4E3D] w-full p-5 rounded-md">
                <h2>Alert when it happens X</h2>
              </div>
              <div className="bg-[#F1BA00] w-full p-5 rounded-md">
                <h2>Alert when it happens Y</h2>
              </div>
              <div className="bg-[#10A45C] w-full p-5 rounded-md">
                <h2>Alert when it happens Z</h2>
              </div>
            </div>
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
