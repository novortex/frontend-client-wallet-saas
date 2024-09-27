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
    <Card className="w-2/5 h-full min-h-[220px] rounded-[12px] border border-[#272727] bg-[#131313] flex flex-col">
      <CardHeader className="flex justify-center items-end">
        <p
          className={`w-1/6 flex items-center justify-center rounded-[40px] bg-opacity-30 ${tagStyles}`}
        >
          {tagText}
        </p>
      </CardHeader>
      <CardContent className="flex justify-center items-center text-[#fff] gap-3">
        <img src={assetIcon} alt="" className="h-2/3" />
        <CardTitle className="text-4xl">{quantity}</CardTitle>
      </CardContent>
    </Card>
  )
}
