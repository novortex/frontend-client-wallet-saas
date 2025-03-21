import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '../ui/button'

interface HistoryCardDepositWithdrawalProps {
  quantity: number
  operation: boolean
  fiatCurrency: string | undefined
}

export default function HistoryCardDepositWithdrawal({
  quantity,
  operation,
  fiatCurrency,
}: HistoryCardDepositWithdrawalProps) {
  return (
    <Card className="w-1/3 rounded-[12px] border bg-lightComponent dark:border-[#272727] dark:bg-[#131313]">
      <CardHeader></CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-5">
        <CardTitle style={{ color: operation ? '#CF5757' : '#8BF067' }}>
          {operation
            ? `${quantity} ${fiatCurrency}`
            : `+ ${quantity} ${fiatCurrency}`}
        </CardTitle>
        {operation && (
          <Button className="w-2/6 bg-[#1877F2] p-5 hover:bg-blue-600">
            Detail
          </Button>
        )}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  )
}
