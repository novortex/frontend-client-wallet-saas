import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '../ui/button'

interface HistoryCardStartCloseProps {
  walletState: boolean
  date: string
  hour: string
  initialValue: number
  closeValue?: number
}

export default function HistoryCardStartClose({
  walletState,
  date,
  hour,
  initialValue,
  closeValue,
}: HistoryCardStartCloseProps) {
  const borderStyle = walletState ? 'border-[#23CE20]' : 'border-[#C81C1C]'
  const walletTitle = walletState ? 'Start Wallet' : 'Close Wallet'
  const walletValue = walletState ? 'Intial Value' : 'Invested Value'

  return (
    <Card className={`${borderStyle} rounded-[12px] border bg-[#131313] w-1/3`}>
      <CardHeader className="flex justify-center items-center">
        <CardTitle className="text-3xl text-[#fff]">{walletTitle}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4">
        <CardDescription className="flex flex-row gap-2 text-lg">
          Date:
          <p className="text-[#fff]">
            {date} ({hour})
          </p>
        </CardDescription>
        <CardDescription className="flex flex-row gap-2 text-lg">
          {walletValue}: <p className="text-[#fff]">{initialValue}</p>
        </CardDescription>
        {!walletState && (
          <CardDescription className="flex flex-row gap-2 text-lg">
            Close Value: <p className="text-[#fff]">{closeValue}</p>
          </CardDescription>
        )}
        {!walletState && (
          <Button className="bg-white text-black">Export</Button>
        )}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  )
}
