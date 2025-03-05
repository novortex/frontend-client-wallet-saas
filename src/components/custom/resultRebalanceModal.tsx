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

export function ResultRebalanceModal({ open, onOpenChange, rebalanceResults }: ResultRebalanceModalProps) {
  const buyResults = rebalanceResults.filter((result) => result.action === 'buy')
  const sellResults = rebalanceResults.filter((result) => result.action === 'sell')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark:bg-[#1C1C1C] border-none p-6 flex flex-col items-center justify-center w-full max-w-[600px] h-[400px] mx-auto">
        <DialogHeader>
          <DialogTitle className="dark:text-[#F2BE38] text-center text-[24px]">
            Rebalancing parameters
          </DialogTitle>
        </DialogHeader>
        <br />
        <div className="flex flex-col gap-4 items-center w-full">
          <div className="flex flex-row items-start justify-center gap-6 w-full">
            <div className="w-1/2 bg-gray-200 dark:bg-[#171717] rounded-[8px] p-4">
              <p className="dark:text-white text-center text-[16px]">Buy</p>
              <Separator className="bg-gray-500 dark:bg-[#F2BE38] my-2" />
              <div className="flex flex-col items-center gap-4 overflow-hidden w-full">
                {buyResults.map((result, index) => (
                  <div
                    key={index}
                    className="bg-gray-300 dark:bg-[#1C1C1C] flex items-center justify-center p-2 rounded-[8px] w-full gap-1"
                  >
                    <img src={result.assetIcon} alt={result.assetName} className="w-6 h-6" />
                    <p className="dark:text-white text-[16px] w-fit">{result.assetName}</p>
                    <p className="text-green-600 dark:text-[#8BF067] text-[16px] w-fit">
                      +{Math.round(Number(result.amount))} USD
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-1/2 bg-gray-200 dark:bg-[#171717] rounded-[8px] p-4">
              <p className="dark:text-white text-center text-[16px]">Sell</p>
              <Separator className="bg-gray-500 dark:bg-[#F2BE38] my-2" />
              <div className="flex flex-col items-center gap-4 overflow-hidden w-full">
                {sellResults.map((result, index) => (
                  <div
                    key={index}
                    className="bg-gray-300 dark:bg-[#1C1C1C] flex items-center justify-center p-2 rounded-[8px] w-full gap-1"
                  >
                    <img src={result.assetIcon} alt={result.assetName} className="w-6 h-6" />
                    <p className="dark:text-white text-[16px] w-fit">{result.assetName}</p>
                    <p className="text-red-600 dark:text-[#FF6666] text-[16px] w-fit">
                      -{Math.round(Number(result.amount))} USD
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <br />
          <DialogFooter className="w-full flex justify-center">
            <DialogClose asChild>
              <Button className="bg-[#F2BE38] hover:bg-[#F2BE38] rounded-[16px] w-[70%] mx-auto text-[16px] text-black">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
