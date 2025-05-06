import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'

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
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  )
}
