import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

interface HistoryCardAllocationProps {
  assetIcon: string
  allocation: number
  tagState: boolean
}

export default function HistoryCardAllocation({
  assetIcon,
  allocation,
  tagState,
}: HistoryCardAllocationProps) {
  const tagStyles = tagState
    ? 'text-[#74F238] bg-[#74F238]'
    : 'text-[#F2BE38] bg-[#F2BE38]'

  const tagText = tagState ? 'New' : 'Old'

  return (
    <Card className="w-2/5 h-full min-h-[220px] rounded-[12px] border border-[#272727] bg-[#131313] flex flex-col">
      <CardHeader className="flex flex-row">
        <div className="w-1/3 h-full"></div>
        <CardDescription className="w-1/3 h-full flex justify-center items-center text-[#fff] text-lg">
          Allocation
        </CardDescription>
        <div className="w-1/3 h-full flex justify-end">
          <p
            className={`w-1/2 flex items-center justify-center bg-opacity-50 rounded-[40px] ${tagStyles}`}
          >
            {tagText}
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex justify-center items-center text-[#fff] gap-3">
        <img src={assetIcon} alt="" className="h-2/3" />
        <CardTitle className="text-4xl">{allocation}%</CardTitle>
      </CardContent>
    </Card>
  )
}
