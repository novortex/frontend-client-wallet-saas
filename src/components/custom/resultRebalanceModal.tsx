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
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { RebalanceReturn } from '@/types/wallet.type'
import { useState, useEffect } from 'react'

type RebalanceItem = RebalanceReturn & {
  selected: boolean
  customAmount: string
  originalAmount: number
  isCustomAmount: boolean
}

type ResultRebalanceModalProps = {
  open: boolean | undefined
  onOpenChange: (open: boolean) => void
  rebalanceResults: RebalanceReturn[] | []
  onConfirm?: (selectedItems: RebalanceItem[]) => void
}

export function ResultRebalanceModal({
  open,
  onOpenChange,
  rebalanceResults,
  onConfirm,
}: ResultRebalanceModalProps) {
  const [rebalanceItems, setRebalanceItems] = useState<RebalanceItem[]>([])

  // Function to automatically adjust values so the balance is zero
  const adjustForZeroBalance = (items: RebalanceItem[]): RebalanceItem[] => {
    const selectedItems = items.filter((item) => item.selected)
    if (selectedItems.length === 0) return items

    // Não ajusta itens que foram editados manualmente
    const selectedBuyItems = selectedItems.filter(
      (item) => item.action === 'buy' && !item.isCustomAmount,
    )
    const selectedSellItems = selectedItems.filter(
      (item) => item.action === 'sell' && !item.isCustomAmount,
    )

    // Calcula totais incluindo itens editados manualmente
    const allSelectedBuyItems = selectedItems.filter(
      (item) => item.action === 'buy',
    )
    const allSelectedSellItems = selectedItems.filter(
      (item) => item.action === 'sell',
    )

    const totalBuy = allSelectedBuyItems.reduce(
      (sum, item) => sum + Number(item.customAmount || 0),
      0,
    )
    const totalSell = allSelectedSellItems.reduce(
      (sum, item) => sum + Number(item.customAmount || 0),
      0,
    )

    const difference = totalSell - totalBuy

    // If already balanced, do nothing
    if (Math.abs(difference) < 1) return items

    const adjustedItems = [...items]

    // Determine which group needs to be adjusted and by how much
    let itemsToAdjust: RebalanceItem[]
    let adjustmentAmount: number

    if (difference > 0) {
      // Excess in sell, need to increase buys
      itemsToAdjust = selectedBuyItems
      adjustmentAmount = difference
    } else {
      // Excess in buy, need to increase sells
      itemsToAdjust = selectedSellItems
      adjustmentAmount = Math.abs(difference)
    }

    if (itemsToAdjust.length === 0) return adjustedItems

    // Distribute the adjustment simply: add 1 to each item until balanced
    let remainingAdjustment = Math.round(adjustmentAmount)
    let itemIndex = 0

    while (remainingAdjustment > 0 && itemsToAdjust.length > 0) {
      const currentItem = itemsToAdjust[itemIndex % itemsToAdjust.length]
      const globalIndex = adjustedItems.findIndex(
        (item) =>
          item.assetName === currentItem.assetName &&
          item.action === currentItem.action,
      )

      if (globalIndex !== -1) {
        const currentAmount = Number(
          adjustedItems[globalIndex].customAmount || 0,
        )
        adjustedItems[globalIndex] = {
          ...adjustedItems[globalIndex],
          customAmount: (currentAmount + 1).toString(),
        }
        remainingAdjustment -= 1
      }

      itemIndex++
    }

    return adjustedItems
  }

  // Initialize items when the modal opens
  useEffect(() => {
    if (open && rebalanceResults.length > 0) {
      const items = rebalanceResults.map((result) => {
        const roundedAmount = Math.round(Number(result.amount))
        return {
          ...result,
          selected: true,
          customAmount: roundedAmount.toString(),
          originalAmount: roundedAmount,
          isCustomAmount: false,
        }
      })

      // Adjust values to ensure zero balance
      const adjustedItems = adjustForZeroBalance(items)

      // Update original values to match adjusted values
      const finalItems = adjustedItems.map((item) => ({
        ...item,
        originalAmount: Number(item.customAmount),
      }))

      setRebalanceItems(finalItems)
    }
  }, [open, rebalanceResults])

  // Handle selection toggle for an item
  const handleItemToggle = (index: number, checked: boolean) => {
    const newItems = rebalanceItems.map((item, i) =>
      i === index
        ? { ...item, selected: checked, isCustomAmount: false } // Reset custom amount flag
        : item,
    )

    // Readjust values after selection change
    const adjustedItems = adjustForZeroBalance(newItems)
    setRebalanceItems(adjustedItems)
  }

  // Handle manual amount change for an item
  const handleAmountChange = (index: number, value: string) => {
    // Allow numbers and empty field
    if (value === '' || /^\d+$/.test(value)) {
      setRebalanceItems((prev) =>
        prev.map((item, i) =>
          i === index
            ? { ...item, customAmount: value, isCustomAmount: true } // Mark as custom amount
            : item,
        ),
      )
    }
  }

  // Handle confirm button click
  const handleConfirm = () => {
    const selectedItems = rebalanceItems.filter((item) => item.selected)
    onConfirm?.(selectedItems)
    onOpenChange(false)
  }

  // Button to reset all calculations to original
  const handleResetCalculation = () => {
    const resetItems = rebalanceItems.map((item) => ({
      ...item,
      selected: true,
      customAmount: item.originalAmount.toString(),
      isCustomAmount: false, // Reset custom amount flag
    }))

    // Only adjust after reset if necessary
    const adjustedItems = adjustForZeroBalance(resetItems)
    setRebalanceItems(adjustedItems)
  }

  const buyResults = rebalanceItems.filter((item) => item.action === 'buy')
  const sellResults = rebalanceItems.filter((item) => item.action === 'sell')

  // Calculate totals for display
  const totalBuySelected = buyResults
    .filter((item) => item.selected)
    .reduce((sum, item) => sum + Number(item.customAmount || 0), 0)

  const totalSellSelected = sellResults
    .filter((item) => item.selected)
    .reduce((sum, item) => sum + Number(item.customAmount || 0), 0)

  // Render section for buy or sell items
  const renderRebalanceSection = (
    items: RebalanceItem[],
    title: string,
    colorClass: string,
    total: number,
  ) => (
    <div className="w-1/2 rounded-[8px] bg-gray-200 p-4 dark:bg-[#171717]">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-center text-[16px] dark:text-white">{title}</p>
        <p className={`text-[14px] font-semibold ${colorClass}`}>
          Total: ${total.toLocaleString()}
        </p>
      </div>
      <Separator className="my-2 bg-gray-500 dark:bg-[#F2BE38]" />
      <div className="flex max-h-[200px] w-full flex-col items-center gap-3 overflow-auto">
        {items.map((result, index) => {
          const originalIndex = rebalanceItems.findIndex(
            (item) =>
              item.assetName === result.assetName &&
              item.action === result.action,
          )

          return (
            <div
              key={`${result.assetName}-${result.action}-${index}`}
              className={`flex w-full flex-col gap-2 rounded-[8px] p-3 transition-all duration-200 ${
                result.selected
                  ? 'bg-gray-300 shadow-sm dark:bg-[#1C1C1C]'
                  : 'bg-gray-400 opacity-60 dark:bg-[#2A2A2A]'
              }`}
            >
              {/* Header with checkbox and asset info */}
              <div className="flex w-full items-center gap-2">
                <Checkbox
                  checked={result.selected}
                  onCheckedChange={(checked) =>
                    handleItemToggle(originalIndex, checked as boolean)
                  }
                  className="flex-shrink-0"
                />
                <img
                  src={result.assetIcon}
                  alt={result.assetName}
                  className="h-6 w-6 flex-shrink-0"
                />
                <div className="flex-1">
                  <p className="text-[14px] font-medium dark:text-white">
                    {result.assetName}
                  </p>
                  <p className="text-[12px] text-gray-500 dark:text-gray-400">
                    Original: ${result.originalAmount.toLocaleString()}
                    {result.isCustomAmount && (
                      <span className="ml-1 text-yellow-500">• Custom</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Amount input */}
              {result.selected && (
                <div className="flex items-center gap-2">
                  <p
                    className={`text-[12px] ${colorClass} flex-shrink-0 font-bold`}
                  >
                    {title === 'Buy' ? '+' : '-'}
                  </p>
                  <Input
                    type="text"
                    value={result.customAmount}
                    onChange={(e) =>
                      handleAmountChange(originalIndex, e.target.value)
                    }
                    className={`h-8 flex-1 text-[14px] ${
                      result.isCustomAmount ? 'border-yellow-500' : ''
                    }`}
                    placeholder="Amount"
                  />
                  <p className="flex-shrink-0 text-[12px] dark:text-white">
                    USD
                  </p>
                </div>
              )}
            </div>
          )
        })}

        {items.length === 0 && (
          <p className="py-4 text-center text-[14px] text-gray-500 dark:text-gray-400">
            No {title.toLowerCase()} operations
          </p>
        )}
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="mx-auto flex h-[650px] w-full max-w-[800px] flex-col border-none p-6 dark:bg-[#1C1C1C]">
        <DialogHeader>
          <DialogTitle className="text-center text-[24px] dark:text-[#F2BE38]">
            Rebalancing Parameters
          </DialogTitle>
          <p className="text-center text-[14px] text-gray-600 dark:text-gray-400">
            Select assets and adjust amounts for rebalancing
          </p>
        </DialogHeader>

        <div className="flex w-full flex-1 flex-col items-center gap-4 overflow-hidden">
          {/* Balance information */}
          <div className="flex w-full justify-center gap-6 py-2">
            <div className="text-center">
              <p className="text-[12px] text-gray-500 dark:text-gray-400">
                Total Buy
              </p>
              <p className="text-[16px] font-bold text-green-600 dark:text-[#8BF067]">
                ${totalBuySelected.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[12px] text-gray-500 dark:text-gray-400">
                Total Sell
              </p>
              <p className="text-[16px] font-bold text-red-600 dark:text-[#FF6666]">
                ${totalSellSelected.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[12px] text-gray-500 dark:text-gray-400">
                Balance
              </p>
              <p
                className={`text-[16px] font-bold ${
                  totalSellSelected - totalBuySelected < 1
                    ? 'text-yellow-600 dark:text-[#F2BE38]'
                    : 'text-green-600 dark:text-[#8BF067]'
                }`}
              >
                ${(totalSellSelected - totalBuySelected).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Reset button */}
          <Button
            onClick={handleResetCalculation}
            variant="outline"
            className="border-[#F2BE38] text-[12px] text-[#F2BE38] hover:bg-[#F2BE38] hover:text-black"
          >
            Reset to Original Calculation
          </Button>

          <div className="flex w-full flex-1 flex-row items-start justify-center gap-6">
            {renderRebalanceSection(
              buyResults,
              'Buy',
              'text-green-600 dark:text-[#8BF067]',
              totalBuySelected,
            )}
            {renderRebalanceSection(
              sellResults,
              'Sell',
              'text-red-600 dark:text-[#FF6666]',
              totalSellSelected,
            )}
          </div>

          <DialogFooter className="flex w-full justify-center gap-3">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="w-[30%] rounded-[16px] border-[#F2BE38] text-[#F2BE38] hover:bg-[#F2BE38] hover:text-black"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleConfirm}
              disabled={
                rebalanceItems.filter((item) => item.selected).length === 0
              }
              className="w-[40%] rounded-[16px] bg-[#F2BE38] text-[16px] text-black hover:bg-[#D4A532] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Confirm Rebalance (
              {rebalanceItems.filter((item) => item.selected).length} items)
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
