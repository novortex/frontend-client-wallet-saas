import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { RebalanceReturn } from '@/types/wallet.type'

type ResultRebalanceModalProps = {
  open: boolean | undefined
  onOpenChange: (open: boolean) => void
  rebalanceResults: RebalanceReturn[] | []
}

export function ResultRebalanceModal({
  open,
  onOpenChange,
  rebalanceResults,
}: ResultRebalanceModalProps) {
  const buyResults = rebalanceResults.filter(
    (result) => result.action === 'buy',
  )
  const sellResults = rebalanceResults.filter(
    (result) => result.action === 'sell',
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="mx-auto flex h-[400px] w-full max-w-[600px] flex-col items-center justify-center border-none p-6 dark:bg-[#1C1C1C]">
        <DialogHeader>
          <DialogTitle className="text-center text-[24px] dark:text-[#F2BE38]">
            Rebalancing parameters
          </DialogTitle>
        </DialogHeader>
        <br />
        <div className="flex w-full flex-col items-center gap-4">
          <div className="flex w-full flex-row items-start justify-center gap-6">
            <div className="w-1/2 rounded-[8px] bg-gray-200 p-4 dark:bg-[#171717]">
              <p className="text-center text-[16px] dark:text-white">Buy</p>
              <Separator className="my-2 bg-gray-500 dark:bg-[#F2BE38]" />
              <div className="flex w-full flex-col items-center gap-4 overflow-hidden">
                {buyResults.map((result, index) => (
                  <div
                    key={index}
                    className="flex w-full items-center justify-center gap-1 rounded-[8px] bg-gray-300 p-2 dark:bg-[#1C1C1C]"
                  >
                    <img
                      src={result.assetIcon}
                      alt={result.assetName}
                      className="h-6 w-6"
                    />
                    <p className="w-fit text-[16px] dark:text-white">
                      {result.assetName}
                    </p>
                    <p className="w-fit text-[16px] text-green-600 dark:text-[#8BF067]">
                      +{Math.round(Number(result.amount))} USD
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-1/2 rounded-[8px] bg-gray-200 p-4 dark:bg-[#171717]">
              <p className="text-center text-[16px] dark:text-white">Sell</p>
              <Separator className="my-2 bg-gray-500 dark:bg-[#F2BE38]" />
              <div className="flex w-full flex-col items-center gap-4 overflow-hidden">
                {sellResults.map((result, index) => (
                  <div
                    key={index}
                    className="flex w-full items-center justify-center gap-1 rounded-[8px] bg-gray-300 p-2 dark:bg-[#1C1C1C]"
                  >
                    <img
                      src={result.assetIcon}
                      alt={result.assetName}
                      className="h-6 w-6"
                    />
                    <p className="w-fit text-[16px] dark:text-white">
                      {result.assetName}
                    </p>
                    <p className="w-fit text-[16px] text-red-600 dark:text-[#FF6666]">
                      -{Math.round(Number(result.amount))} USD
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <br />
          <DialogFooter className="flex w-full justify-center">
            <DialogClose asChild>
              <Button className="mx-auto w-[70%] rounded-[16px] bg-[#F2BE38] text-[16px] text-black hover:bg-[#F2BE38]">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
