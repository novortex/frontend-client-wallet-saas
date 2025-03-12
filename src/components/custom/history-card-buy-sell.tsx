import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface HistoryCardBuySellProps {
  assetIcon: string
  quantity: number
  tagState: boolean
}

export default function HistoryCardBuySell({
  assetIcon,
  quantity,
  tagState,
}: HistoryCardBuySellProps) {
  const tagStyles = tagState
    ? 'text-[#74F238] bg-[#74F238]'
    : 'text-[#F2BE38] bg-[#F2BE38]'

  const tagText = tagState ? 'New' : 'Old'

  return (
    <Card className="flex h-full min-h-[220px] w-2/5 flex-col rounded-[12px] border bg-lightComponent dark:border-[#272727] dark:bg-[#131313]">
      <CardHeader className="flex items-end justify-center">
        <p
          className={`flex w-1/6 items-center justify-center rounded-[40px] bg-opacity-30 ${tagStyles}`}
        >
          {tagText}
        </p>
      </CardHeader>
      <CardContent className="flex items-center justify-center gap-3 dark:text-[#fff]">
        <img src={assetIcon} alt="" className="h-2/3" />
        <CardTitle className="text-4xl">{quantity}</CardTitle>
      </CardContent>
    </Card>
  )
}
