import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '../ui/button'

interface HistoryCardDepositWithdrawalProps {
  quantity: number
  operation: boolean
  fiatCurrency: string | undefined
}

export default function HistoryCardDepositWithdrawal({ quantity, operation, fiatCurrency }: HistoryCardDepositWithdrawalProps) {
  return (
    <Card className="rounded-[12px] border border-[#272727] bg-[#131313] w-1/3">
      <CardHeader></CardHeader>
      <CardContent className="flex flex-col justify-center items-center gap-5">
        <CardTitle style={{ color: operation ? '#CF5757' : '#8BF067' }}>{operation ? `${quantity} ${fiatCurrency}` : `+ ${quantity} ${fiatCurrency}`}</CardTitle>
        {operation && <Button className="bg-[#1877F2] w-2/6 hover:bg-blue-600 p-5">Detail</Button>}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  )
}
