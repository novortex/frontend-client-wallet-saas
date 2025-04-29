import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Building2 } from 'lucide-react'
export function ExchangeFilter({
  exchanges,
  selectedExchanges,
  handleSelectExchange,
  handleRemoveExchange,
}: {
  exchanges: { name: string }[]
  selectedExchanges: string[]
  handleSelectExchange: (exchangeName: string) => void
  handleRemoveExchange: (exchangeName: string) => void
}) {
  const handleExchangeSelection = (exchangeName: string) => {
    if (!selectedExchanges.includes(exchangeName)) {
      handleSelectExchange(exchangeName)
    }
  }
  const lastExchange = selectedExchanges.at(-1) ?? ''

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="h-[20%] w-full font-bold dark:text-[#959CB6]">
        Filter by exchange
      </div>
      <div className="flex h-[80%] w-full flex-col items-center justify-center gap-4">
        <div className="flex h-full w-[100%] items-center justify-center gap-2">
          <div className="flex h-full w-[6%] items-center justify-center">
            <Building2 className="text-[#D1AB00]" size="ls" />
          </div>
          <div className="flex w-full items-center justify-start">
            <Select
              value={lastExchange}
              onValueChange={handleExchangeSelection}
            >
              <SelectTrigger className="w-full dark:border-[#323232] dark:bg-[#131313] dark:text-[#fff]">
                <SelectValue placeholder="Select exchange" />
              </SelectTrigger>
              <SelectContent className="border-2 dark:border-[#323232] dark:bg-[#131313]">
                {exchanges.length > 0 ? (
                  exchanges.map((exchange, index) => (
                    <SelectItem
                      key={index}
                      value={exchange.name}
                      className="border-0 dark:bg-[#131313] dark:text-white dark:focus:bg-[#252525] dark:focus:text-white"
                    >
                      {exchange.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem
                    disabled
                    className="text-gray-500"
                    value="not_value"
                  >
                    No exchanges available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        {selectedExchanges.length > 0 && (
          <div className="flex w-full flex-wrap items-start justify-start gap-2">
            {selectedExchanges.map((exchange) => (
              <div
                key={exchange}
                className="flex h-8 items-center justify-start rounded-md bg-[#959CB6] px-2 text-white"
              >
                <div
                  className="mr-2 cursor-pointer"
                  onClick={() => handleRemoveExchange(exchange)}
                >
                  X
                </div>
                <div>{exchange}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
