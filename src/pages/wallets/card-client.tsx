import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { CircleAlert, Calendar } from 'lucide-react'
import responsibleIcon from '../../assets/image/responsible-icon.png'
import { useNavigate } from 'react-router-dom'

interface CardClientProps {
  name: string
  responsible?: string
  alerts: number
  nextRebalancing: string | null
  lastRebalancing: string | null
  email: string
  phone?: string
  walletUuid: string
}

const getTagAlertColor = (alerts: number) => {
  switch (true) {
    case alerts >= 1 && alerts <= 3:
      return 'bg-green-500'
    case alerts >= 4 && alerts <= 6:
      return 'bg-yellow-500'
    case alerts >= 7 && alerts <= 8:
      return 'bg-orange-500'
    case alerts >= 9:
      return 'bg-red-500'
    default:
      return 'bg-gray-200 dark:bg-[#272727]'
  }
}

const getTextAlertColor = (alerts: number) => {
  switch (true) {
    case alerts >= 1 && alerts <= 3:
      return 'text-black dark:text-white'
    case alerts >= 4 && alerts <= 6:
      return 'text-black dark:text-white'
    case alerts >= 7 && alerts <= 8:
      return 'text-black dark:text-white'
    case alerts >= 9:
      return 'text-black dark:text-white'
    default:
      return 'text-[#f0bc32]'
  }
}

export default function CardClient({
  name,
  responsible,
  alerts,
  nextRebalancing,
  lastRebalancing,
  email,
  phone,
  walletUuid,
}: CardClientProps) {
  const alertColor = getTagAlertColor(alerts)
  const alertTextColor = getTextAlertColor(alerts)
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate(`/clients/${walletUuid}/infos`, {
      state: { name, email, phone },
    })
  }

  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/').map(Number)
    return new Date(year, month - 1, day)
  }

  // Check if the current date is after nextRebalancing
  const isDelayedRebalancing =
    nextRebalancing && new Date() > parseDate(nextRebalancing)

  return (
    <Card
      className="h-[300px] w-[100%] cursor-pointer rounded-[12px] border bg-lightComponent hover:bg-gray-100 dark:border-[#272727] dark:bg-[#171717] dark:hover:bg-[#373737]"
      onClick={handleCardClick}
    >
      <CardHeader className="h-1/2 w-full gap-3">
        <CardTitle className="flex flex-row">
          <div className="flex h-full w-1/2 items-center justify-start text-2xl text-black dark:text-white">
            <p className="max-w-full truncate">{name}</p>
          </div>
          <div className="relative flex h-full w-1/2 items-center justify-end">
            <div className="group relative">
              <CircleAlert className="text-[#F2BE38]" />
              <div className="pointer-events-none absolute bottom-full right-full mb-2 w-[1250%] rounded bg-white px-4 py-2 text-start text-sm text-black opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-black dark:text-white">
                {name}
                <br />
                email: {email}
                <br />
                phone: {phone}
              </div>
            </div>
          </div>
        </CardTitle>
        <CardDescription className="flex flex-row">
          <div className="flex h-full w-1/2 items-center justify-start gap-2 text-lg text-[#959CB6]">
            <img src={responsibleIcon} alt="" />
            <p>{responsible}</p>
          </div>
          <div className="flex w-full flex-col">
            <div className="flex h-full flex-col items-center justify-end p-4">
              <div
                className={`${alertColor} flex h-full flex-col items-center justify-center rounded-[20px] font-bold`}
              >
                <p className={`${alertTextColor} p-2 text-[12px]`}>
                  {alerts} alerts
                </p>
              </div>
              {isDelayedRebalancing && (
                <p className="text-[12px] text-red-600">delayed rebalancing</p>
              )}
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="h-1/2 w-full">
        <div className="flex h-1/2 w-full flex-row">
          <div className="flex h-full w-1/2 items-center justify-start gap-2 text-base text-black dark:text-white">
            <Calendar className="text-[#F2BE38]" />
            <p>Next rebalancing:</p>
          </div>
          <div className="flex h-full w-1/2 items-center justify-end text-base text-black dark:text-white">
            {nextRebalancing}
          </div>
        </div>
        <div className="flex h-1/2 w-full flex-row">
          <div className="flex h-full w-1/2 items-center justify-start gap-2 text-base text-black dark:text-white">
            <Calendar className="text-[#F2BE38]" />
            <p>Last rebalancing:</p>
          </div>
          <div className="flex h-full w-1/2 items-center justify-end text-base text-black dark:text-white">
            {lastRebalancing}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
