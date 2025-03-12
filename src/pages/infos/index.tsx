import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import { useEffect, useState } from 'react'
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
import { convertedTimeZone } from '@/services/managementService'
import {
  getInfosCustomer,
  updateCurrentAmount,
} from '@/services/wallet/walleInfoService'

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

      await updateCurrentAmount(walletUuid)

      const result = await getInfosCustomer(walletUuid)

      if (!result) {
        return false
      }

      setWalletI(result.walletInfo)
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

  return (
    <div className="h-full bg-white p-10 dark:bg-transparent">
      <div className="mb-10 flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="text-2xl font-medium text-black dark:text-white"
                href="/wallets"
              >
                Wallets
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-2xl font-medium text-black dark:text-white">
                Information clients
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <SwitchTheme />
      </div>

      <div className="mb-10 flex items-center justify-between">
        <Input
          className="w-5/6 border border-0 bg-gray-100 focus:ring-0 dark:bg-[#171717] dark:text-white"
          type="text"
          placeholder="Search for ..."
        />
        <div className="">
          <Button className="flex gap-2 bg-gray-200 p-5 text-black hover:bg-gray-400 dark:bg-white">
            {' '}
            <img src={exportIcon} alt="" /> Export
          </Button>
        </div>
      </div>

      <div className="flex gap-10">
        <div className="flex w-3/5 flex-col">
          <div className="mb-5 flex justify-between">
            <div className="flex gap-5">
              <h1 className="text-3xl text-black dark:text-white">
                {walletI.user.name || '-'}
              </h1>
              {walletInfos.lastContactAt == null ||
              (timeZone &&
                walletI.monthCloseDate &&
                new Date(timeZone) > new Date(walletI.monthCloseDate)) ? (
                <Badge className="flex h-10 gap-2 bg-red-500 text-white hover:bg-red-500">
                  <Check className="w-5" /> Not registered
                </Badge>
              ) : (
                <Badge className="flex gap-2 bg-[#10A45C] text-white hover:bg-[#10A45C] hover:text-white">
                  <Check className="w-5" /> Confirm contact
                </Badge>
              )}
            </div>

            <div className="flex gap-5">
              <Button
                className="flex gap-3 bg-gray-200 bg-yellow-500 text-black hover:bg-yellow-400 dark:bg-[#131313] dark:text-[#F2BE38] dark:hover:bg-yellow-500 dark:hover:text-black"
                onClick={openModal}
              >
                {' '}
                <CircleAlert className="w-5" /> Information
              </Button>
              <Button
                className="flex gap-3 bg-gray-200 bg-yellow-500 text-black hover:bg-yellow-400 dark:bg-[#131313] dark:text-[#F2BE38] dark:hover:bg-yellow-500 dark:hover:text-black"
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
              <p>{walletInfos.manager || '-'}</p>
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

          <div className="w-full rounded-xl border bg-lightComponent p-10 dark:border-[#272727] dark:bg-[#171717]">
            <div className="mb-5 flex justify-between gap-2 text-xl text-[#959CB6]">
              <div className="flex items-center gap-5">
                <div className="rounded-full bg-transparent p-2">
                  <img className="w-6" src={responsibleIcon} alt="" />
                </div>

                <p className="text-black dark:text-white">
                  Wallet informations
                </p>
              </div>

              <Badge className="flex gap-2 bg-[#F2BE38] p-2 pl-5 pr-5 text-black hover:bg-[#F2BE38] hover:text-black">
                {' '}
                <CircleAlert className="" /> {walletI.riskProfile}
              </Badge>
            </div>

            <div className="mb-5 grid w-full grid-cols-2 gap-5 p-2">
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-black dark:text-white">
                  Initial amount invested:{' '}
                  {walletI.investedAmount !== undefined
                    ? Number(walletI.investedAmount).toFixed(2)
                    : '-'}
                </p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-black dark:text-white">
                  Current value referring to the benchmark:{' '}
                  {walletI.currentValueBenchmark !== undefined
                    ? Number(walletI.currentValueBenchmark).toFixed(2)
                    : '-'}
                </p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-black dark:text-white">
                  Current value:{' '}
                  {walletI.currentAmount !== null &&
                  walletI.currentAmount !== undefined
                    ? Number(walletI.currentAmount).toFixed(2)
                    : '-'}
                </p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-black dark:text-white">
                  Next rebalancing date:{' '}
                  {walletI.nextBalance !== null
                    ? formatDate(walletI.nextBalance?.toString())
                    : '-'}
                </p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-black dark:text-white">
                  Performance fee:{' '}
                  {walletI.performanceFee !== undefined
                    ? Number(walletI.performanceFee).toFixed(2)
                    : '-'}
                </p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-black dark:text-white">
                  Last rebalance date:{' '}
                  {walletI.lastRebalance !== null
                    ? formatDate(walletI.lastRebalance?.toString())
                    : '-'}
                </p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-black dark:text-white">
                  Benchmark: {walletI.benchmark.name || '-'}
                </p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-black dark:text-white">
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
                <Calendar className="text-[#F2BE38]" />
                <p className="text-black dark:text-white">
                  Exchange: {walletI.exchange.name || '-'}
                </p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-black dark:text-white">
                  Initial fee:{' '}
                  {walletI.initialFee !== undefined
                    ? Number(walletI.initialFee).toFixed(2)
                    : '-'}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  className="bg-[#F2BE38] text-black hover:bg-yellow-400"
                  onClick={openModalExchange}
                >
                  Account exchange information
                </Button>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-black dark:text-white">
                  Initial fee was paid or not (checker):{' '}
                  {walletI.initialFeePaid ? '✅' : '❌'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-2/5 flex-col">
          <div className="mb-5 flex justify-end gap-7">
            <div className="flex flex-col items-center rounded-lg border bg-lightComponent p-10 dark:bg-[#171717]">
              <Calendar className="text-[#F2BE38]" />
              <p className="text-black dark:text-white">Start Date</p>
              <p className="text-[#959CB6]">
                {walletI.startDate !== null
                  ? formatDate(walletI.startDate?.toString())
                  : '-'}
              </p>
            </div>
            <div className="flex flex-col items-center rounded-lg border bg-lightComponent p-10 dark:bg-[#171717]">
              <Calendar className="text-[#F2BE38]" />
              <p className="text-black dark:text-white">Close Date</p>
              <p className="text-[#959CB6]">
                {walletI.closeDate !== null
                  ? formatDate(walletI.closeDate?.toString())
                  : '-'}
              </p>
            </div>
          </div>

          <div className="h-full w-full rounded-xl border bg-lightComponent p-10 dark:border-[#272727] dark:bg-[#171717]">
            <div className="mb-16 flex items-center justify-between">
              <h1 className="text-xl text-black dark:text-white">Alerts</h1>
              <div className="flex gap-5">
                <Button
                  onClick={() => navigate(`/wallet/${walletUuid}/assets`)}
                  className="flex gap-3 bg-yellow-600 pb-5 pt-5 text-white hover:bg-yellow-500"
                >
                  <Wallet />
                  <p>Wallet</p>
                </Button>

                <Button
                  onClick={() => navigate(`/wallet/${walletUuid}/graphs`)}
                  className="flex gap-3 bg-yellow-600 pb-5 pt-5 text-white hover:bg-yellow-500"
                >
                  <BarChartBigIcon />
                  <p>Graphics</p>
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="w-full rounded-md bg-[#EF4E3D] p-5 text-white">
                <h2>Alert when it happens X</h2>
              </div>
              <div className="w-full rounded-md bg-[#F1BA00] p-5 text-white">
                <h2>Alert when it happens Y</h2>
              </div>
              <div className="w-full rounded-md bg-[#10A45C] p-5 text-white">
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

export default Infos
