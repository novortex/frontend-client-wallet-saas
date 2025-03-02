import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BadgeCent } from 'lucide-react'

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

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="h-[20%] w-full font-bold dark:text-[#959CB6]">Filter by exchange</div>
      <div className="h-[80%] w-full flex flex-col items-center justify-center gap-4">
        <div className="h-full w-[100%] flex justify-center gap-2 items-center">
          <div className="h-full w-[10%] flex justify-center items-center">
            <BadgeCent className="text-[#D1AB00]" size="ls" />
          </div>
          <div className="w-full flex items-center justify-start">
            <Select value={selectedExchanges.join(', ')} onValueChange={handleExchangeSelection}>
              <SelectTrigger className="w-full dark:bg-[#131313] dark:border-[#323232] dark:text-[#fff]">
                <SelectValue placeholder="Select exchange" />
              </SelectTrigger>
              <SelectContent className="dark:bg-[#131313] border-2 dark:border-[#323232]">
                {exchanges.length > 0 ? (
                  exchanges.map((exchange, index) => (
                    <SelectItem key={index} value={exchange.name} className="dark:bg-[#131313] border-0 dark:focus:bg-[#252525] dark:focus:text-white dark:text-white">
                      {exchange.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled className="text-gray-500" value="not_value">
                    No exchanges available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        {selectedExchanges.length > 0 && (
          <div className="flex flex-wrap justify-start items-start gap-2 w-full">
            {selectedExchanges.map((exchange) => (
              <div key={exchange} className="h-8 flex justify-start items-center bg-[#959CB6] text-white rounded-md px-2">
                <div className="cursor-pointer mr-2" onClick={() => handleRemoveExchange(exchange)}>
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
