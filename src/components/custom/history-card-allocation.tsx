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
    <Card className="flex h-full min-h-[220px] w-2/5 flex-col rounded-[12px] border bg-lightComponent dark:border-[#272727] dark:bg-[#131313]">
      <CardHeader className="flex flex-row">
        <div className="h-full w-1/3"></div>
        <CardDescription className="flex h-full w-1/3 items-center justify-center text-lg dark:text-[#fff]">
          Allocation
        </CardDescription>
        <div className="flex h-full w-1/3 justify-end">
          <p
            className={`flex w-1/2 items-center justify-center rounded-[40px] bg-opacity-30 ${tagStyles}`}
          >
            {tagText}
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-center gap-3 dark:text-[#fff]">
        <img src={assetIcon} alt="" className="h-2/3" />
        <CardTitle className="text-4xl">{allocation}%</CardTitle>
      </CardContent>
    </Card>
  )
}
