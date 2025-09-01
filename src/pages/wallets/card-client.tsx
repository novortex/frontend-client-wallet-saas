import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { CircleAlert, Calendar, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface CardClientProps {
  name: string
  responsible?: string
  nextRebalancing: string | null
  lastRebalancing: string | null
  email: string
  phone?: string
  walletUuid: string
}


export default function CardClient({
  name,
  responsible,
  nextRebalancing,
  lastRebalancing,
  email,
  phone,
  walletUuid,
}: CardClientProps) {
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
      className="card-wallet h-[200px] w-[100%]"
      onClick={handleCardClick}
    >
      <CardHeader className="px-4 pt-4 pb-1">
        <CardTitle className="flex flex-row items-center gap-3">
          <div className="flex-1">
            <div className="group relative">
              <p className="truncate text-2xl text-black dark:text-white">{name}</p>
              <div className="pointer-events-none absolute bottom-full left-0 mb-2 whitespace-nowrap rounded bg-white px-3 py-2 text-sm text-black opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-black dark:text-white shadow-lg border border-border z-10">
                {name}
              </div>
            </div>
          </div>
          {isDelayedRebalancing && (
            <div className="relative flex items-center justify-end">
              <div className="group relative">
                <div className="rounded-full bg-destructive/10 p-2">
                  <CircleAlert className="h-5 w-5 text-destructive" data-testid="delayed-rebalancing-alert" />
                </div>
                <div className="pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded bg-white px-3 py-2 text-sm text-black opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-black dark:text-white shadow-lg border border-border">
                  O rebalanceamento está atrasado
                </div>
              </div>
            </div>
          )}
        </CardTitle>
        <CardDescription className="flex flex-row">
          <div className="flex h-full w-full items-center justify-start gap-2 text-lg text-[#959CB6]">
            <div className="rounded-full bg-primary/10 p-2">
              <User className="h-5 w-5 text-primary" />
            </div>
            <p className="truncate">{responsible}</p>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pt-1 pb-4 space-y-1">
        <div className="flex w-full flex-row items-center py-1 gap-2">
          <div className="flex items-center gap-2 text-base text-[#959CB6]">
            <div className="rounded-full bg-primary/10 p-2">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <p>Next rebalancing:</p>
            <span>{nextRebalancing}</span>
          </div>
        </div>
        <div className="flex w-full flex-row items-center py-1 gap-2">
          <div className="flex items-center gap-2 text-base text-[#959CB6]">
            <div className="rounded-full bg-primary/10 p-2">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <p>Last rebalancing:</p>
            <span>{lastRebalancing}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
