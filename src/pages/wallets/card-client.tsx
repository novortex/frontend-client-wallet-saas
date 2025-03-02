import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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

export default function CardClient({ name, responsible, alerts, nextRebalancing, lastRebalancing, email, phone, walletUuid }: CardClientProps) {
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
  const isDelayedRebalancing = nextRebalancing && new Date() > parseDate(nextRebalancing)

  return (
    <Card
      className="rounded-[12px] border dark:border-[#272727] bg-lightComponent dark:bg-[#171717] w-[100%] h-[300px] hover:bg-gray-100 dark:hover:bg-[#373737] cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="w-full h-1/2 gap-3">
        <CardTitle className="flex flex-row">
          <div className="h-full w-1/2 flex items-center justify-start text-black dark:text-white text-2xl">
            <p className="truncate max-w-full">{name}</p>
          </div>
          <div className="relative h-full w-1/2 flex items-center justify-end">
            <div className="relative group">
              <CircleAlert className="text-[#F2BE38]" />
              <div className="absolute bottom-full right-full mb-2 w-[1250%] px-4 py-2 bg-white dark:bg-black text-sm text-black dark:text-white text-start rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
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
          <div className="h-full w-1/2 flex items-center justify-start gap-2 text-[#959CB6] text-lg">
            <img src={responsibleIcon} alt="" />
            <p>{responsible}</p>
          </div>
          <div className="flex flex-col w-full">
            <div className="h-full flex-col p-4 flex items-center justify-end">
              <div className={`${alertColor} h-full flex flex-col justify-center items-center rounded-[20px] font-bold`}>
                <p className={`${alertTextColor} text-[12px] p-2`}>{alerts} alerts</p>
              </div>
              {isDelayedRebalancing && <p className="text-red-600 text-[12px]">delayed rebalancing</p>}
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full h-1/2">
        <div className="flex flex-row h-1/2 w-full">
          <div className="flex h-full w-1/2 justify-start items-center text-base gap-2 text-black dark:text-white">
            <Calendar className="text-[#F2BE38]" />
            <p>Next rebalancing:</p>
          </div>
          <div className="flex h-full w-1/2 justify-end items-center text-base text-black dark:text-white">{nextRebalancing}</div>
        </div>
        <div className="flex flex-row h-1/2 w-full">
          <div className="flex h-full w-1/2 justify-start items-center text-base gap-2 text-black dark:text-white">
            <Calendar className="text-[#F2BE38]" />
            <p>Last rebalancing:</p>
          </div>
          <div className="flex h-full w-1/2 justify-end items-center text-base text-black dark:text-white">{lastRebalancing}</div>
        </div>
      </CardContent>
    </Card>
  )
}
