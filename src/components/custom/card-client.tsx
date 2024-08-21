import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import infoIcon from '../../assets/image/info.png'
import responsibleIcon from '../../assets/image/responsible-icon.png'
import dateIcon from '../../assets/image/date-icon.png'
import { useNavigate } from 'react-router-dom'

interface CardClientProps {
  name: string
  responsible?: string
  alerts: number
  nextRebalancing: string | null
  lastRebalancing: string | null
  email: string
  cpf?: string
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
      return 'bg-[#272727]'
  }
}

const getTextAlertColor = (alerts: number) => {
  switch (true) {
    case alerts >= 1 && alerts <= 3:
      return 'text-[#fff]'
    case alerts >= 4 && alerts <= 6:
      return 'text-[#fff]'
    case alerts >= 7 && alerts <= 8:
      return 'text-[#fff]'
    case alerts >= 9:
      return 'text-[#fff]'
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
  cpf,
  phone,
  walletUuid,
}: CardClientProps) {
  const alertColor = getTagAlertColor(alerts)
  const alertTextColor = getTextAlertColor(alerts)

  const navigate = useNavigate()
  const handleCardClick = () => {
    navigate(`/clients/${walletUuid}/infos`, {
      state: { name, email, cpf, phone },
    })
  }

  return (
    <Card
      className="rounded-[12px] border border-[#272727] bg-[#171717] w-[32%] h-[300px] hover:bg-[#373737] cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="w-full h-1/2 gap-3">
        <CardTitle className="flex flex-row">
          <div className="h-full w-1/2 flex items-center justify-start text-[#fff] text-2xl">
            <p>{name}</p>
          </div>
          <div className="relative h-full w-1/2 flex items-center justify-end">
            <div className="relative group">
              <img src={infoIcon} alt="Info Icon" className="cursor-pointer" />
              <div className="absolute top-full right-full mb-2 w-[650%] px-4 py-2 bg-black text-sm text-white text-start rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {name}
                <br />
                email: {email}
                <br />
                phone: {phone}
                <br />
                cpf: {cpf}
              </div>
            </div>
          </div>
        </CardTitle>
        <CardDescription className="flex flex-row">
          <div className="h-full w-1/2 flex items-center justify-start gap-2 text-[#959CB6] text-lg">
            <img src={responsibleIcon} alt="" />
            <p>{responsible}</p>
          </div>
          <div className="h-full w-1/2 flex items-center justify-end">
            <div
              className={`${alertColor} w-1/2 h-full flex justify-center items-center rounded-[20px] font-bold`}
            >
              <p className={`${alertTextColor}`}>{alerts} alerts</p>
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full h-1/2">
        <div className="flex flex-row h-1/2 w-full">
          <div className="flex h-full w-1/2 justify-start items-center text-base gap-2 text-[#fff]">
            <img src={dateIcon} alt="" />
            <p>Next rebalancing:</p>
          </div>
          <div className="flex h-full w-1/2 justify-end items-center text-base text-[#fff]">
            {nextRebalancing}
          </div>
        </div>
        <div className="flex flex-row h-1/2 w-full">
          <div className="flex h-full w-1/2 justify-start items-center text-base gap-2 text-[#fff]">
            <img src={dateIcon} alt="" />
            <p>Last rebalancing:</p>
          </div>
          <div className="flex h-full w-1/2 justify-end items-center text-base text-[#fff]">
            {lastRebalancing}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
