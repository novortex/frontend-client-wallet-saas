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
  effectiveDate?: string // Nova prop para a data efetiva
}

export default function HistoryCardDepositWithdrawal({
  quantity,
  operation,
  fiatCurrency,
  effectiveDate,
}: HistoryCardDepositWithdrawalProps) {
  return (
    <Card className="w-1/3 rounded-[12px] border bg-lightComponent dark:border-[#272727] dark:bg-[#131313]">
      <CardHeader></CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-3">
        <CardTitle style={{ color: operation ? '#CF5757' : '#8BF067' }}>
          {operation
            ? `${quantity} ${fiatCurrency}`
            : `+ ${quantity} ${fiatCurrency}`}
        </CardTitle>
        {effectiveDate && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            {operation ? 'Withdrawal' : 'Deposit'} made on: {effectiveDate}
          </p>
        )}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  )
}
