import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'

interface HistoryCardAddDeleteProps {
  asset: string
  assetIcon: string
  quantity: number
  targetAllocation: number
  operation: boolean
}

export default function HistoryCardAddDelete({
  asset,
  assetIcon,
  quantity,
  targetAllocation,
  operation,
}: HistoryCardAddDeleteProps) {
  const borderStyle = operation ? 'border-[#23CE20]' : 'border-[#C81C1C]'
  return (
    <Card
      className={`${borderStyle} w-1/3 rounded-[12px] border bg-lightComponent dark:bg-[#131313]`}
    >
      <CardHeader className="flex items-center justify-center">
        <CardTitle className="text-3xl dark:text-[#fff]">{asset}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4">
        <img src={assetIcon} alt="" />
        <CardDescription className="flex flex-row gap-2 text-lg">
          Quantity: <p className="dark:text-[#fff]">{quantity}</p>
        </CardDescription>
        <CardDescription className="flex flex-row gap-2 text-lg">
          Target Allocation:{' '}
          <p className="dark:text-[#fff]">{targetAllocation}%</p>
        </CardDescription>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  )
}
